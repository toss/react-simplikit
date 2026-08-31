import { MIN_RUNTIME_VERSION, MOBILE_PACKAGE_NAME, ROOT_PACKAGE_NAME } from '../../constants.ts';
import type { PackageJsonChange } from '../../types.ts';

export type TransformPackageJsonResult = {
  text: string;
  changes: PackageJsonChange[];
  manual: string[];
};

const DEPENDENCY_FIELDS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'] as const;

// Package managers disagree on what these mean, and a pin here is usually deliberate,
// so the codemod reports them instead of guessing.
const MANUAL_FIELDS = ['resolutions', 'overrides'] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function detectIndent(text: string): string {
  const match = /\n([ \t]+)"/.exec(text);

  return match?.[1] ?? '  ';
}

function withoutMobile(field: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(field).filter(([name]) => name !== MOBILE_PACKAGE_NAME));
}

export function transformPackageJson(text: string): TransformPackageJsonResult {
  if (!text.includes(MOBILE_PACKAGE_NAME)) {
    return { text, changes: [], manual: [] };
  }

  const parsed: unknown = JSON.parse(text);

  if (!isRecord(parsed)) {
    throw new Error('package.json must contain a JSON object at its root');
  }

  const changes: PackageJsonChange[] = [];
  const manual: string[] = [];

  let next = parsed;
  let hasRoot = DEPENDENCY_FIELDS.some(field => {
    const value = parsed[field];

    return isRecord(value) && ROOT_PACKAGE_NAME in value;
  });

  for (const field of DEPENDENCY_FIELDS) {
    const value = next[field];

    if (!isRecord(value) || !(MOBILE_PACKAGE_NAME in value)) {
      continue;
    }

    const added = hasRoot ? undefined : `^${MIN_RUNTIME_VERSION}`;
    const rest = withoutMobile(value);

    // Appended, not inserted alphabetically: re-sorting a manifest that was never
    // sorted would widen the diff for no gain, and the package manager rewrites the
    // field on the next install anyway.
    next = { ...next, [field]: added === undefined ? rest : { ...rest, [ROOT_PACKAGE_NAME]: added } };
    hasRoot = true;
    changes.push({ field, removed: MOBILE_PACKAGE_NAME, added });
  }

  for (const field of MANUAL_FIELDS) {
    const value = next[field];

    if (isRecord(value) && MOBILE_PACKAGE_NAME in value) {
      manual.push(
        `"${field}" still pins ${MOBILE_PACKAGE_NAME}. Remove it by hand — its meaning differs per package manager.`
      );
    }
  }

  if (changes.length === 0) {
    return { text, changes, manual };
  }

  const serialized = JSON.stringify(next, null, detectIndent(text));

  return { text: text.endsWith('\n') ? `${serialized}\n` : serialized, changes, manual };
}

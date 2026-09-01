import { MIN_RUNTIME_VERSION, MOBILE_PACKAGE_NAME, ROOT_PACKAGE_NAME } from '../../constants.ts';
import type { PackageJsonChange } from '../../types.ts';

export type TransformPackageJsonResult = {
  text: string;
  changes: PackageJsonChange[];
  manual: string[];
};

const DEPENDENCY_FIELDS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'] as const;

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

const FLOOR = MIN_RUNTIME_VERSION.split('.').map(Number);

function versionIn(range: string): number[] | undefined {
  const match = /(\d+)\.(\d+)\.(\d+)/.exec(range);

  return match === null ? undefined : [Number(match[1]), Number(match[2]), Number(match[3])];
}

function isBelowFloor(range: string): boolean {
  const version = versionIn(range);

  if (version === undefined) {
    return false;
  }

  return FLOOR.some((part, index) => version[index] !== part && version[index] < part);
}

function rangeFor(field: string, previous: unknown): string | undefined {
  if (typeof previous === 'string' && versionIn(previous) === undefined) {
    return undefined;
  }

  return field === 'peerDependencies' ? `>=${MIN_RUNTIME_VERSION}` : `^${MIN_RUNTIME_VERSION}`;
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

  for (const field of DEPENDENCY_FIELDS) {
    const value = next[field];

    if (!isRecord(value) || !(MOBILE_PACKAGE_NAME in value)) {
      continue;
    }

    const existing = value[ROOT_PACKAGE_NAME];
    const keepExisting = typeof existing === 'string' && !isBelowFloor(existing);
    const added = keepExisting ? undefined : rangeFor(field, value[MOBILE_PACKAGE_NAME]);
    const rest = withoutMobile(value);

    if (added === undefined && !keepExisting) {
      manual.push(
        `"${field}" pinned ${MOBILE_PACKAGE_NAME} as \`${String(value[MOBILE_PACKAGE_NAME])}\`, which is not a version range. Point ${ROOT_PACKAGE_NAME} at the same source by hand.`
      );
    }

    next = {
      ...next,
      [field]:
        added === undefined
          ? { ...rest, ...(keepExisting ? {} : { [ROOT_PACKAGE_NAME]: value[MOBILE_PACKAGE_NAME] }) }
          : { ...rest, [ROOT_PACKAGE_NAME]: added },
    };
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

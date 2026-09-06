import detectIndent from 'detect-indent';
import semver from 'semver';

import { MIN_RUNTIME_VERSION, MOBILE_PACKAGE_NAME, ROOT_PACKAGE_NAME } from '../constants.ts';

export type PackageJsonChange = {
  field: string;
  removed: string;
  added: string | null;
};

type TransformPackageJsonResult = {
  text: string;
  changes: PackageJsonChange[];
  manual: string[];
};

const DEPENDENCY_FIELDS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'] as const;

const MANUAL_FIELDS = ['resolutions', 'overrides'] as const;

const FLOOR_RANGE = `>=${MIN_RUNTIME_VERSION}`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function withoutMobile(field: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(field).filter(([name]) => name !== MOBILE_PACKAGE_NAME));
}

// `workspace:*`, `file:../x.tgz`, `npm:other@1`, a git URL, a dist-tag: nothing semver can read as a range.
function isRegistryRange(spec: string): boolean {
  return semver.validRange(spec) !== null;
}

function rangeFor(field: string, previous: unknown): string | null {
  if (typeof previous === 'string' && !isRegistryRange(previous)) {
    return null;
  }

  return field === 'peerDependencies' ? FLOOR_RANGE : `^${MIN_RUNTIME_VERSION}`;
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
    const unreadable = typeof existing === 'string' && !isRegistryRange(existing);
    // `*` and `>=0.1.0` still admit a version below the floor, and a lockfile would keep one there.
    const keepExisting = typeof existing === 'string' && (unreadable || semver.subset(existing, FLOOR_RANGE));

    if (unreadable) {
      manual.push(
        `"${field}" points ${ROOT_PACKAGE_NAME} at \`${existing}\`, so its version cannot be checked against the ${MIN_RUNTIME_VERSION} floor. Confirm that source ships ${MIN_RUNTIME_VERSION} or newer.`
      );
    }
    const added = keepExisting ? null : rangeFor(field, value[MOBILE_PACKAGE_NAME]);
    const rest = withoutMobile(value);

    if (added === null && !keepExisting) {
      manual.push(
        `"${field}" pinned ${MOBILE_PACKAGE_NAME} as \`${String(value[MOBILE_PACKAGE_NAME])}\`, which is not a version range. Point ${ROOT_PACKAGE_NAME} at the same source by hand.`
      );
    }

    next = {
      ...next,
      [field]:
        added === null
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

  const { indent } = detectIndent(text);
  const serialized = JSON.stringify(next, null, indent === '' ? '  ' : indent);

  return { text: text.endsWith('\n') ? `${serialized}\n` : serialized, changes, manual };
}

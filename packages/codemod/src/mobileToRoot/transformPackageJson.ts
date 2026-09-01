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

// `workspace:`, `catalog:`, `file:`, `link:`, `portal:`, `npm:` — anything the package manager
// resolves itself. A registry range never carries a scheme, and matching on digits instead would
// read `file:../pkg-0.1.1.tgz` as the version 0.1.1.
function isProtocolSpec(range: string): boolean {
  return /^[a-z][a-z\d+.-]*:/i.test(range);
}

function versionIn(range: string): number[] | undefined {
  if (isProtocolSpec(range)) {
    return undefined;
  }

  const match = /(\d+)\.(\d+)\.(\d+)/.exec(range);

  return match === null ? undefined : [Number(match[1]), Number(match[2]), Number(match[3])];
}

function isBelowFloor(range: string): boolean {
  const version = versionIn(range);

  if (version === undefined) {
    return false;
  }

  // The first component that differs decides. Testing each component against its own floor
  // component independently would rank 1.0.0 below a 0.2.0 floor, because its minor is lower.
  for (const [index, part] of FLOOR.entries()) {
    if (version[index] !== part) {
      return version[index] < part;
    }
  }

  return false;
}

function rangeFor(field: string, previous: unknown): string | null {
  if (typeof previous === 'string' && versionIn(previous) === undefined) {
    return null;
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

    if (typeof existing === 'string' && isProtocolSpec(existing)) {
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

  const serialized = JSON.stringify(next, null, detectIndent(text));

  return { text: text.endsWith('\n') ? `${serialized}\n` : serialized, changes, manual };
}

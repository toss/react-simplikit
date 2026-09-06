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

type RootDependency = {
  spec: unknown;
  added: string | null;
  manual: string[];
};

const DEPENDENCY_FIELDS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

const MANUAL_FIELDS = ['resolutions', 'overrides'];

const FLOOR_RANGE = `>=${MIN_RUNTIME_VERSION}`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// What the field should point react-simplikit at once @react-simplikit/mobile leaves it.
function rootDependencyFor(field: string, existing: unknown, previous: unknown): RootDependency {
  // `workspace:*`, `file:../x.tgz`, `npm:other@1`, a git URL, a dist-tag: semver cannot read these as a range.
  if (typeof existing === 'string' && semver.validRange(existing) === null) {
    return {
      spec: existing,
      added: null,
      manual: [
        `"${field}" points ${ROOT_PACKAGE_NAME} at \`${existing}\`, so its version cannot be checked against the ${MIN_RUNTIME_VERSION} floor. Confirm that source ships ${MIN_RUNTIME_VERSION} or newer.`,
      ],
    };
  }

  // `*` and `>=0.1.0` still admit a version below the floor, and a lockfile would keep one there.
  if (typeof existing === 'string' && semver.subset(existing, FLOOR_RANGE)) {
    return { spec: existing, added: null, manual: [] };
  }

  if (typeof previous === 'string' && semver.validRange(previous) === null) {
    return {
      spec: previous,
      added: null,
      manual: [
        `"${field}" pinned ${MOBILE_PACKAGE_NAME} as \`${previous}\`, which is not a version range. Point ${ROOT_PACKAGE_NAME} at the same source by hand.`,
      ],
    };
  }

  const added = field === 'peerDependencies' ? FLOOR_RANGE : `^${MIN_RUNTIME_VERSION}`;

  return { spec: added, added, manual: [] };
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

    const { [MOBILE_PACKAGE_NAME]: previous, ...rest } = value;
    const root = rootDependencyFor(field, value[ROOT_PACKAGE_NAME], previous);

    next = { ...next, [field]: { ...rest, [ROOT_PACKAGE_NAME]: root.spec } };
    changes.push({ field, removed: MOBILE_PACKAGE_NAME, added: root.added });
    manual.push(...root.manual);
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

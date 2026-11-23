import detectIndent from 'detect-indent';
import semver from 'semver';

import { MIN_RUNTIME_VERSION, MOBILE_PACKAGE_NAME, ROOT_PACKAGE_NAME } from './constants.ts';

type TransformPackageJsonResult = {
  text: string;
  manual: string[];
};

type RootDependency = {
  spec: unknown;
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
      manual: [
        `"${field}" points ${ROOT_PACKAGE_NAME} at \`${existing}\`, so its version cannot be checked against the ${MIN_RUNTIME_VERSION} floor. Confirm that source ships ${MIN_RUNTIME_VERSION} or newer.`,
      ],
    };
  }

  // `*` and `>=0.1.0` still admit a version below the floor, and a lockfile would keep one there.
  if (typeof existing === 'string' && semver.subset(existing, FLOOR_RANGE)) {
    return { spec: existing, manual: [] };
  }

  if (typeof previous === 'string' && semver.validRange(previous) === null) {
    return {
      spec: previous,
      manual: [
        `"${field}" pinned ${MOBILE_PACKAGE_NAME} as \`${previous}\`, which is not a version range. Point ${ROOT_PACKAGE_NAME} at the same source by hand.`,
      ],
    };
  }

  return { spec: field === 'peerDependencies' ? FLOOR_RANGE : `^${MIN_RUNTIME_VERSION}`, manual: [] };
}

export function transformPackageJson(text: string): TransformPackageJsonResult {
  if (!text.includes(MOBILE_PACKAGE_NAME)) {
    return { text, manual: [] };
  }

  // JSON.parse rejects a byte order mark, so it is set aside and written back.
  const bom = text.startsWith('\uFEFF') ? '\uFEFF' : '';
  const parsed: unknown = JSON.parse(text.slice(bom.length));

  if (!isRecord(parsed)) {
    throw new Error('package.json must contain a JSON object at its root');
  }

  const manual: string[] = [];

  let next = parsed;
  let changed = false;

  for (const field of DEPENDENCY_FIELDS) {
    const value = next[field];

    if (!isRecord(value) || !(MOBILE_PACKAGE_NAME in value)) {
      continue;
    }

    const { [MOBILE_PACKAGE_NAME]: previous, ...rest } = value;
    const root = rootDependencyFor(field, value[ROOT_PACKAGE_NAME], previous);

    next = { ...next, [field]: { ...rest, [ROOT_PACKAGE_NAME]: root.spec } };
    changed = true;
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

  const { indent } = detectIndent(text);
  const serialized = JSON.stringify(next, null, indent === '' ? '  ' : indent);
  const output = changed ? `${bom}${serialized}${text.endsWith('\n') ? '\n' : ''}` : text;

  if (output.includes(MOBILE_PACKAGE_NAME) && manual.length === 0) {
    manual.push(`package.json still names ${MOBILE_PACKAGE_NAME} outside the dependency fields. Check it by hand.`);
  }

  return { text: output, manual };
}

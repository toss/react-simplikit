import glob from 'fast-glob';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { generateSkill, PACKAGE_INDEX_FILE, SKILL_DIRECTORY } from './commands/generateSkill/index.ts';
import { collectPublicExports } from './utils/collectPublicExports.ts';
import { getRootPath } from './utils/getRootPath.ts';

// agentskills.io: keep SKILL.md under 500 lines and the description under 1024 characters.
const MAX_SKILL_LINES = 500;
const MAX_DESCRIPTION_LENGTH = 1024;

const root = getRootPath();
const skillDirectory = path.join(root, SKILL_DIRECTORY);
// Hand-written, so it gets the frontmatter checks below but no regeneration diff.
const codemodSkillDirectory = path.join(root, path.dirname(SKILL_DIRECTORY), 'react-simplikit-codemod');

// The committed skill must be exactly what a fresh generation produces.
const regeneratedDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'react-simplikit-skill-'));

try {
  await generateSkill({ root, outputDirectory: regeneratedDirectory });

  const committedFiles = await listGeneratedFiles(skillDirectory);

  assert.deepEqual(
    committedFiles,
    await listGeneratedFiles(regeneratedDirectory),
    'the committed skill lists different files than `yarn skill:gen` produces — run it and commit the result'
  );

  for (const file of committedFiles) {
    assert.equal(
      await fs.readFile(path.join(skillDirectory, file), 'utf8'),
      await fs.readFile(path.join(regeneratedDirectory, file), 'utf8'),
      `${file} is out of date — run \`yarn skill:gen\` and commit the result`
    );
  }
} finally {
  await fs.rm(regeneratedDirectory, { force: true, recursive: true });
}

const skill = await readVerifiedSkill(skillDirectory, 'react-simplikit');
const codemodSkill = await readVerifiedSkill(codemodSkillDirectory, 'react-simplikit-codemod');

// The version floor lives in one constant and is repeated in prose. A bump that misses the prose
// ships docs promising a range the CLI no longer writes -- it was already wrong once, at 0.1.1.
const constants = await fs.readFile(path.join(root, 'packages/codemod/src/constants.ts'), 'utf8');
const floor = /MIN_RUNTIME_VERSION = '(.*)'/.exec(constants)?.[1];

if (floor === undefined) {
  throw new Error('MIN_RUNTIME_VERSION is missing from packages/codemod/src/constants.ts');
}

for (const [label, contents] of [
  ['the react-simplikit-codemod skill', codemodSkill],
  ['packages/codemod/README.md', await fs.readFile(path.join(root, 'packages/codemod/README.md'), 'utf8')],
] as const) {
  assert.equal(
    contents.includes(floor),
    true,
    `${label} never mentions ${floor} — MIN_RUNTIME_VERSION changed without the prose following`
  );
}

const publicExports = await collectPublicExports(path.join(root, PACKAGE_INDEX_FILE));
const catalogNames = [...skill.matchAll(/^\| \[`([^`]+)`\]\(references\/\1\.md\) \| .+ \|$/gm)].map(match => match[1]);

assert.deepEqual(catalogNames.toSorted(), publicExports, 'the catalog must list exactly the public exports');

for (const name of publicExports) {
  const page = await fs.readFile(path.join(skillDirectory, 'references', `${name}.md`), 'utf8');

  // References are one level deep: a page that links to another local page would be read as a dead link.
  assert.doesNotMatch(
    page,
    /\]\((?!https?:\/\/)[^)]*\.md/,
    `references/${name}.md must not link to another local page`
  );
  assert.equal(
    page.includes('@react-simplikit/mobile'),
    false,
    `references/${name}.md still mentions the legacy package — fix the JSDoc example and run \`yarn docs:gen ${name}\``
  );
}

// The skill has no "Deprecated" section by design; a deprecated export would be listed as if it were current.
const sourceFiles = await glob('packages/react-simplikit/src/**/*.{ts,tsx}', {
  cwd: root,
  ignore: ['**/*.spec.*', '**/*.test.*'],
});

for (const file of sourceFiles) {
  assert.equal(
    (await fs.readFile(path.join(root, file), 'utf8')).includes('@deprecated'),
    false,
    `${file} is @deprecated, but the skill catalog has no way to say so — un-deprecate it or add a Deprecated section to the template`
  );
}

// The hand-written table may only name catalog entries, or it drifts from the source.
const commonNeeds = skill.slice(skill.indexOf('## Common needs'), skill.indexOf('## Workflow'));

for (const [, token] of commonNeeds.matchAll(/`([^`]+)`/g)) {
  assert.equal(publicExports.includes(token), true, `"${token}" in the Common needs table is not a public export`);
}

async function readVerifiedSkill(directory: string, name: string): Promise<string> {
  const contents = await fs.readFile(path.join(directory, 'SKILL.md'), 'utf8');
  const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(contents)?.[1] ?? '';
  const description = /^description: (.*)$/m.exec(frontmatter)?.[1] ?? '';

  assert.equal(
    contents.split('\n').length <= MAX_SKILL_LINES,
    true,
    `${name}/SKILL.md must stay under ${MAX_SKILL_LINES} lines`
  );
  assert.equal(/^name: (.*)$/m.exec(frontmatter)?.[1], name, `the ${name} skill name must match its directory`);
  assert.equal(description.length > 0, true, `the ${name} skill must have a description`);
  assert.equal(
    description.length <= MAX_DESCRIPTION_LENGTH,
    true,
    `the ${name} skill description must stay under ${MAX_DESCRIPTION_LENGTH} characters`
  );

  return contents;
}

async function listGeneratedFiles(directory: string): Promise<string[]> {
  return (await glob(['SKILL.md', 'references/*.md'], { cwd: directory })).toSorted();
}

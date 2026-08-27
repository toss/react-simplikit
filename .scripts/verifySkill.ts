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

const skill = await fs.readFile(path.join(skillDirectory, 'SKILL.md'), 'utf8');
const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(skill)?.[1] ?? '';
const description = /^description: (.*)$/m.exec(frontmatter)?.[1] ?? '';

assert.equal(skill.split('\n').length <= MAX_SKILL_LINES, true, `SKILL.md must stay under ${MAX_SKILL_LINES} lines`);
assert.equal(/^name: (.*)$/m.exec(frontmatter)?.[1], 'react-simplikit', 'the skill name must match its directory');
assert.equal(description.length > 0, true, 'the skill must have a description');
assert.equal(
  description.length <= MAX_DESCRIPTION_LENGTH,
  true,
  `the skill description must stay under ${MAX_DESCRIPTION_LENGTH} characters`
);

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

async function listGeneratedFiles(directory: string): Promise<string[]> {
  return (await glob(['SKILL.md', 'references/*.md'], { cwd: directory })).toSorted();
}

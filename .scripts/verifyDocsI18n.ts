import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { getSidebarItems } from '../.vitepress/libs/getSidebarItems.mts';
import { generatedLocalesDirectory, generatedRewrites, localeDefinitions, rewrites } from '../.vitepress/locales.mts';
import { corePackageRoot } from '../.vitepress/shared.mts';

import { execWithOutput } from './utils/execWithOutput.ts';
import { getRootPath } from './utils/getRootPath.ts';

const root = getRootPath();
const releaseWorkflow = await fs.readFile(path.join(root, '.github/workflows/release.yml'), 'utf8');
const packageJson = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8')) as {
  scripts: Record<string, string>;
};
const gitignore = await fs.readFile(path.join(root, '.gitignore'), 'utf8');
const integrationWorkflow = await fs.readFile(path.join(root, '.github/workflows/integration.yml'), 'utf8');

for (const forbiddenText of ['get-diffs:', 'generate-docs:', 'OPENAI_API_KEY', 'create-pull-request@']) {
  assert.equal(releaseWorkflow.includes(forbiddenText), false, `release workflow must not contain ${forbiddenText}`);
}

for (const requiredText of ['release:', 'changesets/action@', 'changeset:publish']) {
  assert.equal(releaseWorkflow.includes(requiredText), true, `release workflow must contain ${requiredText}`);
}

assert.deepEqual(Object.keys(localeDefinitions), ['root', 'ko']);
assert.equal(rewrites['docs/index.md'], 'index.md');
assert.equal(rewrites['docs/ko/index.md'], 'ko/index.md');
assert.equal(rewrites['packages/core/src/hooks/:hook/ko/:hook.md'], 'ko/core/hooks/:hook.md');
assert.equal(generatedRewrites['generated-locales/docs/ko/index.md'], 'ko/index.md');
assert.equal(packageJson.scripts['docs:prepare'], 'tsx .scripts/index.ts prepare-localized-fallbacks');
assert.equal(packageJson.scripts['docs:dev'], 'yarn docs:prepare && vitepress dev');
assert.equal(packageJson.scripts['docs:build'], 'yarn docs:prepare && vitepress build');
assert.equal(gitignore.includes('generated-locales'), true);
assert.equal(packageJson.scripts['test:docs'], 'vitest run --dir .scripts && tsx .scripts/verifyDocsI18n.ts');
assert.equal(
  integrationWorkflow.includes("command: ['format', 'lint', 'type', 'docs']"),
  true,
  'the integration workflow must run test:docs'
);

const sidebarFixtureDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'react-simplikit-sidebar-'));

try {
  await fs.mkdir(path.join(sidebarFixtureDirectory, 'hooks', 'useJapanese', 'ja'), { recursive: true });
  await fs.mkdir(path.join(sidebarFixtureDirectory, 'hooks', 'useKorean', 'ko'), { recursive: true });
  await fs.writeFile(path.join(sidebarFixtureDirectory, 'hooks', 'useJapanese', 'ja', 'useJapanese.md'), '');
  await fs.writeFile(path.join(sidebarFixtureDirectory, 'hooks', 'useKorean', 'ko', 'useKorean.md'), '');

  assert.deepEqual(getSidebarItems(sidebarFixtureDirectory, 'hooks', '/core', 'ja'), [
    { text: 'useJapanese', link: '/ja/core/hooks/useJapanese' },
  ]);
} finally {
  await fs.rm(sidebarFixtureDirectory, { force: true, recursive: true });
}

const guideFixtureTitle = 'Untranslated Fallback Fixture';
const guideFixturePath = path.join(root, 'docs/core/untranslated-fallback-fixture.md');
const hookFixtureName = 'useUntranslatedFallbackFixture';
const hookFixtureDirectory = path.join(root, 'packages/core/src/hooks', hookFixtureName);
const buildOutputDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'react-simplikit-docs-'));

// The repository currently has a Korean translation for every routed English document, so the
// fallback path only has a route to render on while these English-only fixtures exist.
await fs.writeFile(guideFixturePath, `# ${guideFixtureTitle}\n`);
await fs.mkdir(hookFixtureDirectory, { recursive: true });
await fs.writeFile(path.join(hookFixtureDirectory, `${hookFixtureName}.md`), `# ${hookFixtureName}\n`);

try {
  await execWithOutput('yarn', ['docs:build', '--outDir', buildOutputDirectory], { cwd: root });

  const fallbackPage = await fs.readFile(
    path.join(buildOutputDirectory, 'ko/core/untranslated-fallback-fixture.html'),
    'utf8'
  );

  assert.equal(
    fallbackPage.includes(guideFixtureTitle),
    true,
    'the fallback route must serve the English source content'
  );
  assert.equal(
    fallbackPage.includes(localeDefinitions.ko.untranslatedNotice),
    true,
    'the fallback route must show the untranslated banner'
  );

  const translatedPage = await fs.readFile(path.join(buildOutputDirectory, 'ko/core/intro.html'), 'utf8');

  assert.equal(
    translatedPage.includes(localeDefinitions.ko.untranslatedNotice),
    false,
    'a real translation must not show the untranslated banner'
  );

  assert.deepEqual(
    getSidebarItems(corePackageRoot, 'hooks', '/core', 'ko').find(item => item.text === hookFixtureName),
    { text: hookFixtureName, link: `/ko/core/hooks/${hookFixtureName}` },
    'the Korean sidebar must link the fallback page so it is not reachable by URL only'
  );
} finally {
  await fs.rm(guideFixturePath, { force: true });
  await fs.rm(hookFixtureDirectory, { force: true, recursive: true });
  await fs.rm(path.join(root, generatedLocalesDirectory), { force: true, recursive: true });
  await fs.rm(buildOutputDirectory, { force: true, recursive: true });
}

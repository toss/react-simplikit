import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { DefaultTheme } from 'vitepress';

import { buildLocaleConfig } from '../.vitepress/libs/buildLocaleConfig.mts';
import { getSidebarItems } from '../.vitepress/libs/getSidebarItems.mts';
import { generatedLocalesDirectory, generatedRewrites, localeDefinitions, rewrites } from '../.vitepress/locales.mts';
import { corePackageRoot } from '../.vitepress/shared.mts';

import { assertLlmsOutput } from './utils/assertLlmsOutput.ts';
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

assert.deepEqual(Object.keys(localeDefinitions), ['root', 'ko', 'ja', 'zh-Hans', 'es']);
assert.equal(rewrites['docs/index.md'], 'index.md');
assert.equal(rewrites['docs/ko/index.md'], 'ko/index.md');
assert.equal(rewrites['packages/react-simplikit/src/hooks/:hook/ko/:hook.md'], 'ko/core/hooks/:hook.md');
assert.equal(rewrites['docs/ja/index.md'], 'ja/index.md');
assert.equal(rewrites['packages/react-simplikit/src/hooks/:hook/ja/:hook.md'], 'ja/core/hooks/:hook.md');
assert.equal(rewrites['docs/zh-Hans/index.md'], 'zh-Hans/index.md');
assert.equal(rewrites['packages/react-simplikit/src/hooks/:hook/zh-Hans/:hook.md'], 'zh-Hans/core/hooks/:hook.md');
assert.equal(rewrites['docs/es/index.md'], 'es/index.md');
assert.equal(rewrites['packages/react-simplikit/src/hooks/:hook/es/:hook.md'], 'es/core/hooks/:hook.md');
assert.equal(generatedRewrites['generated-locales/docs/ko/index.md'], 'ko/index.md');
assert.equal(generatedRewrites['generated-locales/docs/ja/index.md'], 'ja/index.md');
assert.equal(generatedRewrites['generated-locales/docs/zh-Hans/index.md'], 'zh-Hans/index.md');
assert.equal(generatedRewrites['generated-locales/docs/es/index.md'], 'es/index.md');
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
const hookFixtureDirectory = path.join(root, 'packages/react-simplikit/src/hooks', hookFixtureName);
const buildOutputDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'react-simplikit-docs-'));

// Korean translates every routed English document, so its fallback path only has a route to
// render on while these English-only fixtures exist. Japanese ships without translated API
// reference pages, so those routes render from generated fallbacks on every build.
await fs.writeFile(guideFixturePath, `# ${guideFixtureTitle}\n`);
await fs.mkdir(hookFixtureDirectory, { recursive: true });
await fs.writeFile(path.join(hookFixtureDirectory, `${hookFixtureName}.md`), `# ${hookFixtureName}\n`);

try {
  await execWithOutput('yarn', ['docs:build', '--outDir', buildOutputDirectory], { cwd: root });

  await assertLlmsOutput({ buildOutputDirectory, root });

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

// Brazilian Portuguese is not in the registry, so this fixture keeps covering the case
// buildLocaleConfig has to handle before a locale is registered. Whichever locale is used
// here must stay unregistered, or the assertions below stop proving anything.
const unregisteredLocaleFixture = {
  label: 'Português (Brasil)',
  lang: 'pt-BR',
  path: 'pt-BR',
  untranslatedNotice: 'Esta página está sendo exibida em inglês enquanto sua tradução é preparada.',
  themeStrings: {
    homeNavLabel: 'Início',
    guideLabel: 'Guia',
    referenceLabel: 'Referência',
    componentsLabel: 'Componentes',
    hooksLabel: 'Hooks',
    utilsLabel: 'Utilitários',
    guidePages: {
      core: {
        intro: 'Introdução',
        whyReactSimplikitMatters: 'Por que o react-simplikit importa',
        installation: 'Instalação',
        designPrinciples: 'Princípios de design',
        contributing: 'Contribuir',
      },
      mobile: {
        intro: 'Introdução',
        roadmap: 'Roteiro',
        installation: 'Instalação',
        designPrinciples: 'Princípios de design',
        contributing: 'Contribuir',
      },
    },
    editLinkText: 'Editar esta página no GitHub',
    footerMessage: 'Distribuído sob a licença MIT.',
  },
} satisfies Parameters<typeof buildLocaleConfig>[0];

const unregisteredConfig = buildLocaleConfig(unregisteredLocaleFixture);

assert.equal(unregisteredConfig.lang, 'pt-BR');
assert.deepEqual(unregisteredConfig.themeConfig?.nav, [
  { text: 'Início', link: '/pt-BR/' },
  { text: 'Guide', link: '/pt-BR/core/intro' },
  { text: 'Mobile Utilities', link: '/pt-BR/mobile/intro' },
]);
assert.deepEqual(Object.keys(unregisteredConfig.themeConfig?.sidebar ?? {}), ['/pt-BR/core/', '/pt-BR/mobile/']);
assert.equal(unregisteredConfig.themeConfig?.editLink?.text, 'Editar esta página no GitHub');

const koConfig = buildLocaleConfig(localeDefinitions.ko);
const rootConfig = buildLocaleConfig(localeDefinitions.root);

assert.deepEqual(koConfig.themeConfig?.nav, [
  { text: '홈', link: '/ko/' },
  { text: 'Guide', link: '/ko/core/intro' },
  { text: 'Mobile Utilities', link: '/ko/mobile/intro' },
]);
assert.deepEqual((koConfig.themeConfig?.sidebar as Record<string, DefaultTheme.SidebarItem[]>)['/ko/core/'][0], {
  text: '가이드',
  items: [
    { text: '소개', link: '/ko/core/intro' },
    { text: 'react-simplikit, 선택의 이유', link: '/ko/core/why-react-simplikit-matters' },
    { text: '설치하기', link: '/ko/core/installation' },
    { text: '설계 원칙', link: '/ko/core/design-principles' },
    { text: '기여하기', link: '/ko/core/contributing' },
  ],
});
assert.equal(koConfig.themeConfig?.editLink?.text, 'GitHub에서 수정하기');
assert.equal(koConfig.themeConfig?.footer?.message, 'MIT 라이선스에 따라 배포됩니다.');

assert.deepEqual(rootConfig.themeConfig?.nav, [
  { text: 'Home', link: '/' },
  { text: 'Guide', link: '/core/intro' },
  { text: 'Mobile Utilities', link: '/mobile/intro' },
]);
assert.equal(rootConfig.lang, 'en');
assert.equal(rootConfig.themeConfig?.editLink?.text, 'Edit this page on GitHub');

const jaConfig = buildLocaleConfig(localeDefinitions.ja);

assert.equal(jaConfig.lang, 'ja');
assert.deepEqual(jaConfig.themeConfig?.nav, [
  { text: 'ホーム', link: '/ja/' },
  { text: 'Guide', link: '/ja/core/intro' },
  { text: 'Mobile Utilities', link: '/ja/mobile/intro' },
]);
assert.equal(jaConfig.themeConfig?.editLink?.text, 'GitHub で編集する');
assert.notEqual(
  localeDefinitions.ja.themeStrings.search,
  undefined,
  'Japanese must ship search translations, or the search UI silently renders in English'
);

const zhHansConfig = buildLocaleConfig(localeDefinitions['zh-Hans']);

assert.equal(zhHansConfig.lang, 'zh-Hans');
assert.deepEqual(zhHansConfig.themeConfig?.nav, [
  { text: '首页', link: '/zh-Hans/' },
  { text: 'Guide', link: '/zh-Hans/core/intro' },
  { text: 'Mobile Utilities', link: '/zh-Hans/mobile/intro' },
]);
assert.equal(zhHansConfig.themeConfig?.editLink?.text, '在 GitHub 上编辑此页');
assert.notEqual(
  localeDefinitions['zh-Hans'].themeStrings.search,
  undefined,
  'Simplified Chinese must ship search translations, or the search UI silently renders in English'
);

const esConfig = buildLocaleConfig(localeDefinitions.es);

assert.equal(esConfig.lang, 'es');
assert.deepEqual(esConfig.themeConfig?.nav, [
  { text: 'Inicio', link: '/es/' },
  { text: 'Guide', link: '/es/core/intro' },
  { text: 'Mobile Utilities', link: '/es/mobile/intro' },
]);
assert.equal(esConfig.themeConfig?.editLink?.text, 'Editar esta página en GitHub');
assert.notEqual(
  localeDefinitions.es.themeStrings.search,
  undefined,
  'Spanish must ship search translations, or the search UI silently renders in English'
);

for (const retiredLocaleFile of ['.vitepress/en.mts', '.vitepress/ko.mts']) {
  await assert.rejects(
    fs.access(path.join(root, retiredLocaleFile)),
    `${retiredLocaleFile} must be deleted — locale config now comes from the registry`
  );
}

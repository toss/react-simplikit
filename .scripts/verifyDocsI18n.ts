import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { DefaultTheme } from 'vitepress';

import { buildLocaleConfig } from '../.vitepress/libs/buildLocaleConfig.mts';
import { getSidebarItems } from '../.vitepress/libs/getSidebarItems.mts';
import { collectLegacyRedirects } from '../.vitepress/libs/legacyRedirects.mts';
import {
  generatedLocalesDirectory,
  generatedRewrites,
  localeDefinitions,
  localeDirectories,
  rewrites,
} from '../.vitepress/locales.mts';
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
assert.equal(rewrites['packages/react-simplikit/src/hooks/:hook/ko/:hook.md'], 'ko/hooks/:hook.md');
assert.equal(rewrites['docs/ja/index.md'], 'ja/index.md');
assert.equal(rewrites['packages/react-simplikit/src/hooks/:hook/ja/:hook.md'], 'ja/hooks/:hook.md');
assert.equal(rewrites['docs/zh-Hans/index.md'], 'zh-Hans/index.md');
assert.equal(rewrites['packages/react-simplikit/src/hooks/:hook/zh-Hans/:hook.md'], 'zh-Hans/hooks/:hook.md');
assert.equal(rewrites['docs/es/index.md'], 'es/index.md');
assert.equal(rewrites['packages/react-simplikit/src/hooks/:hook/es/:hook.md'], 'es/hooks/:hook.md');
assert.equal(generatedRewrites['generated-locales/docs/ko/index.md'], 'ko/index.md');
assert.equal(generatedRewrites['generated-locales/docs/ja/index.md'], 'ja/index.md');
assert.equal(generatedRewrites['generated-locales/docs/zh-Hans/index.md'], 'zh-Hans/index.md');
assert.equal(generatedRewrites['generated-locales/docs/es/index.md'], 'es/index.md');
assert.equal(
  packageJson.scripts['docs:prepare'],
  'tsx .scripts/index.ts prepare-localized-fallbacks && tsx .scripts/index.ts generate-reference-index'
);
assert.equal(packageJson.scripts['docs:dev'], 'yarn docs:prepare && vitepress dev');
assert.equal(packageJson.scripts['docs:build'], 'yarn docs:prepare && vitepress build');
assert.equal(gitignore.includes('generated-locales'), true);
assert.equal(
  packageJson.scripts['test:docs'],
  'vitest run --dir .scripts && tsx .scripts/verifyDocsI18n.ts && tsx .scripts/verifyDocs.ts'
);
assert.equal(
  integrationWorkflow.includes("command: ['format', 'lint', 'type', 'docs', 'skill', 'codemod']"),
  true,
  'the integration workflow quality matrix must match this literal — update both when adding a command'
);

const sidebarFixtureDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'react-simplikit-sidebar-'));

try {
  await fs.mkdir(path.join(sidebarFixtureDirectory, 'hooks', 'useJapanese', 'ja'), { recursive: true });
  await fs.mkdir(path.join(sidebarFixtureDirectory, 'hooks', 'useKorean', 'ko'), { recursive: true });
  await fs.writeFile(path.join(sidebarFixtureDirectory, 'hooks', 'useJapanese', 'ja', 'useJapanese.md'), '');
  await fs.writeFile(path.join(sidebarFixtureDirectory, 'hooks', 'useKorean', 'ko', 'useKorean.md'), '');

  assert.deepEqual(getSidebarItems(sidebarFixtureDirectory, 'hooks', '', 'ja'), [
    { text: 'useJapanese', link: '/ja/hooks/useJapanese' },
  ]);
} finally {
  await fs.rm(sidebarFixtureDirectory, { force: true, recursive: true });
}

const guideFixtureTitle = 'Untranslated Fallback Fixture';
const guideFixturePath = path.join(root, 'docs/untranslated-fallback-fixture.md');
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

  // The redirect stubs are the only thing keeping pre-flattening URLs alive, and a
  // broken route filter would silently emit none of them.
  const stubs = collectLegacyRedirects();
  const localeCount = localeDirectories.length + 1;
  const referenceItemCount = (
    await Promise.all(
      ['hooks', 'components', 'utils', 'mobile/hooks', 'mobile/utils'].map(
        async directory =>
          (
            await fs.readdir(path.join(root, 'packages/react-simplikit/src', directory), { withFileTypes: true })
          ).filter(entry => entry.isDirectory()).length
      )
    )
  ).reduce((total, count) => total + count, 0);
  const guidePageCount = 11;

  assert.equal(
    stubs.length,
    (guidePageCount + referenceItemCount) * localeCount,
    'the legacy redirect set must cover every pre-flattening URL across all locales'
  );

  for (const { from, to } of stubs) {
    const stub = await fs.readFile(path.join(buildOutputDirectory, from), 'utf8');
    assert.match(stub, /http-equiv="refresh"/, `${from} must redirect`);
    assert.equal(stub.includes('noindex'), false, `${from} must stay indexable so canonical can consolidate signals`);
    await fs.access(path.join(buildOutputDirectory, to.split('#')[0]));
  }

  // The reference index is generated, so a broken generator would leave the nav
  // pointing at a page that does not exist.
  for (const locale of ['', ...localeDirectories]) {
    const referencePage = await fs.readFile(path.join(buildOutputDirectory, locale, 'reference.html'), 'utf8');
    assert.match(referencePage, /\/hooks\/useToggle/, `${locale || 'root'} reference index must list the exports`);
  }

  const fallbackPage = await fs.readFile(
    path.join(buildOutputDirectory, 'ko/untranslated-fallback-fixture.html'),
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

  const translatedPage = await fs.readFile(path.join(buildOutputDirectory, 'ko/intro.html'), 'utf8');

  assert.equal(
    translatedPage.includes(localeDefinitions.ko.untranslatedNotice),
    false,
    'a real translation must not show the untranslated banner'
  );

  assert.deepEqual(
    getSidebarItems(corePackageRoot, 'hooks', '', 'ko').find(item => item.text === hookFixtureName),
    { text: hookFixtureName, link: `/ko/hooks/${hookFixtureName}` },
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
    mobileWebLabel: 'Web móvel',
    guidePages: {
      intro: 'Introdução',
      whyReactSimplikitMatters: 'Por que o react-simplikit importa',
      installation: 'Instalação',
      aiIntegration: 'Integração com IA',
      designPrinciples: 'Princípios de design',
      contributing: 'Contribuir',
    },
    editLinkText: 'Editar esta página no GitHub',
    footerMessage: 'Distribuído sob a licença MIT.',
  },
} satisfies Parameters<typeof buildLocaleConfig>[0];

const unregisteredConfig = buildLocaleConfig(unregisteredLocaleFixture);

assert.equal(unregisteredConfig.lang, 'pt-BR');
const unregisteredConfigNav = unregisteredConfig.themeConfig?.nav ?? [];
assert.deepEqual(unregisteredConfigNav[0], { text: 'Início', link: '/pt-BR/' });
assert.deepEqual(unregisteredConfigNav[1], { text: 'Guide', link: '/pt-BR/intro' });
assert.equal((unregisteredConfigNav[2] as DefaultTheme.NavItemWithLink).text, 'Referência');
assert.equal((unregisteredConfigNav[2] as DefaultTheme.NavItemWithLink).link, '/pt-BR/reference');
assert.deepEqual(Object.keys(unregisteredConfig.themeConfig?.sidebar ?? {}), ['/pt-BR/']);
assert.equal(unregisteredConfig.themeConfig?.editLink?.text, 'Editar esta página no GitHub');

const koConfig = buildLocaleConfig(localeDefinitions.ko);
const rootConfig = buildLocaleConfig(localeDefinitions.root);

const koConfigNav = koConfig.themeConfig?.nav ?? [];
assert.deepEqual(koConfigNav[0], { text: '홈', link: '/ko/' });
assert.deepEqual(koConfigNav[1], { text: 'Guide', link: '/ko/intro' });
assert.equal((koConfigNav[2] as DefaultTheme.NavItemWithLink).text, '레퍼런스');
assert.equal((koConfigNav[2] as DefaultTheme.NavItemWithLink).link, '/ko/reference');
assert.deepEqual((koConfig.themeConfig?.sidebar as Record<string, DefaultTheme.SidebarItem[]>)['/ko/'][0], {
  text: '가이드',
  items: [
    { text: '소개', link: '/ko/intro' },
    { text: 'react-simplikit, 선택의 이유', link: '/ko/why-react-simplikit-matters' },
    { text: '설치하기', link: '/ko/installation' },
    { text: 'AI 연동', link: '/ko/ai-integration' },
    { text: '설계 원칙', link: '/ko/design-principles' },
    { text: '모바일 웹', link: '/ko/mobile-web' },
    { text: '기여하기', link: '/ko/contributing' },
  ],
});
assert.equal(koConfig.themeConfig?.editLink?.text, 'GitHub에서 수정하기');
assert.equal(koConfig.themeConfig?.footer?.message, 'MIT 라이선스에 따라 배포됩니다.');

const rootConfigNav = rootConfig.themeConfig?.nav ?? [];
assert.deepEqual(rootConfigNav[0], { text: 'Home', link: '/' });
assert.deepEqual(rootConfigNav[1], { text: 'Guide', link: '/intro' });
assert.equal((rootConfigNav[2] as DefaultTheme.NavItemWithLink).text, 'Reference');
assert.equal((rootConfigNav[2] as DefaultTheme.NavItemWithLink).link, '/reference');
assert.equal(rootConfig.lang, 'en');
assert.equal(rootConfig.themeConfig?.editLink?.text, 'Edit this page on GitHub');

const jaConfig = buildLocaleConfig(localeDefinitions.ja);

assert.equal(jaConfig.lang, 'ja');
const jaConfigNav = jaConfig.themeConfig?.nav ?? [];
assert.deepEqual(jaConfigNav[0], { text: 'ホーム', link: '/ja/' });
assert.deepEqual(jaConfigNav[1], { text: 'Guide', link: '/ja/intro' });
assert.equal((jaConfigNav[2] as DefaultTheme.NavItemWithLink).text, 'リファレンス');
assert.equal((jaConfigNav[2] as DefaultTheme.NavItemWithLink).link, '/ja/reference');
assert.equal(jaConfig.themeConfig?.editLink?.text, 'GitHub で編集する');
assert.notEqual(
  localeDefinitions.ja.themeStrings.search,
  undefined,
  'Japanese must ship search translations, or the search UI silently renders in English'
);

const zhHansConfig = buildLocaleConfig(localeDefinitions['zh-Hans']);

assert.equal(zhHansConfig.lang, 'zh-Hans');
const zhHansConfigNav = zhHansConfig.themeConfig?.nav ?? [];
assert.deepEqual(zhHansConfigNav[0], { text: '首页', link: '/zh-Hans/' });
assert.deepEqual(zhHansConfigNav[1], { text: 'Guide', link: '/zh-Hans/intro' });
assert.equal((zhHansConfigNav[2] as DefaultTheme.NavItemWithLink).text, '参考');
assert.equal((zhHansConfigNav[2] as DefaultTheme.NavItemWithLink).link, '/zh-Hans/reference');
assert.equal(zhHansConfig.themeConfig?.editLink?.text, '在 GitHub 上编辑此页');
assert.notEqual(
  localeDefinitions['zh-Hans'].themeStrings.search,
  undefined,
  'Simplified Chinese must ship search translations, or the search UI silently renders in English'
);

const esConfig = buildLocaleConfig(localeDefinitions.es);

assert.equal(esConfig.lang, 'es');
const esConfigNav = esConfig.themeConfig?.nav ?? [];
assert.deepEqual(esConfigNav[0], { text: 'Inicio', link: '/es/' });
assert.deepEqual(esConfigNav[1], { text: 'Guide', link: '/es/intro' });
assert.equal((esConfigNav[2] as DefaultTheme.NavItemWithLink).text, 'Referencia');
assert.equal((esConfigNav[2] as DefaultTheme.NavItemWithLink).link, '/es/reference');
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

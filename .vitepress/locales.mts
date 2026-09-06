import { DefaultTheme } from 'vitepress';

import { en } from './locales/en.mts';
import { es } from './locales/es.mts';
import { ja } from './locales/ja.mts';
import { ko } from './locales/ko.mts';
import { zhHans } from './locales/zh-Hans.mts';

export type LocaleCode = 'root' | 'ko' | 'ja' | 'zh-Hans' | 'es';

type GuidePageTitles = {
  intro: string;
  whyReactSimplikitMatters: string;
  installation: string;
  aiIntegration: string;
  designPrinciples: string;
  mobileWeb: string;
  contributing: string;
};

export type LocaleThemeStrings = {
  homeNavLabel: string;
  guideLabel: string;
  referenceLabel: string;
  componentsLabel: string;
  hooksLabel: string;
  utilsLabel: string;
  guidePages: GuidePageTitles;
  editLinkText: string;
  footerMessage: string;
  search?: NonNullable<DefaultTheme.LocalSearchOptions['locales']>[string];
};

export type LocaleDefinition = {
  label: string;
  lang: string;
  path: string;
  untranslatedNotice: string;
  themeStrings: LocaleThemeStrings;
};

type RouteDefinition = {
  source: string;
  destination: string;
  localizedSource: string;
  localizedDestination: string;
  /** Pre-flattening URL kept only to emit redirect stubs. */
  legacyDestination?: string;
  localizedLegacyDestination?: string;
};

export const localeDefinitions: Record<LocaleCode, LocaleDefinition> = {
  root: {
    label: 'English',
    lang: 'en',
    path: '',
    untranslatedNotice: 'This page is currently shown in English while its translation is being prepared.',
    themeStrings: en,
  },
  ko: {
    label: '한국어',
    lang: 'ko',
    path: 'ko',
    untranslatedNotice: '이 페이지는 번역을 준비하는 동안 영어 원문으로 보여드려요.',
    themeStrings: ko,
  },
  ja: {
    label: '日本語',
    lang: 'ja',
    path: 'ja',
    untranslatedNotice: 'このページは翻訳の準備中のため、英語の原文を表示しています。',
    themeStrings: ja,
  },
  'zh-Hans': {
    label: '简体中文',
    lang: 'zh-Hans',
    path: 'zh-Hans',
    untranslatedNotice: '此页面的翻译正在准备中，暂时显示英文原文。',
    themeStrings: zhHans,
  },
  es: {
    label: 'Español',
    lang: 'es',
    path: 'es',
    untranslatedNotice: 'Esta página se muestra en inglés mientras se prepara su traducción.',
    themeStrings: es,
  },
};

export const localeDirectories = Object.values(localeDefinitions)
  .map(locale => locale.path)
  .filter(path => path.length > 0);

export const generatedLocalesDirectory = 'generated-locales';

const routeDefinitions: RouteDefinition[] = [
  {
    source: 'docs/index.md',
    destination: 'index.md',
    localizedSource: 'docs/:locale/index.md',
    localizedDestination: ':locale/index.md',
  },
  {
    source: 'docs/:doc.md',
    destination: ':doc.md',
    localizedSource: 'docs/:locale/:doc.md',
    localizedDestination: ':locale/:doc.md',
  },
  {
    source: 'packages/react-simplikit/src/hooks/:hook/:hook.md',
    destination: 'hooks/:hook.md',
    legacyDestination: 'core/hooks/:hook.md',
    localizedSource: 'packages/react-simplikit/src/hooks/:hook/:locale/:hook.md',
    localizedDestination: ':locale/hooks/:hook.md',
    localizedLegacyDestination: ':locale/core/hooks/:hook.md',
  },
  {
    source: 'packages/react-simplikit/src/components/:component/:component.md',
    destination: 'components/:component.md',
    legacyDestination: 'core/components/:component.md',
    localizedSource: 'packages/react-simplikit/src/components/:component/:locale/:component.md',
    localizedDestination: ':locale/components/:component.md',
    localizedLegacyDestination: ':locale/core/components/:component.md',
  },
  {
    source: 'packages/react-simplikit/src/utils/:util/:util.md',
    destination: 'utils/:util.md',
    legacyDestination: 'core/utils/:util.md',
    localizedSource: 'packages/react-simplikit/src/utils/:util/:locale/:util.md',
    localizedDestination: ':locale/utils/:util.md',
    localizedLegacyDestination: ':locale/core/utils/:util.md',
  },
  {
    source: 'packages/react-simplikit/src/mobile/hooks/:hook/:hook.md',
    destination: 'hooks/:hook.md',
    legacyDestination: 'mobile/hooks/:hook.md',
    localizedSource: 'packages/react-simplikit/src/mobile/hooks/:hook/:locale/:hook.md',
    localizedDestination: ':locale/hooks/:hook.md',
    localizedLegacyDestination: ':locale/mobile/hooks/:hook.md',
  },
  {
    source: 'packages/react-simplikit/src/mobile/utils/:util/:util.md',
    destination: 'utils/:util.md',
    legacyDestination: 'mobile/utils/:util.md',
    localizedSource: 'packages/react-simplikit/src/mobile/utils/:util/:locale/:util.md',
    localizedDestination: ':locale/utils/:util.md',
    localizedLegacyDestination: ':locale/mobile/utils/:util.md',
  },
];

const localizedRewriteEntries = localeDirectories.flatMap(locale =>
  routeDefinitions.map(route => [
    route.localizedSource.replace(':locale', locale),
    route.localizedDestination.replace(':locale', locale),
  ])
);

export const rewrites = Object.fromEntries([
  ...routeDefinitions.map(route => [route.source, route.destination]),
  ...localizedRewriteEntries,
]);

/**
 * Old-to-new URL pairs (still parameterized with :hook etc.) for every route that
 * moved in the flattening. buildEnd expands them against the source tree and writes
 * redirect stubs so pre-flattening links keep working on any static host.
 */
export const legacyRoutePatterns = routeDefinitions
  .filter(route => route.legacyDestination !== undefined)
  .flatMap(route => [
    { source: route.source, from: route.legacyDestination as string, to: route.destination },
    ...localeDirectories.map(locale => ({
      source: route.source,
      from: (route.localizedLegacyDestination as string).replace(':locale', locale),
      to: route.localizedDestination.replace(':locale', locale),
    })),
  ]);

export const generatedRewrites = Object.fromEntries(
  localizedRewriteEntries.map(([source, destination]) => [`${generatedLocalesDirectory}/${source}`, destination])
);

/**
 * Glob patterns for the English source files that participate in the rewrites above.
 * Any Markdown outside these patterns has no localized destination, so generating a
 * fallback for it would publish an unrouted page.
 */
export const localizableSourcePatterns = routeDefinitions.map(route => route.source.replace(/:[A-Za-z]+/g, '*'));

/**
 * Notice shown on a generated fallback page, keyed by the `lang` VitePress reports at runtime.
 */
export const untranslatedNoticeByLang = Object.fromEntries(
  Object.values(localeDefinitions).map(locale => [locale.lang, locale.untranslatedNotice])
);

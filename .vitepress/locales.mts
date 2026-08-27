import { DefaultTheme } from 'vitepress';

import { en } from './locales/en.mts';
import { es } from './locales/es.mts';
import { ja } from './locales/ja.mts';
import { ko } from './locales/ko.mts';
import { zhHans } from './locales/zh-Hans.mts';

export type LocaleCode = 'root' | 'ko' | 'ja' | 'zh-Hans' | 'es';

type GuidePageTitles = {
  core: {
    intro: string;
    whyReactSimplikitMatters: string;
    installation: string;
    aiIntegration: string;
    designPrinciples: string;
    contributing: string;
  };
  mobile: {
    intro: string;
    roadmap: string;
    installation: string;
    designPrinciples: string;
    contributing: string;
  };
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
    source: 'docs/core/:doc.md',
    destination: 'core/:doc.md',
    localizedSource: 'docs/:locale/core/:doc.md',
    localizedDestination: ':locale/core/:doc.md',
  },
  {
    source: 'docs/mobile/:doc.md',
    destination: 'mobile/:doc.md',
    localizedSource: 'docs/:locale/mobile/:doc.md',
    localizedDestination: ':locale/mobile/:doc.md',
  },
  {
    source: 'packages/react-simplikit/src/hooks/:hook/:hook.md',
    destination: 'core/hooks/:hook.md',
    localizedSource: 'packages/react-simplikit/src/hooks/:hook/:locale/:hook.md',
    localizedDestination: ':locale/core/hooks/:hook.md',
  },
  {
    source: 'packages/react-simplikit/src/components/:component/:component.md',
    destination: 'core/components/:component.md',
    localizedSource: 'packages/react-simplikit/src/components/:component/:locale/:component.md',
    localizedDestination: ':locale/core/components/:component.md',
  },
  {
    source: 'packages/react-simplikit/src/utils/:util/:util.md',
    destination: 'core/utils/:util.md',
    localizedSource: 'packages/react-simplikit/src/utils/:util/:locale/:util.md',
    localizedDestination: ':locale/core/utils/:util.md',
  },
  {
    source: 'packages/react-simplikit/src/mobile/hooks/:hook/:hook.md',
    destination: 'mobile/hooks/:hook.md',
    localizedSource: 'packages/react-simplikit/src/mobile/hooks/:hook/:locale/:hook.md',
    localizedDestination: ':locale/mobile/hooks/:hook.md',
  },
  {
    source: 'packages/react-simplikit/src/mobile/utils/:util/:util.md',
    destination: 'mobile/utils/:util.md',
    localizedSource: 'packages/react-simplikit/src/mobile/utils/:util/:locale/:util.md',
    localizedDestination: ':locale/mobile/utils/:util.md',
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

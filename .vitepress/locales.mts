import { DefaultTheme } from 'vitepress';

export type LocaleCode = 'root' | 'ko';

type GuidePageTitles = {
  core: {
    intro: string;
    whyReactSimplikitMatters: string;
    installation: string;
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
    themeStrings: {
      homeNavLabel: 'Home',
      guideLabel: 'Guide',
      referenceLabel: 'Reference',
      componentsLabel: 'Components',
      hooksLabel: 'Hooks',
      utilsLabel: 'Utils',
      guidePages: {
        core: {
          intro: 'Introduction',
          whyReactSimplikitMatters: 'Why react-simplikit matters',
          installation: 'Installation',
          designPrinciples: 'Design Principles',
          contributing: 'Contributing',
        },
        mobile: {
          intro: 'Introduction',
          roadmap: 'Roadmap',
          installation: 'Installation',
          designPrinciples: 'Design Principles',
          contributing: 'Contributing',
        },
      },
      editLinkText: 'Edit this page on GitHub',
      footerMessage: 'Released under the MIT License.',
    },
  },
  ko: {
    label: '한국어',
    lang: 'ko',
    path: 'ko',
    untranslatedNotice: '이 페이지는 번역을 준비하는 동안 영어 원문으로 보여드려요.',
    themeStrings: {
      homeNavLabel: '홈',
      guideLabel: '가이드',
      referenceLabel: '레퍼런스',
      componentsLabel: '컴포넌트',
      hooksLabel: '훅',
      utilsLabel: '유틸리티',
      guidePages: {
        core: {
          intro: '소개',
          whyReactSimplikitMatters: 'react-simplikit, 선택의 이유',
          installation: '설치하기',
          designPrinciples: '설계 원칙',
          contributing: '기여하기',
        },
        mobile: {
          intro: '소개',
          roadmap: '앞으로의 방향',
          installation: '설치하기',
          designPrinciples: '설계 원칙',
          contributing: '기여하기',
        },
      },
      editLinkText: 'GitHub에서 수정하기',
      footerMessage: 'MIT 라이선스에 따라 배포됩니다.',
      search: {
        translations: {
          button: {
            buttonText: '검색',
            buttonAriaLabel: '검색',
          },
          modal: {
            backButtonTitle: '뒤로가기',
            displayDetails: '더보기',
            footer: {
              closeKeyAriaLabel: '닫기',
              closeText: '닫기',
              navigateDownKeyAriaLabel: '아래로',
              navigateText: '이동',
              navigateUpKeyAriaLabel: '위로',
              selectKeyAriaLabel: '선택',
              selectText: '선택',
            },
            noResultsText: '검색 결과를 찾지 못했어요.',
            resetButtonTitle: '모두 지우기',
          },
        },
      },
    },
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
    source: 'packages/core/src/hooks/:hook/:hook.md',
    destination: 'core/hooks/:hook.md',
    localizedSource: 'packages/core/src/hooks/:hook/:locale/:hook.md',
    localizedDestination: ':locale/core/hooks/:hook.md',
  },
  {
    source: 'packages/core/src/components/:component/:component.md',
    destination: 'core/components/:component.md',
    localizedSource: 'packages/core/src/components/:component/:locale/:component.md',
    localizedDestination: ':locale/core/components/:component.md',
  },
  {
    source: 'packages/core/src/utils/:util/:util.md',
    destination: 'core/utils/:util.md',
    localizedSource: 'packages/core/src/utils/:util/:locale/:util.md',
    localizedDestination: ':locale/core/utils/:util.md',
  },
  {
    source: 'packages/mobile/src/hooks/:hook/:hook.md',
    destination: 'mobile/hooks/:hook.md',
    localizedSource: 'packages/mobile/src/hooks/:hook/:locale/:hook.md',
    localizedDestination: ':locale/mobile/hooks/:hook.md',
  },
  {
    source: 'packages/mobile/src/utils/:util/:util.md',
    destination: 'mobile/utils/:util.md',
    localizedSource: 'packages/mobile/src/utils/:util/:locale/:util.md',
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

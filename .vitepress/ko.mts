import { defineConfig, DefaultTheme } from 'vitepress';
import { getSidebarItems } from './libs/getSidebarItems.mts';
import { sortByText } from './libs/sortByText.mts';
import { sourceRoot } from './shared.mts';

export const ko = defineConfig({
  lang: 'ko',
  themeConfig: {
    nav: nav(),
    sidebar: sidebar(),
    editLink: {
      pattern: 'https://github.com/toss/react-simplikit/edit/main/src/:path',
      text: 'GitHub에서 수정하기',
    },
    footer: {
      message: 'MIT 라이선스에 따라 배포됩니다.',
      copyright: `Copyright © ${new Date().getFullYear()} Viva Republica, Inc.`,
    },
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: '홈', link: '/ko' },
    { text: '소개', link: '/ko/intro.html' },
    { text: '레퍼런스', link: '/ko/hooks/useBooleanState.html' },
  ];
}

function sidebar(): DefaultTheme.Sidebar {
  return [
    {
      text: '가이드',
      items: [
        { text: '소개', link: '/ko/intro' },
        { text: 'react-simplikit, 선택의 이유', link: '/ko/why-react-simplikit-matters' },
        { text: '설치하기', link: '/ko/installation' },
        { text: '설계 원칙', link: '/ko/design-principles' },
        { text: '기여하기', link: '/ko/contributing' },
      ],
    },
    {
      text: 'Reference',
      items: sortByText([
        {
          text: 'Components',
          items: getSidebarItems(sourceRoot, 'components', '*', 'ko'),
        },
        {
          text: 'Hooks',
          items: getSidebarItems(sourceRoot, 'hooks', '*', 'ko'),
        },
        {
          text: 'Utils',
          items: getSidebarItems(sourceRoot, 'utils', '*', 'ko'),
        },
      ]),
    },
  ];
}

export const search: DefaultTheme.LocalSearchOptions['locales'] = {
  ko: {
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
};

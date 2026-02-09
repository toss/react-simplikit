import { defineConfig, DefaultTheme } from 'vitepress';
import { getSidebarItems } from './libs/getSidebarItems.mts';
import { sortByText } from './libs/sortByText.mts';
import { corePackageRoot, mobilePackageRoot } from './shared.mts';

export const ko = defineConfig({
  lang: 'ko',
  themeConfig: {
    nav: nav(),
    sidebar: sidebar(),
    editLink: {
      pattern: 'https://github.com/toss/react-simplikit/edit/main/:path',
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
    { text: '홈', link: '/ko/' },
    { text: 'Mobile', link: '/ko/mobile/intro' },
    { text: 'Core', link: '/ko/core/intro' },
  ];
}

function sidebar(): DefaultTheme.Sidebar {
  return {
    '/ko/core/': coreSidebar(),
    '/ko/mobile/': mobileSidebar(),
  };
}

function coreSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '가이드',
      items: [
        { text: '소개', link: '/ko/core/intro' },
        { text: 'react-simplikit, 선택의 이유', link: '/ko/core/why-react-simplikit-matters' },
        { text: '설치하기', link: '/ko/core/installation' },
        { text: '설계 원칙', link: '/ko/core/design-principles' },
        { text: '기여하기', link: '/ko/core/contributing' },
      ],
    },
    {
      text: '레퍼런스',
      items: sortByText([
        {
          text: '컴포넌트',
          collapsed: false,
          items: getSidebarItems(corePackageRoot, 'components', '/core', 'ko'),
        },
        {
          text: '훅',
          collapsed: false,
          items: getSidebarItems(corePackageRoot, 'hooks', '/core', 'ko'),
        },
        {
          text: '유틸리티',
          collapsed: false,
          items: getSidebarItems(corePackageRoot, 'utils', '/core', 'ko'),
        },
      ]),
    },
  ];
}

function mobileSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '가이드',
      items: [
        { text: '소개', link: '/ko/mobile/intro' },
        { text: '앞으로의 방향', link: '/ko/mobile/roadmap' },
        { text: '설치하기', link: '/ko/mobile/installation' },
        { text: '설계 원칙', link: '/ko/mobile/design-principles' },
        { text: '기여하기', link: '/ko/mobile/contributing' },
      ],
    },
    {
      text: '레퍼런스',
      items: [
        {
          text: '훅',
          collapsed: false,
          items: getSidebarItems(mobilePackageRoot, 'hooks', '/mobile', 'ko'),
        },
      ],
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

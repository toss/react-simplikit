import { defineConfig, DefaultTheme } from 'vitepress';
import { getSidebarItems } from './libs/getSidebarItems.mts';
import { sortByText } from './libs/sortByText.mts';
import { sourceRoot } from './shared.mts';

export const ko = defineConfig({
  themeConfig: {
    nav: nav(),
    sidebar: sidebar(),
    editLink: {
      pattern: 'https://github.com/toss/reactive-kit/edit/main/docs/:path',
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
  ];
}

function sidebar(): DefaultTheme.Sidebar {
  return [
    {
      text: '가이드',
      items: [
        { text: '소개', link: '/ko/intro' },
        { text: '설치 및 사용 방법', link: '/ko/usage' },
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

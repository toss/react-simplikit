import path from 'node:path';
import { DefaultTheme, defineConfig } from 'vitepress';
import { getSidebarItems } from './libs/getSidebarItems.mts';
import { sortByText } from './libs/sortByText.mts';

const docsRoot = path.resolve(import.meta.dirname, '..');
console.log(docsRoot);

export default defineConfig({
  title: 'reactie',
  themeConfig: {
    nav: nav(),

    sidebar: sidebar(),

    editLink: {
      pattern: 'https://github.com/toss/es-toolkit/edit/main/docs/:path',
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
    { text: 'Home', link: '/' },
    { text: 'Introduction', link: '/intro.html' },
  ];
}

function sidebar(): DefaultTheme.Sidebar {
  return [
    {
      text: '가이드',
      items: [
        { text: '소개', link: '/intro' },
        { text: '설치 및 사용 방법', link: '/usage' },
      ],
    },
    {
      text: '레퍼런스',
      items: sortByText([
        {
          text: 'Hooks',
          items: [...getSidebarItems(docsRoot, 'reference', 'hooks')],
        },
      ]),
    },
  ];
}

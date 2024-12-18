import { defineConfig, DefaultTheme } from 'vitepress';
import { getSidebarItems } from './libs/getSidebarItems.mts';
import { sortByText } from './libs/sortByText.mts';
import { docsRoot } from './shared.mts';

export const en = defineConfig({
  themeConfig: {
    nav: nav(),

    sidebar: sidebar(),

    editLink: {
      pattern: 'https://github.com/toss/reactie/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License.',
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
      text: 'Guide',
      items: [
        { text: 'Introduction', link: '/intro' },
        { text: 'Installation & Usage', link: '/usage' },
      ],
    },
    {
      text: 'Reference',
      items: sortByText([
        {
          text: 'Hooks',
          items: [...getSidebarItems(docsRoot, 'reference', 'hooks')],
        },
      ]),
    },
  ];
}

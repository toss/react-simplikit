import { defineConfig, DefaultTheme } from 'vitepress';
import { getSidebarItems } from './libs/getSidebarItems.mts';
import { sortByText } from './libs/sortByText.mts';
import { corePackageRoot, mobilePackageRoot } from './shared.mts';

export const en = defineConfig({
  lang: 'en',
  themeConfig: {
    nav: nav(),
    sidebar: sidebar(),
    editLink: {
      pattern: 'https://github.com/toss/react-simplikit/edit/main/:path',
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
    { text: 'Mobile', link: '/mobile/intro' },
    { text: 'Core', link: '/core/intro' },
  ];
}

function sidebar(): DefaultTheme.Sidebar {
  return {
    '/core/': coreSidebar(),
    '/mobile/': mobileSidebar(),
  };
}

function coreSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Guide',
      items: [
        { text: 'Introduction', link: '/core/intro' },
        { text: 'Why react-simplikit matters', link: '/core/why-react-simplikit-matters' },
        { text: 'Installation', link: '/core/installation' },
        { text: 'Design Principles', link: '/core/design-principles' },
        { text: 'Contributing', link: '/core/contributing' },
      ],
    },
    {
      text: 'Reference',
      items: sortByText([
        {
          text: 'Components',
          collapsed: false,
          items: getSidebarItems(corePackageRoot, 'components', '/core'),
        },
        {
          text: 'Hooks',
          collapsed: false,
          items: getSidebarItems(corePackageRoot, 'hooks', '/core'),
        },
        {
          text: 'Utils',
          collapsed: false,
          items: getSidebarItems(corePackageRoot, 'utils', '/core'),
        },
      ]),
    },
  ];
}

function mobileSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Guide',
      items: [
        { text: 'Introduction', link: '/mobile/intro' },
        { text: 'Roadmap', link: '/mobile/roadmap' },
        { text: 'Installation', link: '/mobile/installation' },
        { text: 'Design Principles', link: '/mobile/design-principles' },
        { text: 'Contributing', link: '/mobile/contributing' },
      ],
    },
    {
      text: 'Reference',
      items: [
        {
          text: 'Hooks',
          collapsed: false,
          items: getSidebarItems(mobilePackageRoot, 'hooks', '/mobile'),
        },
      ],
    },
  ];
}

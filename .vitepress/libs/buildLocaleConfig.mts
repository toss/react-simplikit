import { DefaultTheme, LocaleSpecificConfig } from 'vitepress';

import { LocaleDefinition } from '../locales.mts';
import { corePackageRoot, mobilePackageRoot } from '../shared.mts';
import { getSidebarItems } from './getSidebarItems.mts';
import { sortByText } from './sortByText.mts';

/**
 * Builds one locale's VitePress config from registry data, so adding a locale
 * is a registry entry plus translated Markdown — no per-locale config file.
 */
export function buildLocaleConfig(
  definition: LocaleDefinition
): LocaleSpecificConfig<DefaultTheme.Config> & { lang: string } {
  const prefix = definition.path === '' ? '' : `/${definition.path}`;
  const sidebarLocale = definition.path === '' ? undefined : definition.path;
  const strings = definition.themeStrings;

  return {
    lang: definition.lang,
    themeConfig: {
      nav: [
        { text: strings.homeNavLabel, link: `${prefix}/` },
        { text: 'Guide', link: `${prefix}/core/intro` },
        { text: 'Mobile Utilities', link: `${prefix}/mobile/intro` },
      ],
      sidebar: {
        [`${prefix}/core/`]: [
          {
            text: strings.guideLabel,
            items: [
              { text: strings.guidePages.core.intro, link: `${prefix}/core/intro` },
              {
                text: strings.guidePages.core.whyReactSimplikitMatters,
                link: `${prefix}/core/why-react-simplikit-matters`,
              },
              { text: strings.guidePages.core.installation, link: `${prefix}/core/installation` },
              { text: strings.guidePages.core.designPrinciples, link: `${prefix}/core/design-principles` },
              { text: strings.guidePages.core.contributing, link: `${prefix}/core/contributing` },
            ],
          },
          {
            text: strings.referenceLabel,
            items: sortByText([
              {
                text: strings.componentsLabel,
                collapsed: false,
                items: getSidebarItems(corePackageRoot, 'components', '/core', sidebarLocale),
              },
              {
                text: strings.hooksLabel,
                collapsed: false,
                items: getSidebarItems(corePackageRoot, 'hooks', '/core', sidebarLocale),
              },
              {
                text: strings.utilsLabel,
                collapsed: false,
                items: getSidebarItems(corePackageRoot, 'utils', '/core', sidebarLocale),
              },
            ]),
          },
        ],
        [`${prefix}/mobile/`]: [
          {
            text: strings.guideLabel,
            items: [
              { text: strings.guidePages.mobile.intro, link: `${prefix}/mobile/intro` },
              { text: strings.guidePages.mobile.roadmap, link: `${prefix}/mobile/roadmap` },
              { text: strings.guidePages.mobile.installation, link: `${prefix}/mobile/installation` },
              { text: strings.guidePages.mobile.designPrinciples, link: `${prefix}/mobile/design-principles` },
              { text: strings.guidePages.mobile.contributing, link: `${prefix}/mobile/contributing` },
            ],
          },
          {
            text: strings.referenceLabel,
            items: [
              {
                text: strings.hooksLabel,
                collapsed: false,
                items: getSidebarItems(mobilePackageRoot, 'hooks', '/mobile', sidebarLocale),
              },
              {
                text: strings.utilsLabel,
                collapsed: false,
                items: getSidebarItems(mobilePackageRoot, 'utils', '/mobile', sidebarLocale),
              },
            ],
          },
        ],
      },
      editLink: {
        pattern: 'https://github.com/toss/react-simplikit/edit/main/:path',
        text: strings.editLinkText,
      },
      footer: {
        message: strings.footerMessage,
        copyright: `Copyright © ${new Date().getFullYear()} Viva Republica, Inc.`,
      },
    },
  };
}

import { DefaultTheme, LocaleSpecificConfig } from 'vitepress';

import { LocaleDefinition } from '../locales.mts';
import { packageSourceRoot } from '../shared.mts';
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

  const hooks = getSidebarItems(packageSourceRoot, 'hooks', '', sidebarLocale);
  const components = getSidebarItems(packageSourceRoot, 'components', '', sidebarLocale);
  const utils = getSidebarItems(packageSourceRoot, 'utils', '', sidebarLocale);

  return {
    lang: definition.lang,
    themeConfig: {
      nav: [
        { text: strings.homeNavLabel, link: `${prefix}/` },
        { text: 'Guide', link: `${prefix}/intro` },
        { text: strings.referenceLabel, link: `${prefix}/reference` },
      ],
      sidebar: {
        [`${prefix}/`]: [
          {
            text: strings.guideLabel,
            items: [
              { text: strings.guidePages.intro, link: `${prefix}/intro` },
              {
                text: strings.guidePages.whyReactSimplikitMatters,
                link: `${prefix}/why-react-simplikit-matters`,
              },
              { text: strings.guidePages.installation, link: `${prefix}/installation` },
              { text: strings.guidePages.aiIntegration, link: `${prefix}/ai-integration` },
              { text: strings.guidePages.designPrinciples, link: `${prefix}/design-principles` },
              { text: strings.guidePages.mobileWeb, link: `${prefix}/mobile-web` },
              { text: strings.guidePages.contributing, link: `${prefix}/contributing` },
            ],
          },
          {
            text: strings.referenceLabel,
            items: sortByText([
              { text: strings.componentsLabel, collapsed: false, items: components },
              { text: strings.hooksLabel, collapsed: false, items: hooks },
              { text: strings.utilsLabel, collapsed: false, items: utils },
            ]),
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

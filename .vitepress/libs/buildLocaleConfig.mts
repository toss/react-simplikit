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

  // Reference URLs are flat: category segment only, no core/mobile namespace.
  const hooks = getSidebarItems(corePackageRoot, 'hooks', '', sidebarLocale);
  const components = getSidebarItems(corePackageRoot, 'components', '', sidebarLocale);
  const utils = getSidebarItems(corePackageRoot, 'utils', '', sidebarLocale);
  const mobileWeb = [
    ...getSidebarItems(mobilePackageRoot, 'hooks', '', sidebarLocale),
    ...getSidebarItems(mobilePackageRoot, 'utils', '', sidebarLocale),
  ].sort((a, b) => (a.text ?? '').localeCompare(b.text ?? ''));

  return {
    lang: definition.lang,
    themeConfig: {
      nav: [
        { text: strings.homeNavLabel, link: `${prefix}/` },
        { text: 'Guide', link: `${prefix}/core/intro` },
        { text: strings.referenceLabel, link: hooks[0]?.link ?? `${prefix}/core/intro` },
      ],
      sidebar: {
        [`${prefix}/`]: [
          {
            text: strings.guideLabel,
            items: [
              { text: strings.guidePages.core.intro, link: `${prefix}/core/intro` },
              {
                text: strings.guidePages.core.whyReactSimplikitMatters,
                link: `${prefix}/core/why-react-simplikit-matters`,
              },
              { text: strings.guidePages.core.installation, link: `${prefix}/core/installation` },
              { text: strings.guidePages.core.aiIntegration, link: `${prefix}/core/ai-integration` },
              { text: strings.guidePages.core.designPrinciples, link: `${prefix}/core/design-principles` },
              { text: strings.mobileWebLabel, link: `${prefix}/mobile/intro` },
              { text: strings.guidePages.core.contributing, link: `${prefix}/core/contributing` },
            ],
          },
          {
            text: strings.referenceLabel,
            items: sortByText([
              { text: strings.componentsLabel, collapsed: false, items: components },
              { text: strings.hooksLabel, collapsed: false, items: hooks },
              { text: strings.utilsLabel, collapsed: false, items: utils },
            ]).concat([{ text: strings.mobileWebLabel, collapsed: false, items: mobileWeb }]),
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

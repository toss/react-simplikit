import type { LocaleThemeStrings } from '../locales.mts';

export const zhHans: LocaleThemeStrings = {
  homeNavLabel: '首页',
  guideLabel: '指南',
  referenceLabel: '参考',
  componentsLabel: '组件',
  hooksLabel: 'Hooks',
  utilsLabel: '工具函数',
  guidePages: {
    core: {
      intro: '简介',
      whyReactSimplikitMatters: '为什么选择 react-simplikit',
      installation: '安装',
      designPrinciples: '设计原则',
      contributing: '贡献指南',
    },
    mobile: {
      intro: '简介',
      roadmap: '路线图',
      installation: '安装',
      designPrinciples: '设计原则',
      contributing: '贡献指南',
    },
  },
  editLinkText: '在 GitHub 上编辑此页',
  footerMessage: '基于 MIT 许可证发布。',
  search: {
    translations: {
      button: {
        buttonText: '搜索',
        buttonAriaLabel: '搜索',
      },
      modal: {
        backButtonTitle: '返回',
        displayDetails: '显示详情',
        footer: {
          closeKeyAriaLabel: '关闭',
          closeText: '关闭',
          navigateDownKeyAriaLabel: '向下',
          navigateText: '切换',
          navigateUpKeyAriaLabel: '向上',
          selectKeyAriaLabel: '选择',
          selectText: '选择',
        },
        noResultsText: '没有找到相关结果。',
        resetButtonTitle: '清除全部',
      },
    },
  },
};

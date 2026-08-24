// https://vitepress.dev/guide/custom-theme
import './style.css';

import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import Interface from '../components/Interface.vue';
import SplitView from '../components/SplitView.vue';
import UntranslatedBanner from '../components/UntranslatedBanner.vue';

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'doc-before': () => h(UntranslatedBanner),
    });
  },
  enhanceApp({ app }) {
    app.component('Interface', Interface);
    app.component('SplitView', SplitView);
  },
} satisfies Theme;

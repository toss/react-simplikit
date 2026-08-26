import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';

import { reactCompilerTestPlugin } from '../../.scripts/vitest/reactCompilerTestPlugin.ts';
import baseConfig from './vitest.config.ts';

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [reactCompilerTestPlugin()],
    test: {
      name: 'compiled',
      // The canary proves this run actually compiles the source. It deliberately does not
      // match the default include, so the uncompiled run never executes it.
      include: [...configDefaults.include, 'src/_internal/test-utils/reactCompilerCanary.ts'],
    },
  })
);

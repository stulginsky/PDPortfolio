import type { StorybookConfig } from '@storybook/vue3-vite'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { mergeConfig } from 'vite'
import { managerNavigationHead } from './build-manager-navigation.ts'

const config: StorybookConfig = {
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  features: {
    // Required by the Storybook MCP docs toolset for Vue.
    componentsManifest: true,
    // Server-side vue-component-meta docgen (Storybook 11 default).
    experimentalDocgenServer: true,
  },
  stories: [
    '../app/**/*.stories.@(js|ts)',
    '../storybook/**/*.mdx',
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
    '@storybook/addon-mcp',
    '@chromatic-com/storybook'
  ],
  managerHead: managerNavigationHead,
  // templateCompilation() only adds the Vue alias; the SFC plugin is required
  // for Storybook's browser-test Vite server as well.
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      plugins: [vue()],
      define: {
        'import.meta.env.VITE_SITE_BASE_URL': JSON.stringify(
          process.env.STORYBOOK_SITE_BASE_URL || (configType === 'PRODUCTION' ? '/PDPortfolio/' : '/'),
        ),
      },
      optimizeDeps: { include: ['typograf'] },
      resolve: {
        alias: {
          '~': fileURLToPath(new URL('../app', import.meta.url)),
        },
      },
    })
  },
}

export default config

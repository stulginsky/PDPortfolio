import type { StorybookConfig } from '@storybook/vue3-vite'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { mergeConfig } from 'vite'

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
  // templateCompilation() only adds the Vue alias; the SFC plugin is required
  // for Storybook's browser-test Vite server as well.
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [vue()],
      resolve: {
        alias: {
          '~': fileURLToPath(new URL('../app', import.meta.url)),
        },
      },
    })
  },
}

export default config

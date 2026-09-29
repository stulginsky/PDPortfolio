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
  ],
  // Ensure @vitejs/plugin-vue is included so .vue SFCs are compiled correctly.
  // templateCompilation() only adds the vue alias; the SFC plugin must be explicit.
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

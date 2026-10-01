import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '~': path.join(dirname, 'app'),
    },
  },
  test: {
    // Vue emits this message while Storybook evaluates string-based story
    // templates through its Node-side test bridge. It is an ignored compiler
    // option, not an application warning, and does not occur in the browser
    // Storybook build.
    onConsoleLog(log) {
      if (log.includes('decodeEntities option is passed but will be ignored in non-browser builds')) {
        return false
      }
    },
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
            storybookScript: 'npm run storybook -- --ci',
            storybookUrl: 'http://127.0.0.1:6006',
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            api: { host: '127.0.0.1' },
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})

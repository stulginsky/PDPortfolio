// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: [
    '@fontsource-variable/roboto-flex/full.css',
    '~/assets/css/tokens.css',
  ],
  alias: {
    '#content': fileURLToPath(new URL('./content', import.meta.url)),
  },
  devServer: {
    host: '127.0.0.1',
    port: 3000,
  },
})

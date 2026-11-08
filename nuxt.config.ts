// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import { metrikaBootstrap, metrikaNoscript } from './app/constants/metrika'

const baseURL = process.env.NUXT_APP_BASE_URL || '/'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  app: {
    baseURL,
    head: process.env.NODE_ENV === 'production' ? {
      script: [
        { key: 'yandex-metrika', innerHTML: metrikaBootstrap },
        {
          key: 'google-analytics',
          async: true,
          src: 'https://www.googletagmanager.com/gtag/js?id=G-6WJY3M3EHY',
        },
        {
          key: 'google-analytics-config',
          innerHTML: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-6WJY3M3EHY');`,
        },
      ],
      noscript: [{ key: 'yandex-metrika-noscript', innerHTML: metrikaNoscript, tagPosition: 'bodyClose' }],
    } : {},
  },
  vite: {
    define: { 'import.meta.env.VITE_SITE_BASE_URL': JSON.stringify(baseURL) },
  },

  css: [
    '~/assets/css/fonts.css',
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

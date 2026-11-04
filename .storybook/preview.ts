import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import { DocsPage } from './DocsPage'
import './docs.css'
import '../app/assets/css/fonts.css'
import '../app/assets/css/tokens.css'

// Register Nuxt auto-import helpers as global components
// Storybook doesn't provide Nuxt auto-imports; production components use TypoText without explicit import.
import TypoText from '../app/components/TypoText.vue'

setup((app) => {
  app.component('TypoText', TypoText)
})

const preview: Preview = {
  parameters: {
    options: {
      storySort: (a, b) => {
        if (a.title === b.title) {
          if (a.type === 'docs' && b.type !== 'docs') return -1
          if (b.type === 'docs' && a.type !== 'docs') return 1
          return 0
        }
        if (a.title === 'Введение') return -1
        if (b.title === 'Введение') return 1
        return 0
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: {
        mobile320: { name: 'Mobile 320', styles: { width: '320px', height: '100%' } },
        mobile370: { name: 'Mobile 370', styles: { width: '370px', height: '100%' } },
        mobile410: { name: 'Mobile 410', styles: { width: '410px', height: '100%' } },
        mobile425: { name: 'Mobile 425', styles: { width: '425px', height: '100%' } },
        phablet534: { name: 'Phablet 534', styles: { width: '534px', height: '100%' } },
        tablet720: { name: 'Tablet 720', styles: { width: '720px', height: '100%' } },
        tablet768: { name: 'Tablet 768', styles: { width: '768px', height: '100%' } },
        desktop1024: { name: 'Desktop 1024', styles: { width: '1024px', height: '100%' } },
        desktop1280: { name: 'Desktop 1280', styles: { width: '1280px', height: '100%' } },
        desktop1440: { name: 'Desktop 1440', styles: { width: '1440px', height: '100%' } },
        desktop1920: { name: 'Desktop 1920', styles: { width: '1920px', height: '100%' } },
      },
    },
    docs: {
      page: DocsPage,
      toc: false,
    },
  },
}

export default preview

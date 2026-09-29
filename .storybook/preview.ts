import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
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
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: {
        mobile320: { name: 'Mobile 320', styles: { width: '320px', height: '568px' } },
        mobile370: { name: 'Mobile 370', styles: { width: '370px', height: '812px' } },
        mobile410: { name: 'Mobile 410', styles: { width: '410px', height: '896px' } },
        mobile425: { name: 'Mobile 425', styles: { width: '425px', height: '900px' } },
        phablet534: { name: 'Phablet 534', styles: { width: '534px', height: '960px' } },
        tablet720: { name: 'Tablet 720', styles: { width: '720px', height: '1024px' } },
        tablet768: { name: 'Tablet 768', styles: { width: '768px', height: '1024px' } },
        desktop1024: { name: 'Desktop 1024', styles: { width: '1024px', height: '768px' } },
        desktop1280: { name: 'Desktop 1280', styles: { width: '1280px', height: '900px' } },
        desktop1440: { name: 'Desktop 1440', styles: { width: '1440px', height: '900px' } },
        desktop1920: { name: 'Desktop 1920', styles: { width: '1920px', height: '1080px' } },
      },
    },
    docs: {
      toc: true,
    },
  },
}

export default preview
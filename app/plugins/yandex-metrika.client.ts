import { METRIKA_ID } from '../constants/metrika'
import { nextTick } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.dev) return
  const tracker = window as Window & {
    ym?: (counter: number, method: string, url: string, options: { title: string; referer: string }) => void
  }
  let previousUrl = ''
  async function reportPage() {
    // An in-page anchor is not a new page view.
    const url = window.location.origin + window.location.pathname + window.location.search
    // Nuxt finishes the page before Unhead has necessarily rendered its title.
    await nextTick()
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
    const settledUrl = window.location.origin + window.location.pathname + window.location.search
    if (url !== settledUrl) return
    if (!tracker.ym || url === previousUrl) return
    tracker.ym(METRIKA_ID, 'hit', url, {
      title: document.title,
      referer: previousUrl || document.referrer,
    })
    previousUrl = url
  }
  nuxtApp.hook('app:mounted', reportPage)
  nuxtApp.hook('page:finish', reportPage)
})

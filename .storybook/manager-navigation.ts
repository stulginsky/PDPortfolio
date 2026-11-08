import { createApp, h } from 'vue'
import DsBtnNav from '../app/components/DsBtnNav.vue'

// Storybook owns the header; Vue owns only this isolated shadow root.
export function mountNavigation(styles: string) {
  const hosting = window.location.pathname.match(/^(.*)\/storybook(?:\/|$)/)
  const showcase = hosting ? `${hosting[1]}/` : 'http://127.0.0.1:3000/'
  const host = document.createElement('span')
  host.dataset.portfolioNavigation = ''
  host.style.cssText = 'display:inline-flex;flex:0 0 auto;margin-right:12px'
  const shadow = host.attachShadow({ mode: 'open' })
  const style = document.createElement('style')
  style.textContent = styles
  const container = document.createElement('span')
  shadow.append(style, container)
  const app = createApp({
    render: () => h(DsBtnNav, {
      direction: 'Left', tag: 'a', href: showcase,
      ariaLabel: 'На витрину', title: 'На витрину',
    }),
  })
  let mounted = false
  const place = () => {
    // Avoid generated Emotion class names and React-owned child content.
    const brand = document.querySelector<HTMLAnchorElement>('a[title="Storybook"]')
    if (!brand?.parentElement || host.parentElement === brand.parentElement) return
    brand.before(host)
    if (!mounted) {
      app.mount(container)
      mounted = true
    }
  }
  const observer = new MutationObserver(place)
  observer.observe(document.body, { childList: true, subtree: true })
  place()
}

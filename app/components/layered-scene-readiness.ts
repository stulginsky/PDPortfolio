import type { ObjectDirective } from 'vue'

const cleanup = new WeakMap<HTMLElement, () => void>()

// The static picture is deliberately excluded. It can paint before JavaScript.
function liveImages(root: HTMLElement) {
  return [...root.querySelectorAll('img')].filter(image =>
    !image.closest('[data-scene-fallback]') &&
    image.getClientRects().length > 0 &&
    getComputedStyle(image).display !== 'none',
  )
}

function observe(root: HTMLElement) {
  let generation = 0
  let frame = 0
  let disposed = false
  let controller: AbortController | undefined
  let settledSignature = ''

  function signature(images: HTMLImageElement[]) {
    const bounds = root.getBoundingClientRect()
    return JSON.stringify([window.innerWidth, bounds.width, bounds.height, root.dataset.breakpoint,
      images.map(image => [image.src, image.currentSrc || image.src])])
  }

  function cancel() {
    generation++
    controller?.abort()
    cancelAnimationFrame(frame)
  }

  async function refresh() {
    // KeepAlive temporarily detaches the showcase; it does not unload its scenes.
    if (!root.isConnected || !root.getClientRects().length || !root.getBoundingClientRect().width) return
    const images = liveImages(root)
    const nextSignature = signature(images)
    if (root.dataset.ready === 'true' && root.dataset.sceneState === 'ready' &&
      settledSignature === nextSignature && images.every(image => image.complete && image.naturalWidth > 0)) return
    cancel()
    const current = generation
    root.dataset.sceneState = 'loading'
    if (root.dataset.ready !== 'true') return
    controller = new AbortController()
    const signal = controller.signal
    const selectedSources = images.map(image => image.currentSrc || image.src)
    const results = await Promise.all(images.map(async image => {
      if (!image.complete) await new Promise<void>(resolve => {
        const done = () => resolve()
        image.addEventListener('load', done, { once: true, signal })
        image.addEventListener('error', done, { once: true, signal })
        signal.addEventListener('abort', done, { once: true })
      })
      if (signal.aborted || !image.naturalWidth) return false
      try { await image.decode(); return true } catch { return false }
    }))
    if (disposed || current !== generation || signal.aborted) return
    if (!results.every(Boolean)) { root.dataset.sceneState = 'error'; return }
    // Two settled frames cover Vue positioning, layout, and responsive source selection.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        if (disposed || current !== generation || root.dataset.ready !== 'true') return
        if (images.some((image, index) => (image.currentSrc || image.src) !== selectedSources[index])) {
          void refresh()
          return
        }
        root.dataset.sceneState = 'ready'
        settledSignature = signature(images)
        root.dispatchEvent(new CustomEvent('scene-ready'))
      })
    })
  }

  const mutation = new MutationObserver(records => {
    if (records.every(record => (record.target as Element).closest?.('[data-scene-fallback]'))) return
    void refresh()
  })
  mutation.observe(root, { subtree: true, childList: true, attributes: true,
    attributeFilter: ['src', 'srcset', 'media', 'data-ready', 'data-breakpoint'] })
  const resize = new ResizeObserver(() => { void refresh() })
  resize.observe(root)
  const onWindowResize = () => { void refresh() }
  window.addEventListener('resize', onWindowResize)
  void refresh()
  return () => {
    disposed = true
    cancel()
    mutation.disconnect()
    resize.disconnect()
    window.removeEventListener('resize', onWindowResize)
  }
}

export const vLayeredScene: ObjectDirective<HTMLElement> = {
  getSSRProps: () => ({ 'data-scene-state': 'loading' }),
  beforeMount: element => { element.dataset.sceneState = 'loading' },
  mounted: element => { cleanup.set(element, observe(element)) },
  beforeUnmount: element => { cleanup.get(element)?.(); cleanup.delete(element) },
}

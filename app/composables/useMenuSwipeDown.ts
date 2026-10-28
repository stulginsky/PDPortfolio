export function useMenuSwipeDown(close: () => void, options: { enabled?: () => boolean; scrollTop?: () => number } = {}) {
  let start: { x: number; y: number; down: boolean } | undefined
  function cancelSwipe() { start = undefined }
  function beginSwipe(event: TouchEvent) {
    cancelSwipe()
    if (!(options.enabled?.() ?? window.innerWidth < 768) || event.touches.length !== 1 || (options.scrollTop?.() ?? 0) > 1) return
    const touch = event.touches[0]!
    start = { x: touch.clientX, y: touch.clientY, down: false }
  }
  function moveSwipe(event: TouchEvent) {
    if (!start) return
    if (event.touches.length !== 1) { cancelSwipe(); return }
    const touch = event.touches[0]!
    const dx = touch.clientX - start.x, dy = touch.clientY - start.y
    if (dy > 12 && dy > Math.abs(dx)) {
      start.down = true
      if (event.cancelable) event.preventDefault()
    }
  }
  function endSwipe(event: TouchEvent) {
    const gesture = start
    cancelSwipe()
    if (!gesture?.down || event.changedTouches.length !== 1) return
    const touch = event.changedTouches[0]!
    const dx = touch.clientX - gesture.x, dy = touch.clientY - gesture.y
    if (event.cancelable) event.preventDefault()
    if (dy >= 72 && dy > Math.abs(dx) && (options.scrollTop?.() ?? 0) <= 1) close()
  }
  return { beginSwipe, moveSwipe, endSwipe, cancelSwipe }
}

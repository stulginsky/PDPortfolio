<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import DsBtnNav from '../../components/DsBtnNav.vue'
import DsRoleFocus from '../../components/DsRoleFocus.vue'
import DsPageUp from '../../components/DsPageUp.vue'
import TypoText from '../../components/TypoText.vue'
import content from '../../../content/cases/4real-3dweapon.json'

const copy = content.page
useSeoMeta({ title: content.pageTitle, description: copy.paragraphs[0] })
const root = ref<HTMLElement>(), opening = ref<HTMLElement>(), landing = ref<HTMLIFrameElement>()
const showPageUp = ref(false)
let openingObserver: ResizeObserver | undefined
let landingObserver: ResizeObserver | undefined
let frameDocument: Document | undefined
let pendingFrame = 0
let snapFrame = 0, snapTimer: ReturnType<typeof setTimeout> | undefined
let previousScroll = 0, scrollDirection = 0, expectedScroll = 0, snapBlockedUntil = 0
let touching = false

function cancelLandingSnap() {
  clearTimeout(snapTimer)
  cancelAnimationFrame(snapFrame)
  snapFrame = 0
}
function scheduleLandingSnap() {
  clearTimeout(snapTimer)
  if (snapFrame || touching || scrollDirection <= 0 || performance.now() < snapBlockedUntil || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const edge = landing.value?.parentElement?.getBoundingClientRect().top
  const reach = Math.min(180, window.innerHeight * .22)
  if (edge === undefined || edge <= 1 || edge > reach) return
  snapTimer = setTimeout(() => {
    const remaining = landing.value?.parentElement?.getBoundingClientRect().top
    if (touching || remaining === undefined || remaining <= 1 || remaining > reach) return
    const start = window.scrollY, target = start + remaining, started = performance.now()
    const duration = 520
    expectedScroll = start
    function step(now: number) {
      const progress = Math.min(1, (now - started) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      expectedScroll = start + (target - start) * eased
      window.scrollTo({ top: expectedScroll, behavior: 'instant' })
      if (progress < 1) snapFrame = requestAnimationFrame(step)
      else { snapFrame = 0; snapBlockedUntil = performance.now() + 180 }
    }
    snapFrame = requestAnimationFrame(step)
  }, 120)
}
function touchStart() { touching = true; cancelLandingSnap() }
function touchEnd() { touching = false; scheduleLandingSnap() }
type MobileLanding = Window & { weaponMobileLayout?: { measure: () => { height: number } | null; update: (offset: number, height: number) => void } }

function syncFrameHeight() {
  if (!landing.value || !frameDocument) return
  const footer = frameDocument.querySelector<HTMLElement>('.weapon-footer-slot')
  const scene = frameDocument.querySelector<HTMLElement>('.weapon-scene')
  const mobile = (landing.value.contentWindow as MobileLanding | null)?.weaponMobileLayout?.measure()
  const contentHeight = Math.max(scene?.offsetHeight ?? 0,
    footer && getComputedStyle(footer).display !== 'none' ? footer.offsetTop + footer.offsetHeight : 0)
  const height = window.innerWidth >= 1280
    ? Math.max(956, window.innerHeight)
    : window.innerHeight
  if (window.innerWidth < 1280) landing.value.parentElement!.style.height = `${Math.max(window.innerHeight, mobile?.height || contentHeight || frameDocument.body.scrollHeight)}px`
  else landing.value.parentElement!.style.height = ''
  if (Math.abs(landing.value.offsetHeight - height) > 1) landing.value.style.height = `${height}px`
  root.value?.style.setProperty('--weapon-case-landing-scale', `${window.innerWidth >= 1280 ? Math.min(1, window.innerHeight / 956) : 1}`)
}
function frameLoaded() {
  frameDocument?.defaultView?.removeEventListener('weapon-mobile-layout', resize)
  landingObserver?.disconnect()
  frameDocument = landing.value?.contentDocument ?? undefined
  if (!frameDocument?.body) return
  frameDocument.defaultView?.addEventListener('weapon-mobile-layout', resize)
  landingObserver = new ResizeObserver(syncFrameHeight)
  landingObserver.observe(frameDocument.body)
  frameDocument.querySelectorAll('.weapon-footer-slot, .weapon-scene').forEach(element => landingObserver!.observe(element))
  syncFrameHeight()
}
function updateOpening() {
  if (!root.value || !opening.value) return
  root.value.style.setProperty('--weapon-case-opening-height', `${opening.value.offsetHeight}px`)
}
function updateScroll() {
  pendingFrame = 0
  const current = window.scrollY
  if (snapFrame && Math.abs(current - expectedScroll) > 3) cancelLandingSnap()
  if (!snapFrame && Math.abs(current - previousScroll) > .5) scrollDirection = Math.sign(current - previousScroll)
  previousScroll = current
  scheduleLandingSnap()
  showPageUp.value = window.scrollY > 100
  if (window.innerWidth < 1280 && landing.value) {
    const offset = Math.max(0, -landing.value.parentElement!.getBoundingClientRect().top)
    ;(landing.value.contentWindow as MobileLanding | null)?.weaponMobileLayout?.update(offset, window.innerHeight)
  }
}
function scheduleScroll() { if (!pendingFrame) pendingFrame = requestAnimationFrame(updateScroll) }
function resize() { cancelLandingSnap(); updateOpening(); syncFrameHeight(); scheduleScroll() }
function scrollToStart() {
  cancelLandingSnap()
  root.value?.focus({ preventScroll: true })
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
}
onMounted(() => {
  openingObserver = new ResizeObserver(updateOpening)
  if (opening.value) openingObserver.observe(opening.value)
  updateOpening(); updateScroll()
  // Cached same-origin documents can finish loading before Vue hydration attaches @load.
  if (landing.value?.contentDocument?.readyState === 'complete' && landing.value.contentDocument.URL !== 'about:blank') frameLoaded()
  window.addEventListener('scroll', scheduleScroll, { passive: true })
  window.addEventListener('resize', resize)
  window.addEventListener('wheel', cancelLandingSnap, { passive: true })
  window.addEventListener('touchstart', touchStart, { passive: true })
  window.addEventListener('touchend', touchEnd, { passive: true })
  window.addEventListener('touchcancel', touchEnd, { passive: true })
  window.addEventListener('keydown', cancelLandingSnap)
})
onUnmounted(() => {
  openingObserver?.disconnect(); landingObserver?.disconnect()
  frameDocument?.defaultView?.removeEventListener('weapon-mobile-layout', resize)
  cancelAnimationFrame(pendingFrame)
  cancelLandingSnap()
  window.removeEventListener('scroll', scheduleScroll)
  window.removeEventListener('resize', resize)
  window.removeEventListener('wheel', cancelLandingSnap)
  window.removeEventListener('touchstart', touchStart)
  window.removeEventListener('touchend', touchEnd)
  window.removeEventListener('touchcancel', touchEnd)
  window.removeEventListener('keydown', cancelLandingSnap)
})
</script>

<template>
  <main ref="root" class="weapon-case" tabindex="-1" data-figma-frame="13:279">
    <div class="weapon-case__back" data-figma-frame="15:435"><DsBtnNav tag="a" href="/" :aria-label="copy.backLabel" /></div>
    <section ref="opening" class="weapon-case__opening">
      <div class="weapon-case__column" data-figma-frame="13:280">
        <div class="weapon-case__copy" data-figma-text="13:281">
          <TypoText v-for="(paragraph, index) in copy.paragraphs" :key="index" tag="p" :content="paragraph" />
        </div>
        <DsRoleFocus class="weapon-case__role" :role="copy.role" :focus="copy.focus" data-figma-frame="13:282" />
      </div>
    </section>
    <section class="weapon-case__landing" :aria-label="copy.landingLabel" data-figma-frame="13:283">
      <iframe ref="landing" class="weapon-case-landing" src="/cases/3D_Weapon/home.html" :title="copy.landingLabel"
        allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen @load="frameLoaded" />
      <div class="weapon-case__end-slot" aria-hidden="true" data-figma-frame="13:300" />
    </section>
    <DsPageUp v-if="showPageUp" @click="scrollToStart" />
  </main>
</template>

<style scoped>
.weapon-case {
  --weapon-case-opening-height: 660px;
  position: relative; isolation: isolate;
  background: linear-gradient(118.9688888447091deg, rgba(229,231,235,.3) 55.519%, rgba(184,221,205,.3) 85.813%), var(--surface-default);
  outline: none;
}
.weapon-case__opening {
  position: sticky; top: min(0px, calc(100svh - var(--weapon-case-opening-height))); z-index: 0;
  padding: 144px var(--space-4) var(--space-8); box-sizing: border-box;
}
.weapon-case__back { position: fixed; z-index: 3; left: 0; top: .606px; height: 100px; box-sizing: border-box; display: flex; align-items: center; padding: var(--space-6); }
.weapon-case__column { width: 100%; max-width: 924px; margin-inline: auto; display: flex; flex-direction: column; align-items: center; gap: var(--space-8); }
.weapon-case__copy { width: 100%; display: flex; flex-direction: column; gap: var(--space-6); color: var(--text-default); font-family: var(--text-font-sans); font-size: var(--text-size-16); font-weight: var(--text-weight-regular); line-height: 1.6; font-variation-settings: var(--body-16-regular-font-variation); }
.weapon-case__copy :deep(p) { margin: 0; }
.weapon-case__role { width: 100%; }
.weapon-case__landing { position: relative; z-index: 1; width: 100%; background: #fff; box-shadow: 3.024px 6.047px 20px var(--effect-shadow-2nd); }
.weapon-case-landing { display: block; width: 100%; height: max(956px, calc(100svh - 168px)); border: 0; background: #fff; }
.weapon-case__end-slot { height: 168px; }
@media (max-width: 1279px) {
  .weapon-case__back { z-index: 1; }
  .weapon-case-landing { position: sticky; top: 0; height: 100svh; }
  .weapon-case__end-slot { display: none; }
}
@media (min-width: 768px) {
  .weapon-case__role { transform: translateX(-6.125px); }
  .weapon-case__opening { padding-bottom: var(--space-12); }
  .weapon-case__column { gap: var(--space-12); }
}
@media (min-width: 1280px) {
  .weapon-case__landing { height: 100svh; overflow: hidden; }
  .weapon-case-landing { position: relative; left: 50%; width: calc(100% / var(--weapon-case-landing-scale, 1)); transform: translateX(-50%) scale(var(--weapon-case-landing-scale, 1)); transform-origin: top center; }
  .weapon-case__end-slot { display: none; }
  .weapon-case__opening { padding-bottom: var(--space-20); }
  .weapon-case__copy { font-size: var(--text-size-20); font-weight: var(--text-weight-light); font-variation-settings: var(--body-20-regular-font-variation); letter-spacing: .2px; gap: var(--space-8); }
}
@media (prefers-reduced-motion: reduce) { .weapon-case__opening { position: relative; top: 0; } }
</style>

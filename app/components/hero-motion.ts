import { onMounted, onUnmounted, watch, type Ref } from 'vue';
export interface HeroMotionSettings {
    speed?: number;
    viscosity?: number;
    returnSpeed?: number;
    amplitude?: number;
    baseOffset?: number;
    pointerDirection?: 1 | -1;
    introDirection: 1 | -1;
    animationEnabled: boolean;
}
const tenth = (n: number) => Math.max(.1, Math.min(20, Math.round(n * 10) / 10));
export function migrateMotion<T extends HeroMotionSettings>(layer: T, c: {
    baseOffset: number;
    direction: 1 | -1;
    legacyTau?: number;
    legacyIntro?: 1 | -1;
}): Omit<T, 'speed'> {
    const { speed, ...rest } = layer, tau = c.legacyTau ?? 100;
    return { ...rest, viscosity: layer.viscosity ?? tenth(tau / (speed ?? 1) / 100), returnSpeed: layer.returnSpeed ?? tenth(600 * (speed ?? 1) / tau),
        amplitude: layer.amplitude ?? 1, baseOffset: layer.baseOffset ?? c.baseOffset,
        pointerDirection: layer.viscosity === undefined ? c.direction : layer.pointerDirection ?? c.direction,
        introDirection: layer.viscosity === undefined ? c.legacyIntro ?? layer.introDirection : layer.introDirection };
}
export function validMotion(l: HeroMotionSettings) {
    return [l.speed, l.viscosity, l.returnSpeed].every(n => n === undefined || Number.isFinite(n) && n >= .1 && n <= 20)
        && (l.amplitude === undefined || Number.isFinite(l.amplitude) && l.amplitude >= 0 && l.amplitude <= 4)
        && (l.baseOffset === undefined || Number.isFinite(l.baseOffset) && l.baseOffset >= 0)
        && (l.pointerDirection === undefined || [-1, 1].includes(l.pointerDirection)) && [-1, 1].includes(l.introDirection) && typeof l.animationEnabled === 'boolean';
}
export function useHeroMotion<L extends HeroMotionSettings>(o: {
    root: Ref<HTMLElement | undefined>;
    layers: () => L[];
    breakpoint: () => string;
    mode: () => string | undefined;
    width: () => number;
    viewport: () => number;
    render: (offsets: number[]) => void;
    enabled?: (l: L) => boolean;
    scope?: 'hero' | 'viewport';
}) {
    let offsets: number[] = [], targets: number[] = [], frame = 0, lastTime = 0, lastMovement = -Infinity;
    let introStart: number | undefined, mouseX: number | undefined, pointer: number | undefined, pointerX = 0, introUsed = false, visible = false;
    let reduced: MediaQueryList | undefined, observer: IntersectionObserver | undefined;
    const neutral = () => reduced?.matches || document.hidden || !visible || o.mode() === 'Neutral';
    const range = (l: L) => (l.baseOffset ?? 0) * (l.amplitude ?? 1);
    const enabled = (l: L) => l.animationEnabled && (o.enabled?.(l) ?? true) && range(l) > 0;
    function arrays() { if (offsets.length !== o.layers().length) {
        offsets = o.layers().map(() => 0);
        targets = [...offsets];
    } }
    function resetMotion() { arrays(); introStart = undefined; lastMovement = -Infinity; lastTime = 0; mouseX = undefined; pointer = undefined; offsets.fill(0); targets.fill(0); cancelAnimationFrame(frame); frame = 0; o.render(offsets); if (o.root.value)
        o.root.value.dataset.motion = 'neutral'; }
    function schedule() { if (!frame && !neutral())
        frame = requestAnimationFrame(tick); }
    const smooth = (t: number) => t * t * (3 - 2 * t);
    function seed() { o.layers().forEach((l, i) => { targets[i] = range(l) ? offsets[i]! / (range(l) * (l.pointerDirection ?? 1)) : 0; }); }
    function moveBy(dx: number) { if (!dx)
        return; arrays(); const now = performance.now(); if (introStart !== undefined || now - lastMovement > 80)
        seed(); introUsed = true; introStart = undefined; targets.forEach((n, i) => { targets[i] = Math.max(-1, Math.min(1, n + dx / Math.max(1, o.width() / 2))); }); lastMovement = now; schedule(); }
    function tick(time: number) {
        frame = 0;
        if (neutral()) {
            resetMotion();
            return;
        }
        arrays();
        const dt = lastTime ? Math.min(time - lastTime, 64) : 16.67;
        lastTime = time;
        let ongoing = false;
        const elapsed = introStart === undefined ? undefined : time - introStart - 300;
        o.layers().forEach((l, i) => {
            if (!enabled(l)) {
                offsets[i] = 0;
                return;
            }
            if (elapsed !== undefined) {
                const t = Math.max(0, elapsed), out = 300 * (l.viscosity ?? 1), back = 600 / (l.returnSpeed ?? 1);
                const scalar = t < out ? smooth(t / out) : t < out + back ? 1 - smooth((t - out) / back) : 0;
                offsets[i] = scalar * l.introDirection * range(l) * .25;
                if (t < out + back)
                    ongoing = true;
            }
            else {
                const returning = time - lastMovement > 80, destination = returning ? 0 : targets[i]! * (l.pointerDirection ?? 1) * range(l), tau = returning ? 600 / (l.returnSpeed ?? 1) : 100 * (l.viscosity ?? 1);
                offsets[i] = offsets[i]! + (destination - offsets[i]!) * (1 - Math.exp(-dt / tau));
                if (Math.abs(destination - offsets[i]!) > .01)
                    ongoing = true;
                else
                    offsets[i] = destination;
                if (!returning)
                    ongoing = true;
            }
        });
        o.render(offsets);
        if (o.root.value)
            o.root.value.dataset.motion = elapsed === undefined ? ongoing ? time - lastMovement > 80 ? 'return' : 'pointer' : 'neutral' : elapsed < 0 ? 'delay' : ongoing ? 'intro' : 'neutral';
        if (elapsed !== undefined && !ongoing)
            introStart = undefined;
        if (ongoing)
            schedule();
        else
            lastTime = 0;
    }
    const mediaReady = () => (!o.root.value?.hasAttribute('data-scene-state') || o.root.value.dataset.sceneState === 'ready') &&
        [...(o.root.value?.querySelectorAll('img') ?? [])].filter(img => !img.closest('[data-scene-fallback]')).every(img => img.complete && img.naturalWidth > 0);
    function replayIntro() { if (neutral() || !mediaReady())
        return; resetMotion(); introUsed = true; introStart = performance.now(); schedule(); }
    function maybeIntro() { if (!introUsed && !neutral() && mediaReady() && (o.viewport() < 1024 || window.matchMedia('(pointer: coarse)').matches))
        replayIntro(); }
    function release(e?: PointerEvent) { if (e && e.pointerType !== 'mouse' && pointer !== e.pointerId)
        return; pointer = undefined; introStart = undefined; targets.fill(0); lastMovement = -Infinity; schedule(); }
    function pointerMove(e: PointerEvent) {
        if (neutral() || !mediaReady())
            return;
        if (e.pointerType === 'touch' || e.pointerType === 'pen') {
            if (pointer !== e.pointerId)
                return;
            const dx = e.clientX - pointerX;
            pointerX = e.clientX;
            moveBy(dx);
        }
        else if (window.matchMedia('(hover: hover)').matches) {
            const b = o.root.value!.getBoundingClientRect();
            if (o.scope !== 'viewport' && (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom)) {
                mouseX = undefined;
                release();
                return;
            }
            const dx = mouseX === undefined ? 0 : e.clientX - mouseX;
            mouseX = e.clientX;
            moveBy(dx);
        }
    }
    function pointerDown(e: PointerEvent) { if (neutral() || !mediaReady() || !e.isPrimary || pointer !== undefined)
        return; arrays(); seed(); introUsed = true; introStart = undefined; lastMovement = -Infinity; if (e.pointerType === 'mouse')
        mouseX = e.clientX;
    else {
        pointer = e.pointerId;
        pointerX = e.clientX;
    } schedule(); }
    const leave = (e: PointerEvent) => { if (e.relatedTarget === null) {
        mouseX = undefined;
        release();
    } }, blur = () => { mouseX = undefined; release(); }, visibility = () => { if (document.hidden)
        resetMotion();
    else
        maybeIntro(); }, reducedChange = () => { if (reduced?.matches) {
        introUsed = true;
        resetMotion();
    } };
    watch([o.breakpoint, o.mode], resetMotion);
    watch(() => o.layers().map(l => [l.animationEnabled, l.amplitude, l.baseOffset, l.pointerDirection, l.viscosity, l.returnSpeed]), () => { arrays(); o.layers().forEach((l, i) => { if (!enabled(l))
        offsets[i] = 0; }); o.render(offsets); schedule(); });
    onMounted(() => { arrays(); reduced = window.matchMedia('(prefers-reduced-motion: reduce)'); reduced.addEventListener('change', reducedChange); observer = new IntersectionObserver(es => { visible = es[0]?.isIntersecting ?? false; if (visible)
        maybeIntro();
    else
        resetMotion(); }); observer.observe(o.root.value!); window.addEventListener('pointermove', pointerMove, { passive: true }); window.addEventListener('pointerup', release, { passive: true }); window.addEventListener('pointercancel', release, { passive: true }); window.addEventListener('pointerout', leave, { passive: true }); window.addEventListener('blur', blur); document.addEventListener('visibilitychange', visibility); });
    onUnmounted(() => { cancelAnimationFrame(frame); observer?.disconnect(); reduced?.removeEventListener('change', reducedChange); window.removeEventListener('pointermove', pointerMove); window.removeEventListener('pointerup', release); window.removeEventListener('pointercancel', release); window.removeEventListener('pointerout', leave); window.removeEventListener('blur', blur); document.removeEventListener('visibilitychange', visibility); });
    return { resetMotion, replayIntro, maybeIntro, pointerDown, release };
}

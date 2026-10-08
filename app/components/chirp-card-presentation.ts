import { computed, inject, type ComputedRef, type InjectionKey } from 'vue'
import './chirp-card-presentation.css'

export const chirpCardPresentationKey: InjectionKey<{
  scale: ComputedRef<number>
  height: ComputedRef<number>
  reportCopyHeight: (name: string, height: number) => void
}> = Symbol('ChirpCardPresentation')

export function useChirpCardPresentation(name: string) {
  const context = inject(chirpCardPresentationKey, undefined)
  return {
    context,
    copyZoom: computed(() => context ? Math.max(1, (5 / 6) / context.scale.value) : 1),
    reportCopyHeight: (height: number) => context?.reportCopyHeight(name, height / context.scale.value),
  }
}

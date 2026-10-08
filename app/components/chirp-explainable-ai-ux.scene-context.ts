import type { InjectionKey, Ref } from 'vue'
import { uxGeometry } from './chirp-explainable-ai-ux.geometry'

export type UxBreakpoint = 'base' | 'min-768'
export type UxState = 'Default' | 'Hover' | 'ActivePressed'
export type UxLayer = { x: number; y: number; width: number; height: number; rotation: number }
export type UxSceneDraft = Record<UxBreakpoint, Record<UxState, UxLayer[]>>
export const uxStates: UxState[] = ['Default', 'Hover', 'ActivePressed']
export const uxBreakpoints: UxBreakpoint[] = ['base', 'min-768']
export function getUxSceneProfile(width: number): UxBreakpoint { return width < 768 ? 'base' : 'min-768' }
export function createUxSceneDraft(): UxSceneDraft {
  return Object.fromEntries(uxBreakpoints.map(bp => [bp, Object.fromEntries(uxStates.map(state => {
    const geometry = uxGeometry[bp][state]
    const offset = (430 - (bp === 'base' ? 264 : 430)) / 2
    return [state, geometry.phones.map(layer => ({ ...layer, x: layer.x + geometry.pict.x + offset, y: layer.y + geometry.pict.y }))]
  }))])) as UxSceneDraft
}
export const uxSceneEditorKey: InjectionKey<{ mode: Ref<UxState | 'Interaction'>; draft: UxSceneDraft }> = Symbol('ChirpExplainableAiUx scene editor')

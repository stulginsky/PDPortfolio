import type { InjectionKey, Ref } from 'vue'
import scenePreset from './chirp-ai-medical-brand.scenes.json'

export type BrandBreakpoint = 'base' | 'min-768'
export type BrandState = 'Default' | 'Hover' | 'ActivePressed'
export type BrandLayer = { x: number; y: number; width: number; height: number; rotation: number }
export type BrandSceneDraft = Record<BrandBreakpoint, Record<BrandState, BrandLayer[]>>
export const brandStates: BrandState[] = ['Default', 'Hover', 'ActivePressed']
export const brandBreakpoints: BrandBreakpoint[] = ['base', 'min-768']
export const brandLayerNames = ['ConcentricCircles', 'SoundBars', 'SongbirdMain', 'Logotype', 'SongbirdDecorLeft', 'SongbirdDecorRight'] as const
export const brandCoordinateSpace = 'card at width 430px; x shifts by (actualWidth-430)/2 except Logotype, whose x is measured from the actual card left edge'
export function brandLayerXShift(name: string, width: number): number { return name === 'Logotype' ? 0 : (width - 430) / 2 }
export function getBrandSceneProfile(width: number): BrandBreakpoint { return width < 768 ? 'base' : 'min-768' }
export function createBrandSceneDraft(): BrandSceneDraft {
  return JSON.parse(JSON.stringify(scenePreset.scenes)) as BrandSceneDraft
}
export const brandSceneEditorKey: InjectionKey<{ mode: Ref<BrandState | 'Interaction'>; draft: BrandSceneDraft }> = Symbol('ChirpAiMedicalBrand scene editor')

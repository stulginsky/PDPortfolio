import type { InjectionKey, Ref } from 'vue'
import { getHealthGeometry } from './chirp-ai-health-assistant.geometry'

export type HealthBreakpoint = 'base' | 'min-768'
export type HealthState = 'Default' | 'Hover' | 'ActivePressed'
export type HealthPhone = { x: number; y: number; width: number; height: number; rotation: number }
export type HealthSceneProfile = 'base-320-425' | 'base-426-767' | 'min-768'
export type HealthSceneDraft = Record<HealthSceneProfile, Record<HealthState, HealthPhone[]>>
export const healthStates: HealthState[] = ['Default', 'Hover', 'ActivePressed']
export const healthBreakpoints: HealthBreakpoint[] = ['base', 'min-768']
export const healthSceneProfiles: HealthSceneProfile[] = ['base-320-425', 'base-426-767', 'min-768']
export function getHealthSceneProfile(viewportWidth: number): HealthSceneProfile {
  return viewportWidth < 426 ? 'base-320-425' : viewportWidth < 768 ? 'base-426-767' : 'min-768'
}

// Draft X/Y use the card origin at width 430px; narrower cards keep the scene centred.
export function createHealthSceneDraft(): HealthSceneDraft {
  return Object.fromEntries(healthSceneProfiles.map(profile => [profile, Object.fromEntries(healthStates.map(state => {
    const bp = profile === 'min-768' ? 'min-768' : 'base'
    const viewport = profile === 'base-320-425' ? 320 : profile === 'base-426-767' ? 720 : 768
    const geometry = getHealthGeometry(bp, state, viewport)
    const offset = (430 - (bp === 'base' ? 264 : 430)) / 2
    return [state, geometry.phones.map(phone => ({ ...phone, x: phone.x + geometry.pict.x + offset, y: phone.y + geometry.pict.y }))]
  }))])) as HealthSceneDraft
}

export const healthSceneEditorKey: InjectionKey<{
  mode: Ref<HealthState | 'Interaction'>
  draft: HealthSceneDraft
}> = Symbol('ChirpAiHealthAssistant scene editor')

import type { InjectionKey, Ref } from 'vue'
import { migrateMotion, validMotion, type HeroMotionSettings } from './hero-motion'

export const lidPortHeroBreakpoints = ['base', 'min-768', 'min-1024', 'min-1280', 'min-1440', 'min-1920'] as const
export type LidPortHeroBreakpoint = typeof lidPortHeroBreakpoints[number]

export interface LidPortHeroLayer extends HeroMotionSettings {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
}

export type LidPortHeroDraft = Record<LidPortHeroBreakpoint, LidPortHeroLayer[]>

export const lidPortHeroReferences = {
  base: { width: 320, height: 540, clip: { id: '3748:2423', height: 292 }, logo: { id: '3748:2425', x: 110.5, y: 115, width: 100, height: 46.45944595336914 }, heading: { id: '3748:2428', x: 22.774658203125, y: 221.9454956054688, width: 278.534423828125, height: 70.05450439453125 }, panel: { y: 292, height: 248, padding: 24 }, role: { x: 16, y: 316, width: 288, height: 200 } },
  'min-768': { width: 768, height: 673, clip: { id: '3748:2432', height: 469 }, logo: { id: '3748:2434', x: 298, y: 190, width: 174, height: 80.83943939208984 }, heading: { id: '3748:2437', x: 125.75244140625, y: 336.6954345703125, width: 524.300048828125, height: 132.3045654296875 }, panel: { y: 469, height: 204, padding: 48 }, role: { x: 16, y: 517, width: 736, height: 108 } },
  'min-1024': { width: 1024, height: 410, clip: { id: '3748:2441', height: 238 }, logo: { id: '3748:2443', x: 435.5, y: 67, width: 155, height: 72.01211547851562 }, heading: { id: '3748:2446', x: 77.152587890625, y: 199.078125, width: 871.7138671875, height: 38.921875 }, panel: { y: 238, height: 172, padding: 32 }, role: { x: 50, y: 270, width: 924, height: 108 } },
  'min-1280': { width: 1280, height: 540, clip: { id: '3748:2450', height: 304 }, logo: { id: '3748:2452', x: 554, y: 121, width: 174, height: 80.83943939208984 }, heading: { id: '3748:2455', x: 124.43994140625, y: 257.6953125, width: 1033.142578125, height: 46.3046875 }, panel: { y: 304, height: 236, padding: 64 }, role: { x: 178, y: 368, width: 924, height: 108 } },
  'min-1440': { width: 1440, height: 560, clip: { id: '3748:2464', height: 324 }, logo: { id: '3748:2466', x: 634, y: 141, width: 174, height: 80.83943939208984 }, heading: { id: '3748:2469', x: 204.43994140625, y: 277.6953125, width: 1033.142578125, height: 46.3046875 }, panel: { y: 324, height: 236, padding: 64 }, role: { x: 258, y: 388, width: 924, height: 108 } },
  'min-1920': { width: 1920, height: 560, clip: { id: '3748:2473', height: 324 }, logo: { id: '3748:2475', x: 874, y: 141, width: 174, height: 80.83943939208984 }, heading: { id: '3748:2478', x: 444.43994140625, y: 277.6953125, width: 1033.142578125, height: 46.3046875 }, panel: { y: 324, height: 236, padding: 64 }, role: { x: 498, y: 388, width: 924, height: 108 } },
} as const

export function getLidPortHeroBreakpoint(width: number): LidPortHeroBreakpoint {
  return width >= 1920 ? 'min-1920' : width >= 1440 ? 'min-1440' : width >= 1280 ? 'min-1280' : width >= 1024 ? 'min-1024' : width >= 768 ? 'min-768' : 'base'
}

export function createLidPortHeroDraft(): LidPortHeroDraft {
  return Object.fromEntries(lidPortHeroBreakpoints.map((breakpoint) => {
    const reference = lidPortHeroReferences[breakpoint]
    return [breakpoint, [
      { ...reference.logo, name: 'LadaImage-logo', animationEnabled: true, viscosity: 10, returnSpeed: 0.4, amplitude: 2.5, baseOffset: 6, pointerDirection: -1, introDirection: 1 },
      { ...reference.heading, name: 'Diller’s Portal Design System', animationEnabled: true, viscosity: 3, returnSpeed: 0.5, amplitude: 1, baseOffset: 8, pointerDirection: 1, introDirection: 1 },
      { id: `role-${breakpoint}`, ...reference.role, name: 'Role-Focus', animationEnabled: false, viscosity: 1, returnSpeed: 1, amplitude: 0, baseOffset: 0, pointerDirection: 1, introDirection: 1 },
    ]]
  })) as LidPortHeroDraft
}

export function migrateLidPortHeroLayer(layer: LidPortHeroLayer, index: number): LidPortHeroLayer {
  return migrateMotion(layer, { baseOffset: index === 0 ? 6 : 8, direction: index === 0 ? -1 : 1, legacyTau: 180 }) as LidPortHeroLayer
}

export function validLidPortHeroDraft(value: unknown): value is LidPortHeroDraft {
  if (!value || typeof value !== 'object') return false
  const draft = value as LidPortHeroDraft
  const baseline = createLidPortHeroDraft()
  return lidPortHeroBreakpoints.every((breakpoint) => Array.isArray(draft[breakpoint]) && draft[breakpoint].length === baseline[breakpoint].length && draft[breakpoint].every((layer, index) => {
    const reference = baseline[breakpoint][index]!
    return layer?.name === reference.name && ['x', 'y', 'width', 'height'].every(key => Number.isFinite(layer[key as 'x'])) && layer.width > 0 && layer.height > 0 && validMotion(layer)
  }))
}

export const lidPortHeroSceneEditorKey: InjectionKey<{ draft: LidPortHeroDraft; mode: Ref<'Neutral' | 'Interaction'> }> = Symbol('LIDPortDsHeroEditor')

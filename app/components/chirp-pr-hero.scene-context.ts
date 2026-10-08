import type { InjectionKey, Ref } from 'vue'

export const heroBreakpoints = ['base', 'min-768', 'min-1024', 'min-1280', 'min-1440', 'min-1920'] as const
export type HeroBreakpoint = typeof heroBreakpoints[number]
export interface HeroLayer {
  name: string
  x: number
  y: number
  width: number
  height: number
  speed: number
  introDirection: 1 | -1
  animationEnabled: boolean
}
export type HeroDraft = Record<HeroBreakpoint, HeroLayer[]>
export interface HeroReference {
  width: number
  height: number
  assetProfile: string
  nameWidth: number
  nameHeight: number
  logoX: number
  logoY: number
  logoWidth: number
  logoHeight: number
  copyWidth: number
  fontSize: number
}
export const heroReferences: Record<HeroBreakpoint, HeroReference> = {
  base: { width: 320, height: 389, assetProfile: 'base', nameWidth: 284.412, nameHeight: 106.533, logoX: 142.433, logoY: 2.796, logoWidth: 84.433, logoHeight: 23.429, copyWidth: 223, fontSize: 27.494 },
  'min-768': { width: 768, height: 788, assetProfile: 'min-768', nameWidth: 568.823, nameHeight: 213.067, logoX: 284.866, logoY: 5.592, logoWidth: 168.867, logoHeight: 46.859, copyWidth: 419, fontSize: 54.988 },
  'min-1024': { width: 1024, height: 484, assetProfile: 'min-1024', nameWidth: 450.954, nameHeight: 168.916, logoX: 225.838, logoY: 4.433, logoWidth: 133.875, logoHeight: 37.149, copyWidth: 338, fontSize: 43.593 },
  'min-1280': { width: 1280, height: 545, assetProfile: 'min-1280', nameWidth: 568.823, nameHeight: 213.067, logoX: 284.866, logoY: 5.592, logoWidth: 168.867, logoHeight: 46.859, copyWidth: 419, fontSize: 54.988 },
  'min-1440': { width: 1440, height: 578, assetProfile: 'min-1280', nameWidth: 568.823, nameHeight: 213.067, logoX: 284.866, logoY: 5.592, logoWidth: 168.867, logoHeight: 46.859, copyWidth: 419, fontSize: 54.988 },
  'min-1920': { width: 1920, height: 769, assetProfile: 'min-1920', nameWidth: 744.81, nameHeight: 278.987, logoX: 373, logoY: 7.322, logoWidth: 221.112, logoHeight: 61.356, copyWidth: 533, fontSize: 72 },
}
const geometry: Record<HeroBreakpoint, [string, number, number, number, number][]> = {
  base: [['back-Pr01-m', -117, 0, 555, 389], ['laptop-P01-w', -22, 33, 285, 154], ['phones-P01-w', 89, 17, 235, 175], ['HeroTitle-P01-w', 18.2058, 195, 284.4115, 193.5333]],
  'min-768': [['back-Pr01-m', -144, 0, 1057, 740], ['laptop-P01-w', -61, 76, 720, 389], ['phones-P01-w', 159, 25, 582, 432], ['HeroTitle-P01-w', 100, 453.0002, 568.8231, 335.0666]],
  'min-1024': [['back-Pr01-w', -97, 0, 1218, 375], ['laptop-P01-w', 323, 24, 710, 384], ['phones-P01-w', 579, 82, 460, 341], ['HeroTitle-P01-w', 51, 208.1504, 450.9545, 275.9162]],
  'min-1280': [['back-Pr01-w', -65, 0, 1410, 422], ['laptop-P01-w', 417, 27, 798, 432], ['phones-P01-w', 736.93, 92.29, 516.76, 383.357], ['HeroTitle-P01-w', 56, 209.9197, 568.8231, 335.0668]],
  'min-1440': [['back-Pr01-w', -64, -6, 1568, 459], ['laptop-P01-w', 474, 25, 866, 468], ['phones-P01-w', 804.69, 93.29, 585, 434], ['HeroTitle-P01-w', 106, 242.9197, 568.8231, 335.0668]],
  'min-1920': [['back-Pr01-w', -75, 0, 2071, 626], ['laptop-P01-w', 636, 63, 1136, 614], ['phones-P01-w', 1092, 121, 778, 577], ['HeroTitle-P01-w', 146, 347, 744.8099, 421.987]],
}
export const heroAmplitudes = [38, 35.5, 18.5, 34.5] as const
export const heroPointerDirections = [1, -1, 1, 1] as const
export function getHeroBreakpoint(width: number): HeroBreakpoint {
  return [...heroBreakpoints].reverse().find(bp => bp !== 'base' && width >= Number(bp.slice(4))) ?? 'base'
}
export function createHeroDraft(): HeroDraft {
  return Object.fromEntries(heroBreakpoints.map(bp => [bp, geometry[bp].map(([name, x, y, width, height], index) => ({
    name, x, y, width, height, speed: 1, introDirection: heroPointerDirections[index]!, animationEnabled: true,
  }))])) as HeroDraft
}
export function validHeroDraft(value: unknown): value is HeroDraft {
  if (!value || typeof value !== 'object') return false
  const scenes = value as HeroDraft
  return heroBreakpoints.every(bp => Array.isArray(scenes[bp]) && scenes[bp].length === 4 && scenes[bp].every((layer, index) =>
    layer?.name === geometry[bp][index]![0] && ['x', 'y', 'width', 'height', 'speed'].every(key => Number.isFinite(layer[key as 'x'])) &&
    layer.width > 0 && layer.height > 0 && layer.speed >= 0.25 && layer.speed <= 4 &&
    [-1, 1].includes(layer.introDirection) && typeof layer.animationEnabled === 'boolean'))
}
export const heroSceneEditorKey: InjectionKey<{ draft: HeroDraft; mode: Ref<'Neutral' | 'Interaction'> }> = Symbol('ChirpPrHero editor')

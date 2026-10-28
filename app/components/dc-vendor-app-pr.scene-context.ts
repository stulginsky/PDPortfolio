import type { InjectionKey, Ref } from 'vue'
import scenePreset from './dc-vendor-app-pr.scenes.json'
export type VendorPrBreakpoint = 'base' | '534-720' | 'min-768' | '1024-1920'
export type VendorPrState = 'Default' | 'Hover' | 'ActivePressed'
export type VendorPrLayer = { x: number; y: number; width: number; height: number; rotation: number }
export type VendorPrSceneDraft = Record<VendorPrBreakpoint, Record<VendorPrState, VendorPrLayer[]>>
export const vendorPrStates: VendorPrState[] = ['Default', 'Hover', 'ActivePressed']
export const vendorPrBreakpoints: VendorPrBreakpoint[] = ['base', '534-720', 'min-768', '1024-1920']
export const vendorPrLayerNames = ["00_sky","01-cloud","02-cloud","03-mountains","05-landform_city-1st","06-landform_city-2nd","04-water","07-tussock 1","08-dimmer","09-ostrich"] as const
export const vendorPrCoordinateSpace = 'card at width 430px; x shifts by (actualWidth-430)/2; 09-ostrich x is anchored to the actual card'
export function vendorPrLayerXShift(name: string, width: number): number { return name === '09-ostrich' ? 0 : (width - 430) / 2 }
export function vendorPrLayerYShift(name: string, viewport: number): number {
 const lift=viewport>=320&&viewport<=424&&name!=='09-ostrich'&&name!=='08-dimmer'?-50:0
 const centre=viewport>=320&&viewport<=410&&['05-landform_city-1st','06-landform_city-2nd','04-water','07-tussock 1'].includes(name)?30:0
 return lift+centre
}
export function getVendorPrSceneProfile(width: number): VendorPrBreakpoint { return width >= 1024 && width <= 1920 ? '1024-1920' : width >= 534 && width <= 720 ? '534-720' : width < 768 ? 'base' : 'min-768' }
export function createVendorPrSceneDraft(): VendorPrSceneDraft { return JSON.parse(JSON.stringify(scenePreset.scenes)) as VendorPrSceneDraft }
export const vendorPrSceneEditorKey: InjectionKey<{ mode: Ref<VendorPrState | 'Interaction'>; draft: VendorPrSceneDraft }> = Symbol('DCVendorAppPr scene editor')

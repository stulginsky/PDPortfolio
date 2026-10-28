import type { InjectionKey, Ref } from 'vue'
import scenePreset from './dc-vendor-app-ux.scenes.json'
export type VendorUxBreakpoint = 'base' | 'min-768'
export type VendorUxState = 'Default' | 'Hover' | 'ActivePressed'
export type VendorUxLayer = { x: number; y: number; width: number; height: number; rotation: number }
export type VendorUxSceneDraft = Record<VendorUxBreakpoint, Record<VendorUxState, VendorUxLayer[]>>
export const vendorUxStates: VendorUxState[] = ['Default', 'Hover', 'ActivePressed']
export const vendorUxBreakpoints: VendorUxBreakpoint[] = ['base', 'min-768']
export const vendorUxLayerNames = ["01-Background","02-Chef","03-Countertop","04-DeliveryBag-reflection","05-Phone-reflection","04-05-shadow","04-DeliveryBag","05-Phone","06-Foreground"] as const
export const vendorUxCoordinateSpace = 'card at width 430px; x shifts by (actualWidth-430)/2'
export function vendorUxLayerXShift(_name: string, width: number): number { return (width - 430) / 2 }
// The user extends the existing min-768 artwork profile down to534; shell stays base until768.
export function getVendorUxSceneProfile(width: number): VendorUxBreakpoint { return width < 534 ? 'base' : 'min-768' }
export function createVendorUxSceneDraft(): VendorUxSceneDraft { return JSON.parse(JSON.stringify(scenePreset.scenes)) as VendorUxSceneDraft }
export const vendorUxSceneEditorKey: InjectionKey<{ mode: Ref<VendorUxState | 'Interaction'>; draft: VendorUxSceneDraft }> = Symbol('DCVendorAppUx scene editor')

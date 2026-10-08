import type { InjectionKey, Ref } from 'vue'
import scenePreset from './chirp-ai-design-system.scenes.json'
export type DesignSystemBreakpoint = 'base' | 'min-768'
export type DesignSystemState = 'Default' | 'Hover' | 'ActivePressed'
export type DesignSystemLayer = { x: number; y: number; width: number; height: number; rotation: number }
export type DesignSystemSceneDraft = Record<DesignSystemBreakpoint, Record<DesignSystemState, DesignSystemLayer[]>>
export const designSystemStates: DesignSystemState[] = ['Default', 'Hover', 'ActivePressed']
export const designSystemBreakpoints: DesignSystemBreakpoint[] = ['base', 'min-768']
export const designSystemLayerNames = ["ColorBrand","Images","InputText","ChatBubble","Logotype","DatePickerBoundary","InputGenderSelect","Button","RowDiagnosisItem","RowQueryResultItem","RowListItemShort","RowListItemTall","code","EllipseBottom","EllipseTop"] as const
export const designSystemCoordinateSpace = 'card at width 430px; x shifts by (actualWidth-430)/2'
export function designSystemLayerXShift(_name: string, width: number): number { return (width - 430) / 2 }
export function getDesignSystemSceneProfile(width: number): DesignSystemBreakpoint { return width < 768 ? 'base' : 'min-768' }
export function createDesignSystemSceneDraft(): DesignSystemSceneDraft { return JSON.parse(JSON.stringify(scenePreset.scenes)) as DesignSystemSceneDraft }
export const designSystemSceneEditorKey: InjectionKey<{ mode: Ref<DesignSystemState | 'Interaction'>; draft: DesignSystemSceneDraft }> = Symbol('ChirpAiDesignSystem scene editor')

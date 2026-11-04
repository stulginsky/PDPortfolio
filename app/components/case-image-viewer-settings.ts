export type ResponsiveViewerSetting<T> = T | { base?: T; 'min-768'?: T }
export type ViewerInitialScale = 'fit-screen' | 'fit-width' | 'fit-height' | 'cover' | `${number}%`
export type ViewerAlignX = 'left' | 'center'
export type ViewerAlignY = 'top' | 'center' | 'viewport-center'
export type ViewerFitArea = 'content' | 'viewport'

export interface CaseImageViewerSettings {
  initialScale?: ResponsiveViewerSetting<ViewerInitialScale>
  alignX?: ResponsiveViewerSetting<ViewerAlignX>
  alignY?: ResponsiveViewerSetting<ViewerAlignY>
  fitArea?: ResponsiveViewerSetting<ViewerFitArea>
}

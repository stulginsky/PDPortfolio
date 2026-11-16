export type LIDPortDsCardState = 'Default' | 'Hover' | 'ActivePressed'
export type LIDPortDsCardBreakpoint = 'base' | 'min-768'
export interface LIDPortDsCardRect { x: number; y: number; width: number; height: number; opacity?: number; shadow?: boolean }
export interface LIDPortDsCardGeometry { background: LIDPortDsCardRect; window1: LIDPortDsCardRect; window2: LIDPortDsCardRect }

export const lidPortDsCardGeometry: Record<LIDPortDsCardBreakpoint, Record<LIDPortDsCardState, LIDPortDsCardGeometry>> = {
  base: {
    Default: { background: { x: -71, y: 0, width: 430, height: 539 }, window1: { x: 2, y: 23, width: 249, height: 227, shadow: true }, window2: { x: 30, y: 179, width: 281, height: 156, opacity: .65 } },
    Hover: { background: { x: -132, y: 0, width: 552, height: 691 }, window1: { x: 30, y: 23, width: 214, height: 195, opacity: .65 }, window2: { x: -57, y: 121, width: 419, height: 233 } },
    ActivePressed: { background: { x: -87, y: -40, width: 462, height: 579 }, window1: { x: -28, y: -9, width: 294, height: 267, shadow: true }, window2: { x: 40, y: 177, width: 299, height: 166 } },
  },
  'min-768': {
    Default: { background: { x: 0, y: 0, width: 430, height: 539 }, window1: { x: 33, y: 24, width: 328, height: 299, shadow: true }, window2: { x: 74, y: 208, width: 370, height: 206, opacity: .65 } },
    Hover: { background: { x: -61, y: 0, width: 552, height: 691 }, window1: { x: 71, y: 11, width: 286, height: 259, opacity: .65 }, window2: { x: -18, y: 131, width: 479, height: 266 } },
    ActivePressed: { background: { x: -16, y: -40, width: 462, height: 579 }, window1: { x: 21, y: 23, width: 291, height: 265, shadow: true }, window2: { x: 94, y: 193, width: 341, height: 190 } },
  },
}

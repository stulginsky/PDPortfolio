import { migrateMotion, validMotion, type HeroMotionSettings } from './hero-motion.ts'
import type { InjectionKey, Ref } from 'vue'

export const heroBreakpoints = ["base","min-768","min-1024","min-1280","min-1440","min-1920"] as const
export type HeroBreakpoint = typeof heroBreakpoints[number]
export interface HeroLayer extends HeroMotionSettings {
  name: string
  x: number
  y: number
  width: number
  height: number
  /** Legacy v1 field, consumed only by migration. */
  speed?: number
  viscosity?: number
  returnSpeed?: number
  amplitude?: number
  baseOffset?: number
  introDirection: 1 | -1
  animationEnabled: boolean
}
export type HeroDraft = Record<HeroBreakpoint, HeroLayer[]>
export interface HeroReference {
  width: number; height: number; nameHeight: number; nameY: number; logoX: number; logoY: number
  copyWidth: number; fontSize: number; backgroundBlur: number; greenOffset: number
  nameWidth: number; titleGap: string; copyPaddingLeft: string; copyPaddingRight: string
  inner: { x: number; y: number; width: number; height: number; blur: number } | null
}
export const heroReferences: Record<HeroBreakpoint, HeroReference> = {
  "base": {
    "width": 320,
    "height": 564,
    "nameHeight": 73.710846,
    "nameY": 0,
    "logoX": 98.55,
    "logoY": 1.93,
    "copyWidth": 200.787003,
    "nameWidth": 196.787003,
    "titleGap": "var(--space-2)",
    "copyPaddingLeft": "var(--space-0)",
    "copyPaddingRight": "var(--space-1)",
    "fontSize": 19.023,
    "backgroundBlur": 150,
    "inner": null,
    "greenOffset": 170
  },
  "min-768": {
    "width": 768,
    "height": 869,
    "nameHeight": 146.390945,
    "nameY": 0,
    "logoX": 195.721512,
    "logoY": 3.842355,
    "copyWidth": 390.819031,
    "nameWidth": 390.819031,
    "titleGap": "var(--space-3)",
    "copyPaddingLeft": "var(--space-0)",
    "copyPaddingRight": "var(--space-1)",
    "fontSize": 37.78,
    "backgroundBlur": 150,
    "inner": null,
    "greenOffset": 400
  },
  "min-1024": {
    "width": 1024,
    "height": 455.466705,
    "nameHeight": 170.27478,
    "nameY": 10.03418,
    "logoX": 214.92836,
    "logoY": 0,
    "copyWidth": 307,
    "nameWidth": 427.79361,
    "titleGap": "1px",
    "copyPaddingLeft": "var(--space-1)",
    "copyPaddingRight": "var(--space-1)",
    "fontSize": 41.354,
    "backgroundBlur": 150,
    "inner": {
      "x": -69.49707,
      "y": 0,
      "width": 1162.994141,
      "height": 255.339218,
      "blur": 75
    },
    "greenOffset": 0
  },
  "min-1280": {
    "width": 1280,
    "height": 569.333313,
    "nameHeight": 190.79245,
    "nameY": 0,
    "logoX": 255.085587,
    "logoY": 5.008175,
    "copyWidth": 355,
    "nameWidth": 509.358398,
    "titleGap": "1px",
    "copyPaddingLeft": "var(--space-1)",
    "copyPaddingRight": "var(--space-0)",
    "fontSize": 49.239,
    "backgroundBlur": 150,
    "inner": {
      "x": -91.180664,
      "y": 0,
      "width": 1462.361328,
      "height": 321.066284,
      "blur": 125
    },
    "greenOffset": 0
  },
  "min-1440": {
    "width": 1440,
    "height": 640.5,
    "nameHeight": 190.79245,
    "nameY": 0,
    "logoX": 255.085587,
    "logoY": 5.008175,
    "copyWidth": 367,
    "nameWidth": 509.358398,
    "titleGap": "1px",
    "copyPaddingLeft": "var(--space-2)",
    "copyPaddingRight": "var(--space-2)",
    "fontSize": 49.239,
    "backgroundBlur": 150,
    "inner": {
      "x": -86.078125,
      "y": -0.166992,
      "width": 1572.882813,
      "height": 345.331635,
      "blur": 150
    },
    "greenOffset": 0
  },
  "min-1920": {
    "width": 1920,
    "height": 854,
    "nameHeight": 238.436096,
    "nameY": 0,
    "logoX": 318.783814,
    "logoY": 6.258399,
    "copyWidth": 444,
    "nameWidth": 636.552612,
    "titleGap": "1px",
    "copyPaddingLeft": "var(--space-2)",
    "copyPaddingRight": "var(--space-2)",
    "fontSize": 61.535,
    "backgroundBlur": 150,
    "inner": {
      "x": -226,
      "y": 0,
      "width": 2373,
      "height": 521,
      "blur": 150
    },
    "greenOffset": 0
  }
}
const geometry: Record<HeroBreakpoint, [string, number, number, number, number][]> = {
  "base": [
    [
      "back-for-all",
      -337.705078,
      0,
      858.384216,
      251.848663
    ],
    [
      "green",
      -450,
      -235.531357,
      678.30188,
      454.26825
    ],
    [
      "phonesUX",
      -55.0445741,
      47.012695,
      369.3257202,
      319.74921875
    ],
    [
      "Role-Focus",
      16,
      416,
      288,
      148
    ],
    [
      "HeroTitle-UX01-m",
      103.212387,
      40,
      200.787003,
      157.710846
    ]
  ],
  "min-768": [
    [
      "back-for-all",
      -438,
      0,
      1697,
      498
    ],
    [
      "green",
      -600,
      -467,
      1324,
      796
    ],
    [
      "phonesUX",
      4.775,
      41,
      751.45,
      649.8
    ],
    [
      "Role-Focus",
      16,
      793,
      736,
      76
    ],
    [
      "HeroTitle-UX01-m",
      347.180664,
      54.506836,
      390.819031,
      257.39093
    ]
  ],
  "min-1024": [
    [
      "background",
      20,
      100,
      1024,
      454.4
    ],
    [
      "green",
      -138,
      110,
      1303,
      455
    ],
    [
      "phonesUX",
      338.04673265,
      10.666992,
      486.9067167,
      421.5466996
    ],
    [
      "Role-Focus",
      670,
      37.486328,
      310,
      204
    ],
    [
      "HeroTitle-UX01-w",
      55,
      79.637695,
      427.79361,
      275.27478
    ]
  ],
  "min-1280": [
    [
      "background",
      0,
      100,
      1280,
      568
    ],
    [
      "green",
      -153,
      150,
      1598,
      570
    ],
    [
      "phonesUX",
      425.18338365,
      13.333333,
      608.6332947,
      526.9332947
    ],
    [
      "Role-Focus",
      701,
      63.445313,
      543,
      108
    ],
    [
      "HeroTitle-UX01-w",
      93,
      117.44516,
      509.358398,
      305.79245
    ]
  ],
  "min-1440": [
    [
      "background",
      0,
      100,
      1440,
      639
    ],
    [
      "green",
      -160,
      110,
      1793,
      640
    ],
    [
      "phonesUX",
      467.143751525,
      15,
      684.71255795,
      592.8
    ],
    [
      "Role-Focus",
      785,
      84,
      543,
      108
    ],
    [
      "HeroTitle-UX01-w",
      149,
      183,
      509.358398,
      305.79245
    ]
  ],
  "min-1920": [
    [
      "background",
      20,
      50,
      1920,
      735
    ],
    [
      "green",
      -226,
      130,
      2373,
      854
    ],
    [
      "phonesUX",
      543.025,
      20,
      912.95,
      790.4
    ],
    [
      "Role-Focus",
      955,
      121,
      813,
      76
    ],
    [
      "HeroTitle-UX01-w",
      149,
      223,
      636.552612,
      368.436096
    ]
  ]
}
// Trial values approved by user; no animated UX nodes were exported from Figma.
export const heroAmplitudes = [38, 18.5, 35.5, 18.5, 34.5] as const
export const heroPointerDirections = [1, 1, -1, 1, 1] as const
export function getHeroBreakpoint(width: number): HeroBreakpoint {
  return [...heroBreakpoints].reverse().find(bp => bp !== 'base' && width >= Number(bp.slice(4))) ?? 'base'
}
function createLegacyHeroDraft(): HeroDraft {
  const draft = Object.fromEntries(heroBreakpoints.map(bp => [bp, geometry[bp].map(([name, x, y, width, height], index) => ({
    name, x, y, width, height, viscosity: 1, returnSpeed: 1, amplitude: 1, baseOffset: heroAmplitudes[index]!, introDirection: heroPointerDirections[index]!, animationEnabled: index < 3,
  }))])) as HeroDraft
  for (const bp of heroBreakpoints) {
    const mobile = bp === 'base' || bp === 'min-768'
    const values = mobile
      ? [[2,38,1,2,-1], [3,30,1,2,1], [.5,40,5,.5,-1]]
      : [[2,40,1,2,-1], [3,50,3,1,1], [.5,40,5,.5,-1]]
    values.forEach(([amplitude,baseOffset,viscosity,returnSpeed,introDirection], index) => {
      Object.assign(draft[bp][index]!, { amplitude,baseOffset,viscosity,returnSpeed,introDirection })
    })
    if (mobile) draft[bp][1]!.x = bp === 'base' ? -450 : -600
    if (bp === 'min-1024' || bp === 'min-1920') draft[bp][0]!.animationEnabled = false
  }
  return draft
}
export function validHeroDraft(value:unknown):value is HeroDraft {
 if(!value||typeof value!=='object')return false
 const d=value as HeroDraft,b=createLegacyHeroDraft()
 return heroBreakpoints.every(bp=>Array.isArray(d[bp])&&d[bp].length===b[bp].length&&d[bp].every((l,i)=>{
  const ref=b[bp][i]!
  return l&&l.name===ref.name&&(!('id' in ref)||('id' in l&&l.id===ref.id))&&['x','y','width','height'].every(k=>Number.isFinite(l[k as 'x']))&&l.width>0&&l.height>0&&validMotion(l)
 }))
}

export const heroSceneEditorKey: InjectionKey<{ draft: HeroDraft; mode: Ref<'Neutral' | 'Interaction'> }> = Symbol('ChirpUxHero editor')

export function migrateHeroLayer(layer:HeroLayer,index:number,bp:HeroBreakpoint='base'):HeroLayer { return migrateMotion(layer,{baseOffset:heroAmplitudes[index]!,legacyTau:100,direction:heroPointerDirections[index]!}) as HeroLayer }
export function createHeroDraft():HeroDraft {
 const draft=createLegacyHeroDraft()
 for(const bp of heroBreakpoints)draft[bp]=draft[bp].map((layer,index)=>migrateHeroLayer(layer,index,bp))
 return draft
}

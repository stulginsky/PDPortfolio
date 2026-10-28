import { migrateMotion, validMotion, type HeroMotionSettings } from './hero-motion.ts'
import type { InjectionKey, Ref } from 'vue'
export const heroBreakpoints = ["base","min-768","min-1024","min-1280","min-1440","min-1920"] as const
export type HeroBreakpoint = typeof heroBreakpoints[number]
export interface HeroLayer extends HeroMotionSettings { name: string; x: number; y: number; width: number; height: number }
export type HeroDraft = Record<HeroBreakpoint, HeroLayer[]>
export const heroReferences = {
  "base": {
    "width": 320,
    "height": 488
  },
  "min-768": {
    "width": 768,
    "height": 724
  },
  "min-1024": {
    "width": 1024,
    "height": 480
  },
  "min-1280": {
    "width": 1280,
    "height": 600
  },
  "min-1440": {
    "width": 1440,
    "height": 675
  },
  "min-1920": {
    "width": 1923,
    "height": 830
  }
} as const
const defaults: HeroDraft = {
  "base": [
    {
      "name": "01_sky",
      "x": -208,
      "y": -27,
      "width": 921,
      "height": 464,
      "viscosity": 2.4,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 4,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": false
    },
    {
      "name": "02-cloud",
      "x": -113,
      "y": 0,
      "width": 531,
      "height": 488,
      "viscosity": 2.4,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 6,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "03-mountains",
      "x": -121.40625,
      "y": 367.86328125,
      "width": 539.40673828125,
      "height": 101.74896240234375,
      "viscosity": 2,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 10,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "05-landform_city-1st",
      "x": -124.986328125,
      "y": 329,
      "width": 491.3088073730469,
      "height": 160.7249755859375,
      "viscosity": 1.6,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 16,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "06-landform_city-2nd",
      "x": 18.4296875,
      "y": 431.146484375,
      "width": 336.0539245605469,
      "height": 58.57846450805664,
      "viscosity": 3,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 18,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "07-tussock",
      "x": 280.59765625,
      "y": 419.8603515625,
      "width": 63.38741683959961,
      "height": 35.19016647338867,
      "viscosity": 1.4,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 22,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "08-dimmer",
      "x": 0,
      "y": 0,
      "width": 320,
      "height": 488,
      "viscosity": 2,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 4,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": false
    },
    {
      "name": "Title",
      "x": 12,
      "y": 89.103515625,
      "width": 296,
      "height": 152,
      "viscosity": 2,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 6,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": false
    }
  ],
  "min-768": [
    {
      "name": "01_sky",
      "x": -83,
      "y": 2,
      "width": 951,
      "height": 611,
      "viscosity": 2.4,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 4,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": false
    },
    {
      "name": "02-cloud",
      "x": -132,
      "y": 24,
      "width": 1018,
      "height": 656,
      "viscosity": 2.4,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 6,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "03-mountains",
      "x": -378.02734375,
      "y": 468.43017578125,
      "width": 1352.30322265625,
      "height": 255.0866241455078,
      "viscosity": 2,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 10,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "05-landform_city-1st",
      "x": -387,
      "y": 371,
      "width": 1231.7208251953125,
      "height": 402.9406433105469,
      "viscosity": 1.6,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 16,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "06-landform_city-2nd",
      "x": -27.453125,
      "y": 627.083984375,
      "width": 842.4937133789062,
      "height": 146.85733032226562,
      "viscosity": 3,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 18,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "07-tussock",
      "x": 629.810546875,
      "y": 598.7900390625,
      "width": 158.91348266601562,
      "height": 88.2224349975586,
      "viscosity": 1.4,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 22,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "08-dimmer",
      "x": 0,
      "y": 2,
      "width": 768,
      "height": 722,
      "viscosity": 2,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 4,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": false
    },
    {
      "name": "Title",
      "x": 72,
      "y": 83,
      "width": 496,
      "height": 255,
      "viscosity": 2,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 6,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": false
    }
  ],
  "min-1024": [
    {
      "name": "01_sky",
      "x": -166.46343994140625,
      "y": -5.088510513305664,
      "width": 1330.0400390625,
      "height": 375.03448486328125,
      "viscosity": 2.4,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 4,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": false
    },
    {
      "name": "02-cloud",
      "x": -166.46343994140625,
      "y": -9.94140625,
      "width": 1323.0576171875,
      "height": 552.4453125,
      "viscosity": 2.4,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 6,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "03-mountains",
      "x": -223.30384826660156,
      "y": 266.8554992675781,
      "width": 1461.3038330078125,
      "height": 275.6475524902344,
      "viscosity": 2,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 10,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "05-landform_city-1st",
      "x": -233,
      "y": 161.57415771484375,
      "width": 1331.0020751953125,
      "height": 435.41912841796875,
      "viscosity": 1.6,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 16,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "06-landform_city-2nd",
      "x": 155.525634765625,
      "y": 438.2984619140625,
      "width": 910.4017944335938,
      "height": 158.694580078125,
      "viscosity": 3,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 18,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "07-tussock",
      "x": 865.7704467773438,
      "y": 407.7248840332031,
      "width": 171.72247314453125,
      "height": 95.33348083496094,
      "viscosity": 1.4,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 22,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "08-dimmer",
      "x": 0,
      "y": 0,
      "width": 1024,
      "height": 480,
      "viscosity": 2,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 4,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": false
    },
    {
      "name": "Title",
      "x": 96,
      "y": 93,
      "width": 323,
      "height": 182,
      "viscosity": 2,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 6,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": false
    }
  ],
  "min-1280": [
    {
      "name": "01_sky",
      "x": -152.71286010742188,
      "y": -4.085600852966309,
      "width": 1604.908935546875,
      "height": 452.5399169921875,
      "viscosity": 2.4,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 4,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": false
    },
    {
      "name": "02-cloud",
      "x": -152.71286010742188,
      "y": -9.94140625,
      "width": 1596.4835205078125,
      "height": 666.6148071289062,
      "viscosity": 2.4,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 6,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "03-mountains",
      "x": -221.30001831054688,
      "y": 324.05950927734375,
      "width": 1763.300048828125,
      "height": 332.61346435546875,
      "viscosity": 2,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 10,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "05-landform_city-1st",
      "x": -233,
      "y": 197.0199432373047,
      "width": 1606.06982421875,
      "height": 525.40380859375,
      "viscosity": 1.6,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 16,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "06-landform_city-2nd",
      "x": 235.8191680908203,
      "y": 530.9326782226562,
      "width": 1098.54736328125,
      "height": 191.49073791503906,
      "viscosity": 3,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 18,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "07-tussock",
      "x": 1092.8447265625,
      "y": 494.04071044921875,
      "width": 207.2110137939453,
      "height": 115.0353012084961,
      "viscosity": 1.4,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 22,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "08-dimmer",
      "x": 0,
      "y": 0,
      "width": 1280,
      "height": 600,
      "viscosity": 2,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 4,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": false
    },
    {
      "name": "Title",
      "x": 136,
      "y": 111,
      "width": 385,
      "height": 222,
      "viscosity": 2,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 6,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": false
    }
  ],
  "min-1440": [
    {
      "name": "01_sky",
      "x": -143.82998657226562,
      "y": -1.4374570846557617,
      "width": 1782.4755859375,
      "height": 502.60882568359375,
      "viscosity": 2.4,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 4,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": false
    },
    {
      "name": "02-cloud",
      "x": -143.82998657226562,
      "y": -7.94140625,
      "width": 1773.117919921875,
      "height": 740.368896484375,
      "viscosity": 2.4,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 6,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "03-mountains",
      "x": -220.005859375,
      "y": 363.01275634765625,
      "width": 1958.39111328125,
      "height": 369.41375732421875,
      "viscosity": 2,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 10,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "05-landform_city-1st",
      "x": -233,
      "y": 221.91796875,
      "width": 1783.764892578125,
      "height": 583.5343017578125,
      "viscosity": 1.6,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 16,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "06-landform_city-2nd",
      "x": 287.689453125,
      "y": 592.775390625,
      "width": 1220.09033203125,
      "height": 212.67721557617188,
      "viscosity": 3,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 18,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "07-tussock",
      "x": 1239.53515625,
      "y": 551.80078125,
      "width": 230.1367950439453,
      "height": 127.76277160644531,
      "viscosity": 1.4,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 22,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "08-dimmer",
      "x": 0,
      "y": 0,
      "width": 1440,
      "height": 675,
      "viscosity": 2,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 4,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": false
    },
    {
      "name": "Title",
      "x": 151,
      "y": 158,
      "width": 496,
      "height": 263,
      "viscosity": 2,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 6,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": false
    }
  ],
  "min-1920": [
    {
      "name": "01_sky",
      "x": -126.994140625,
      "y": 0,
      "width": 2176.42578125,
      "height": 613.69189453125,
      "viscosity": 2.4,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 4,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": false
    },
    {
      "name": "02-cloud",
      "x": -126.994140625,
      "y": -7.94140625,
      "width": 2165,
      "height": 904,
      "viscosity": 2.4,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 6,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "03-mountains",
      "x": -220.005859375,
      "y": 444.9990234375,
      "width": 2391.220947265625,
      "height": 451.0589904785156,
      "viscosity": 2,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 10,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "05-landform_city-1st",
      "x": -135,
      "y": 272.7197265625,
      "width": 2178,
      "height": 712.5029296875,
      "viscosity": 1.6,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 16,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "06-landform_city-2nd",
      "x": 500.767578125,
      "y": 725.541015625,
      "width": 1489.74609375,
      "height": 259.681640625,
      "viscosity": 3,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 18,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "07-tussock",
      "x": 1662.984375,
      "y": 675.5107421875,
      "width": 281,
      "height": 156,
      "viscosity": 1.4,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 22,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": true
    },
    {
      "name": "08-dimmer",
      "x": 0,
      "y": 0,
      "width": 1920,
      "height": 830,
      "viscosity": 2,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 4,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": false
    },
    {
      "name": "Title",
      "x": 151,
      "y": 177.529296875,
      "width": 700,
      "height": 355,
      "viscosity": 2,
      "returnSpeed": 0.7,
      "amplitude": 1,
      "baseOffset": 6,
      "pointerDirection": 1,
      "introDirection": -1,
      "animationEnabled": false
    }
  ]
}
export const heroAmplitudes = [4,6,10,16,18,22,4,6]
export function createHeroDraft(): HeroDraft { return structuredClone(defaults) }
export function getHeroBreakpoint(width: number): HeroBreakpoint { return [...heroBreakpoints].reverse().find(bp => bp === 'base' || width >= Number(bp.slice(4))) ?? 'base' }
export function migrateHeroLayer(layer: HeroLayer, index: number, _bp?: HeroBreakpoint): HeroLayer { return migrateMotion(layer, {baseOffset: heroAmplitudes[index]!, direction: 1}) }
export function validHeroDraft(value: unknown): value is HeroDraft {
 if (!value || typeof value !== 'object') return false
 return heroBreakpoints.every(bp => { const layers=(value as HeroDraft)[bp]; return Array.isArray(layers) && layers.length===8 && layers.every((l,i) => l?.name===defaults[bp][i]!.name && [l.x,l.y,l.width,l.height].every(Number.isFinite) && l.width>0 && l.height>0 && validMotion(l)) })
}
// Historical v1/v2 drafts used nine layers. Match identities before validating;
// removing water must not shift another layer's custom settings onto its neighbour.
export function restoreHeroDraft(value: unknown): HeroDraft | undefined {
 if (!value || typeof value !== 'object') return
 const restored = {} as HeroDraft
 for (const bp of heroBreakpoints) {
  const scene = (value as Record<string, unknown>)[bp]
  if (!Array.isArray(scene) || ![8,9].includes(scene.length)) return
  const byName = new Map<string, HeroLayer>()
  for (const entry of scene) {
   if (!entry || typeof entry !== 'object' || typeof entry.name !== 'string') return
   if (entry.name === '04-water') continue
   const name = entry.name === '07-tussock 1' ? '07-tussock' : entry.name
   if (byName.has(name) || !defaults[bp].some(layer => layer.name === name)) return
   byName.set(name, { ...entry, name })
  }
  restored[bp] = defaults[bp].map((layer,index) => {
   const saved = byName.get(layer.name)
   return saved ? migrateHeroLayer(saved,index,bp) : undefined
  }) as HeroLayer[]
 }
 return validHeroDraft(restored) ? restored : undefined
}
export const heroSceneEditorKey: InjectionKey<{draft:HeroDraft;mode:Ref<'Neutral'|'Interaction'>}> = Symbol('DCVendorAppPrHeroSceneEditor')


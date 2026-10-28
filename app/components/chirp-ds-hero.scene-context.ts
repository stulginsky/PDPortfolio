import { migrateMotion, validMotion, type HeroMotionSettings } from './hero-motion.ts'
import type { InjectionKey, Ref } from 'vue'
export const heroBreakpoints = ['base','min-768','min-1024','min-1280','min-1440','min-1920'] as const
export type HeroBreakpoint = typeof heroBreakpoints[number]
export interface HeroLayer extends HeroMotionSettings { id:string; name:string; x:number; y:number; width:number; height:number; speed?:number; amplitude:number; introDirection:1|-1; pointerDirection:1|-1; animationEnabled:boolean }
export type HeroDraft = Record<HeroBreakpoint,HeroLayer[]>
export const heroReferences = {
  "base": {
    "width": 320,
    "height": 540,
    "id": "1559:6079",
    "clip": {
      "id": "1559:6090",
      "x": 0,
      "y": 0,
      "width": 320,
      "height": 292
    },
    "title": {
      "id": "1559:6080",
      "name": "Chirp design system",
      "x": 39.3330078125,
      "y": 39,
      "width": 274,
      "height": 273
    },
    "panel": {
      "x": 0,
      "y": 292,
      "width": 320,
      "height": 248,
      "padding": 24
    },
    "role": {
      "id": "1559:6082",
      "x": 16,
      "y": 316,
      "width": 288,
      "height": 200
    },
    "bird": {
      "id": "1559:6083",
      "x": 71.8102035522461,
      "y": 252.621337890625,
      "width": 56.8271484375,
      "height": 56.8271484375
    }
  },
  "min-768": {
    "width": 768,
    "height": 766,
    "id": "1559:6103",
    "clip": {
      "id": "1559:6104",
      "x": 0,
      "y": 0,
      "width": 768,
      "height": 562
    },
    "title": {
      "id": "1559:6105",
      "name": "Chirp design system",
      "x": 177,
      "y": 48,
      "width": 575,
      "height": 552
    },
    "panel": {
      "x": 0,
      "y": 562,
      "width": 768,
      "height": 204,
      "padding": 48
    },
    "role": {
      "id": "1559:6107",
      "x": 16,
      "y": 610,
      "width": 736,
      "height": 108
    },
    "bird": {
      "id": "1559:6108",
      "x": 241.07398986816406,
      "y": 488.4909973144531,
      "width": 103,
      "height": 103
    }
  },
  "min-1024": {
    "width": 1024,
    "height": 410,
    "id": "1559:6057",
    "clip": {
      "id": "3001:8022",
      "x": 0,
      "y": 0,
      "width": 1024,
      "height": 238
    },
    "title": {
      "id": "1559:6058",
      "name": "Chirp design system",
      "x": 0,
      "y": 158.4453125,
      "width": 1024,
      "height": 104
    },
    "panel": {
      "x": 0,
      "y": 238,
      "width": 1024,
      "height": 172,
      "padding": 32
    },
    "role": {
      "id": "1559:6060",
      "x": 50,
      "y": 270,
      "width": 924,
      "height": 108
    },
    "bird": {
      "id": "1559:6061",
      "x": 160.8193359375,
      "y": 183.671142578125,
      "width": 76.6708984375,
      "height": 76.6708984375
    }
  },
  "min-1280": {
    "width": 1280,
    "height": 540,
    "id": "1559:6046",
    "clip": {
      "id": "3001:8021",
      "x": 0,
      "y": 0,
      "width": 1280,
      "height": 304
    },
    "title": {
      "id": "1559:6047",
      "name": "Chirp design system",
      "x": 0,
      "y": 205.458984375,
      "width": 1280,
      "height": 130
    },
    "panel": {
      "x": 0,
      "y": 304,
      "width": 1280,
      "height": 236,
      "padding": 64
    },
    "role": {
      "id": "1559:6049",
      "x": 178,
      "y": 368,
      "width": 924,
      "height": 108
    },
    "bird": {
      "id": "1559:6050",
      "x": 202.5458984375,
      "y": 237.3740234375,
      "width": 94.25780487060547,
      "height": 94.25780487060547
    }
  },
  "min-1440": {
    "width": 1440,
    "height": 560,
    "id": "1553:4635",
    "clip": {
      "id": "3001:8020",
      "x": 0,
      "y": 0,
      "width": 1440,
      "height": 324
    },
    "title": {
      "id": "1559:6035",
      "name": "Chirp design system",
      "x": 0,
      "y": 204.4453125,
      "width": 1439.673828125,
      "height": 156
    },
    "panel": {
      "x": 0,
      "y": 324,
      "width": 1440,
      "height": 236,
      "padding": 64
    },
    "role": {
      "id": "1559:6037",
      "x": 258,
      "y": 388,
      "width": 924,
      "height": 108
    },
    "bird": {
      "id": "1559:6038",
      "x": 191.34765625,
      "y": 248.7080078125,
      "width": 102.99999237060547,
      "height": 102.99999237060547
    }
  },
  "min-1920": {
    "width": 1920,
    "height": 560,
    "id": "1559:6124",
    "clip": {
      "id": "3001:8019",
      "x": 0,
      "y": 0,
      "width": 1920,
      "height": 324
    },
    "title": {
      "id": "1559:6125",
      "name": "Chirp design system",
      "x": 0,
      "y": 167,
      "width": 1920,
      "height": 208
    },
    "panel": {
      "x": 0,
      "y": 324,
      "width": 1920,
      "height": 236,
      "padding": 64
    },
    "role": {
      "id": "1559:6127",
      "x": 498,
      "y": 388,
      "width": 924,
      "height": 108
    },
    "bird": {
      "id": "1559:6128",
      "x": 250.4765625,
      "y": 231.302734375,
      "width": 124.142578125,
      "height": 124.142578125
    }
  }
} as const
export function getHeroBreakpoint(width:number):HeroBreakpoint { return width>=1920?'min-1920':width>=1440?'min-1440':width>=1280?'min-1280':width>=1024?'min-1024':width>=768?'min-768':'base' }
function createLegacyHeroDraft():HeroDraft {
 return Object.fromEntries(heroBreakpoints.map(bp=>{
  const r=heroReferences[bp]
  // User-approved JSON preset2026-10-14; keep the original Figma references above.
  return [bp,[{...r.title,name:'Chirp design system',animationEnabled:true},{...r.bird,x:bp==='min-1440'?190:r.bird.x,name:'b05-metaphor-songbird-v1 1',animationEnabled:true},{...r.role,name:'Role-Focus',animationEnabled:false}].map(layer=>({...layer,speed:1,amplitude:1,introDirection:1,pointerDirection:layer.name==='b05-metaphor-songbird-v1 1'?-1:1}))]
 })) as HeroDraft
}
export const heroSceneEditorKey:InjectionKey<{draft:HeroDraft;mode:Ref<'Neutral'|'Interaction'>}>=Symbol('ChirpDsHeroEditor')
export function validHeroDraft(value:unknown):value is HeroDraft {
 if(!value||typeof value!=='object')return false
 const d=value as HeroDraft,b=createLegacyHeroDraft()
 return heroBreakpoints.every(bp=>Array.isArray(d[bp])&&d[bp].length===b[bp].length&&d[bp].every((l,i)=>{
  const ref=b[bp][i]!
  return l&&l.name===ref.name&&(!('id' in ref)||('id' in l&&l.id===ref.id))&&['x','y','width','height'].every(k=>Number.isFinite(l[k as 'x']))&&l.width>0&&l.height>0&&validMotion(l)
 }))
}


export function migrateHeroLayer(layer:HeroLayer,index:number,bp:HeroBreakpoint='base'):HeroLayer { return migrateMotion(layer,{baseOffset:bp==='base'?8:10,legacyTau:180,direction:layer.pointerDirection??1,legacyIntro:(-layer.introDirection*(layer.pointerDirection??1)) as 1|-1}) as HeroLayer }
export function createHeroDraft():HeroDraft {
 const draft=createLegacyHeroDraft()
 // User JSON v2, 2026-10-16: min-1024 web and base mobile sources agree.
 // Apply motion only; retain each profile's original reference geometry.
 for(const bp of heroBreakpoints)draft[bp]=draft[bp].map((layer,index)=>({
  ...migrateHeroLayer(layer,index,bp),
  ...(index===0?{viscosity:10,returnSpeed:1,amplitude:1,baseOffset:8}:
      index===1?{viscosity:1.8,returnSpeed:1,amplitude:2.5,baseOffset:6}:{})
 }))
 return draft
}


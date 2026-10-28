import type { CSSProperties } from 'vue'
import type { HeroBreakpoint } from './chirp-br-hero.scene-context'
// Target inventory from Figma1502:6792; signed mean excursions, quarter strength.
const targets: Record<HeroBreakpoint, (string | null)[]> = {
 base: ['1464:7803','1464:7804','1464:7805','1464:7806','1464:7807','1464:7808','1464:7809','1464:7810','1464:7859','1464:7813','1464:7850','1464:7840'],
 'min-768': ['1464:7638','1464:7639','1464:7640','1464:7641','1464:7642','1464:7643','1464:7644','1464:7645','1464:7715',null,'1464:7732','1464:7718'],
 'min-1024': ['1464:7509','1464:7510','1464:7511','1464:7512','1464:7513','1464:7514','1464:7515','1464:7516','1464:7526','1464:7529','1464:7532','1464:7535'],
 'min-1280': ['1464:7450','1464:7451','1464:7452','1464:7453','1464:7454','1464:7455','1464:7456','1464:7457','1464:7467','1464:7470','1464:7473','1464:7476'],
 'min-1440': ['1464:7391','1464:7392','1464:7393','1464:7394','1464:7395','1464:7396','1464:7397','1464:7398','1464:7408','1464:7411','1464:7414','1464:7417'],
 'min-1920': ['1464:6349','1464:6350','1464:6351','1464:6352','1464:6353','1464:6354','1464:6355','1464:7078','1464:7081','1464:6369','1464:6373','1464:6376'],
}

const depths = [-14,-20,-49.0905,-89.822,-44,-76,-141.807,-90,-79.4805,-22,-30,-146.856]
export function applyPointerMotion(style: CSSProperties, breakpoint: HeroBreakpoint, id?: string): string | undefined {
 const index = targets[breakpoint].findIndex(target => target === id)
 if (index < 0) return
 // Parent variable is now a physical-pixel maximum converted back through stage scale.
 // Preserve the original relative depths of all eight img-main children.
 const depth = Math.abs(depths[index]!) / (index < 8 ? 141.807 : Math.abs(depths[index]!))
 style.translate = `calc(var(--hero-motion, 0px) * ${depth}) 0px`
 return String(index)
}


import { defineComponent, h, type PropType, type CSSProperties, type VNode } from 'vue'
import DsRoleFocus from './DsRoleFocus.vue'
import TypoText from './TypoText.vue'
import ChirpBrHeroAsset from './ChirpBrHeroAsset.vue'
import content from '../../content/cases/chirp-brand.json'
import { applyPointerMotion } from './chirp-br-hero.pointer-motion'
import { createHeroDraft, type LayoutNode, type HeroBreakpoint } from './chirp-br-hero.scene-context'
const titleSizes: Record<HeroBreakpoint, [number, number]> = {
 base: [320,231], 'min-768': [768,351], 'min-1024': [572,283],
 'min-1280': [715,378], 'min-1440': [805,400], 'min-1920': [1073,468],
}
const titleAnchors = createHeroDraft()
const semanticStyle: CSSProperties = { position:'absolute',width:'1px',height:'1px',padding:0,margin:0,overflow:'hidden',clipPath:'inset(50%)',whiteSpace:'nowrap',border:0 }
export default defineComponent({
 name:'ChirpBrHeroNode',
 props:{
  node:{type:Object as PropType<LayoutNode>,required:true},
  copy:{type:Object as PropType<typeof content.hero>,required:true},
  breakpoint:{type:String as PropType<HeroBreakpoint>,required:true},
  moving:{type:Boolean,default:false},
  initialMedia:{type:String,default:undefined},
 },
 emits:['loaded'],
 setup(props,{emit}){
  const text=(key:string)=>{const parts=key.split('.');const value=props.copy[parts[0] as keyof typeof content.hero];return Array.isArray(value)?value[Number(parts[1])]!:value}
  function render(node:LayoutNode, inHeadline=false):VNode {
   if(node.text) return h(TypoText,{content:text(node.text)})
   const style={...node.style} as CSSProperties
   const motionId=props.moving ? applyPointerMotion(style,props.breakpoint,node.id) : undefined
   const attrs={style,'data-figma-node':node.id,'data-figma-name':node.name,'data-figma-motion':motionId}
   if(node.name==='title') {
    const anchor=titleAnchors[props.breakpoint].find(layer=>layer.name==='title')!
    const [width,height]=titleSizes[props.breakpoint]
    return h('div', { ...attrs, style:{position:'absolute',left:anchor.x+'px',top:anchor.y+'px',width:width+'px',height:height+'px'}, class:'chirp-br-hero__title-svg' }, [
     h('picture',null,[props.initialMedia?h('source',{media:props.initialMedia,srcset:`/cases/chirp-brand/hero-layers/${props.breakpoint}/${node.id!.replace(':','-')}/title.svg`}):null,h('img',{src:props.initialMedia?undefined:`/cases/chirp-brand/hero-layers/${props.breakpoint}/${node.id!.replace(':','-')}/title.svg`,alt:'','aria-hidden':'true',draggable:false,onLoad:()=>emit('loaded'),style:{display:'block',maxWidth:'none',pointerEvents:'none',userSelect:'none'}})]),
     h('div',{style:semanticStyle},[
      h('h1',null,h(TypoText,{content:props.copy.headline.join(' ')})),
      h('p',null,h(TypoText,{content:props.copy.clarity})),
      h('p',null,h(TypoText,{content:props.copy.subline})),
     ]),
    ])
   }
   if(node.roleFocus) return h(DsRoleFocus,{...attrs,role:props.copy.role,focus:props.copy.focus,breakpoint:props.breakpoint==='base'?'base':'min-425'})
   if(node.asset) return h(ChirpBrHeroAsset,{...node.asset,boxStyle:style,media:props.initialMedia,onLoaded:()=>emit('loaded')})
   const headline=style.fontFamily==='Playfair'
   if(node.tag==='p'||node.heading||headline) style.margin=0
   if(headline){style.fontOpticalSizing='none';style.fontSynthesis='none'}
   if(inHeadline){style.display='block';style.fontSize='inherit';style.fontWeight='inherit'}
   return h(headline?'h1':inHeadline&&node.heading?'span':node.tag||'div',attrs,(node.children||[]).map(child=>render(child,inHeadline||headline)))
  }
  return ()=>render(props.node)
 },
})

import type { ObjectDirective } from 'vue'
import './media-readiness.css'

const observers = new WeakMap<HTMLElement, () => void>()
// A local media boundary: no page-wide gate, timers or new component API.
function observeMedia(root:HTMLElement) {
 let disposed=false, generation=0, controller:AbortController|undefined
 async function refresh(){
  const current=++generation
  controller?.abort();controller=new AbortController()
  const signal=controller.signal
  const images=[...root.querySelectorAll('img')].filter(img=>!img.closest('[data-scene-fallback]') && img.getClientRects().length && getComputedStyle(img).opacity!=='0')
  // The loading wrapper uses visibility, keeping the reserved geometry measurable.
  if(images.some(img=>!img.complete)) root.dataset.mediaState='loading'
  const results=await Promise.all(images.map(async img=>{
   if(!img.complete)await new Promise<void>(resolve=>{
    const done=()=>resolve()
    img.addEventListener('load',done,{once:true,signal})
    img.addEventListener('error',done,{once:true,signal})
    signal.addEventListener('abort',done,{once:true})
   })
   if(signal.aborted)return false
   if(!img.naturalWidth)return false
   try{await img.decode();return true}catch{return false}
  }))
  if(!disposed && current===generation)root.dataset.mediaState=results.every(Boolean)?'ready':'error'
 }
 const observer=new MutationObserver(refresh)
 observer.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['src','srcset','media']})
 const resize=()=>{void refresh()}
 window.addEventListener('resize',resize)
 void refresh()
 return ()=>{disposed=true;generation++;controller?.abort();observer.disconnect();window.removeEventListener('resize',resize)}
}
export const vMediaReady:ObjectDirective<HTMLElement>={
 getSSRProps:()=>({'data-media-state':'loading'}),
 beforeMount:el=>{el.dataset.mediaState='loading'},
 mounted:el=>{observers.set(el,observeMedia(el))},
 beforeUnmount:el=>{observers.get(el)?.();observers.delete(el)},
}

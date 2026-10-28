import './showcase-card-layout.css'
import './chirp-card-initial.css'
type Rect = { x:number; y:number; width:number; height:number; rotation:number }
type Geometry = { pict:Rect; cred:Rect; blur:Rect; phones?:readonly Rect[] }
export function cardInitialStyle(profiles:Record<string,Geometry>, cover=false) {
 const vars:Record<string,string>={}
 for(const [profile,g] of Object.entries(profiles)){
  const reference=profile==='web'?430:264
  const values:Record<string,string>={
   px:g.pict.x+'px',py:g.pict.y+'px',pw:g.pict.width+'px',ph:g.pict.height+'px',
   rotation:-g.pict.rotation+'deg',reference:reference+'px',ch:g.cred.height+'px',
   bx:g.blur.x+'px',by:g.blur.y+'px',bw:g.blur.width+'px',bh:g.blur.height+'px',
   cover:cover&&profile!=='web'?'max(1, calc(100cqw / '+g.pict.width+'px))':'1',
  }
  g.phones?.forEach((p,i)=>Object.entries({x:p.x+'px',y:p.y+'px',w:p.width+'px',h:p.height+'px',r:-p.rotation+'deg'}).forEach(([key,value])=>values['phone'+i+key]=value))
  for(const [key,value]of Object.entries(values))vars['--'+profile+'-'+key]=value
 }
 return vars
}
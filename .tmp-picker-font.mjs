import { chromium } from 'playwright'
const b=await chromium.launch()
const p=await b.newPage()
await p.goto('http://127.0.0.1:6006/iframe.html?id=compositions-showcase-cards-dcpickerapp-ux--sandbox&viewMode=story')
await p.locator('h2').waitFor()
console.log(await p.locator('h2').evaluate(async t=>{
 const s=getComputedStyle(t)
 await document.fonts.load(`${s.fontWeight} ${s.fontSize} ${s.fontFamily}`,'Picker')
 const session=await Promise.resolve(null)
 return {font:s.font,fontVariation:s.fontVariationSettings,faces:[...document.fonts].map(f=>({family:f.family,status:f.status})),title:t.innerText}
}))
const cdp=await p.context().newCDPSession(p)
await cdp.send('DOM.enable');await cdp.send('CSS.enable')
const {root}=await cdp.send('DOM.getDocument')
const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:'h2'})
console.log(await cdp.send('CSS.getPlatformFontsForNode',{nodeId}))
await b.close()

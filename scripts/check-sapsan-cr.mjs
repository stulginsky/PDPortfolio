import {chromium} from 'playwright'
import fs from 'node:fs'
import assert from 'node:assert/strict'
const dir='E:/GitHub/PDPortfolio-DS/ds/evidence/sapsan-cr-2026-10-30'
const source=JSON.parse(fs.readFileSync(dir+'/state.json','utf8'))
const bounds=JSON.parse(fs.readFileSync(dir+'/png-bounds.json','utf8'))
const browser=await chromium.launch({headless:true}),report=[],errors=[]
try{
 const page=await browser.newPage({reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message))
 for(const width of [320,370,393,410,425,461,462,534,768,1920]){
  await page.setViewportSize({width,height:900})
  await page.goto('http://localhost:6006/iframe.html?id=compositions-showcase-cards-sapsancr--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'})
  const card=page.locator('.sapsan-cr');await card.waitFor();await card.locator('img').evaluateAll(es=>Promise.all(es.map(i=>i.decode())))
  assert.equal(await card.locator('a').count(),0);assert.equal(await card.locator('li').count(),6)
  const box=await card.boundingBox();assert.equal(box.height,width>=462?532:500)
  const profile=width>=462?'min-768':'base',art=card.locator('.sapsan-cr__art[data-profile="'+profile+'"]'),states=[]
  assert.equal(await art.evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).a),1)
  for(const [si,state] of ['Default','Hover','ActivePressed'].entries()){
   if(si===0)await page.mouse.move(0,850);if(si===1)await card.hover();if(si===2)await page.mouse.down()
   await page.waitForFunction(s=>document.querySelector('.sapsan-cr').dataset.state===s,state)
   const original=source[(width>=462?3:0)+si].pict.children
   const my=original.find(n=>n.name==='my'),expected=[original[0],original[1],...original.filter(n=>['book-shadow','book'].includes(n.name)).map(n=>n.children[1]),my.children[0],...my.children[1].children]
   const actual=await card.locator(':scope > [data-profile="'+profile+'"] > .sapsan-cr__layer').evaluateAll(es=>es.map(e=>{const s=getComputedStyle(e),m=new DOMMatrix(s.transform);return {x:m.e,y:m.f,w:Math.hypot(m.a,m.b)*100,h:Math.hypot(m.c,m.d)*100,angle:Math.atan2(m.b,m.a)*180/Math.PI,name:e.dataset.layer}}))
   assert.equal(actual.length,9)
   actual.forEach((f,i)=>{let e=i===0&&width<462&&si===0?{...expected[i],y:0,w:375,h:500}:expected[i];if(i===0){const cover=Math.max(1,box.width/(e.x+e.w));e={...e,x:e.x*cover,y:e.y*cover,w:e.w*cover,h:e.h*cover};}for(const [a,b]of [[f.x,e.x],[f.y,e.y],[f.w,e.w],[f.h,e.h],[f.angle,-e.rotation]])assert.ok(Math.abs(a-b)<.05,JSON.stringify({width,state,i,a,b}))})
   const sky=await card.locator('.sapsan-cr__sky[data-profile="'+profile+'"] [data-layer="sky"]').boundingBox();assert.ok(sky.x<=box.x+.05&&sky.y<=box.y+.05&&sky.x+sky.width>=box.x+box.width-.05&&sky.y+sky.height>=box.y+box.height-.05,JSON.stringify({width,state,sky,box}))
   const pngFrames=await art.locator('[data-layer="book"],[data-layer="book-shadow"]').evaluateAll((es,state)=>es.map(e=>{const p=getComputedStyle(e),pm=new DOMMatrix(p.transform),img=e.querySelector('[data-texture="'+state+'"] img'),im=new DOMMatrix(getComputedStyle(img).transform),m=pm.multiply(im);return {name:e.dataset.layer,x:m.e,y:m.f,w:img.width,h:img.height,a:m.a,b:m.b,c:m.c,d:m.d}}),state)
   const ref=bounds[(width>=462?3:0)+si];for(const f of pngFrames){const r=ref.layers.find(l=>l.name===f.name).render;assert.ok(Math.abs(f.x-(r.x-ref.origin[0]))<.05);assert.ok(Math.abs(f.y-(r.y-ref.origin[1]))<.05);for(const [a,b]of [[f.a,1],[f.b,0],[f.c,0],[f.d,1]])assert.ok(Math.abs(a-b)<.0001);assert.equal(f.w,Math.ceil(r.width));assert.equal(f.h,Math.ceil(r.height))}
   if([320,370,425,462,534].includes(width))await card.screenshot({path:dir+'/'+width+'-'+state+'.png'})
   states.push({state,actual,pngFrames})
  }
  await page.mouse.up();await page.mouse.move(0,850);await card.evaluate(e=>e.blur())
  const badgeBoxes=await card.locator('li').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}}));for(const b of badgeBoxes)assert.ok(b.x>=box.x&&b.x+b.w<=box.x+box.width+.1&&b.y+b.h<=box.y+box.height+.1)
  report.push({width,states})
 }
 await page.emulateMedia({reducedMotion:'no-preference'});const card=page.locator('.sapsan-cr'),art=card.locator('.sapsan-cr__art[data-profile="min-768"]')
 await card.hover();await page.waitForTimeout(90)
 const mid=await art.locator('[data-layer="book"] .sapsan-cr__texture').evaluateAll(es=>es.map(e=>+getComputedStyle(e).opacity));assert.ok(mid.some(v=>v>0&&v<1));assert.ok(Math.abs(mid.reduce((a,b)=>a+b,0)-1)<.01)
 await page.mouse.move(0,850);await page.waitForTimeout(450);assert.equal(await card.getAttribute('data-state'),'Default')
 await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});const issues=await page.evaluate(async()=>(await axe.run('.sapsan-cr')).violations.map(v=>v.id));assert.deepEqual(issues,[])
 const touch=await browser.newContext({viewport:{width:320,height:812},hasTouch:true,isMobile:true,reducedMotion:'reduce'}),tp=await touch.newPage();await tp.goto('http://localhost:6006/iframe.html?id=compositions-showcase-cards-sapsancr--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'});await tp.locator('.sapsan-cr').tap();assert.equal(await tp.locator('.sapsan-cr').getAttribute('data-state'),'Default');await touch.close()
 assert.deepEqual(errors,[]);fs.writeFileSync(dir+'/verification.json',JSON.stringify({report,issues,errors,maskCrossfade:true,reversal:true,touch:true,skyCoverage:true,nativeForegroundScale:true},null,2));console.log('10 widths ×3 states:9 native layer frames,sky coverage,native foreground size,PNG placement,assets,badges,crossfade/reversal,touch,axe0 passed')
}finally{await browser.close()}

import {chromium} from 'playwright'
import fs from 'node:fs'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
const dir='E:/GitHub/PDPortfolio-DS/ds/evidence/4real-3dweapon-2026-10-31',source=JSON.parse(fs.readFileSync(dir+'/source.json','utf8'))
assert.ok(JSON.parse(fs.readFileSync('content/4real-3dweapon.json','utf8')).title.startsWith('CS2 '),'Card title must use the current CS2 brand')
const assets=source.frames.map((f,i)=>{const file='frame-'+String(i+1).padStart(2,'0')+'.png',b=fs.readFileSync('public/showcase/4real-3dweapon/ak-47/'+file);assert.equal(crypto.createHash('sha1').update(b).digest('hex'),f.hash);assert.equal(b.readUInt32BE(16),945);assert.equal(b.readUInt32BE(20),564);return {file,hash:f.hash,bytes:b.length}})
const browser=await chromium.launch({headless:true}),report=[],errors=[]
try{
 const page=await browser.newPage({reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message))
 for(const width of [320,370,393,410,425,461,462,534,768,1920]){
  await page.setViewportSize({width,height:900});await page.mouse.move(0,850)
  await page.goto('http://localhost:6006/iframe.html?id=compositions-showcase-cards-4real3dweapon--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'})
  const card=page.locator('.card-4real-3dweapon');await card.waitFor();await page.waitForFunction(()=>document.querySelector('.card-4real-3dweapon').dataset.sequence==='ready')
  assert.equal(await card.locator('a').count(),0);assert.equal(await card.locator('li').count(),3);assert.equal(await card.locator('img').count(),18)
  const profile=width>=462?'min-768':'base',art=card.locator('[data-profile="'+profile+'"]'),root=await card.boundingBox(),ab=await art.boundingBox();assert.equal(root.height,width>=462?532:500);assert.equal(ab.width,width>=462?430:288);assert.ok(Math.abs(ab.x+ab.width/2-root.x-root.width/2)<.05)
  const states=[]
  for(const [si,state]of ['Default','Hover','ActivePressed'].entries()){
   if(si===1)await card.hover();if(si===2)await page.mouse.down()
   await page.waitForFunction(s=>document.querySelector('.card-4real-3dweapon').dataset.state===s,state)
   const ref=source.variants[(width>=462?4:0)+si].pict.find(n=>n.type!=='RECTANGLE')
   const actual=await art.locator('.card-4real-3dweapon__weapon').evaluate(e=>{const m=new DOMMatrix(getComputedStyle(e).transform);return {x:m.e,y:m.f,w:m.a*945,h:m.d*564}})
   for(const k of ['x','y','w','h'])assert.ok(Math.abs(actual[k]-ref[k])<.05,JSON.stringify({width,state,k,actual:actual[k],expected:ref[k]}))
   assert.equal(await card.getAttribute('data-frame'),'1');assert.equal(await art.locator('.card-4real-3dweapon__frame').evaluateAll(es=>es.filter(e=>getComputedStyle(e).visibility==='visible').length),1)
   assert.equal(await art.locator('.card-4real-3dweapon__stripe').evaluate(e=>getComputedStyle(e).clipPath),si===2?'inset(0px 50%)':'inset(0px 0%)',JSON.stringify({width,state,actualState:await card.getAttribute('data-state'),reduce:await page.evaluate(()=>matchMedia('(prefers-reduced-motion:reduce)').matches)}))
   const boxes=await card.locator('.card-4real-3dweapon__copy,li,h2,p').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}}));for(const b of boxes)assert.ok(b.x>=root.x&&b.x+b.w<=root.x+root.width+.1&&b.y>=root.y&&b.y+b.h<=root.y+root.height+.1)
   if([320,425,534].includes(width))await card.screenshot({path:dir+'/'+width+'-'+state+'.png'})
   states.push({state,actual})
  }
  await page.mouse.up();await page.mouse.move(0,850);await card.evaluate(e=>e.blur());report.push({width,states})
 }
 await page.emulateMedia({reducedMotion:'no-preference'});const card=page.locator('.card-4real-3dweapon'),art=card.locator('[data-profile="min-768"]'),weapon=art.locator('.card-4real-3dweapon__weapon'),urls=await card.locator('img').evaluateAll(es=>es.map(i=>i.currentSrc))
 const trace=page.evaluate(()=>new Promise(resolve=>{const root=document.querySelector('.card-4real-3dweapon'),frames=[+root.dataset.frame],observer=new MutationObserver(()=>{const n=+root.dataset.frame;if(n!==frames.at(-1))frames.push(n)});observer.observe(root,{attributes:true,attributeFilter:['data-frame']});setTimeout(()=>{observer.disconnect();resolve(frames)},900)}))
 await card.hover();await page.waitForTimeout(40);const mid=await weapon.evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).e);assert.ok(mid<-266.1&&mid>-578.9,'zoom must interpolate, not jump')
 const frames=await trace;assert.deepEqual(frames,[1,2,3,4,5,6,7,8,9]);await page.waitForFunction(()=>document.querySelector('.card-4real-3dweapon').dataset.animating==='false')
 await page.waitForTimeout(100);assert.equal(await card.getAttribute('data-frame'),'9')
 await card.screenshot({path:dir+'/534-hover-frame09.png'})
 await page.mouse.down();await page.waitForFunction(()=>document.querySelector('.card-4real-3dweapon').dataset.animating==='false');assert.equal(await card.getAttribute('data-frame'),'9');assert.equal(await art.locator('.card-4real-3dweapon__stripe').evaluate(e=>getComputedStyle(e).clipPath),'inset(0px 50%)')
 await page.mouse.up();await page.waitForFunction(()=>document.querySelector('.card-4real-3dweapon').dataset.animating==='false');assert.equal(await card.getAttribute('data-frame'),'9')
 await page.mouse.move(0,850);await page.waitForFunction(()=>document.querySelector('.card-4real-3dweapon').dataset.animating==='false');assert.equal(await card.getAttribute('data-frame'),'1');assert.equal(await card.getAttribute('data-animating'),'false')
 await card.hover();await page.waitForTimeout(105);const partial=+(await card.getAttribute('data-frame'));assert.ok(partial>1&&partial<9)
 await page.mouse.move(0,850);const reversalStart=+(await card.getAttribute('data-frame'));assert.ok(reversalStart<=partial&&reversalStart<9)
 await page.waitForTimeout(40);const reverseFrame=+(await card.getAttribute('data-frame'));assert.ok(reverseFrame<=reversalStart)
 await card.hover();await page.waitForTimeout(360);assert.equal(await card.getAttribute('data-frame'),'9');assert.deepEqual(await card.locator('img').evaluateAll(es=>es.map(i=>i.currentSrc)),urls)
 await page.mouse.move(0,850);await page.waitForFunction(()=>document.querySelector('.card-4real-3dweapon').dataset.animating==='false')
 await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});const issues=await page.evaluate(async()=>(await axe.run('.card-4real-3dweapon')).violations.map(v=>v.id));assert.deepEqual(issues,[])
 const touch=await browser.newContext({viewport:{width:320,height:812},hasTouch:true,isMobile:true}),tp=await touch.newPage();await tp.goto('http://localhost:6006/iframe.html?id=compositions-showcase-cards-4real3dweapon--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'});await tp.locator('.card-4real-3dweapon').tap();assert.equal(await tp.locator('.card-4real-3dweapon').getAttribute('data-state'),'Default');assert.equal(await tp.locator('.card-4real-3dweapon').getAttribute('data-frame'),'1');await touch.close()
 const failed=await browser.newPage();await failed.route('**/ak-47/frame-04.png',r=>r.abort());await failed.goto('http://localhost:6006/iframe.html?id=compositions-showcase-cards-4real3dweapon--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'});await failed.waitForFunction(()=>document.querySelector('.card-4real-3dweapon').dataset.sequence==='error');await failed.locator('.card-4real-3dweapon').hover();await failed.waitForTimeout(350);assert.equal(await failed.locator('.card-4real-3dweapon').getAttribute('data-frame'),'1');await failed.close()
 assert.deepEqual(errors,[]);fs.writeFileSync(dir+'/verification.json',JSON.stringify({assets,report,frames,partial,reversalStart,reverseFrame,issues,errors,touch:true,failedFrameFallback:true,stableSources:true},null,2));console.log('10 widths×3 states;original9PNG hashes,predecode,01→09 once,partial reversal,no press restart,smooth zoom,stripe,touch,reduced-motion,error fallback,axe0 passed')
}finally{await browser.close()}

import {chromium} from 'playwright'
import fs from 'node:fs'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const dir='E:/GitHub/PDPortfolio-DS/ds/evidence/dragon-heart-jw-2026-11-02'
const source=JSON.parse(fs.readFileSync(dir+'/source.json','utf8'))
const assets=['sky','moon','cloud','mountain','pendant'].map(name=>{
 const file='public/showcase/dragon-heart-jw/'+name+'.png',b=fs.readFileSync(file)
 return {name,file,bytes:b.length,w:b.readUInt32BE(16),h:b.readUInt32BE(20),sha256:crypto.createHash('sha256').update(b).digest('hex')}
})
const browser=await chromium.launch({headless:true}),report=[],errors=[]
const url='http://localhost:6006/iframe.html?id=compositions-showcase-cards-dragonheart-jw--sandbox&viewMode=story&embed=true'
try{
 const p=await browser.newPage({reducedMotion:'reduce'});p.on('pageerror',e=>errors.push(e.message))
 for(const width of [320,370,393,410,425,461,462,534,768,1920]){
  await p.setViewportSize({width,height:900});await p.mouse.move(0,850)
  await p.goto(url,{waitUntil:'networkidle'});const card=p.locator('.dragon-heart-jw')
  await card.locator('img').evaluateAll(es=>Promise.all(es.map(i=>i.decode())))
  assert.equal(await card.locator('a').count(),0);assert.equal(await card.locator('li').count(),4)
  const profile=width>=462?'min-768':'base',art=card.locator('[data-profile="'+profile+'"]')
  const root=await card.boundingBox(),stage=await art.boundingBox(),extra=Math.max(0,(root.width-stage.width)/2)
  assert.equal(root.width,Math.min(430,width-32));assert.equal(root.height,width>=462?532:500)
  assert.ok(Math.abs(stage.x+stage.width/2-root.x-root.width/2)<.05)
  const urls=await card.locator('img').evaluateAll(es=>es.map(i=>i.currentSrc))
  for(const [index,state]of ['Default','Hover','ActivePressed'].entries()){
   if(index===1)await card.hover();if(index===2)await p.mouse.down()
   assert.equal(await card.getAttribute('data-state'),state)
   const expected=source.variants.find(v=>v.name===`Breakpoint=${profile}, State=${state}`)
   const actual=await art.locator('[data-layer]').evaluateAll(es=>es.map(e=>{const s=getComputedStyle(e),m=new DOMMatrix(s.transform);return {name:e.dataset.layer,x:m.e,y:m.f,w:parseFloat(s.width)*m.a,h:parseFloat(s.height)*m.d,opacity:+s.opacity}}))
   for(const n of expected.layers){const a=actual.find(l=>l.name===n.name),edge=['sky','Mountain','shader'].includes(n.name)
    for(const k of ['x','y','w','h']){const value=n[k]+(edge?(k==='x'?-extra:k==='w'?2*extra:0):0);assert.ok(Math.abs(a[k]-value)<.06,JSON.stringify({width,state,layer:n.name,k,actual:a[k],value}))}
    assert.ok(Math.abs(a.opacity-(n.fills[0].opacity??1))<.001)
   }
   assert.equal(await card.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(40, 46, 58)')
   const boxes=await card.locator('h2,p,li').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,w:b.width,h:b.height}}))
   for(const b of boxes)assert.ok(b.x>=root.x&&b.x+b.w<=root.x+root.width+.1&&b.y+b.h<=root.y+root.height+.1)
   const badge=card.locator(width>=462?'.dragon-heart-jw__badge-default .ds-badge__text':'.dragon-heart-jw__badge-base .ds-badge__text').first()
   assert.equal(await badge.evaluate(e=>parseFloat(getComputedStyle(e).fontSize)),width>=462?12:10)
   assert.deepEqual(await card.locator('img').evaluateAll(es=>es.map(i=>i.currentSrc)),urls)
   if([320,425,534].includes(width))await card.screenshot({path:dir+`/${width}-${state}.png`})
   report.push({width,state,layers:actual})
  }
  await p.mouse.up();await p.mouse.move(0,850);await card.evaluate(e=>e.blur())
 }
 await p.setViewportSize({width:534,height:900});await p.goto(url,{waitUntil:'networkidle'});await p.emulateMedia({reducedMotion:'no-preference'})
 const card=p.locator('.dragon-heart-jw'),pendant=card.locator('[data-profile="min-768"] [data-layer=pendant]')
 await card.hover();await p.waitForTimeout(65)
 const mid=(await pendant.boundingBox()).width;assert.ok(mid>317.8&&mid<469.9,'Hover interpolates')
 await p.mouse.move(0,850);const start=(await pendant.boundingBox()).width;assert.ok(start<470,'Return starts from current width')
 await p.waitForFunction(()=>document.querySelector('.dragon-heart-jw').dataset.animating==='false');assert.ok(Math.abs((await pendant.boundingBox()).width-317.6979)<.1)
 await card.hover();await p.waitForFunction(()=>document.querySelector('.dragon-heart-jw').dataset.animating==='false');await p.mouse.down()
 assert.equal(await pendant.evaluate(e=>getComputedStyle(e).transitionProperty),'filter')
 await p.waitForFunction(()=>document.querySelector('.dragon-heart-jw').dataset.animating==='false');await p.mouse.up()
 await card.dispatchEvent('pointercancel');assert.equal(await card.getAttribute('data-state'),'Default')
 await p.mouse.move(0,850);await p.waitForFunction(()=>document.querySelector('.dragon-heart-jw').dataset.animating==='false')
 await p.addScriptTag({path:'node_modules/axe-core/axe.min.js'});const violations=await p.evaluate(async()=>(await axe.run('.dragon-heart-jw')).violations.map(v=>v.id));assert.deepEqual(violations,[])
 const context=await browser.newContext({viewport:{width:320,height:812},isMobile:true,hasTouch:true}),tp=await context.newPage();await tp.goto(url,{waitUntil:'networkidle'})
 await tp.locator('.dragon-heart-jw').tap();assert.equal(await tp.locator('.dragon-heart-jw').getAttribute('data-state'),'Default');await context.close()
 assert.deepEqual(errors,[])
 fs.writeFileSync(dir+'/verification.json',JSON.stringify({assets,report,errors,violations,touch:true,interruption:true},null,2))
 console.log('PASS:10 widths ×3 states, original assets/crop slots, compact mobile badges, geometry, pointer/touch, interruption, timing, axe0')
}finally{await browser.close()}

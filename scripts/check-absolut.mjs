import {chromium} from 'playwright'
import fs from 'node:fs'
import assert from 'node:assert/strict'
const source=[["",[-214.947265625,-109,419,758],[-110.947265625,16,548.3790283203125,407.0000305175781,0]],["Hover",[-109,0,276,499],[-269,80.4801254272461,706.4466552734375,524.31591796875,-16.401771044335604]],["ActivePressed",[-173.81884765625,-51,355,643],[-155.86572265625,22.3564453125,588.1729125976562,436.5345764160156,-3.402857737828132]],["",[-152,-117,448,810],[-41,17,586.1052856445312,435.0000305175781,0]],["Hover",[-41,0,294,532],[-210.79859924316406,54.92753601074219,753.0857543945312,558.9308471679688,-13.305991125934431]],["ActivePressed",[-128,-53,382,690],[-109.36186981201172,25.170001983642578,632,469,-3.402857737828132]]]
const dir='E:/GitHub/PDPortfolio-DS/ds/evidence/absolut-2026-10-30'
fs.mkdirSync(dir,{recursive:true})
const browser=await chromium.launch({headless:true}),report=[]
try{
 const page=await browser.newPage({reducedMotion:'reduce'}),errors=[]
 page.on('pageerror',e=>errors.push(e.message))
 for(const width of [320,370,425,461,462,534,768,1920]){
  await page.setViewportSize({width,height:900})
  await page.goto('http://localhost:6006/iframe.html?id=compositions-showcase-cards-absolut--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'})
  const card=page.locator('.absolut');await card.waitFor();await card.locator('img').evaluateAll(async es=>Promise.all(es.map(i=>i.decode())))
  assert.equal(await card.locator('img').count(),2);assert.equal(await card.locator('a').count(),0);assert.equal(await card.locator('li').count(),7)
  const r=await card.boundingBox();assert.equal(r.height,width>=462?532:500)
  const states=[]
  for(const [i,state] of ['Default','Hover','ActivePressed'].entries()){
   if(i===0)await page.mouse.move(0,850)
   if(i===1)await card.hover()
   if(i===2)await page.mouse.down()
   await page.waitForFunction(s=>document.querySelector('.absolut').dataset.state===s,state)
   const actual=await card.locator('img').evaluateAll(es=>es.map(e=>{const s=getComputedStyle(e),m=new DOMMatrix(s.transform);return {x:parseFloat(s.left),y:parseFloat(s.top),w:parseFloat(s.width),h:parseFloat(s.height),angle:Math.atan2(m.b,m.a)*180/Math.PI,src:e.currentSrc}}))
   const expected=source[(width>=462?3:0)+i]
   const front=expected[2],angle=front[4]*Math.PI/180,ax=881/1536,ay=51/1140
   const expectedAnchorY=front[1]+Math.sin(angle)*front[2]*ax+Math.cos(angle)*front[3]*ay
   const alignedFront=[expected[1][0]+expected[1][2]-front[2]*ax,expectedAnchorY-front[3]*ay,front[2],front[3],front[4]]
   for(let layer=0;layer<2;layer++)for(let j=0;j<5;j++){const a=Object.values(actual[layer])[j],v=(layer?alignedFront:[...expected[1],0])[j];assert.ok(Math.abs(a-v)<.03,JSON.stringify({width,state,layer,a,v}))}
   if([320,462].includes(width))await card.screenshot({path:dir+'/'+width+'-'+state+'.png'})
   states.push({state,actual})
  }
  await page.mouse.up();await page.mouse.move(0,850);await card.evaluate(e=>e.blur());assert.equal(await card.getAttribute('data-state'),'Default')
  const badges=await card.locator('li').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}}))
  for(const box of badges)assert.ok(box.x>=r.x&&box.x+box.w<=r.x+r.width+.1&&box.y+box.h<=r.y+r.height+.1)
  report.push({width,states})
 }
 await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('.absolut').hover();await page.waitForTimeout(100)
 const mid=await page.locator('.absolut__image-15').evaluate(e=>getComputedStyle(e).width)
 await page.waitForTimeout(260);assert.notEqual(mid,await page.locator('.absolut__image-15').evaluate(e=>getComputedStyle(e).width))
 await page.mouse.move(0,850);await page.waitForTimeout(350)
 await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'})
 const issues=await page.evaluate(async()=>(await axe.run('.absolut')).violations.map(v=>({id:v.id,impact:v.impact})));assert.deepEqual(issues,[])
 const touch=await browser.newContext({viewport:{width:320,height:812},hasTouch:true,isMobile:true,reducedMotion:'reduce'}),tp=await touch.newPage()
 await tp.goto('http://localhost:6006/iframe.html?id=compositions-showcase-cards-absolut--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'});await tp.locator('.absolut').tap();assert.equal(await tp.locator('.absolut').getAttribute('data-state'),'Default');await touch.close()
 assert.deepEqual(errors,[]);fs.writeFileSync(dir+'/verification.json',JSON.stringify({report,issues,errors,intermediate:true,touch:true},null,2))
 console.log('8 widths x3 states x2 images:original frames/rotation,badge bounds,motion,touch,axe0,no navigation/errors passed')
}finally{await browser.close()}

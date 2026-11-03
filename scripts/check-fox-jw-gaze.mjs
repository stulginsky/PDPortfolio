import {chromium} from 'playwright'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const dir='E:/GitHub/PDPortfolio-DS/ds/evidence/fox-jw-2026-11-02'
const url='http://localhost:6006/iframe.html?id=compositions-showcase-cards-fox-jw--sandbox&viewMode=story&embed=true'
const browser=await chromium.launch({headless:true}),report=[]
const offset=card=>card.evaluate(e=>{
 const profile=innerWidth<462?'base':'min-768',layer=e.querySelector(`[data-profile="${profile}"] [data-layer=eyes02]`),gaze=layer.querySelector('.fox-jw__gaze'),a=new DOMMatrix(getComputedStyle(layer).transform),b=new DOMMatrix(getComputedStyle(gaze).transform)
 return {x:b.e*a.a,y:b.f*a.d,pupils:layer.querySelectorAll('[data-pupil]').length,state:e.dataset.state}
})
try{
 for(const width of [320,425,534]){
  const p=await browser.newPage({viewport:{width,height:900}})
  await p.goto(url,{waitUntil:'networkidle'});const card=p.locator('.fox-jw');await card.locator('img').evaluateAll(es=>Promise.all(es.map(i=>i.decode())))
  await card.hover();let r=await card.boundingBox()
  await p.mouse.move(r.x+r.width-24,r.y+24);await p.waitForTimeout(650);const right=await offset(card)
  assert.equal(right.pupils,2);assert(right.x>.5&&right.y<-.3);assert(Math.hypot(right.x/3,right.y/2)<=1.001)
  await card.screenshot({path:dir+`/gaze-${width}-right.png`})
  await p.mouse.move(r.x+24,r.y+r.height-24);await p.waitForTimeout(650);const left=await offset(card)
  assert(left.x<-.5&&left.y>.3);assert(Math.hypot(left.x/3,left.y/2)<=1.001)
  await p.mouse.down();await p.waitForTimeout(850);const pressed=await offset(card);assert(Math.abs(pressed.x)<.01&&Math.abs(pressed.y)<.01)
  await p.mouse.up();await p.mouse.move(0,850);await p.waitForFunction(()=>document.querySelector('.fox-jw')?.dataset.animating==='false')
  const rest=await offset(card);assert.equal(rest.x,0);assert.equal(rest.y,0)
  await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(50);await card.hover();await p.mouse.move(r.x+r.width-24,r.y+24);await p.waitForTimeout(50)
  const reduced=await offset(card);assert.equal(reduced.x,0);assert.equal(reduced.y,0)
  report.push({width,right,left,pressed,rest,reduced});await p.close()
 }
 const context=await browser.newContext({viewport:{width:320,height:812},isMobile:true,hasTouch:true}),p=await context.newPage()
 await p.goto(url,{waitUntil:'networkidle'});const card=p.locator('.fox-jw')
 await p.evaluate(()=>{document.body.style.minHeight='2400px';window.gazeClicks=[];window.gazeCancels=0;document.addEventListener('click',e=>{if(e.target.closest('.fox-jw'))window.gazeClicks.push(e.defaultPrevented)});document.querySelector('.fox-jw').addEventListener('pointercancel',()=>window.gazeCancels++)})
 const cdp=await context.newCDPSession(p),r=await card.boundingBox(),start={x:r.x+r.width/2,y:r.y+250,id:1}
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});await p.waitForTimeout(500)
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:r.x+r.width-10,y:start.y-80,id:1}]});await p.waitForTimeout(150)
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:315,y:start.y-140,id:1}]});await p.waitForTimeout(650)
 const touch=await offset(card),scroll=await p.evaluate(()=>scrollY),cancels=await p.evaluate(()=>window.gazeCancels)
 assert.equal(touch.state,'ActivePressed');assert(touch.x>.5);assert(Math.hypot(touch.x/3,touch.y/2)<=1.001);assert(scroll>0,'Native page scrolling must remain enabled');assert(cancels>0,'Native scroll must transfer pointer control while Touch Events keep gaze alive')
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForFunction(()=>document.querySelector('.fox-jw')?.dataset.animating==='false')
 const ended=await offset(card);assert.equal(ended.state,'Default');assert.equal(ended.x,0);assert.equal(ended.y,0);assert.deepEqual(await p.evaluate(()=>window.gazeClicks),[])
 report.push({touch,scroll,cancels,ended,dragDoesNotClick:true});await context.close()
 fs.writeFileSync(dir+'/gaze-verification.json',JSON.stringify(report,null,2))
 console.log('PASS:bounded mouse gaze at3 widths, centered press/leave, reduced motion, native touch tracking outside card through scroll/pointercancel, release and no drag activation')
}finally{await browser.close()}

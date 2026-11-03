import {chromium} from 'playwright'
import fs from 'node:fs'
import assert from 'node:assert/strict'
const browser=await chromium.launch({headless:true}),results=[]
try{
 const page=await browser.newPage({reducedMotion:'no-preference'})
 for(const width of [320,370,425,534]){
  await page.setViewportSize({width,height:900});await page.mouse.move(0,850)
  await page.goto('http://localhost:6006/iframe.html?id=compositions-showcase-cards-sapsancr--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'})
  const card=page.locator('.sapsan-cr');await card.locator('img').evaluateAll(es=>Promise.all(es.map(i=>i.decode())));await page.waitForTimeout(450)
  const sample=page.evaluate(()=>new Promise(resolve=>{
   const root=document.querySelector('.sapsan-cr'),profile=innerWidth>=462?'min-768':'base',sky=root.querySelector('.sapsan-cr__sky[data-profile="'+profile+'"] img'),layers=[...root.querySelectorAll('.sapsan-cr__art[data-profile="'+profile+'"] > .sapsan-cr__layer')],frames=[];let start;
   function tick(t){start??=t;const r=root.getBoundingClientRect(),s=sky.getBoundingClientRect();frames.push({t:t-start,state:root.dataset.state,gap:Math.max(s.left-r.left,s.top-r.top,r.right-s.right,r.bottom-s.bottom),layers:layers.map(e=>{const m=new DOMMatrix(getComputedStyle(e).transform);return [m.e,m.f,m.a,m.b,m.c,m.d]})});if(t-start<1500)requestAnimationFrame(tick);else resolve(frames)}requestAnimationFrame(tick)
  }))
  await card.hover();await page.waitForTimeout(90);await page.mouse.down();await page.waitForTimeout(90);await page.mouse.up();await page.waitForTimeout(90);await page.mouse.move(0,850);await page.waitForTimeout(90);await card.hover();await page.waitForTimeout(90);await page.mouse.move(0,850)
  const frames=await sample;assert.ok(frames.length>20);assert.ok(frames.every(f=>f.gap<.06),JSON.stringify({width,gap:Math.max(...frames.map(f=>f.gap))}));assert.ok(new Set(frames.map(f=>f.state)).size===3)
  const style=await card.locator('.sapsan-cr__art[data-profile="'+(width>=462?'min-768':'base')+'"] > .sapsan-cr__layer').evaluateAll(es=>es.map(e=>{const s=getComputedStyle(e);return {properties:s.transitionProperty,duration:s.transitionDuration,easing:s.transitionTimingFunction}}));assert.ok(style.every(s=>s.properties==='transform'&&s.duration==='0.4s'))
  let movement=0;for(let i=1;i<frames.length;i++)movement+=Math.abs(frames[i].layers[0][0]-frames[i-1].layers[0][0]);assert.ok(movement>1)
  results.push({width,count:frames.length,maxGap:Math.max(...frames.map(f=>f.gap)),maxFrameMs:Math.max(...frames.slice(1).map((f,i)=>f.t-frames[i].t)),style,frames})
 }
 fs.writeFileSync('E:/GitHub/PDPortfolio-DS/ds/evidence/sapsan-cr-2026-10-30/motion-coverage.json',JSON.stringify(results,null,2));console.log('4 widths:continuous hover/press/release/reversal,transform-only400ms,sky fully covered; '+results.reduce((s,r)=>s+r.count,0)+' frames sampled')
}finally{await browser.close()}

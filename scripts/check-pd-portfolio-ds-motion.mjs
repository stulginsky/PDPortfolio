import {chromium} from 'playwright'
import fs from 'node:fs'
import assert from 'node:assert/strict'
const browser=await chromium.launch({headless:true}),results=[]
try{
 const page=await browser.newPage({reducedMotion:'no-preference'})
 for(const width of [320,425,534,1920]){
  await page.setViewportSize({width,height:900});await page.mouse.move(0,850)
  await page.goto('http://localhost:6006/iframe.html?id=compositions-showcase-cards-pdportfoliods--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'})
  const card=page.locator('.pd-portfolio-ds');await card.locator('img').evaluateAll(es=>Promise.all(es.map(i=>i.decode())))
  const urls=await card.locator('img').evaluateAll(es=>es.map(i=>i.currentSrc))
  const sample=page.evaluate(()=>new Promise(resolve=>{
   const root=document.querySelector('.pd-portfolio-ds'),profile=innerWidth>=462?'min-768':'base',art=root.querySelector('[data-profile="'+profile+'"]'),green=art.querySelector('[data-layer="green-square"]'),startMatrix=new DOMMatrix(getComputedStyle(green).transform),startAngle=Math.atan2(startMatrix.b,startMatrix.a)*180/Math.PI,frames=[];let start;
   function tick(t){start??=t;const m=new DOMMatrix(getComputedStyle(green).transform),angle=Math.atan2(m.b,m.a)*180/Math.PI;frames.push({t:t-start,state:root.dataset.state,rotationDelta:((angle-startAngle+540)%360)-180});if(t-start<1300)requestAnimationFrame(tick);else resolve(frames)}requestAnimationFrame(tick)
  }))
  await card.hover();await page.waitForTimeout(350);await page.mouse.down();await page.waitForTimeout(90);await page.mouse.up();await page.waitForTimeout(90);await page.mouse.move(0,850)
  const frames=await sample;assert.ok(frames.length>20);assert.ok(new Set(frames.map(f=>f.state)).size===3);assert.ok(frames.every(f=>f.rotationDelta>=-51.1&&f.rotationDelta<=.1));assert.ok(frames.some(f=>f.rotationDelta<-50));assert.ok(Math.abs(frames.at(-1).rotationDelta)<.05)
  assert.deepEqual(await card.locator('img').evaluateAll(es=>es.map(i=>i.currentSrc)),urls)
  results.push({width,frames:frames.length,maxFrameMs:Math.max(...frames.slice(1).map((f,i)=>f.t-frames[i].t)),trace:frames})
 }
 fs.writeFileSync('E:/GitHub/PDPortfolio-DS/ds/evidence/pd-portfolio-ds-2026-10-31/motion.json',JSON.stringify(results,null,2));console.log('4 widths:per-frame shortest rotation,hover/press/release/reversal,stable SVG assets; '+results.reduce((s,r)=>s+r.frames,0)+' frames')
}finally{await browser.close()}

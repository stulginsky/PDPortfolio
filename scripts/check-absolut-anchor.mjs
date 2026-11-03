import {chromium} from 'playwright'
import fs from 'node:fs'
import assert from 'node:assert/strict'
const b=await chromium.launch({headless:true}),results=[]
try{
 const p=await b.newPage()
 for(const width of [320,370,462,768]){
  await p.setViewportSize({width,height:900})
  await p.goto('http://localhost:6006/iframe.html?id=compositions-showcase-cards-absolut--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'})
  const card=p.locator('.absolut');await card.waitFor()
  // Browser pixels are sampled every animation frame during enter, press, release,
  // exit and reversal, including the interpolated rotation and changing dimensions.
  await p.evaluate(()=>{
   window.anchorFrames=[]
   window.anchorRunning=true
   const sample=()=>{
    const root=document.querySelector('.absolut'),front=root.querySelector('.absolut__image-15'),back=root.querySelector('.absolut__image-17-1')
    const f=getComputedStyle(front),s=getComputedStyle(back),art=getComputedStyle(root.querySelector('.absolut__art'))
    const m=new DOMMatrix(f.transform),origin=f.transformOrigin.split(' ').map(parseFloat)
    const px=parseFloat(f.width)*881/1536,py=parseFloat(f.height)*51/1140
    const x=parseFloat(f.left)+origin[0]+m.a*(px-origin[0])+m.c*(py-origin[1])+m.e
    const edge=parseFloat(s.left)+parseFloat(s.width)
    window.anchorFrames.push({state:root.dataset.state,gap:(x-edge)*new DOMMatrix(art.transform).a})
    if(window.anchorRunning)requestAnimationFrame(sample)
   };requestAnimationFrame(sample)
  })
  await card.hover();await p.waitForTimeout(350)
  await p.mouse.down();await p.waitForTimeout(180)
  await p.mouse.up();await p.waitForTimeout(350)
  await p.mouse.move(0,850);await p.waitForTimeout(350)
  await card.hover();await p.waitForTimeout(80);await p.mouse.move(0,850);await p.waitForTimeout(350)
  const frames=await p.evaluate(()=>{window.anchorRunning=false;return window.anchorFrames})
  const maxGap=Math.max(...frames.map(f=>Math.abs(f.gap)))
  assert.ok(maxGap<.15,JSON.stringify({width,maxGap,frames:frames.filter(f=>Math.abs(f.gap)>.15)}))
  results.push({width,frames:frames.length,maxGap})
 }
 fs.writeFileSync('E:/GitHub/PDPortfolio-DS/ds/evidence/absolut-2026-10-30/anchor-verification.json',JSON.stringify(results,null,2))
 console.log(JSON.stringify(results))
}finally{await b.close()}

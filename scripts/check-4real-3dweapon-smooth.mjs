import {chromium} from 'playwright'
import fs from 'node:fs'
import assert from 'node:assert/strict'
import {advanceWeaponMotion,alignWeaponPose,interpolateWeaponPose} from '../app/components/4real-3dweapon.motion.ts'
import {weaponPoseAnchors} from '../app/components/4real-3dweapon.geometry.ts'
for(let i=0;i<weaponPoseAnchors.length;i++){const matrix=alignWeaponPose(weaponPoseAnchors[i],interpolateWeaponPose(weaponPoseAnchors,i)).slice(7,-1).split(',').map(Number);matrix.forEach((v,j)=>assert.ok(Math.abs(v-[1,0,0,1,0,0][j])<1e-8,'original poses must remain unchanged'))}
function simulate(hz){let v=0,speed=0;for(let i=0;i<hz/2;i++){const n=advanceWeaponMotion(v,speed,1,1/hz,14);v=n.value;speed=n.velocity;}return [v,speed]}
const sixty=simulate(60),oneTwenty=simulate(120);sixty.forEach((v,i)=>assert.ok(Math.abs(v-oneTwenty[i])<1e-10,'motion speed must not depend on refresh rate'))
const browser=await chromium.launch({headless:true}),results=[]
try{
 const page=await browser.newPage({reducedMotion:'no-preference'})
 for(const width of [320,425,534]){
  await page.setViewportSize({width,height:900});await page.mouse.move(0,850)
  await page.goto('http://localhost:6006/iframe.html?id=compositions-showcase-cards-4real3dweapon--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'})
  const card=page.locator('.card-4real-3dweapon');await page.waitForFunction(()=>document.querySelector('.card-4real-3dweapon').dataset.sequence==='ready');await page.waitForFunction(()=>document.querySelector('.card-4real-3dweapon').dataset.animating==='false')
  const trace=page.evaluate(()=>new Promise(resolve=>{const root=document.querySelector('.card-4real-3dweapon'),art=root.querySelector('[data-profile="'+(innerWidth>=462?'min-768':'base')+'"]'),weapon=art.querySelector('.card-4real-3dweapon__weapon'),images=[...art.querySelectorAll('img')],frames=[];let start;function tick(t){start??=t;const m=new DOMMatrix(getComputedStyle(weapon).transform),active=images.map((image,index)=>({index,opacity:+getComputedStyle(image).opacity,visible:getComputedStyle(image).visibility==='visible'})).filter(i=>i.visible);frames.push({t:t-start,state:root.dataset.state,frame:+root.dataset.frame,position:+root.dataset.framePosition,x:m.e,y:m.f,scale:m.a,active});if(t-start<2300)requestAnimationFrame(tick);else resolve(frames)}requestAnimationFrame(tick)}))
  await card.hover();await page.waitForTimeout(180);await page.mouse.move(0,850);await page.waitForTimeout(100);await card.hover();await page.waitForTimeout(240);await page.mouse.down();await page.waitForTimeout(120);await page.mouse.up();await page.waitForTimeout(150);await page.mouse.move(0,850)
  const frames=await trace;assert.ok(frames.length>30);assert.ok(new Set(frames.map(f=>f.state)).size===3)
  for(const f of frames){assert.ok(f.active.length>=1&&f.active.length<=2);assert.ok(Math.abs(f.active.reduce((s,a)=>s+a.opacity,0)-1)<.0001);if(f.active.length===2)assert.equal(f.active[1].index-f.active[0].index,1)}
  assert.ok(frames.some(f=>f.active.length===2&&f.active[0].opacity>.1&&f.active[0].opacity<.9),'adjacent poses must actually blend')
  for(let i=1;i<frames.length;i++)assert.ok(Math.abs(frames[i].frame-frames[i-1].frame)<=1,'no source pose jumps')
  await page.waitForFunction(()=>document.querySelector('.card-4real-3dweapon').dataset.animating==='false');assert.equal(await card.getAttribute('data-frame'),'1')
  results.push({width,frames})
 }
 fs.writeFileSync('E:/GitHub/PDPortfolio-DS/ds/evidence/4real-3dweapon-2026-10-31/smooth-motion.json',JSON.stringify({refreshRateIndependent:true,sourceKeyIdentity:true,adjacentBlend:true,results},null,2));console.log('60/120Hz geometry consistency;3 widths,rapid reversals/press/release,two adjacent poses,opacity sum1,source-key identity,no frame skips,RAF stops; '+results.reduce((s,r)=>s+r.frames.length,0)+' frames')
}finally{await browser.close()}

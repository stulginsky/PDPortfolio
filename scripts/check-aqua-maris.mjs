import {chromium} from 'playwright'
import fs from 'node:fs'
import assert from 'node:assert/strict'
const dir='E:/GitHub/PDPortfolio-DS/ds/evidence/aqua-maris-2026-10-30'
fs.mkdirSync(dir,{recursive:true})
const b=await chromium.launch({headless:true}),report=[]
const geometry={base:{Default:[-29,-40,431,0],Hover:[-249.879119873,-171.140853882,708.258605957,-15],ActivePressed:[-217.93359375,-50.980957031,567.628723145,-22.458750548]},web:{Default:[1,-20,431,0],Hover:[-192,-112.9921875,662.655822754,-15],ActivePressed:[-121.146522522,-95.554046631,580.673156738,-10.415005350]}}
try{
 const p=await b.newPage({reducedMotion:'reduce'})
 const errors=[];p.on('pageerror',e=>errors.push(e.message))
 for(const width of [320,370,425,461,462,534,768,1920]){
  await p.setViewportSize({width,height:900})
  await p.goto('http://localhost:6006/iframe.html?id=compositions-showcase-cards-aqua-maris--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'})
  const card=p.locator('.aqua-maris'),img=card.locator('img');await card.waitFor();await img.evaluate(i=>i.decode())
  const r=await card.boundingBox(),profile=width>=462?'web':'base',canvas=profile==='web'?430:288,scale=Math.max(1,r.width/canvas)
  assert.equal(r.height,width>=462?532:500)
  assert.equal(await card.locator('a').count(),0)
  assert.equal(await card.locator('li').count(),10)
  const states=[]
  for(const state of ['Default','Hover','ActivePressed']){
   if(state==='Default')await p.mouse.move(0,850)
   if(state==='Hover')await card.hover()
   if(state==='ActivePressed')await p.mouse.down()
   await p.waitForFunction(s=>document.querySelector('.aqua-maris').dataset.state===s,state)
   const matrix=await img.evaluate(e=>{const m=new DOMMatrix(getComputedStyle(e).transform);return [m.a,m.b,m.c,m.d,m.e,m.f]})
   const [x,y,w,angle]=geometry[profile][state],rad=angle*Math.PI/180,z=w/431*scale
   const expected=[Math.cos(rad)*z,Math.sin(rad)*z,-Math.sin(rad)*z,Math.cos(rad)*z,(r.width-canvas*scale)/2+x*scale,y*scale]
   for(let i=0;i<6;i++)assert.ok(Math.abs(matrix[i]-expected[i])<.02,JSON.stringify({width,state,matrix,expected}))
   states.push({state,matrix})
   if([320,462].includes(width))await card.screenshot({path:`${dir}/${width}-${state}.png`})
  }
  await p.mouse.up();await p.mouse.move(0,850);await card.evaluate(e=>e.blur())
  assert.equal(await card.getAttribute('data-state'),'Default')
  const boxes=await card.locator('li').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}}))
  for(const box of boxes)assert.ok(box.x>=r.x&&box.x+box.w<=r.x+r.width+.1&&box.y+box.h<=r.y+r.height+.1)
  report.push({width,profile,states})
 }
 // Check a real intermediate transition and reversal rather than swapping state bitmaps.
 await p.emulateMedia({reducedMotion:'no-preference'});await p.mouse.move(0,850)
 const card=p.locator('.aqua-maris'),img=card.locator('img')
 await card.hover();await p.waitForTimeout(100)
 const middle=await img.evaluate(e=>getComputedStyle(e).transform)
 await p.waitForTimeout(260);const end=await img.evaluate(e=>getComputedStyle(e).transform)
 assert.notEqual(middle,end)
 await p.mouse.move(0,850);await p.waitForTimeout(350)
 await card.focus();await p.keyboard.down('Space');assert.equal(await card.getAttribute('data-state'),'ActivePressed')
 await p.keyboard.up('Space');assert.equal(await card.getAttribute('data-state'),'Default')
 await p.addScriptTag({path:'node_modules/axe-core/axe.min.js'})
 const issues=await p.evaluate(async()=>(await axe.run('.aqua-maris')).violations.map(v=>({id:v.id,impact:v.impact})))
 assert.deepEqual(issues,[])
 const touch=await b.newContext({viewport:{width:320,height:812},hasTouch:true,isMobile:true,reducedMotion:'reduce'})
 const tp=await touch.newPage();await tp.goto('http://localhost:6006/iframe.html?id=compositions-showcase-cards-aqua-maris--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'})
 await tp.locator('.aqua-maris').tap();assert.equal(await tp.locator('.aqua-maris').getAttribute('data-state'),'Default');await touch.close()
 assert.deepEqual(errors,[])
 fs.writeFileSync(`${dir}/verification.json`,JSON.stringify({report,intermediate:true,touch:true,issues,errors},null,2))
 console.log('8 widths ×3 states passed:exact source matrices,badges,one img,real motion,reversal,keyboard,touch,reduced motion,axe0,no navigation/errors')
}finally{await b.close()}

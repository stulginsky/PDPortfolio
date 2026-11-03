import {chromium} from 'playwright'
import fs from 'node:fs'
import assert from 'node:assert/strict'
const dir='E:/GitHub/PDPortfolio-DS/ds/evidence/pd-portfolio-ds-2026-10-31',source=JSON.parse(fs.readFileSync(dir+'/source.json','utf8'))
const browser=await chromium.launch({headless:true}),report=[],errors=[]
try{
 const page=await browser.newPage({reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message))
 for(const width of [320,370,393,410,425,461,462,534,768,1920]){
  await page.setViewportSize({width,height:900});await page.mouse.move(0,850)
  await page.goto('http://localhost:6006/iframe.html?id=compositions-showcase-cards-pdportfoliods--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'})
  const card=page.locator('.pd-portfolio-ds');await card.locator('img').evaluateAll(es=>Promise.all(es.map(i=>i.decode())))
  assert.equal(await card.locator('li').count(),6);assert.equal(await card.locator('a').count(),0)
  const art=card.locator('[data-profile="'+(width>=462?'min-768':'base')+'"]'),root=await card.boundingBox(),ab=await art.boundingBox()
  assert.equal(root.height,width>=462?532:500);assert.equal(ab.width,width>=462?430:288);assert.ok(Math.abs(ab.x+ab.width/2-root.x-root.width/2)<.05)
  const states=[]
  for(const [si,state]of ['Default','Hover','ActivePressed'].entries()){
   if(si===1)await card.hover();if(si===2)await page.mouse.down()
   await page.waitForFunction(s=>document.querySelector('.pd-portfolio-ds').dataset.state===s,state)
   const ref=source[(width>=462?3:0)+si].layers
   const actual=await art.locator('.pd-portfolio-ds__layer').evaluateAll(es=>es.map(e=>{const s=getComputedStyle(e),m=new DOMMatrix(s.transform),img=e.querySelector('img'),r=img.getBoundingClientRect();return {name:e.dataset.layer,x:m.e,y:m.f,w:Math.hypot(m.a,m.b)*parseFloat(s.width),h:Math.hypot(m.c,m.d)*parseFloat(s.height),angle:Math.atan2(m.b,m.a)*180/Math.PI,rect:{x:r.x,y:r.y,w:r.width,h:r.height},src:img.currentSrc}}))
   assert.equal(actual.length,10)
   actual.forEach((a,i)=>{const r=ref[i],angle=-r.rotation,delta=((a.angle-angle+540)%360)-180;assert.ok(Math.abs(delta)<.01);for(const[x,y]of [[a.x,r.x],[a.y,r.y],[a.w,r.w],[a.h,r.h]])assert.ok(Math.abs(x-y)<.05,JSON.stringify({width,state,i,x,y}));const rad=angle*Math.PI/180,c=Math.cos(rad),s=Math.sin(rad),xs=[0,r.w*c,-r.h*s,r.w*c-r.h*s],ys=[0,r.w*s,r.h*c,r.w*s+r.h*c];const box={x:ab.x+r.x+Math.min(...xs),y:ab.y+r.y+Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)};for(const k of ['x','y','w','h'])assert.ok(Math.abs(a.rect[k]-box[k])<.4,JSON.stringify({width,state,name:a.name,k,actual:a.rect[k],expected:box[k]}))})
   const boxes=await card.locator('.pd-portfolio-ds__copy,li,h2,p').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}}));for(const b of boxes)assert.ok(b.x>=root.x&&b.x+b.w<=root.x+root.width+.1&&b.y>=root.y&&b.y+b.h<=root.y+root.height+.1)
   if([320,425,534].includes(width))await card.screenshot({path:dir+'/'+width+'-'+state+'.png'})
   states.push({state,actual})
  }
  await page.mouse.up();await page.mouse.move(0,850);await card.evaluate(e=>e.blur());report.push({width,states})
 }
 await page.emulateMedia({reducedMotion:'no-preference'});const card=page.locator('.pd-portfolio-ds'),art=card.locator('[data-profile="min-768"]')
 const original=await art.locator('[data-layer="green-square"]').evaluate(e=>getComputedStyle(e).transform);await card.hover();await page.waitForTimeout(80);const mid=await art.locator('[data-layer="green-square"]').evaluate(e=>getComputedStyle(e).transform);assert.notEqual(mid,original);await page.mouse.move(0,850);await page.waitForTimeout(350);assert.equal(await card.getAttribute('data-state'),'Default')
 await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});const issues=await page.evaluate(async()=>(await axe.run('.pd-portfolio-ds')).violations.map(v=>v.id));assert.deepEqual(issues,[])
 const touch=await browser.newContext({viewport:{width:320,height:812},hasTouch:true,isMobile:true,reducedMotion:'reduce'}),tp=await touch.newPage();await tp.goto('http://localhost:6006/iframe.html?id=compositions-showcase-cards-pdportfoliods--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'});await tp.locator('.pd-portfolio-ds').tap();assert.equal(await tp.locator('.pd-portfolio-ds').getAttribute('data-state'),'Default');await touch.close()
 assert.deepEqual(errors,[]);fs.writeFileSync(dir+'/verification.json',JSON.stringify({report,issues,errors,motion:true,touch:true},null,2));console.log('10 widths ×3 states ×10 original SVGs:frames/actual graphics bounds,copy/badges,no navigation,touch,reversal,axe0 passed')
}finally{await browser.close()}

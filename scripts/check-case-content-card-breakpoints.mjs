import {chromium} from 'playwright'
import fs from 'node:fs'
import assert from 'node:assert/strict'

const evidence='E:/GitHub/PDPortfolio-DS/ds/evidence/case-content-card-2026-10-27'
fs.mkdirSync(evidence,{recursive:true})
const browser=await chromium.launch({headless:true})
const report=[]
const close=(a,b,label)=>assert.ok(Math.abs(a-b)<.15,`${label}: ${a} vs ${b}`)
const widths=[320,425,534,768,821,822,933,934,1024,1279,1280,1439,1440,1919,1920]
try {
 for(const width of widths){
  const p=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'})
  const errors=[]
  p.on('pageerror',e=>errors.push(e.message))
  await p.goto('http://localhost:6006/iframe.html?id=components-casecontentcard--existing-grid&viewMode=story',{waitUntil:'networkidle'})
  await p.evaluate(()=>document.fonts.ready)
  await p.locator('.case-content-grid img').evaluateAll(async images=>{for(const image of images){image.loading='eager';await image.decode()}})
  const grids=await p.locator('.case-content-layout').evaluateAll(es=>es.map(e=>({available:e.clientWidth,x:e.getBoundingClientRect().x,cards:[...e.querySelectorAll('article')].map(c=>{
   const r=c.getBoundingClientRect(),img=c.querySelector('img'),m=img.getBoundingClientRect(),slot=c.querySelector('.case-content-card__eyebrow-slot'),s=slot.getBoundingClientRect(),title=c.querySelector('h3'),tr=title.getBoundingClientRect()
   return {x:r.x,y:r.y,w:r.width,h:r.height,media:{w:m.width,h:m.height},slot:s.height,titleGap:tr.y-s.bottom,titleFont:getComputedStyle(title).fontSize,bodyFont:getComputedStyle(c.querySelector('.case-content-card__body')).fontSize,framed:getComputedStyle(c).borderTopWidth!=='0px',src:img.getAttribute('src'),loaded:img.naturalWidth>0,emptySlot:!slot.textContent.trim(),imageFit:getComputedStyle(img).objectFit}
  })})))
  for(const [index,g] of grids.entries()){
   const framed=width>=934&&g.available>=790,cols=!framed?1:index===1&&g.available>=1296?3:2
   const gap=g.available>=1776&&index===0?72:g.available>=1296?64:48
   const expectedWidth=framed?Math.min(852,(g.available-gap*(cols-1))/cols):Math.min(544,g.available)
   const firstY=g.cards[0].y
   assert.equal(g.cards.filter(c=>Math.abs(c.y-firstY)<.1).length,cols,`columns ${width}/${index}`)
   for(const c of g.cards){
    close(c.w,expectedWidth,'card width')
    close(c.media.w/c.media.h,framed?754/450:544/342,'media ratio')
    close(c.slot,framed?32:26,'eyebrow slot')
    close(c.titleGap,12,'copy gap')
    assert.equal(c.framed,framed)
    assert.equal(c.titleFont,g.available>=1776?'32px':'24px')
    assert.equal(c.bodyFont,g.available>=1776?'20px':'16px')
    assert.equal(c.imageFit,'cover');assert.equal(c.loaded,true)
    assert.ok(fs.statSync('public'+c.src).size>0,'local original asset')
   }
   for(let i=1;i<cols;i++)close(g.cards[i].x-g.cards[i-1].x-expectedWidth,gap,'column gap')
   const last=g.cards.at(-1)
   if(g.cards.length%cols===1)close(last.x+last.w/2,g.x+g.available/2,'last card centered')
   const rowGap=!framed?(width>=768?48:72):g.available>=1776&&index===0?72:g.available>=1296?64:48
   if(g.cards.length>cols){const rowBottom=Math.max(...g.cards.slice(0,cols).map(c=>c.y+c.h));close(g.cards[cols].y-rowBottom,rowGap,'row gap')}
  }
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),0,'overflow')
  assert.deepEqual(errors,[])
  if([320,768,934,1280,1440,1920].includes(width))await p.screenshot({path:`${evidence}/${width}.png`,fullPage:true})
  report.push({width,grids})
  await p.close()
 }
 // The same component must respond to a narrow parent even inside a desktop viewport.
 const p=await browser.newPage({viewport:{width:1920,height:1000}})
 await p.goto('http://localhost:6006/iframe.html?id=components-casecontentcard--existing-grid&viewMode=story',{waitUntil:'networkidle'})
 for(const available of [789,790,1135,1136,1295,1296,1775,1776]){
  await p.locator('.case-card-demo').evaluate((e,w)=>{e.style.width=w+'px';e.style.padding='0';e.style.boxSizing='content-box'},available)
  const actual=await p.locator('.case-content-layout').last().evaluate(e=>{const cs=[...e.querySelectorAll('article')],r=cs[0].getBoundingClientRect();return {columns:cs.filter(c=>Math.abs(c.getBoundingClientRect().y-r.y)<.1).length,framed:getComputedStyle(cs[0]).borderTopWidth!=='0px',font:getComputedStyle(cs[0].querySelector('h3')).fontSize}})
  assert.equal(actual.columns,available<790?1:available<1296?2:3)
  assert.equal(actual.framed,available>=790)
  assert.equal(actual.font,available>=1776?'32px':'24px')
  report.push({container:available,actual})
 }
 await p.close()
 fs.writeFileSync(`${evidence}/verification.json`,JSON.stringify(report,null,2))
 console.log(`${widths.length} reference/intermediate viewports +8 constrained-parent boundaries passed`)
} finally {await browser.close()}

// Historical migration comparison against pre-component markup.
// Current sizing contract: run check-case-content-card-responsive.mjs.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import {chromium} from 'playwright'
const browser=await chromium.launch()
const result=[]
const measure=(root,selectors)=>{
 const rect=root.getBoundingClientRect()
 const local=selector=>{const n=root.querySelector(selector);if(!n)return null;const b=n.getBoundingClientRect();return{x:b.x-rect.x,y:b.y-rect.y,w:b.width,h:b.height}}
 return {w:rect.width,media:local(selectors.media),title:local(selectors.title),body:local(selectors.body),eyebrow:local(selectors.eyebrow)}
}
try{
 const page=await browser.newPage()
 for(const width of [320,768,1023,1024,1280,1281,1440,1920]){
  await page.setViewportSize({width,height:1000})
  await page.goto('http://127.0.0.1:3000/cases/dc-vendor-app-pr',{waitUntil:'networkidle'})
  await page.locator('.dc-product__card').last().scrollIntoViewIfNeeded()
  await page.locator('.dc-product__card img').evaluateAll(images=>Promise.all(images.map(async image=>{image.loading='eager';await image.decode()})))
  await page.evaluate(()=>document.fonts.ready)
  const old=await page.locator('.dc-product__card').evaluateAll((nodes,source)=>nodes.map(n=>{
    const r=n.getBoundingClientRect();const local=s=>{const el=n.querySelector(s);if(!el)return null;const b=el.getBoundingClientRect();return{x:b.x-r.x,y:b.y-r.y,w:b.width,h:b.height}};
    return{w:r.width,media:local('.dc-product__card-image'),title:local('h3'),body:local('.dc-product__body'),eyebrow:local('.dc-product__label')}
  }))
  await page.goto('http://127.0.0.1:6006/iframe.html?id=components-casecontentcard--existing-grid&viewMode=story')
  const cards=page.locator('.case-content-card')
  await cards.last().waitFor()
  await cards.last().scrollIntoViewIfNeeded()
  await cards.locator('img').evaluateAll(images=>Promise.all(images.map(async image=>{image.loading='eager';await image.decode()})))
  await page.waitForTimeout(350)
  await page.evaluate(()=>document.fonts.ready)
  const current=await cards.evaluateAll(nodes=>nodes.map(n=>{
   const r=n.getBoundingClientRect();const local=s=>{const e=n.querySelector(s);if(!e)return null;const b=e.getBoundingClientRect();return{x:b.x-r.x,y:b.y-r.y,w:b.width,h:b.height}};
   return{w:r.width,media:local('.case-content-card__media'),title:local('h3'),body:local('.case-content-card__body'),eyebrow:local('.case-content-card__eyebrow')}
  }))
  assert.equal(old.length,7);assert.equal(current.length,7)
  for(let i=0;i<7;i++){
   for(const role of ['media','title','body','eyebrow']){
    assert.equal(!!old[i][role],!!current[i][role],`${width}/${i}/${role}`)
    if(!old[i][role])continue
    for(const axis of ['x','y','w','h'])assert(Math.abs(old[i][role][axis]-current[i][role][axis])<1,`${width}/${i}/${role}/${axis}: ${old[i][role][axis]} vs ${current[i][role][axis]}`)
   }
  }
  if(width===1920||width===320)await cards.first().screenshot({path:`E:/GitHub/PDPortfolio-DS/ds/evidence/case-content-card-fixed-${width}.png`})
  result.push({width,cards:current})
 }
 fs.writeFileSync('E:/GitHub/PDPortfolio-DS/ds/evidence/case-content-card-verification.json',JSON.stringify(result,null,2))
 console.log('PASS:7 existing cards ×8 widths; component content geometry matches current page within1px')
}finally{await browser.close()}

import assert from 'node:assert/strict'
import fs from 'node:fs'
import {chromium} from 'playwright'
const browser=await chromium.launch()
const results=[]
try {
 const page=await browser.newPage()
 for(const width of [320,767,768,769,1023,1024,1920]) {
  await page.setViewportSize({width,height:900})
  await page.goto('http://127.0.0.1:6006/iframe.html?id=components-caseimagepreview--overlay&viewMode=story')
  const root=page.locator('.ds-case-image-preview--v2'),media=root.locator('.ds-case-image-preview__media')
  await root.waitFor()
  await media.locator('img').evaluate(i=>i.decode())
  const a=await root.boundingBox(),b=await root.locator('.ds-img-title').boundingBox()
  assert(Math.abs(a.width-width)<1)
  assert.equal(b.width,128);assert.equal(b.height,128)
  assert(Math.abs(b.x+b.width/2-a.x-a.width/2)<1)
  assert(Math.abs(b.y+b.height/2-a.y-a.height/2)<1)
  assert.equal(await root.locator('button').count(),1)
  assert.equal(await root.locator('h2').count(),0)
  assert.equal(await media.evaluate(e=>getComputedStyle(e).maxWidth),'none')
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true)
  results.push({width,preview:a,control:b})
  if(width===320||width===1920) {
   await page.evaluate(()=>document.activeElement instanceof HTMLElement && document.activeElement.blur())
   await page.mouse.move(0,850)
   await page.waitForTimeout(320)
   await root.screenshot({path:`E:/GitHub/PDPortfolio-DS/ds/evidence/case-preview-v2-${width}.png`})
  }
 }
 for(const width of [320,768,1920]) {
  await page.setViewportSize({width,height:900})
  await page.goto('http://127.0.0.1:6006/iframe.html?id=components-caseimageviewer--controls-only&viewMode=story&embed=true')
  const dialog=page.getByRole('dialog',{name:'Когда включается Chirp',exact:true})
  await dialog.waitFor()
  await page.waitForFunction(()=>document.querySelector('.ds-case-image-viewer')?.getAttribute('aria-busy')==='false')
  const box=await dialog.boundingBox(),header=dialog.locator('header')
  assert.equal(box.width,width);assert.equal(box.height,900)
  assert.equal(await header.locator('h2').count(),0)
  assert.equal(await header.getAttribute('class').then(x=>x.includes('ds-top-sticky-bar--controls-only')),true)
  const h=await header.boundingBox()
  if(width>=768){assert(Math.abs(h.x+h.width-width)<1);assert.match(await header.innerText(),/Fit to width/)}
  else {assert.equal(h.height,82);assert.equal(h.width,width)}
  await page.mouse.move(0,850)
  await dialog.screenshot({path:`E:/GitHub/PDPortfolio-DS/ds/evidence/case-viewer-v2-${width}.png`})
  results.push({viewerWidth:width,dialog:box,header:h})
 }
 await page.goto('http://127.0.0.1:6006/iframe.html?id=components-imgtitle-imgtitle--button-only&viewMode=story')
 const circle=page.locator('.ds-img-title--btn-only')
 await circle.waitFor()
 await page.evaluate(()=>document.activeElement instanceof HTMLElement && document.activeElement.blur())
 await page.mouse.move(0,850)
 await page.waitForTimeout(320)
 await circle.screenshot({path:'E:/GitHub/PDPortfolio-DS/ds/evidence/img-title-btn-only.png'})
 fs.writeFileSync('E:/GitHub/PDPortfolio-DS/ds/evidence/case-media-v2-verification.json',JSON.stringify(results,null,2))
 console.log('PASS:7 Preview widths, no924 cap,128px centered control;3 fullscreen Viewer widths, controls-only header, Fit to width, no overflow')
}finally{await browser.close()}

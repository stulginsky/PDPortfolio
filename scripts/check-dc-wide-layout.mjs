import {chromium} from 'playwright'
import fs from 'node:fs'
import assert from 'node:assert/strict'
const dir='E:/GitHub/PDPortfolio-DS/ds/evidence/dc-wide-layout-2026-10-27'
fs.mkdirSync(dir,{recursive:true})
const browser=await chromium.launch({headless:true})
const report=[]
try {
 for(const [slug,selector,cap] of [['dc-vendor-app-pr','.dc-product__flow',2000],['dc-vendor-app-ux','.ux-case__contribution',1920]]){
  for(const width of [320,768,1024,1440,1920,2000,2560,3840]){
   const page=await browser.newPage({viewport:{width,height:1100},reducedMotion:'reduce'})
   const errors=[];page.on('pageerror',e=>errors.push(e.message))
   await page.goto(`http://localhost:3000/cases/${slug}/`,{waitUntil:'networkidle'})
   await page.evaluate(()=>document.fonts.ready)
   const result=await page.evaluate(selector=>{
    const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,w:r.width}}
    const el=document.querySelector(selector),main=document.querySelector('main'),hero=main.firstElementChild
    return {content:rect(el),hero:rect(hero),available:document.documentElement.clientWidth,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}
   },selector)
   assert.ok(Math.abs(result.content.w-Math.min(result.available,cap))<1,JSON.stringify({slug,width,result}))
   assert.ok(Math.abs(result.content.x-(result.available-result.content.w)/2)<1,'centered content')
   assert.ok(Math.abs(result.hero.w-result.available)<1,'full-width hero')
   assert.equal(result.overflow,0,'horizontal overflow')
   assert.deepEqual(errors,[])
   if(width===3840){
    await page.locator(selector+' img').evaluateAll(async images=>{for(const image of images){image.loading='eager';await image.decode().catch(()=>{})}})
    if(slug.endsWith('-ux'))await page.locator(selector).screenshot({path:`${dir}/${slug}-3840.png`})
    else {await page.locator(selector).evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+window.scrollY));await page.screenshot({path:`${dir}/${slug}-3840.png`})}
   }
   report.push({slug,width,...result});await page.close()
  }
 }
 fs.writeFileSync(`${dir}/verification.json`,JSON.stringify(report,null,2))
 console.log('16 page/viewport checks passed: width caps, centering, full-width heroes, no overflow/errors')
} finally {await browser.close()}

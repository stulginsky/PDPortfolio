import assert from 'node:assert/strict'
import { chromium } from 'playwright'
const browser=await chromium.launch()
try {
 const page=await browser.newPage({viewport:{width:768,height:900}})
 await page.goto('http://127.0.0.1:6006/iframe.html?id=compositions-showcase-cards-dcpickerapp-ux--sandbox&viewMode=story&embed=true')
 const link=page.locator('.ds-coming-soon'),tooltip=page.getByRole('tooltip')
 await link.waitFor()
 await page.mouse.move(0,850)
 await page.waitForTimeout(350)
 await link.hover()
 await tooltip.waitFor()
 const enter=await tooltip.evaluate(async e=>{
   const style=getComputedStyle(e)
   const timing={delay:style.transitionDelay,duration:style.transitionDuration}
   let opacity=+style.opacity
   const started=performance.now()
   while (!(opacity>0&&opacity<1) && performance.now()-started<600) {
     await new Promise(requestAnimationFrame)
     opacity=+getComputedStyle(e).opacity
   }
   return {...timing,opacity}
 })
 assert.equal(enter.delay,'0.1s');assert.equal(enter.duration,'0.3s');assert(enter.opacity>0&&enter.opacity<1,JSON.stringify(enter))
 await page.waitForTimeout(320)
 assert.equal(await tooltip.evaluate(e=>+getComputedStyle(e).opacity),1)
 await page.mouse.move(0,850)
 await page.waitForTimeout(70)
 const leave=await tooltip.evaluate(e=>+getComputedStyle(e).opacity)
 assert(leave>0&&leave<1,String(leave))
 await tooltip.waitFor({state:'detached'})
 await page.emulateMedia({reducedMotion:'reduce'})
 await link.hover()
 await tooltip.waitFor()
 assert.equal(await tooltip.evaluate(e=>getComputedStyle(e).transitionDuration),'0s')
 await page.mouse.move(0,850)
 await tooltip.waitFor({state:'detached'})
 console.log('PASS: shared Tooltip enter delay100ms, enter/leave300ms, intermediate opacity, actual detach, reduced-motion0ms')
} finally {await browser.close()}

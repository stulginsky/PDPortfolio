import { chromium } from 'playwright'
import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
const output='tmp/fox-case'
await fs.mkdir(output,{recursive:true})
const browser=await chromium.launch({headless:true,channel:'msedge'})
const report=[],errors=[]
try {
 let page
 for(const width of [1920,768,320]) {
  page=await browser.newPage()
  page.on('pageerror',e=>errors.push(e.message))
  await page.setViewportSize({width,height:1080})
  await page.goto('http://127.0.0.1:3000/cases/fox-jw',{waitUntil:'domcontentloaded'})
  await page.waitForFunction(()=>document.querySelector('#__nuxt')?.__vue_app__?.$nuxt?.isHydrating === false)
  await page.evaluate(()=>document.fonts.ready)
  await page.locator('.fox-case__crop img').evaluateAll(images=>Promise.all(images.map(img=>{img.loading='eager';return img.decode()})))
  const geometry=await page.evaluate(()=>{
   const box=s=>document.querySelector(s).getBoundingClientRect().toJSON()
   return {width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,opening:box('.fox-case__opening'),role:box('.fox-case__role'),player:box('iframe'),images:[...document.querySelectorAll('.fox-case__image')].map(el=>el.getBoundingClientRect().toJSON()),ending:box('.fox-case__ending'),height:document.querySelector('main').getBoundingClientRect().height,assets:[...document.querySelectorAll('.fox-case__crop img')].map(img=>({src:img.getAttribute('src'),width:img.naturalWidth,height:img.naturalHeight}))}
  })
  report.push(geometry)
  await fs.writeFile(`${output}/${width}-geometry.json`,JSON.stringify(geometry,null,2))
  assert.equal(geometry.overflow,false)
  assert.equal(geometry.images.length,2)
  assert.ok(geometry.assets.every(a=>a.width>0&&a.height>0))
  if(width===1920) {
   assert.equal(geometry.opening.x,498)
   assert.equal(geometry.opening.y,144)
   assert.ok(Math.abs(geometry.opening.height-316)<1,JSON.stringify(geometry))
   assert.ok(Math.abs(geometry.player.y-604)<1,JSON.stringify(geometry))
   for(const [i,image] of geometry.images.entries()) {
    assert.equal(image.x,498); assert.equal(image.width,924)
    assert.ok(Math.abs(image.height-1080)<1)
    assert.ok(Math.abs(image.y-(1270.806824+i*1224))<1)
   }
   assert.ok(Math.abs(geometry.height-4144.806824)<1)
  }
  await page.screenshot({path:`${output}/${width}.png`,fullPage:true})
  for(let i=0;i<2;i++) {
   await page.locator('.fox-case__image').nth(i).getByRole('button').click()
   try { await page.getByRole('dialog').waitFor() } catch(error) {
    await page.screenshot({path:`${output}/${width}-failed-${i}.png`})
    console.log(await page.locator('.fox-case').evaluate(e=>({open:e.__vueParentComponent?.setupState.viewerOpen,selected:e.__vueParentComponent?.setupState.selected,html:document.querySelector('[role="dialog"]')?.outerHTML,inert:document.querySelector('#__nuxt').inert})))
    throw error
   }
   await page.waitForFunction(()=>document.querySelector('[role="dialog"]')?.getAttribute('aria-busy')==='false')
   await page.screenshot({path:`${output}/${width}-viewer-${i}.png`})
   await page.keyboard.press('Escape')
   await page.getByRole('dialog').waitFor({state:'detached'})
  }
  await page.close()
 }
 page=await browser.newPage()
 await page.goto('http://127.0.0.1:3000/',{waitUntil:'domcontentloaded'})
 await page.waitForFunction(()=>document.querySelector('#__nuxt')?.__vue_app__?.$nuxt?.isHydrating === false)
 const card=page.locator('[data-case-href="/cases/fox-jw"]')
 await card.getByRole('button').click()
 await page.waitForURL(url=>/^\/cases\/fox-jw\/?$/.test(url.pathname),{waitUntil:'domcontentloaded'})
 assert.deepEqual(errors,[])
 await fs.writeFile(`${output}/verification.json`,JSON.stringify({report,errors,navigation:'passed',viewer:'passed'},null,2))
 console.log('Fox: 1920/768/320 geometry, assets, viewers, Escape and showcase navigation passed')
} finally {await browser.close()}

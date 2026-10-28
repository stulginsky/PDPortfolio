import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { writeFile } from 'node:fs/promises'

const evidence='E:/GitHub/PDPortfolio-DS/ds/evidence'
const browser=await chromium.launch({headless:true})
const results=[],errors=[]
try {
 const page=await browser.newPage({viewport:{width:320,height:1000},reducedMotion:'reduce'})
 page.on('pageerror',error=>errors.push(error.message))
 await page.goto('http://127.0.0.1:6006/iframe.html?id=components-topstickybar--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'})
 const header=page.locator('.ds-top-sticky-bar'),toggle=page.getByRole('checkbox',{name:'ControlsOnly',exact:true})
 for(const width of [320,767,768,1920]) {
  await page.setViewportSize({width,height:1000})
  await page.waitForFunction(web=>document.querySelector('header')?.classList.contains('ds-top-sticky-bar--web')===web,width>=768)
  for(const controlsOnly of [false,true]) {
   await toggle.setChecked(controlsOnly)
   // Close the source mobile menu to dismiss the load hint before visual capture.
   if(width<768){await header.getByRole('button',{name:'Выбрать масштаб'}).click();await page.getByRole('dialog').getByRole('button',{name:'Zoom 100%',exact:true}).click()}
   await page.mouse.move(0,0)
   const geometry=await header.evaluate(el=>{
    const h=el.getBoundingClientRect(),menu=el.querySelector('.ds-top-sticky-bar__menu').getBoundingClientRect(),close=el.querySelector('.ds-top-sticky-bar__close').getBoundingClientRect(),style=getComputedStyle(el)
    return {width:h.width,height:h.height,title:!!el.querySelector('h2'),background:style.backgroundImage,overflow:document.documentElement.scrollWidth-innerWidth,menu:{x:menu.x,y:menu.y,width:menu.width,height:menu.height},close:{x:close.x,y:close.y,width:close.width,height:close.height},raised:el.querySelectorAll('.button-base--raised').length,gap:close.left-menu.right,center:(menu.left+close.right)/2-(h.left+h.right)/2}
   })
   assert.equal(geometry.title,!controlsOnly);assert.equal(geometry.overflow,0)
   assert.equal(geometry.close.width,50);assert.equal(geometry.close.height,50)
   if(controlsOnly){
    assert.equal(geometry.background,'none');assert.equal(geometry.raised,2)
    assert.equal(geometry.height,width<768?82:100)
    assert.ok(Math.abs(geometry.menu.y-geometry.close.y)<.1)
    assert.ok(Math.abs(geometry.gap-12)<.1)
    if(width<768)assert.ok(Math.abs(geometry.center)<.1)
   } else {assert.ok(geometry.background.startsWith('linear-gradient'));assert.equal(geometry.raised,0);if(width>=768)assert.equal(geometry.height,100)}
   results.push({width,controlsOnly,...geometry})
   if([320,768].includes(width))await header.screenshot({path:evidence+'/top-sticky-bar-'+width+'-'+(controlsOnly?'controls':'full')+'.png'})
  }
 }
 // Real controls-only web menu: Escape restores trigger focus, selecting applies zoom.
 await page.setViewportSize({width:1024,height:1000})
 await header.locator('.ds-top-sticky-bar__menu button').first().click()
 await page.keyboard.press('Escape')
 await page.waitForFunction(()=>!document.querySelector('.ds-dropdown-select__list'))
 assert.ok(await header.locator('.ds-top-sticky-bar__menu button').first().evaluate(el=>el===document.activeElement))
 await header.locator('.ds-top-sticky-bar__menu button').first().click()
 await page.locator('.ds-dropdown-select__list').getByRole('button',{name:'Zoom 150%',exact:true}).click()
 assert.match(await page.getByRole('status').innerText(),/Zoom: 150/)
 await header.getByRole('button',{name:'Закрыть просмотрщик'}).click()
 assert.match(await page.getByRole('status').innerText(),/Close: 1/)
 // Shared ButtonIcon owns raised, hover, pressed and keyboard focus appearance.
 const close=header.getByRole('button',{name:'Закрыть просмотрщик'})
 await page.mouse.move(0,0)
 const raised=await close.evaluate(el=>getComputedStyle(el).backgroundColor)
 await close.hover();const hover=await close.evaluate(el=>getComputedStyle(el).backgroundColor)
 await page.mouse.down();const pressed=await close.evaluate(el=>getComputedStyle(el).backgroundColor)
 await page.mouse.up();await page.mouse.move(0,0)
 assert.notEqual(raised,hover);assert.notEqual(raised,pressed)
 await close.focus();assert.ok(await close.evaluate(el=>el===document.activeElement))
 await page.addScriptTag({path:new URL('../node_modules/axe-core/axe.js',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')})
 const accessibility=await page.evaluate(async()=>{const r=await axe.run('.ds-top-sticky-bar');return r.violations.map(v=>({id:v.id,impact:v.impact}))})
 assert.deepEqual(accessibility,[])
 assert.deepEqual(errors,[])
 await writeFile(evidence+'/top-sticky-bar-controls-only-2026-10-25.json',JSON.stringify({results,sharedButtonStates:{raised,hover,pressed},accessibility,errors},null,2))
 console.log('TopStickyBar: 8 responsive/mode combinations, layout, raised/hover/press/focus, Escape, zoom, close and controls-only axe passed')
} finally {await browser.close()}

import {chromium} from 'playwright'
import fs from 'node:fs'
import assert from 'node:assert/strict'
const dir='E:/GitHub/PDPortfolio-DS/ds/evidence/li-design-system-2026-10-30'
fs.mkdirSync(dir,{recursive:true})
const b=await chromium.launch({headless:true}),results=[]
try{
 const p=await b.newPage({reducedMotion:'reduce'})
 const errors=[];p.on('pageerror',e=>errors.push(e.message))
 for(const width of [320,370,410,425,461,462,534,768,1920]){
  await p.setViewportSize({width,height:900})
  await p.goto('http://127.0.0.1:6006/iframe.html?id=compositions-showcase-cards-lidesignsystem--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'})
  const card=p.locator('.li-design-system');await card.waitFor()
  await card.locator('img').evaluateAll(async images=>{await Promise.all(images.map(i=>i.decode()))})
  const actual=await card.evaluate(e=>{
   const box=e.getBoundingClientRect(),t=e.querySelector('.li-design-system__title').getBoundingClientRect(),bg=e.querySelector('.li-design-system__background').getBoundingClientRect()
   return {w:box.width,h:box.height,title:{x:t.x-box.x,y:t.y-box.y,w:t.width,h:t.height},bg:{x:bg.x-box.x,y:bg.y-box.y,w:bg.width,h:bg.height},assets:[...e.querySelectorAll('img')].map(i=>({src:i.currentSrc,loaded:i.naturalWidth>0})),badges:[...e.querySelectorAll('li')].map(li=>{const r=li.getBoundingClientRect();return {x:r.x-box.x,y:r.y-box.y,w:r.width,h:r.height}})}
  })
  const desktop=width>=462,scale=Math.min(1,actual.w/Math.min(430,width-32))
  assert.equal(actual.h,desktop?532:500)
  assert.ok(actual.w<=430&&actual.w<=width)
  assert.ok(Math.abs(actual.title.w-(desktop?247:191)*scale)<.1)
  assert.ok(Math.abs(actual.title.y-(desktop?174.0390625:199.0029296875))<.1)
  assert.ok(Math.abs(actual.title.x-(actual.w/2-(desktop?121.869140625:93.95703125)*scale))<.1)
  for(const asset of actual.assets)assert.ok(asset.loaded,asset.src)
  assert.equal(actual.badges.length,4)
  for(const r of actual.badges)assert.ok(r.x>=0&&r.x+r.w<=actual.w+.1&&r.y+r.h<=actual.h)
  const link=card.locator('a'),uri=new URL(await link.getAttribute('href'))
  assert.equal(await card.locator('a').count(),1)
  assert.equal(uri.pathname,'stulginsky@gmail.com')
  assert.equal(uri.searchParams.get('body'),'Привет, Константин! Очень хочу посмотреть новый кейс LIDPORT UI. Сообщите о публикации. Спасибо.')
  assert.equal(await link.getAttribute('target'),'_blank')
  await link.hover();const tip=card.getByRole('tooltip');await tip.waitFor()
  assert.equal(await link.getAttribute('aria-describedby'),await tip.getAttribute('id'))
  await link.focus();await p.keyboard.press('Escape');await tip.waitFor({state:'detached'})
  if([320,462].includes(width))await card.screenshot({path:`${dir}/${width}.png`})
  results.push({viewport:width,...actual})
 }
 // Parent compression must use the same card at actual available width.
 await p.setViewportSize({width:768,height:900})
 await p.locator('.li-design-system').evaluate(e=>{e.style.width='288px'})
 const compressed=await p.locator('.li-design-system__title').boundingBox()
 assert.ok(Math.abs(compressed.width-247*288/430)<.1)
 assert.deepEqual(errors,[])
 fs.writeFileSync(`${dir}/verification.json`,JSON.stringify({results,errors,compression:true},null,2))
 console.log('9 widths +parent compression passed:original assets,SVG geometry,badge bounds,mailto,title substitution,tooltip/Escape,no page errors')
}finally{await b.close()}

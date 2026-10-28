import {chromium} from 'playwright'
import fs from 'node:fs'
import assert from 'node:assert/strict'
const dir='E:/GitHub/PDPortfolio-DS/ds/evidence/picker-revision-2026-10-27'
fs.mkdirSync(dir,{recursive:true})
const b=await chromium.launch({headless:true}),report=[]
try {
 for(const width of [320,462,768,1920,3840])for(const route of ['/','/cases/dc-vendor-app-pr/']){
  const p=await b.newPage({viewport:{width,height:1000},reducedMotion:'reduce'})
  const errors=[];p.on('pageerror',e=>errors.push(e.message))
  await p.goto('http://localhost:3000'+route,{waitUntil:'networkidle'})
  const card=p.locator('.dc-picker-app-ux');await card.waitFor()
  await card.locator('img').evaluateAll(async images=>{await Promise.all(images.map(i=>i.decode()))})
  const link=card.locator('a');const uri=new URL(await link.getAttribute('href'))
  assert.equal(uri.pathname,'stulginsky@gmail.com')
  assert.equal(uri.searchParams.get('subject'),'Сообщите о новом кейсе')
  assert.equal(uri.searchParams.get('body'),'Привет, Константин! Очень хочу посмотреть новый кейс Picker App. Сообщите о публикации. Спасибо.')
  assert.equal(await card.locator('li').count(),7)
  assert.equal(await card.locator('a').count(),1)
  assert.equal(await link.getAttribute('target'),'_blank')
  const suppressed=await link.evaluate(e=>{let prevented;const listener=event=>{prevented=event.defaultPrevented;event.preventDefault()};document.addEventListener('click',listener,{once:true});e.click();return prevented})
  assert.equal(suppressed,false,'page must not cancel mailto')
  let names
  if(route==='/'){
   assert.equal(await p.locator('.main-page__case').count(),7)
   names=await p.locator('.main-page__case').evaluateAll(es=>es.map(e=>e.firstElementChild.className))
   const cols=await p.locator('.main-page__case').evaluateAll(es=>{const y=es[0].getBoundingClientRect().y;return es.filter(e=>Math.abs(e.getBoundingClientRect().y-y)<1).length})
   assert.ok(cols<=4)
  } else {
   names=await p.locator('[data-card-name]').evaluateAll(es=>es.map(e=>e.getAttribute('data-card-name')))
   assert.deepEqual(names,['DCVendorAppUx','DCPickerAppUx'])
   assert.equal(await p.locator('.related-cases a[href="/cases/dc-vendor-app-pr"]').count(),0)
   await p.locator('.related-cases__rail').evaluate(e=>{e.scrollLeft=e.scrollWidth})
  }
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),0)
  assert.deepEqual(errors,[])
  if([320,1920].includes(width))await card.screenshot({path:`${dir}/${route==='/'?'main':'related'}-${width}.png`})
  report.push({route,width,names,mailtoSuppressed:suppressed});await p.close()
 }
 fs.writeFileSync(`${dir}/verification.json`,JSON.stringify(report,null,2))
 console.log('10 page/width checks passed:7 Main cards,max4 columns,ordered related exclusion,7 badges,mailto draft and uncancelled launch')
} finally {await b.close()}

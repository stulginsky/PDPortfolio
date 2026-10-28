import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { writeFile } from 'node:fs/promises'
import { createHeroDraft, getHeroBreakpoint, heroReferences } from '../app/components/dc-vendor-app-ux-hero.scene-context.ts'
import { heroAssets } from '../app/components/dc-vendor-app-ux-hero.assets.ts'

const evidence='E:/GitHub/PDPortfolio-DS/ds/evidence'
const browser=await chromium.launch({headless:true})
const records={responsive:[],errors:[]}
try {
 const context=await browser.newContext({viewport:{width:1024,height:1200},reducedMotion:'reduce'})
 const page=await context.newPage()
 page.on('pageerror',e=>records.errors.push(e.message))
 await page.goto('http://127.0.0.1:6006/iframe.html?id=compositions-case-heroes-dcvendorapp-ux-hero--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'})
 const root=page.locator('.dc-vendor-app-ux-hero')
 await page.getByRole('button',{name:'Сбросить всё',exact:true}).click()
 await page.getByRole('button',{name:'Neutral',exact:true}).click()
 const defaults=createHeroDraft()
 for(const scene of Object.values(defaults))assert.ok(scene.every(layer=>layer.viscosity===1.8))
 for(const width of [320,370,410,425,534,720,767,768,1023,1024,1279,1280,1439,1440,1919,1920,1923]) {
  await page.setViewportSize({width,height:1200})
  const bp=getHeroBreakpoint(width),ref=heroReferences[bp]
  await page.waitForFunction(bp=>document.querySelector('section[data-breakpoint]')?.dataset.breakpoint===bp,bp)
  await page.waitForFunction(()=>document.querySelector('section[data-breakpoint]')?.dataset.mediaState==='ready')
  const result=await root.evaluate(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height,overflow:document.documentElement.scrollWidth-innerWidth,h1:el.querySelectorAll('h1').length,images:[...el.querySelectorAll('img')].map(i=>({loaded:i.complete&&i.naturalWidth>0,url:i.currentSrc})),layers:[...el.querySelectorAll('[data-layer]')].map(l=>({name:l.dataset.layer,x:l.getBoundingClientRect().x-el.getBoundingClientRect().x,y:l.getBoundingClientRect().y-el.getBoundingClientRect().y}))}))
  assert.equal(result.width,width);assert.equal(result.overflow,0);assert.equal(result.h1,1)
  assert.ok(Math.abs(result.height-ref.height*width/ref.width)<.1)
  assert.equal(result.images.length,10);assert.ok(result.images.every(i=>i.loaded&&i.url.includes('/dc-vendor-app-ux/hero-layers/')));assert.ok(result.images.at(-1).url.includes('/'+bp+'/'))
  assert.deepEqual(result.layers.map(l=>l.name),defaults[bp].map(l=>l.name))
  result.layers.forEach((layer,index)=>{
   const source=defaults[bp][index],asset=heroAssets[bp][index]
   assert.ok(Math.abs(layer.x-(source.x+asset.x)*width/ref.width)<.15,'source layer X '+layer.name)
   assert.ok(Math.abs(layer.y-(source.y+asset.y)*width/ref.width)<.15,'source layer Y '+layer.name)
  })
  records.responsive.push({viewport:width,breakpoint:bp,...result})
  if([320,768,1024,1280,1440,1920].includes(width))await root.screenshot({path:evidence+'/dc-vendor-app-ux-hero-'+width+'.png'})
 }
 await page.setViewportSize({width:1024,height:1200})
 await page.getByRole('combobox',{name:'Слой',exact:true}).selectOption('10')
 await page.setViewportSize({width:370,height:1000})
 await page.waitForFunction(()=>document.querySelector('section[data-breakpoint]')?.dataset.breakpoint==='base')
 assert.equal(await page.getByRole('combobox',{name:'Слой',exact:true}).inputValue(),'9')
 await page.setViewportSize({width:1024,height:1200})
 await page.waitForFunction(()=>document.querySelector('section[data-breakpoint]')?.dataset.breakpoint==='min-1024')
 assert.equal(await page.getByRole('combobox',{name:'Слой',exact:true}).inputValue(),'10')
 await page.getByRole('combobox',{name:'Слой',exact:true}).selectOption('1')
 const input=name=>page.getByRole('spinbutton',{name,exact:true})
 for(const name of ['Вязкость ×','Скорость возврата ×','Амплитуда ×','Базовое смещение, px']){await input(name).fill('.1');assert.equal(Number(await input(name).inputValue()),.1)}
 await input('Базовое смещение, px').fill('20');await input('Амплитуда ×').fill('1')
 const cloud=page.locator('[data-layer="02-Chef"]')
 const offset=()=>cloud.evaluate(el=>parseFloat(el.style.getPropertyValue('--parallax-x'))||0)
 await page.emulateMedia({reducedMotion:'no-preference'})
 // Global pointer scope: keep the hero visible, but move below its hit area.
 await page.getByRole('button',{name:'Interaction',exact:true}).click()
 const outsideY=(await root.boundingBox()).height+60
 for(let i=0;i<15;i++){await page.mouse.move(80+i*30,outsideY);await page.waitForTimeout(12)}
 assert.ok(Math.abs(await offset())>1,'pointer movement outside hero drives visible layers')
 async function trial(viscosity,returnSpeed){
  await page.getByRole('button',{name:'Neutral',exact:true}).click()
  await input('Вязкость ×').fill(String(viscosity));await input('Скорость возврата ×').fill(String(returnSpeed))
  await page.getByRole('button',{name:'Interaction',exact:true}).click()
  const peak=await page.evaluate(()=>new Promise(resolve=>{const node=document.querySelector('[data-layer="02-Chef"]');let peak=0,i=0;const timer=setInterval(()=>{window.dispatchEvent(new PointerEvent('pointermove',{pointerType:'mouse',clientX:80+i*8,clientY:30}));peak=Math.max(peak,Math.abs(parseFloat(node.style.getPropertyValue('--parallax-x'))||0));if(++i>=60){clearInterval(timer);resolve(peak)}},8)}))
  await page.waitForTimeout(450)
  return {peak,after:Math.abs(await offset())}
 }
 records.light=await trial(.1,1);records.heavy=await trial(4,1)
 assert.ok(records.light.peak>records.heavy.peak*1.2)
 records.slow=await trial(.1,.1);records.fast=await trial(.1,4)
 assert.ok(records.slow.after>records.fast.after*2)
 await page.getByRole('checkbox',{name:'Анимация слоя'}).uncheck()
 await page.waitForTimeout(100);assert.equal(await offset(),0)
 await page.getByRole('checkbox',{name:'Анимация слоя'}).check()
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);assert.equal(await offset(),0)
 await page.getByRole('button',{name:'Копировать JSON'}).click()
 const json=JSON.parse(await page.getByRole('textbox',{name:'JSON всех профилей'}).inputValue())
 assert.equal(json.version,2);assert.equal(Object.keys(json.scenes).length,6)
 await page.reload({waitUntil:'networkidle'});await page.getByRole('combobox',{name:'Слой',exact:true}).selectOption('1')
 assert.equal(Number(await input('Скорость возврата ×').inputValue()),4)
 await page.getByRole('button',{name:'Сбросить всё',exact:true}).click()
 assert.equal(Number(await input('Скорость возврата ×').inputValue()),.7)
 // Touch movement is relative; idle return must work while the finger stays down.
 await page.setViewportSize({width:370,height:1000});await page.emulateMedia({reducedMotion:'no-preference'})
 await page.waitForTimeout(1800)
 await input('Вязкость ×').fill('.1');await input('Скорость возврата ×').fill('4');await input('Базовое смещение, px').fill('20')
 await root.dispatchEvent('pointerdown',{pointerType:'touch',pointerId:7,isPrimary:true,clientX:20,clientY:100})
 for(let i=0;i<15;i++){await page.evaluate(i=>window.dispatchEvent(new PointerEvent('pointermove',{pointerType:'touch',pointerId:7,isPrimary:true,clientX:20+i*15,clientY:100})),i);await page.waitForTimeout(12)}
 const touchPeak=Math.abs(await offset());assert.ok(touchPeak>1)
 await page.waitForTimeout(1000);assert.ok(Math.abs(await offset())<touchPeak*.1)
 await page.evaluate(()=>window.dispatchEvent(new PointerEvent('pointercancel',{pointerType:'touch',pointerId:7,isPrimary:true})))
 records.touch={peak:touchPeak,heldReturn:true,cancel:true}
 await page.getByRole('button',{name:'Сбросить всё',exact:true}).click()
 assert.deepEqual(records.errors,[])
 await writeFile(evidence+'/dc-vendor-app-ux-hero-verification.json',JSON.stringify(records,null,2))
 console.log('DCVendorAppUxHero: 17 widths, assets, geometry, shared motion, touch, decimals, reduced motion, reset, persistence and JSON passed')
} finally {await browser.close()}

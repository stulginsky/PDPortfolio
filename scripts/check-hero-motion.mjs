import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { readFile, writeFile } from 'node:fs/promises'
import * as ux from '../app/components/chirp-ux-hero.scene-context.ts'
import * as pr from '../app/components/chirp-pr-hero.scene-context.ts'
import * as br from '../app/components/chirp-br-hero.scene-context.ts'
import * as ds from '../app/components/chirp-ds-hero.scene-context.ts'
const modules={ux,pr,br,ds}, records={}
const evidence='E:/GitHub/PDPortfolio-DS/ds/evidence'
const browser=await chromium.launch({headless:true})
const bp=w=>w>=1920?'min-1920':w>=1440?'min-1440':w>=1280?'min-1280':w>=1024?'min-1024':w>=768?'min-768':'base'
const rates=['Вязкость ×','Скорость возврата ×'], numbers=[...rates,'Амплитуда ×','Базовое смещение, px']
try {
 for(const [hero,m] of Object.entries(modules)){
  const filter=process.argv.indexOf('--hero')
  if(filter>=0&&process.argv[filter+1]!==hero)continue
  const defaults=m.createHeroDraft();assert.ok(m.validHeroDraft(defaults))
  const expectedTau=hero==='br'||hero==='ds'?1.8:1
  if(hero!=='ux')assert.equal(defaults['min-1024'][0].viscosity,hero==='ds'?10:expectedTau)
  for(const layers of Object.values(defaults))for(const l of layers){assert.equal(l.speed,undefined);assert.ok(l.baseOffset>=0)}
  const old=structuredClone(defaults)
  for(const [profile,layers]of Object.entries(old))for(const l of layers){delete l.viscosity;delete l.returnSpeed;delete l.baseOffset;l.speed=1;if(hero==='br')l.pointerDirection=1}
  old['min-1024'][0].x=17;old['min-1024'][0].speed=2
  const c=await browser.newContext({viewport:{width:1024,height:2300},reducedMotion:'reduce'})
  await c.addInitScript(({hero,old})=>{if(!sessionStorage.getItem('seed')){localStorage.setItem('pdportfolio:chirp-'+hero+'-hero:scene:v1',JSON.stringify({version:1,scenes:old}));sessionStorage.setItem('seed','1')}},{hero,old})
  const p=await c.newPage(),errors=[]
  p.on('pageerror',e=>errors.push(e.message))
  await p.goto('http://127.0.0.1:6006/iframe.html?id=compositions-case-heroes-chirp-'+hero+'-hero--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'})
  const input=name=>p.getByRole('spinbutton',{name,exact:true}),set=(name,v)=>input(name).fill(String(v))
  await p.getByRole('combobox',{name:'Слой',exact:true}).selectOption('0')
  assert.equal(Number(await input('X').inputValue()),17,'legacy geometry '+hero)
  assert.equal(Number(await input('Вязкость ×').inputValue()),expectedTau/2,'legacy softness '+hero)
  await p.getByRole('button',{name:'Сбросить всё',exact:true}).click()
  await p.getByRole('button',{name:'Neutral',exact:true}).click()
  const responsive=[]
  for(const width of [320,370,410,425,534,720,767,768,1023,1024,1279,1280,1439,1440,1919,1920]){
   await p.setViewportSize({width,height:2300})
   await p.waitForFunction(expected=>document.querySelector('section[data-breakpoint]')?.dataset.breakpoint===expected,bp(width))
   await p.evaluate(()=>document.fonts.ready)
   await p.waitForFunction(()=>[...document.querySelectorAll('section[data-breakpoint] img')].every(i=>i.complete&&i.naturalWidth>0))
   const r=await p.locator('section[data-breakpoint]').evaluate(root=>({width:root.clientWidth,height:root.getBoundingClientRect().height,overflow:document.documentElement.scrollWidth-innerWidth,h1:root.querySelectorAll('h1').length,steps:[...document.querySelectorAll('input[type=number]')].map(e=>e.step)}))
   assert.equal(r.width,width);assert.equal(r.overflow,0);assert.equal(r.h1,1);assert.ok(r.steps.every(s=>s==='0.1'))
   responsive.push({viewport:width,...r})
   if([320,768,1024,1280,1440,1920].includes(width))await p.locator('section[data-breakpoint]').screenshot({path:evidence+'/hero-unified-'+hero+'-'+width+'.png'})
  }
  await p.setViewportSize({width:1024,height:2300})
  await p.waitForFunction(()=>document.querySelector('section[data-breakpoint]')?.dataset.breakpoint==='min-1024')
  await p.getByRole('combobox',{name:'Слой',exact:true}).selectOption('0')
  for(const name of numbers){assert.equal(await input(name).isEnabled(),true);await set(name,.1);assert.equal(Number(await input(name).inputValue()),.1)}
  await set('Базовое смещение, px',20);await set('Амплитуда ×',1)
  await p.getByRole('combobox',{name:'Направление движения',exact:true}).selectOption('1')
  await p.emulateMedia({reducedMotion:'no-preference'})
  const move=x=>p.mouse.move(x,50)
  const physical=()=>p.locator('[data-layer]').first().evaluate((e,hero)=>{
   if(hero==='ux'||hero==='pr')return parseFloat(e.style.getPropertyValue('--parallax-x'))||0
   const root=e.closest('section[data-breakpoint]'),stage=root.querySelector('[class$="__stage"]'),ref=parseFloat(stage.style.width)
   return (parseFloat(e.style.getPropertyValue(hero==='br'?'--hero-motion':'--motion-x'))||0)*root.clientWidth/ref
  },hero)
  async function trial(viscosity,returnSpeed){
   await p.getByRole('button',{name:'Neutral',exact:true}).click();await set('Вязкость ×',viscosity);await set('Скорость возврата ×',returnSpeed)
   await p.getByRole('button',{name:'Interaction',exact:true}).click()
   await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(50);await move(0)
   const width=await p.evaluate(()=>innerWidth)
   // Input is timer-paced independently of RAF, as real pointer events are.
   // Record the moving peak, not a later IPC sample which may already be returning.
   const movingPeak=await p.evaluate(({width,hero})=>new Promise(resolve=>{
    const e=document.querySelector('[data-layer]'),root=e.closest('section[data-breakpoint]'),stage=root.querySelector('[class$="__stage"]')
    const scale=hero==='br'||hero==='ds'?root.clientWidth/parseFloat(stage.style.width):1
    const property=hero==='br'?'--hero-motion':hero==='ds'?'--motion-x':'--parallax-x'
    const start=performance.now();let i=0,peak=0
    const timer=setInterval(()=>{
     const t=performance.now()-start,x=Math.min(width*.8,width*t/300)+(i++%2?.25:0)
     window.dispatchEvent(new PointerEvent('pointermove',{pointerType:'mouse',clientX:x,clientY:50}))
     peak=Math.max(peak,Math.abs((parseFloat(e.style.getPropertyValue(property))||0)*scale))
     if(t>=500){clearInterval(timer);resolve(peak)}
    },8)
   }),{width,hero})
   const sample=await p.locator('[data-layer]').first().evaluate((e,hero)=>{
    const root=e.closest('section[data-breakpoint]'),stage=root.querySelector('[class$="__stage"]')
    const scale=hero==='br'||hero==='ds'?root.clientWidth/parseFloat(stage.style.width):1
    const property=hero==='br'?'--hero-motion':hero==='ds'?'--motion-x':'--parallax-x'
    const physical=(parseFloat(e.style.getPropertyValue(property))||0)*scale
    const rendered=hero==='br'?Math.max(...[...e.querySelectorAll('[data-figma-motion]')].map(n=>Math.abs(parseFloat(getComputedStyle(n).translate)||0)))*scale:Math.abs(new DOMMatrixReadOnly(getComputedStyle(e).transform).m41)*scale
    return {physical,rendered}
   },hero)
   const {physical:end,rendered}=sample,peak=movingPeak
   assert.ok(Math.abs(Math.abs(end)-rendered)<.15,'actual rendered physical displacement '+hero+' '+JSON.stringify(sample))
   await p.waitForTimeout(400);return {peak,after:await physical(),rendered,end}
  }
  const light=await trial(.1,1),heavy=await trial(4,1),slow=await trial(.1,.1),fast=await trial(.1,4)
  assert.ok(Math.abs(light.peak-20)<.2,'physical20px '+hero+' '+JSON.stringify({light,heavy,slow,fast,bounds:await p.locator('section[data-breakpoint]').boundingBox()}))
  assert.ok(light.peak>heavy.peak*1.2,'viscosity '+hero)
  assert.ok(slow.after/slow.peak>.8 && fast.after/fast.peak<.3,'independent return '+hero)
  const physicalByViewport=[]
  for(const width of [320,768,1920]){
   await p.getByRole('button',{name:'Neutral',exact:true}).click()
   await p.setViewportSize({width,height:2300})
   await p.waitForFunction(expected=>document.querySelector('section[data-breakpoint]')?.dataset.breakpoint===expected,bp(width))
   await set('Базовое смещение, px',20);await set('Амплитуда ×',1)
   await p.getByRole('combobox',{name:'Направление движения',exact:true}).selectOption('1')
   const sample=await trial(.1,4);assert.ok(Math.abs(sample.peak-20)<.2,'same px after stage scaling '+hero+' '+width+' '+JSON.stringify(sample)+' '+await input('Амплитуда ×').inputValue()+'/'+await input('Базовое смещение, px').inputValue())
   physicalByViewport.push({width,...sample})
  }
  await p.getByRole('button',{name:'Neutral',exact:true}).click()
  await p.setViewportSize({width:1024,height:2300})
  await p.waitForFunction(()=>document.querySelector('section[data-breakpoint]')?.dataset.breakpoint==='min-1024')
  await set('Амплитуда ×',0);assert.equal(await physical(),0)
  await set('Амплитуда ×',2);await set('Базовое смещение, px',.1)
  await p.getByRole('button',{name:'Копировать JSON',exact:true}).click()
  const json=JSON.parse(await p.getByRole('textbox',{name:'JSON всех профилей'}).inputValue())
  assert.equal(json.version,2);assert.equal(json.scenes['min-1024'][0].speed,undefined);assert.equal(json.scenes['min-1024'][0].baseOffset,.1)
  await p.reload({waitUntil:'networkidle'})
  await p.getByRole('combobox',{name:'Слой',exact:true}).selectOption('0')
  assert.equal(Number(await input('Базовое смещение, px').inputValue()),.1)
  await p.getByRole('button',{name:'Сбросить слой',exact:true}).click()
  assert.equal(Number(await input('Базовое смещение, px').inputValue()),defaults['min-1024'][0].baseOffset)
  await p.getByRole('button',{name:'Neutral',exact:true}).click()
  await p.locator('.hero-sandbox__editor').screenshot({path:evidence+'/hero-unified-controls-'+hero+'.png'})
  await p.setViewportSize({width:410,height:2300})
  await p.waitForFunction(()=>document.querySelector('section[data-breakpoint]')?.dataset.breakpoint==='base')
  await set('Вязкость ×',.1);await set('Скорость возврата ×',2);await set('Базовое смещение, px',20);await set('Амплитуда ×',1)
  await p.getByRole('combobox',{name:'Направление движения',exact:true}).selectOption('1')
  await p.getByRole('button',{name:'Interaction',exact:true}).click()
  const touch=(type,x)=>p.evaluate(({type,x})=>{
   const e=new PointerEvent(type,{pointerType:'touch',pointerId:7,isPrimary:true,clientX:x,clientY:50,bubbles:true})
   ;(type==='pointerdown'?document.querySelector('section[data-breakpoint]'):window).dispatchEvent(e)
  },{type,x})
  await touch('pointerdown',50)
  for(let i=1;i<=22;i++){await touch('pointermove',50+i*10);await p.waitForTimeout(16)}
  const heldPeak=await physical();assert.ok(heldPeak>10,'held touch peak '+hero)
  await p.waitForTimeout(850);const heldReturn=await physical()
  assert.ok(heldReturn<heldPeak*.15,'held touch idle return '+hero)
  const before=await physical();await touch('pointermove',280)
  assert.ok(Math.abs(await physical()-before)<2,'smooth touch resume '+hero)
  await touch('pointercancel',280)
  await p.waitForFunction(()=>document.querySelector('section[data-breakpoint]').dataset.motion==='neutral',undefined,{timeout:15000})
  await p.emulateMedia({reducedMotion:'reduce'});await touch('pointerdown',50);await touch('pointermove',300)
  await p.waitForTimeout(100);assert.equal(await physical(),0)
  assert.deepEqual(errors,[])
  records[hero]={calibration:defaults['min-1024'].map(l=>({name:l.name,viscosity:l.viscosity,returnSpeed:l.returnSpeed,baseOffset:l.baseOffset})),responsive,light,heavy,slow,fast,physicalByViewport,touch:{heldPeak,heldReturn,resume:true,cancel:true,reducedMotion:true},legacyMigration:true,jsonV2:true,errors}
  await c.close();console.log('PASS '+hero+':16 widths, common20px scale, viscosity/return, decimals, migration, JSON/reset')
 }
 // Equal settings produce the same physical endpoint for every renderer, not just equal UI numbers.
 const endpoints=Object.values(records).map(r=>r.light.peak)
 assert.ok(Math.max(...endpoints)-Math.min(...endpoints)<.2)
 let combined=records
 if(process.argv.includes('--hero')) {
  try {const previous=JSON.parse(await readFile(evidence+'/hero-unified-verification.json','utf8'));combined={...previous.records,...records}}catch(error){if(error.code!=='ENOENT')throw error}
 }
 await writeFile(evidence+'/hero-unified-verification.json',JSON.stringify({date:'2026-10-15',records:combined,uniformPhysicalScale:Object.keys(combined).length===4},null,2)+'\n')
} finally {await browser.close()}

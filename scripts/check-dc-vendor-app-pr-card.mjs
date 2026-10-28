import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {chromium} from 'playwright'
import {PNG} from 'pngjs'

const sources=JSON.parse(readFileSync('E:/GitHub/PDPortfolio-DS/ds/evidence/dc-vendor-app-pr-card-source.json','utf8'))
const copy=JSON.parse(readFileSync('content/cases/dc-vendor-app-pr.json','utf8')).card
const preset=JSON.parse(readFileSync('app/components/dc-vendor-app-pr.scenes.json','utf8'))
const exportsManifest=JSON.parse(readFileSync('E:/GitHub/PDPortfolio-DS/ds/evidence/dc-vendor-app-pr-card-exports.json','utf8'))
for(const asset of exportsManifest.exports){
 const png=PNG.sync.read(readFileSync(asset.file))
 let transparent=false,painted=false
 for(let i=3;i<png.data.length;i+=4){transparent ||= png.data[i]===0;painted ||= png.data[i]>0}
 assert.ok(transparent&&painted,'Original masked export must contain transparent and painted pixels: '+asset.file)
}
const evidence='E:/GitHub/PDPortfolio-DS/ds/evidence/'
const browser=await chromium.launch({headless:true})
const records={responsive:[],loading:[],errors:[]}
const url='http://127.0.0.1:6006/iframe.html?id=compositions-showcase-cards-dcvendorapp-pr--sandbox&viewMode=story&embed=true'
try{
 const context=await browser.newContext({viewport:{width:1024,height:1100},reducedMotion:'reduce'})
 const page=await context.newPage()
 page.on('pageerror',e=>records.errors.push(e.message))
 await page.goto(url,{waitUntil:'networkidle'})
 await page.waitForFunction(()=>window.__STORYBOOK_PREVIEW__?.currentRender?.phase==='finished')
 const root=page.locator('.dc-vendor-app-pr.chirp-card')
 await page.waitForFunction(()=>document.querySelector('.chirp-card')?.dataset.ready==='true')
 await page.getByRole('button',{name:'Default',exact:true}).click()
 await page.getByRole('button',{name:'Сбросить профиль',exact:true}).click()
 for(const width of [319,320,370,409,410,424,425,426,461,462,533,534,535,719,720,721,767,768,769,1023,1024,1440,1920,1921]){
  await page.setViewportSize({width,height:1100})
  const sceneProfile=width>=1024&&width<=1920?'1024-1920':width>=534&&width<=720?'534-720':width<768?'base':'min-768'
  const bp=sceneProfile==='base'?'base':'min-768'
  const artworkProfile=bp
  await page.waitForFunction(bp=>document.querySelector('.chirp-card')?.dataset.breakpoint===bp,bp)
  await page.getByRole('button',{name:'Сбросить профиль',exact:true}).click()
  for(const state of ['Default','Hover','ActivePressed']){
   await page.getByRole('button',{name:state,exact:true}).click()
   await page.waitForFunction(state=>document.querySelector('.chirp-card')?.dataset.state===state,state)
   await page.waitForFunction(()=>[...document.querySelectorAll('.chirp-card img')].every(i=>i.complete&&i.naturalWidth>0))
   const actual=await root.evaluate(el=>{
    const rect=el.getBoundingClientRect()
    return {width:rect.width,height:rect.height,background:getComputedStyle(el).backgroundColor,overflow:document.documentElement.scrollWidth-innerWidth,
     copy:el.querySelector('h2').textContent,badges:[...el.querySelectorAll('li')].filter(n=>n.getClientRects().length).map(n=>n.textContent),
     layers:[...el.querySelectorAll('[class$="__pict"] [data-layer]')].map(n=>{const r=n.getBoundingClientRect();return {name:n.dataset.layer,x:r.x-rect.x,y:r.y-rect.y,width:r.width,height:r.height,filter:getComputedStyle(n).filter}}),
     images:[...el.querySelectorAll('img')].map(n=>({complete:n.complete,width:n.naturalWidth,url:n.currentSrc})),
     order:[...el.children].map(n=>n.className).filter(n=>n.endsWith('__pict')||n.endsWith('__cred'))}
   })
   assert.equal(actual.width,Math.min(430,width-(width<768?32:48)))
   assert.equal(actual.height,width<462?500:532)
   assert.equal(actual.background,'rgb(59, 114, 157)')
   assert.equal(actual.overflow,0)
   assert.equal(actual.copy,copy.title)
   assert.deepEqual(actual.badges,copy.badges[bp])
   assert.equal(actual.layers.length,10)
   assert.ok(actual.images.every(n=>n.complete&&n.width>0&&(n.url.includes('/dc-vendor-app-pr/card-layers/')||n.url.startsWith('data:image/svg+xml'))),JSON.stringify(actual.images))
   const source=sources.find(n=>n.name===`Breakpoint=${artworkProfile}, State=${state}`)
   const native=bp==='base'?264:430
   source.pict.layers.forEach((n,i)=>{
    const a=actual.layers[i]
    const position=preset.scenes[sceneProfile][state][i]
    assert.equal(a.name,n.name)
    for(const [key,target]of Object.entries({x:position.x+(n.name==='09-ostrich'?0:(actual.width-430)/2),y:position.y-(width>=320&&width<=424&&n.name!=='09-ostrich'&&n.name!=='08-dimmer'?50:0)+(width>=320&&width<=410&&['05-landform_city-1st','06-landform_city-2nd','04-water','07-tussock 1'].includes(n.name)?30:0),width:position.width,height:position.height}))assert.ok(Math.abs(a[key]-target)<.06,width+'/'+state+'/'+n.name+'/'+key+': '+a[key]+' != '+target)
   })
   assert.deepEqual(actual.order,['dc-vendor-app-pr__cred','dc-vendor-app-pr__pict'])
   const sky=actual.layers.find(l=>l.name==='00_sky'),dimmer=actual.layers.find(l=>l.name==='08-dimmer'),water=actual.layers.find(l=>l.name==='04-water')
   for(const l of [sky,dimmer,water])assert.ok(l.x<=.01&&l.x+l.width>=actual.width-.01,'Background must cover actual card width: '+width+'/'+state+'/'+l.name)
   records.responsive.push({viewport:width,breakpoint:bp,state,...actual})
  }
  if([320,370,425,534,720,768,1440].includes(width)){
   await page.getByRole('button',{name:'Default',exact:true}).click()
   await root.screenshot({path:evidence+`dc-vendor-app-pr-card-${width}.png`})
  }
 }
 // Match the two native Figma references exactly for visual comparison.
 for(const [width,cardWidth]of [[320,264],[1024,430]]){
  await page.setViewportSize({width,height:1100})
  await page.locator('.dc-vendor-app-pr-sandbox__preview').evaluate((el,width)=>el.style.width=width+'px',cardWidth)
  await page.getByRole('button',{name:'Default',exact:true}).click()
  await page.waitForFunction(width=>document.querySelector('.chirp-card').clientWidth===width,cardWidth)
  await root.screenshot({path:evidence+`dc-vendor-app-pr-card-reference-${cardWidth}.png`})
 }
 // Editor stores independent state/profile drafts; reload and reset preserve the contract.
 const x=page.getByRole('spinbutton',{name:'X',exact:true})
 const oldX=Number(await x.inputValue())
 await x.fill(String(oldX+12.5))
 await page.reload({waitUntil:'networkidle'})
 await page.getByRole('button',{name:'Default',exact:true}).click()
 assert.ok(Math.abs(Number(await x.inputValue())-oldX-12.5)<.01)
 await page.getByRole('button',{name:'Сбросить профиль',exact:true}).click()
 assert.ok(Math.abs(Number(await x.inputValue())-oldX)<.01)
 // Edits remain isolated across all four independently calibrated profiles.
 await page.locator('.dc-vendor-app-pr-sandbox__preview').evaluate(el=>el.style.removeProperty('width'))
 const edited=[]
 for(const viewport of [425,534,768,1024]){
  await page.setViewportSize({width:viewport,height:1100})
  await page.getByRole('button',{name:'Default',exact:true}).click()
  await page.getByRole('button',{name:/\u0421\u0431\u0440/}).click()
  const original=Number(await x.inputValue()),value=original+13+edited.length
  await x.fill(String(value));edited.push({viewport,original,value})
 }
 await page.reload({waitUntil:'networkidle'})
 for(const {viewport,value}of edited){await page.setViewportSize({width:viewport,height:1100});await page.getByRole('button',{name:'Default',exact:true}).click();assert.ok(Math.abs(Number(await x.inputValue())-value)<.01,'Independent editor profile '+viewport)}
 for(const {viewport,original}of edited){await page.setViewportSize({width:viewport,height:1100});await page.getByRole('button',{name:/\u0421\u0431\u0440/}).click();assert.ok(Math.abs(Number(await x.inputValue())-original)<.01,'Independent profile reset '+viewport)}
 await page.setViewportSize({width:1024,height:1100})
 await page.getByRole('button',{name:'Interaction',exact:true}).click()
 await page.emulateMedia({reducedMotion:'no-preference'})
 await root.hover()
 await page.mouse.down()
 assert.equal(await root.getAttribute('data-state'),'ActivePressed')
 await root.dispatchEvent('pointercancel',{pointerType:'mouse'})
 assert.equal(await root.getAttribute('data-state'),'Default')
 await page.mouse.up()
 await root.focus()
 await page.keyboard.down('Enter')
 assert.equal(await root.getAttribute('data-state'),'ActivePressed')
 await page.keyboard.up('Enter')
 assert.equal(await root.getAttribute('data-state'),'Default')
 await page.emulateMedia({reducedMotion:'reduce'})
 assert.equal(await page.locator('.dc-vendor-app-pr__pict [data-layer]').first().evaluate(n=>getComputedStyle(n).transitionDuration),'0s')
 for(const mode of ['delay','error']){
  const c=await browser.newContext({viewport:{width:1024,height:900},reducedMotion:'reduce'})
  const p=await c.newPage()
  let release;const gate=new Promise(r=>release=r)
  await p.route('**/00-sky.png*',async route=>{if(route.request().resourceType()!=='image'){await route.continue();return}if(mode==='delay'){await gate;await route.continue()}else await route.abort()})
  await p.goto(url,{waitUntil:'domcontentloaded'})
  const card=p.locator('.chirp-card')
  await card.waitFor()
  if(mode==='delay'){
   await p.waitForFunction(()=>document.querySelector('.chirp-card')?.dataset.mediaState==='loading')
   assert.equal(await p.locator('.dc-vendor-app-pr__pict').evaluate(n=>getComputedStyle(n).visibility),'hidden')
   assert.equal(await p.locator('h2').evaluate(n=>getComputedStyle(n).visibility),'visible')
   assert.equal(await card.evaluate(n=>getComputedStyle(n,'::after').animationName),'none')
   await card.screenshot({path:evidence+'dc-vendor-app-pr-card-skeleton.png'})
   release()
   await p.waitForFunction(()=>document.querySelector('.chirp-card')?.dataset.mediaState==='ready')
  }else await p.waitForFunction(()=>document.querySelector('.chirp-card')?.dataset.mediaState==='error')
  records.loading.push({mode,state:await card.getAttribute('data-media-state'),height:(await card.boundingBox()).height})
  await c.close()
 }
 assert.deepEqual(records.errors,[])
 writeFileSync(evidence+'dc-vendor-app-pr-card-verification.json',JSON.stringify(records,null,2))
 console.log('PASS 24 widths × 3 states, source base/min-768 artwork, assets/orders, editor persistence/reset, keyboard/cancel/reduced-motion, local delay/error')
}finally{await browser.close()}

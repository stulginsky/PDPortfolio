import assert from 'node:assert/strict'
import {writeFileSync,readFileSync} from 'node:fs'
import {chromium} from 'playwright'
const geometrySource=readFileSync('app/components/dc-vendor-app-pr.geometry.ts','utf8')
const geometry=JSON.parse(geometrySource.slice(geometrySource.indexOf('{'),geometrySource.lastIndexOf(' as const')))
const parts=JSON.parse(readFileSync('app/components/dc-vendor-app-pr.parts.json','utf8'))
const presets=JSON.parse(readFileSync('app/components/dc-vendor-app-pr.scenes.json','utf8'))
const browser=await chromium.launch({headless:true})
const evidence={profiles:[],errors:[]}
try {
 for(const width of [320,425,534,720,768,1024,1920]){
  const page=await browser.newPage({viewport:{width,height:1100},reducedMotion:'no-preference'})
  page.on('pageerror',e=>evidence.errors.push(e.message))
  await page.goto('http://127.0.0.1:6006/iframe.html?id=compositions-showcase-cards-dcvendorapp-pr--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'})
  await page.waitForFunction(()=>window.__STORYBOOK_PREVIEW__?.currentRender?.phase==='finished')
  const root=page.locator('.dc-vendor-app-pr.chirp-card')
  await page.waitForFunction(()=>document.querySelector('.chirp-card')?.dataset.ready==='true')
  await page.getByRole('button',{name:'Default',exact:true}).click()
  await page.getByRole('button',{name:'Сбросить профиль',exact:true}).click()
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.getByRole('button',{name:'Interaction',exact:true}).click()
  await page.mouse.move(0,0)
  await page.emulateMedia({reducedMotion:'no-preference'})
  const result=await root.evaluate(async root=>{
   const scene=root.querySelector('.dc-vendor-app-pr__pict')
   const nodes=[...scene.querySelectorAll('[data-layer]')]
   const images=nodes.flatMap(n=>[...n.querySelectorAll('img')])
   const initialSources=images.map(i=>i.currentSrc)
   const read=()=>{
    const parent=scene.getBoundingClientRect()
    return {t:performance.now(),state:root.dataset.state,stableSources:images.every((img,i)=>img.currentSrc===initialSources[i]),layers:nodes.map(n=>{
     const r=n.getBoundingClientRect()
     return {name:n.dataset.layer,x:r.x-parent.x,y:r.y-parent.y,w:r.width,h:r.height,layoutW:n.clientWidth,layoutH:n.clientHeight,
      images:[...n.querySelectorAll('img')].map(i=>{const a=i.getBoundingClientRect();return {x:(a.x-r.x)/r.width,y:(a.y-r.y)/r.height,w:a.width/r.width,h:a.height/r.height,opacity:Number(getComputedStyle(i).opacity)}}),
      parts:[...n.querySelectorAll('[data-part]')].map(p=>{const a=p.getBoundingClientRect();return {name:p.dataset.part,x:a.x-r.x,y:a.y-r.y,w:a.width,h:a.height,opacity:Number(getComputedStyle(p).opacity)}})}
    })}
   }
   const sample=async(ms)=>{
    const frames=[read()]
    if(ms<=100){const start=performance.now();do{await new Promise(requestAnimationFrame);frames.push(read())}while(performance.now()-start<ms);return frames}
    // Drive actual CSS transitions at exact timeline fractions. Host CPU load must
    // not turn a short reverse transition into a false "no intermediate frame".
    await Promise.resolve()
    nodes.forEach(n=>getComputedStyle(n).transform)
    const animations=scene.getAnimations({subtree:true})
    for(const a of animations){a.pause();a.currentTime=0}
    for(const fraction of [0,.1,.2,.3,.4,.5,.6,.7,.8,.9,1]){
     for(const a of animations)a.currentTime=Number(a.effect.getTiming().duration)*fraction
     frames.push(read())
     await new Promise(requestAnimationFrame)
    }
    animations.forEach(a=>a.finish())
    frames.push(read())
    return frames
   }
   const pointer=type=>root.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerType:'mouse',button:0}))
   const start=read()
   pointer('pointerenter');const enter=await sample(360)
   pointer('pointerdown');const press=await sample(210)
   pointer('pointerup');const release=await sample(360)
   pointer('pointerleave');const leave=await sample(360)
   pointer('pointerenter');const partial=await sample(95)
   pointer('pointerleave');const reversed=await sample(360)
   return {start,enter,press,release,leave,partial,reversed,
    stableDom:nodes.every((n,i)=>scene.querySelectorAll('[data-layer]')[i]===n)&&images.every(i=>i.isConnected)}
  })
  const sceneProfile=width>=1024&&width<=1920?'1024-1920':width>=534&&width<=720?'534-720':width<768?'base':'min-768'
  const bp=sceneProfile==='base'?'base':'min-768'
  const reference=geometry[bp].Default.layers
  assert.ok(result.stableDom,'Images must not remount during a transition')
  for(const [key,state]of [['enter','Hover'],['press','ActivePressed'],['release','Hover'],['leave','Default'],['reversed','Default']]){
   const frames=result[key],last=frames.at(-1)
   for(const l of last.layers){
    const target=presets.scenes[sceneProfile][state][presets.layers.indexOf(l.name)]
    assert.ok(Math.abs(l.w-target.width)<.08,key+'/'+l.name+' width '+l.w+' != '+target.width)
    assert.ok(Math.abs(l.h-target.height)<.08,key+'/'+l.name+' height '+l.h+' != '+target.height)
   }
   const city=last.layers.find(l=>l.name==='05-landform_city-1st')
   assert.equal(city.images.length,11,'One island, decoration, three labels, three lines and three dots')
   assert.deepEqual(city.parts.map(p=>p.name),parts.reference.map(p=>p.name))
   for(const [i,p]of city.parts.entries()){
    const target=parts.scenes[bp][state][i]
    const parent=presets.scenes[sceneProfile][state][presets.layers.indexOf('05-landform_city-1st')]
    const native=geometry[bp][state].layers.find(l=>l.name==='05-landform_city-1st')
    const sx=parent.width/native.width,sy=parent.height/native.height
    for(const [key,value]of Object.entries({x:target.x*sx,y:target.y*sy,w:target.width*sx,h:target.height*sy}))
     assert.ok(Math.abs(p[key]-value)<.08,state+'/'+p.name+'/'+key+' '+p[key]+' != '+value)
   }
   const ostrich=last.layers.find(l=>l.name==='09-ostrich')
   assert.ok(Math.abs(ostrich.images[0].w-1)<.001,'Actual ostrich SVG must fill the animated width')
   assert.ok(Math.abs(ostrich.images[0].h-1)<.001,'Actual ostrich SVG must fill the animated height')
   // Layout and normalized asset coordinates remain fixed throughout motion.
   for(const f of frames)for(const [i,l]of f.layers.entries()){
    assert.ok(f.stableSources,'No state asset swaps')
    assert.equal(l.layoutW,Math.round(l.name==='04-water'&&((width>=320&&width<=768)||(width>=1024&&width<=1920))?430:reference[i].width),'Stable native layout width')
    assert.equal(l.layoutH,Math.round(l.name==='04-water'&&((width>=320&&width<=768)||(width>=1024&&width<=1920))?186:reference[i].height),'Stable native layout height')
    for(const [j,img]of l.images.entries()){
     assert.equal(img.opacity,1,'No fading painted parts: '+l.name)
    }
    assert.ok(l.parts.every(p=>p.opacity===1),'Opaque part wrappers')
    if(reference[i].exportRect&&l.name!=='04-water')for(const [j,img]of l.images.entries())for(const prop of ['x','y','w','h'])
     assert.ok(Math.abs(img[prop]-frames[0].layers[i].images[j][prop])<.002,key+'/'+l.name+' normalized '+prop)
   }
   const leverage=frames.map(f=>f.layers.find(l=>l.name==='05-landform_city-1st').parts.find(p=>p.name==='steps/Group 478/Leverage').y)
   const low=Math.min(leverage[0],leverage.at(-1)),high=Math.max(leverage[0],leverage.at(-1))
   // CSS shortens interrupted reverse transitions; they may span only a few frames.
   if(high-low>1)assert.ok(new Set(leverage.filter(y=>y>low+.1&&y<high-.1).map(y=>y.toFixed(2))).size>=(key==='reversed'?1:2),width+'/'+key+' Real intermediate Leverage positions '+JSON.stringify(leverage))
   const birdFrames=frames.map(f=>f.layers.find(l=>l.name==='09-ostrich').w)
   assert.ok(birdFrames.slice(1,-1).some(w=>w>Math.min(birdFrames[0],birdFrames.at(-1))+.1&&w<Math.max(birdFrames[0],birdFrames.at(-1))-.1),width+'/'+key+' Real intermediate sizes '+JSON.stringify(birdFrames))
   // No oscillation/overshoot in the ease-out transitions, including interruption.
   const sign=Math.sign(birdFrames.at(-1)-birdFrames[0])
   for(let i=1;i<birdFrames.length;i++)assert.ok((birdFrames[i]-birdFrames[i-1])*sign>=-.05,'Continuous monotonic SVG animation')
  }
  const partial=result.partial.at(-1).layers.find(l=>l.name==='09-ostrich').w
  const reversed=result.reversed[0].layers.find(l=>l.name==='09-ostrich').w
  assert.ok(Math.abs(partial-reversed)<.2,'Reversal starts from the visible frame')
  await root.hover()
  await page.waitForTimeout(350)
  await root.screenshot({path:'E:/GitHub/PDPortfolio-DS/ds/evidence/dc-vendor-app-pr-card-motion-'+width+'.png'})
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.mouse.down()
  const reduced=await root.evaluate(r=>({state:r.dataset.state,durations:[...r.querySelectorAll('.dc-vendor-app-pr__pict [data-layer]')].map(n=>getComputedStyle(n).transitionDuration)}))
  assert.equal(reduced.state,'ActivePressed');assert.ok(reduced.durations.every(x=>x==='0s'))
  await page.mouse.up()
  evidence.profiles.push({width,breakpoint:bp,reduced,...result})
  await page.close()
 }
 assert.deepEqual(evidence.errors,[])
 writeFileSync('E:/GitHub/PDPortfolio-DS/ds/evidence/dc-vendor-app-pr-card-motion.json',JSON.stringify(evidence,null,2)+'\n')
 console.log('PASS base/web opaque separate island/flags, no asset swaps, source leaf geometry, intermediate Leverage positions, stable DOM, ostrich scaling, reversal and reduced motion')
}finally{await browser.close()}

import assert from 'node:assert/strict'
import fs from 'node:fs'
import {chromium} from 'playwright'
import {createHeroDraft,heroBreakpoints,heroReferences,restoreHeroDraft,validHeroDraft} from '../app/components/dc-vendor-app-pr-hero.scene-context.ts'
const current=createHeroDraft(),baseline=createHeroDraft()
for(const bp of heroBreakpoints){
 baseline[bp].find(l=>l.name==='Title').y-=bp==='base'?44:bp==='min-768'?24:0
 baseline[bp].find(l=>l.name==='07-tussock').name='07-tussock 1'
 baseline[bp].splice(3,0,{...baseline[bp][2],name:'04-water'})
}
const scenes=structuredClone(baseline)
for(const bp of heroBreakpoints)scenes[bp].find(l=>l.name==='02-cloud').x+=17.5
const restored=restoreHeroDraft(scenes)
assert.ok(validHeroDraft(restored))
for(const bp of heroBreakpoints){assert.equal(restored[bp].length,8);assert.equal(restored[bp][1].x,scenes[bp][1].x);assert.equal(restored[bp][5].name,'07-tussock')}
assert.equal(restoreHeroDraft({base:[]}),undefined)
const browser=await chromium.launch()
const evidence=[]
try{
 const page=await browser.newPage({viewport:{width:320,height:900},reducedMotion:'reduce'})
 await page.addInitScript(saved=>localStorage.setItem('pdportfolio:dc-vendor-app-pr-hero:scene:v1',JSON.stringify(saved)),{version:2,scenes,baseline})
 await page.goto('http://127.0.0.1:6006/iframe.html?id=compositions-case-heroes-dcvendorapp-pr-hero--sandbox&viewMode=story&embed=true',{waitUntil:'networkidle'})
 await page.getByRole('button',{name:'Neutral',exact:true}).click()
 const select=page.getByRole('combobox',{name:'Слой',exact:true})
 assert.equal(await select.locator('option').count(),8)
 await select.selectOption('1')
 assert.equal(Number(await page.getByRole('spinbutton',{name:'X',exact:true}).inputValue()),scenes.base[1].x)
 await select.selectOption('7')
 assert.equal(Number(await page.getByRole('spinbutton',{name:'Y',exact:true}).inputValue()),current.base[7].y)
 evidence.push({legacyDraft:'v2',customCloudX:'preserved',untouchedTitleY:'updated',water:'removed',tussock:'renamed'})
 for(const width of [320,768,1024,1280,1440,1920]){
  const p=await browser.newPage({viewport:{width,height:1000},javaScriptEnabled:false})
  await p.goto('http://127.0.0.1:3000/cases/dc-vendor-app-pr/',{waitUntil:'networkidle'})
  const root=p.locator('.dc-vendor-app-pr-hero'),box=await root.boundingBox()
  const bp=[...heroBreakpoints].reverse().find(b=>b==='base'||width>=Number(b.slice(4)))
  assert.ok(Math.abs(box.height-width*heroReferences[bp].height/heroReferences[bp].width)<.1,`SSR width ${width}: ${box.height}`)
  assert.equal(await root.locator('picture').count(),8)
  assert.equal(await root.locator('[data-layer="04-water"]').count(),0)
  evidence.push({width,ssrHeight:box.height,expected:width*heroReferences[bp].height/heroReferences[bp].width})
  await p.close()
 }
 fs.writeFileSync('E:/GitHub/PDPortfolio-DS/ds/evidence/dc-vendor-app-pr-hero-revision-check.json',JSON.stringify(evidence,null,2)+'\n')
 console.log('Passed: historical draft migration, custom settings, updated defaults, all six SSR profiles, eight layers.')
}finally{await browser.close()}

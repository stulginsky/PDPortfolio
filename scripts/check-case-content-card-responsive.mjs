import {chromium} from 'playwright'
import fs from 'node:fs'
const browser=await chromium.launch({headless:true})
const report=[]
for(const route of ['http://localhost:6006/iframe.html?id=components-casecontentcard--existing-grid&viewMode=story','http://localhost:3000/cases/dc-vendor-app-pr/','http://localhost:3000/cases/dc-vendor-app-ux/']){
 for(const sample of [...[320,534,768,1024,1280,1303,1304,1440,1919,1920,2400].map(width=>({width,classic:false})),{width:1920,classic:true}]){
  const {width,classic}=sample
  const p=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'})
  const errors=[];p.on('pageerror',e=>errors.push(e.message))
  await p.goto(route,{waitUntil:'networkidle'})
  if(classic)await p.addStyleTag({content:'html{scrollbar-gutter:stable!important}'})
  await p.evaluate(()=>document.fonts.ready)
  for(const grid of await p.locator('.case-content-layout').all()){await grid.scrollIntoViewIfNeeded();await grid.locator('img').evaluateAll(async es=>{await Promise.all(es.map(i=>i.decode()))})}
  const grids=await p.locator('.case-content-layout').evaluateAll(es=>es.map(e=>({available:e.clientWidth,cards:[...e.querySelectorAll('article')].map(c=>{const r=c.getBoundingClientRect(),i=c.querySelector('img'),ir=i.getBoundingClientRect(),style=getComputedStyle(c);return {x:r.x,y:r.y,w:r.width,h:r.height,mediaHeight:ir.height,framed:style.borderTopWidth!=='0px',font:getComputedStyle(c.querySelector('h3')).fontSize,ratioError:Math.abs(ir.width/ir.height-Number(i.getAttribute('width'))/Number(i.getAttribute('height')))}})})))
  for(const g of grids)for(const c of g.cards){if(c.w>(c.framed?852:544)+.2||c.framed&&c.w<543.9||c.ratioError>.005)throw Error(JSON.stringify({route,width,g}))}
  if(errors.length)throw Error(errors.join('\n'))
  if(width===1920&&route.includes('3000')){
   const contribution=grids.at(-1)
   if(new Set(contribution.cards.map(c=>Math.round(c.y))).size!==1)throw Error('1920 contribution wrapped: '+JSON.stringify({route,classic,grids}))
  }
  for(const g of grids){const rows=new Map();for(const c of g.cards){const key=Math.round(c.y);const h=rows.get(key);if(h!==undefined&&Math.abs(h-c.mediaHeight)>.1)throw Error('Unequal row media heights');rows.set(key,c.mediaHeight)}}
  const overflow=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)
  if(overflow>0)throw Error('Document overflow '+overflow)
  if([534,1440,1920].includes(width)&&route.includes('6006'))await p.screenshot({path:'tmp/case-card-grid-'+width+'.png',fullPage:true})
  if(classic)await p.locator('.case-content-layout').last().screenshot({path:'tmp/case-card-classic-'+(route.includes('6006')?'storybook':route.includes('-pr/')?'pr':'ux')+'.png'})
  report.push({route,width,classic,grids})
  await p.close()
 }
}
fs.mkdirSync('E:/GitHub/PDPortfolio-DS/ds/evidence/case-content-card-responsive-2026-10-26',{recursive:true})
fs.writeFileSync('E:/GitHub/PDPortfolio-DS/ds/evidence/case-content-card-responsive-2026-10-26/verification.json',JSON.stringify(report,null,2))
console.log(report.length+' route/width checks passed; design frame ratios, aligned row media,1920 columns including classic scrollbar')
await browser.close()

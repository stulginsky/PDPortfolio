import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,channel:'msedge'});
await fs.mkdir('tmp/4real-case',{recursive:true});
try {
 const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const mock=function(){window.Sketchfab=function(){this.init=function(uid,o){window.caseSdkOptions={scrollwheel:o.scrollwheel};window.caseSdkInitializations=(window.caseSdkInitializations||0)+1;o.success({start(){},stop(){},addEventListener(n,c){setTimeout(c,0)}})}}};
 await page.route('https://static.sketchfab.com/api/**',r=>r.fulfill({contentType:'application/javascript',body:'('+mock.toString()+')()'}));
 await page.goto('http://127.0.0.1:3000/cases/4real-3dweapon',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelector('.weapon-case-landing')?.contentDocument?.documentElement.dataset.landingRevealed==='true');
 await page.evaluate(()=>document.fonts.ready);
 const iframe=page.locator('.weapon-case-landing');
 await iframe.evaluate(e=>e.dataset.testIdentity='stable-viewer');
 const frame=page.frames().find(f=>f.url().includes('/cases/3D_Weapon/home.html'));
 assert.equal(await frame.evaluate(()=>caseSdkOptions.scrollwheel),0);
 const geometry=await page.evaluate(()=>{
  const r=s=>document.querySelector(s).getBoundingClientRect();return {column:r('.weapon-case__column').toJSON(),opening:r('.weapon-case__opening').toJSON(),landing:r('.weapon-case__landing').toJSON()};
 });
 assert.equal(geometry.column.x,498);assert.equal(geometry.column.y,144);assert.equal(geometry.column.width,924);
 assert.equal(geometry.opening.height,660);assert.equal(geometry.landing.y,660);assert.equal(geometry.landing.height,1080);
 const firstParagraph=await page.locator('.weapon-case__copy p').first().boundingBox();
 for(const y of [0,220,440,660,330,0]){
  await page.evaluate(y=>scrollTo(0,y),y);
  await page.waitForFunction(y=>Math.abs(scrollY-y)<1,y);
  const sample=await page.evaluate(()=>{const r=document.querySelector('.weapon-case__landing').getBoundingClientRect();return {landingTop:r.top,topElement:document.elementFromPoint(innerWidth/2,160)?.tagName}});
  assert.ok(Math.abs(sample.landingTop-(660-y))<1);
  assert.equal(await iframe.getAttribute('data-test-identity'),'stable-viewer');
  assert.equal(await frame.evaluate(()=>caseSdkInitializations),1);
  if(y===660)assert.equal(sample.topElement,'IFRAME');
  if(y===0)assert.ok(Math.abs((await page.locator('.weapon-case__copy p').first().boundingBox()).y-firstParagraph.y)<1);
  await page.screenshot({path:`tmp/4real-case/desktop-scroll-${y}.png`});
 }
 for (const [width,height] of [[1280,720],[1366,768],[1920,1080]]) {
  await page.setViewportSize({width,height});
  await page.waitForTimeout(150);
  await page.evaluate(()=>scrollTo(0,1e6));
  await page.waitForTimeout(100);
  const end=await page.evaluate(()=>({top:document.querySelector('.weapon-case__landing').getBoundingClientRect().top,max:document.documentElement.scrollHeight-innerHeight,scroll:scrollY,back:document.elementFromPoint(48,48)?.closest('.weapon-case__back')!==null,childOverflow:document.querySelector('.weapon-case-landing').contentDocument.documentElement.scrollHeight>document.querySelector('.weapon-case-landing').clientHeight+1}));
  assert.ok(Math.abs(end.top)<1,JSON.stringify(end));assert.equal(end.scroll,end.max);assert.equal(end.back,true);assert.equal(end.childOverflow,false);
  await page.screenshot({path:`tmp/4real-case/end-stop-${width}.png`});
 }
 await page.evaluate(()=>scrollTo(0,0));
 for(const width of [320,375,425,768,1024,1280,1920,2560]){
  await page.setViewportSize({width,height:1080});
  await page.waitForTimeout(100);
  await page.waitForFunction(()=>{const f=document.querySelector('.weapon-case-landing'),d=f.contentDocument;return innerWidth<1280 ? d.documentElement.classList.contains('weapon-mobile-scroll')&&Math.abs(f.clientHeight-innerHeight)<1 : d.documentElement.scrollHeight<=f.clientHeight+1});
  const result=await page.evaluate(()=>{const f=document.querySelector('.weapon-case-landing'),d=f.contentDocument;return {width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,childOverflow:d.documentElement.scrollWidth>d.documentElement.clientWidth,height:f.clientHeight,body:d.body.getBoundingClientRect().height}});
  assert.equal(result.overflow,false);assert.equal(result.childOverflow,false);
  if([320,768,1920].includes(width))await page.screenshot({path:`tmp/4real-case/initial-${width}.png`,fullPage:true});
  console.log('Responsive',result);
 }
 // Shrinking the iframe must not retain a previous viewport's tall blank canvas.
 await page.setViewportSize({width:768,height:820});await page.waitForTimeout(100);
 const tall=await page.locator('.weapon-case__landing').evaluate(e=>e.offsetHeight);
 await page.setViewportSize({width:320,height:820});
 await page.waitForFunction(tall=>document.querySelector('.weapon-case__landing').offsetHeight<tall,tall);
 assert.equal(await iframe.evaluate(e=>e.clientHeight),820);
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('.weapon-case__opening').evaluate(e=>getComputedStyle(e).position),'relative');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.setViewportSize({width:1920,height:1080});await page.evaluate(()=>scrollTo(0,400));
 await page.locator('.ds-page-up button').click();await page.waitForFunction(()=>scrollY<1);
 assert.equal(errors.length,0,errors.join('\n'));
 await page.goto('http://127.0.0.1:3000/',{waitUntil:'domcontentloaded'});
 await page.locator('.card-4real-3dweapon').waitFor();
  await page.waitForFunction(()=>document.querySelector('.card-4real-3dweapon')?.dataset.sequence!=='loading');
 await Promise.all([page.waitForURL('**/cases/4real-3dweapon'),page.locator('.card-4real-3dweapon').press('Enter')]);
 await page.getByRole('link',{name:/Вернуться/}).click();await page.waitForURL('http://127.0.0.1:3000/');
 console.log('PASS: Figma geometry, reversible curtain, stable viewer, responsive iframe shrinking, reduced motion, PageUp, showcase keyboard link and Back');
}finally{await browser.close()}

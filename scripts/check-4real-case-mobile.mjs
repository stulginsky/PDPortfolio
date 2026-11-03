import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const b=await chromium.launch({headless:true,channel:'msedge'});
try {
const p=await b.newPage({viewport:{width:375,height:820},hasTouch:true}),errors=[];
p.on('pageerror',e=>errors.push(e.message));
if(!process.argv.includes('--real'))await p.route('https://static.sketchfab.com/api/**',r=>r.fulfill({contentType:'application/javascript',body:`window.Sketchfab=function(){this.init=function(uid,o){o.success({start(){},stop(){},addEventListener(n,c){setTimeout(c,0)}})}}`}));
await p.goto('http://127.0.0.1:3000/cases/4real-3dweapon');
const f=p.frames().find(f=>f.url().includes('/cases/3D_Weapon/home.html'));
await f.waitForFunction(()=>document.documentElement.dataset.landingRevealed==='true'&&window.weaponMobileLayout,null,{timeout:90000});
await f.waitForFunction(()=>!document.documentElement.classList.contains('landing-entering'));
for(const [width,height] of [[375,820],[320,568],[425,950],[534,820],[768,1600]]) {
 await p.setViewportSize({width,height});await p.waitForTimeout(200);
 const m=await f.evaluate(()=>weaponMobileLayout.measure());
 const centers=await f.evaluate(()=>['.weapon-limited','.weapon-timer'].map(s=>{const r=document.querySelector(s).getBoundingClientRect();return r.left+r.width/2-innerWidth/2}));
 assert.ok(centers.every(x=>Math.abs(x)<1),JSON.stringify({width,centers}));
 const opening=await p.locator('.weapon-case__opening').evaluate(e=>e.offsetHeight);
 for(const offset of [0,Math.min(150,m.height-height),Math.max(0,m.height-height)]) {
  await p.evaluate(y=>scrollTo(0,y),opening+Math.max(0,offset));await p.waitForTimeout(150);
  const state=await f.evaluate(()=>{
   const r=s=>document.querySelector(s).getBoundingClientRect().toJSON();
   return {offset:Number(document.documentElement.dataset.mobileScrollOffset),header:r('.weapon-header'),menu:r('.weapon-model-menu'),button:r('.weapon-get-button'),title:r('.weapon-product-title'),footer:r('.ds-footer'),pinned:document.documentElement.classList.contains('weapon-mobile-stack-pinned'),inner:scrollY,blur:getComputedStyle(document.querySelector('.weapon-mobile-blur')).opacity,overflow:document.documentElement.scrollWidth>innerWidth};
  });
  assert.equal(state.header.top,0);assert.equal(state.inner,0);assert.equal(state.overflow,false);
  assert.equal(await p.evaluate(()=>!!document.elementFromPoint(48,48)?.closest('.weapon-case__back')),false);
  assert.ok(Math.abs(state.offset-Math.max(0,offset))<=1,JSON.stringify({width,m,state}));
  assert.equal(state.pinned,Math.max(0,m.height-height)>m.pinAt&&offset>=m.pinAt);
  if(offset===Math.max(0,m.height-height))assert.ok(state.footer.bottom<=height+1,JSON.stringify(state));
  await p.screenshot({path:`tmp/4real-case/mobile-scroll-${width}-${Math.round(Math.max(0,offset))}.png`});
  console.log(width,height,offset,state.button.top,state.footer.bottom,state.pinned);
 }
}
await p.setViewportSize({width:375,height:820});await p.waitForTimeout(200);
for(const name of ['awp','knife','m4a1']) {
 await f.evaluate(n=>weaponNavigation.select(n,false),name);await f.waitForFunction(n=>document.documentElement.dataset.activePage===n,name);
 const child=f.childFrames().find(c=>c.name()==='weapon-page-'+name);
 await child.waitForFunction(()=>window.weaponMobileLayout);
 await p.evaluate(()=>scrollTo(0,1e6));await p.waitForTimeout(150);
 assert.equal(await child.evaluate(()=>scrollY),0);
 assert.equal(await child.evaluate(()=>Number(document.documentElement.dataset.mobileScrollOffset)),await f.evaluate(()=>Number(document.documentElement.dataset.mobileScrollOffset)));
 assert.equal(await f.locator('.weapon-footer-slot').evaluate(e=>getComputedStyle(e.parentElement).opacity),'1');
 await p.screenshot({path:`tmp/4real-case/mobile-cached-${name}.png`});
}
if(process.argv.includes('--real')) {
 const child=f.childFrames().find(c=>c.name()==='weapon-page-m4a1');
 await p.evaluate(()=>scrollTo(0,document.querySelector('.weapon-case__opening').offsetHeight));await p.waitForTimeout(200);
 const cdp=await p.context().newCDPSession(p);
 const touch=(type,points)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points.map(([x,y,id])=>({x,y,id,radiusX:3,radiusY:3}))});
 const before=await p.evaluate(()=>scrollY);
 await touch('touchStart',[[170,350,1]]);
 for(let y=330;y>=200;y-=20){await touch('touchMove',[[170,y,1]]);await p.waitForTimeout(25)}
 await touch('touchEnd',[]);await p.waitForTimeout(300);
 assert.ok(await p.evaluate(()=>scrollY)>before);
 await child.evaluate(()=>{window.cameraMoves=0;const move=weaponModelApi.setCameraLookAt;weaponModelApi.setCameraLookAt=function(){cameraMoves++;return move.apply(this,arguments)}});
 const fixed=await p.evaluate(()=>scrollY);
 await touch('touchStart',[[120,180,1],[230,180,2]]);await p.waitForTimeout(200);
 for(let i=1;i<=5;i++){await touch('touchMove',[[120-i*4,180,1],[230+i*4,180,2]]);await p.waitForTimeout(50)}
 await touch('touchEnd',[]);
 assert.ok(await child.evaluate(()=>cameraMoves)>0);assert.equal(await p.evaluate(()=>scrollY),fixed);
 console.log('PASS native one-finger outer scrolling and two-finger camera');
}
await p.setViewportSize({width:1366,height:768});await p.waitForTimeout(200);
console.log('Desktop resize',await f.evaluate(()=>({width:innerWidth,classes:document.documentElement.className})));
await f.waitForFunction(()=>!document.documentElement.classList.contains('weapon-mobile-scroll'));
assert.equal(await f.evaluate(()=>document.documentElement.classList.contains('weapon-mobile-scroll')),false);
assert.deepEqual(errors,[]);
console.log('PASS conditional pinning, all-fit viewport, all3 cached pages, desktop restore');
await p.setViewportSize({width:534,height:820});
await p.goto('http://127.0.0.1:3000/cases/3D_Weapon/awp.html');
await p.waitForFunction(()=>window.weaponMobileLayout&&document.documentElement.dataset.modelState==='ready',null,{timeout:90000});
await p.evaluate(()=>scrollTo(0,1e6));await p.waitForTimeout(200);
const standalone=await p.evaluate(()=>({scroll:scrollY,offset:Number(document.documentElement.dataset.mobileScrollOffset),header:document.querySelector('.weapon-header').getBoundingClientRect().top,footer:document.querySelector('.ds-footer').getBoundingClientRect().bottom,pinned:document.documentElement.classList.contains('weapon-mobile-stack-pinned')}));
assert.ok(standalone.scroll>0);assert.equal(standalone.scroll,standalone.offset);assert.equal(standalone.header,0);assert.ok(standalone.footer<=821);assert.equal(standalone.pinned,true);
console.log('PASS standalone mobile landing',standalone);
}finally{await b.close()}

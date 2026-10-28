import {chromium} from 'playwright'
const b=await chromium.launch()
const p=await b.newPage()
await p.goto('http://127.0.0.1:6006/?path=/story/compositions-showcase-cards-dcpickerapp-ux--sandbox')
const f=p.frameLocator('#storybook-preview-iframe')
const toggle=f.getByRole('checkbox',{name:'Открывать почтовый клиент'})
await toggle.waitFor()
await p.waitForTimeout(1500)
console.log('iframe',await p.locator('#storybook-preview-iframe').evaluate(e=>({sandbox:e.getAttribute('sandbox'),allow:e.getAttribute('allow')})))
console.log('initial',await toggle.isChecked())
await toggle.check()
const link=f.getByRole('link',{name:/Скоро/})
console.log(await link.evaluate(el=>{
 const result={href:el.href,prevented:null}
 const listener=e=>{result.prevented=e.defaultPrevented;e.preventDefault()}
 el.addEventListener('click',listener,{once:true})
 el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}))
 return result
}))
await b.close()

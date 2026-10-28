import type {Meta,StoryObj} from '@storybook/vue3-vite'
import {expect,userEvent,waitFor} from 'storybook/test'
import ChirpBrHero from './ChirpBrHero.vue'
import ChirpBrHeroSandbox from './ChirpBrHeroSandbox.vue'
import content from '../../content/cases/chirp-brand.json'
import {createHeroDraft,getHeroBreakpoint} from './chirp-br-hero.scene-context'
const meta={
 title:'Compositions/Case heroes/Chirp-Br-hero',component:ChirpBrHero,tags:['autodocs'],
 args:{role:content.hero.role,focus:content.hero.focus},
 parameters:{layout:'fullscreen',docs:{description:{component:`
[Figma1464:7870](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1464-7870)

CSS selects the original responsive scene before JavaScript. Only the selected profile requests its original assets. Local loading shimmer waits for image decode; RoleFocus remains available. Mounted handover removes initial alternatives without a geometry change.\n\n<details><summary>Техническое описание</summary>

Шесть mobile-first профилей. Playfair/PT Sans локально, Role-Focus из DS. Оригинальные SVG и изображения, исходные преобразования и порядок слоёв. Пробный параллакс, вступление после загрузки и reduced motion. Sandbox: X/Y исходного Figma reference, вязкость, скорость возврата, базовое смещение, амплитуда, направление вступления, выключатель слоя, сбросы, локальные черновики и JSON. Страница кейса не подключена.

Общая шкала hero-motion: отклик100ms×вязкость, возврат600ms/скорость возврата после80ms без движения. Базовое смещение — физические px; JSON v2, старые черновики мигрируют.

</details>`}}},
} satisfies Meta<typeof ChirpBrHero>
export default meta
type Story=StoryObj<typeof meta>
export const Sandbox:Story={
 render:args=>({components:{ChirpBrHeroSandbox},setup:()=>({args}),template:'<ChirpBrHeroSandbox :hero-args="args" />'}),
 play:async({canvas,canvasElement})=>{
  if(new URLSearchParams(window.location.search).get('embed')==='true')return
  const presets=createHeroDraft()
  const upperArrows=['1464:7813','1464:7529','1464:7470','1464:7411','1464:6369']
  for(const layers of Object.values(presets)) {
   expect(layers.find(layer=>layer.name==='img-sign')?.pointerDirection).toBe(1)
   for(const layer of layers.filter(layer=>upperArrows.includes(layer.id))) {
    expect(layer.viscosity).toBe(.6)
    expect(layer.pointerDirection).toBe(1)
   }
  }
  expect(presets['min-768'].some(layer=>upperArrows.includes(layer.id))).toBe(false)
  const root=canvasElement.querySelector<HTMLElement>('.chirp-br-hero')!
  await waitFor(()=>expect(root.dataset.ready).toBe('true'))
  await waitFor(()=>expect(root.dataset.mediaState).toBe('ready'))
  await expect(root.querySelectorAll('.chirp-br-hero__initial')).toHaveLength(0)
  await waitFor(()=>expect(root.dataset.breakpoint).toBe(getHeroBreakpoint(window.innerWidth)))
  await waitFor(()=>{const images=[...root.querySelectorAll<HTMLImageElement>('img')].filter(img=>!img.closest('[data-scene-fallback]'));expect(images.length).toBeGreaterThan(10);images.forEach(img=>expect(img.complete&&img.naturalWidth>0).toBe(true))})
  await expect(canvas.getByRole('heading',{level:1})).toBeVisible()
  await userEvent.click(canvas.getByRole('button',{name:'Neutral',exact:true}))
  const select=canvas.getByRole('combobox',{name:'Слой',exact:true})
  await userEvent.selectOptions(select,'0')
  const x=canvas.getByRole('spinbutton',{name:'X',exact:true}) as HTMLInputElement
  const original=x.value
  await userEvent.clear(x);await userEvent.type(x,'20')
  await userEvent.selectOptions(select,'1');await userEvent.selectOptions(select,'0')
  expect(x.value).toBe('20')
  const toggle=canvas.getByRole('checkbox',{name:'Анимация слоя'}) as HTMLInputElement
  const enabled=toggle.checked
  if(enabled)await userEvent.click(toggle)
  expect(canvas.getByRole('spinbutton',{name:'Вязкость ×'})).toBeDisabled()
  await userEvent.click(canvas.getByRole('button',{name:'Копировать JSON'}))
  const json=JSON.parse((canvas.getByRole('textbox',{name:'JSON всех профилей'}) as HTMLTextAreaElement).value)
  expect(json.component).toBe('ChirpBrHero');expect(Object.keys(json.scenes)).toHaveLength(6)
  await userEvent.clear(x);await userEvent.type(x,original)
  if(enabled)await userEvent.click(toggle)
  await userEvent.click(canvas.getByRole('button',{name:'Скрыть JSON'}))
  await userEvent.click(canvas.getByRole('button',{name:'Interaction',exact:true}))
 },
}

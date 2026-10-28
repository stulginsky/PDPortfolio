import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor } from 'storybook/test'
import DCVendorAppPrHero from './DCVendorAppPrHero.vue'
import DCVendorAppPrHeroSandbox from './DCVendorAppPrHeroSandbox.vue'
import { heroBreakpoints, heroReferences, getHeroBreakpoint } from './dc-vendor-app-pr-hero.scene-context'
import content from '../../content/cases/dc-vendor-app-pr.json'

const meta = {
 title: 'Compositions/Case heroes/DCVendorApp-Pr-hero', component: DCVendorAppPrHero, tags: ['autodocs'],
 argTypes: { breakpoint: { control: 'inline-radio', options: heroBreakpoints, description: 'Figma profile. Sandbox follows viewport automatically.' } },
 parameters: { layout:'fullscreen', docs:{description:{component:'[Figma 3023:3699](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=3023-3699). Six proportional profiles, eight original layers, outlined SVG Title and accessible generated text. Sandbox: shared pointer/touch motion, idle return, mobile intro, reduced motion, decimal controls, reset and JSON v2. Used by the Product case.'}}},
} satisfies Meta<typeof DCVendorAppPrHero>
export default meta
type Story = StoryObj<typeof meta>
export const Preview:Story = {
 args:{breakpoint:'base'},tags:['!dev'],
 render:args=>({components:{DCVendorAppPrHero},setup:()=>({args,heroReferences}),template:'<div :style="{width:heroReferences[args.breakpoint || \'base\'].width+\'px\',maxWidth:\'100%\'}"><DCVendorAppPrHero v-bind="args" /></div>'}),
}
export const Sandbox:Story = {
 argTypes:{breakpoint:{control:false}},
 render:()=>({components:{DCVendorAppPrHeroSandbox},template:'<DCVendorAppPrHeroSandbox />'}),
 play:async({canvas,canvasElement})=>{
  if(new URLSearchParams(window.location.search).get('embed')==='true')return
  const root=canvasElement.querySelector<HTMLElement>('.dc-vendor-app-pr-hero')!
  await waitFor(()=>expect(root.dataset.breakpoint).toBe(getHeroBreakpoint(window.innerWidth)))
  await waitFor(()=>{const images=root.querySelectorAll('img:not([data-scene-fallback] img)');expect(images).toHaveLength(8);images.forEach(img=>expect(img.complete&&img.naturalWidth>0).toBe(true))})
  await waitFor(()=>expect(root.dataset.mediaState).toBe('ready'))
  await expect(canvas.getByRole('heading',{level:1})).toHaveTextContent(content.hero.title)
  await userEvent.click(canvas.getByRole('button',{name:'Neutral',exact:true}))
  const select=canvas.getByRole('combobox',{name:'Слой',exact:true})
  await userEvent.selectOptions(select,'1')
  const x=canvas.getByRole('spinbutton',{name:'X',exact:true}) as HTMLInputElement
  const initial=x.value
  await userEvent.clear(x);await userEvent.type(x,'20.5')
  const viscosity=canvas.getByRole('spinbutton',{name:'Вязкость ×'}) as HTMLInputElement
  const originalViscosity=viscosity.value
  await userEvent.clear(viscosity);await userEvent.type(viscosity,'2.3')
  await userEvent.selectOptions(select,'7');await userEvent.selectOptions(select,'1')
  expect(x.value).toBe('20.5');expect(viscosity.value).toBe('2.3')
  const toggle=canvas.getByRole('checkbox',{name:'Анимация слоя'})
  await userEvent.click(toggle);await expect(viscosity).toBeDisabled()
  await userEvent.click(canvas.getByRole('button',{name:'Копировать JSON'}))
  const json=JSON.parse((canvas.getByRole('textbox',{name:'JSON всех профилей'}) as HTMLTextAreaElement).value)
  expect(json.component).toBe('DCVendorAppPrHero');expect(json.version).toBe(2)
  expect(Object.keys(json.scenes)).toHaveLength(6);expect(json.scenes[root.dataset.breakpoint!]).toHaveLength(8)
  expect(json.scenes[root.dataset.breakpoint!][1].x).toBe(20.5)
  canvasElement.querySelectorAll<HTMLInputElement>('input[type=number]').forEach(input=>expect(input.step).toBe('0.1'))
  await userEvent.click(toggle);await userEvent.clear(x);await userEvent.type(x,initial)
  await userEvent.clear(viscosity);await userEvent.type(viscosity,originalViscosity)
  await userEvent.click(canvas.getByRole('button',{name:'Скрыть JSON'}))
  await userEvent.click(canvas.getByRole('button',{name:'Interaction',exact:true}))
 },
}

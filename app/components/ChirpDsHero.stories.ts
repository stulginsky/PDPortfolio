import type {Meta,StoryObj} from '@storybook/vue3-vite'
import {expect,userEvent,waitFor} from 'storybook/test'
import ChirpDsHero from './ChirpDsHero.vue'
import ChirpDsHeroSandbox from './ChirpDsHeroSandbox.vue'
import content from '../../content/cases/chirp-design-system.json'
import {heroBreakpoints,heroReferences,getHeroBreakpoint} from './chirp-ds-hero.scene-context'
const meta={
 title:'Compositions/Case heroes/Chirp-Ds-hero',component:ChirpDsHero,tags:['autodocs'],
 args:{panelAppearance:'default',role:content.hero.role,focus:content.hero.focus},
 argTypes:{panelAppearance:{control:'radio',options:['default','on-light','on-dark']},breakpoint:{control:'radio',options:heroBreakpoints},role:{control:'text'},focus:{control:'text'}},
 parameters:{layout:'fullscreen',docs:{description:{component:'CSS/picture select the accepted responsive profile before JavaScript; mounted measurements hand over without a layout change. Delayed-script regression covers eight widths. Figma TPjPitung1VP3oQg42f56O/1553:4645, revised2026-10-19. Original clip frame owns green background and clips only the animated title; bird remains outside. No root green background or gap before panel. Original outlined title SVGs and mirrored bird. User JSON preset: title and bird animate by default in opposite cursor directions; RoleFocus remains static. Reduced motion disables animation. Sandbox: reference X/Y, viscosity, return speed, physical-pixel base offset, amplitude, directions, disable, reset and JSON v2; shared runtime and calibrated defaults. Contextual panelAppearance: default keeps own surface; on-light/on-dark use transparent panel and secondary/inverse RoleFocus text over a composition-owned continuous background. Sandbox environment selector demonstrates both. Production case reuses this component.'}}},
} satisfies Meta<typeof ChirpDsHero>
export default meta
type Story=StoryObj<typeof meta>
export const Preview:Story={
 args:{breakpoint:'base'},tags:['!dev'],
 render:args=>({components:{ChirpDsHero},setup:()=>({args,heroReferences}),template:'<div :style="{width:heroReferences[args.breakpoint || \'base\'].width+\'px\',maxWidth:\'100%\'}"><ChirpDsHero v-bind="args" /></div>'}),
}
export const Sandbox:Story={
 argTypes:{breakpoint:{control:false}},
 render:args=>({components:{ChirpDsHeroSandbox},setup:()=>({args}),template:'<ChirpDsHeroSandbox :hero-args="args" />'}),
 play:async({canvas,canvasElement})=>{
  if(new URLSearchParams(window.location.search).get('embed')==='true')return
  const root=canvasElement.querySelector<HTMLElement>('.chirp-ds-hero')!
  await waitFor(()=>expect(root.dataset.breakpoint).toBe(getHeroBreakpoint(window.innerWidth)))
  await waitFor(()=>[...root.querySelectorAll('img')].filter(img=>!img.closest('[data-scene-fallback]')).forEach(img=>expect(img.complete&&img.naturalWidth>0).toBe(true)))
  await waitFor(()=>expect(root.dataset.ready).toBe('true'))
  await waitFor(()=>expect(root.dataset.mediaState).toBe('ready'))
  await expect(root.querySelectorAll('.ds-role-focus')).toHaveLength(1)
  await expect(canvas.getByRole('heading',{level:1})).toBeInTheDocument()
  const clip=root.querySelector<HTMLElement>('.chirp-ds-hero__clip')!
  await expect(clip).toContainElement(root.querySelector('[data-layer="Chirp design system"]') as HTMLElement)
  await expect(clip).not.toContainElement(root.querySelector('.chirp-ds-hero__bird') as HTMLElement)
  await expect(getComputedStyle(clip).overflow).toBe('hidden')
  const clipBox=clip.getBoundingClientRect(),panelBox=root.querySelector('.chirp-ds-hero__panel')!.getBoundingClientRect()
  await expect(Math.abs(clipBox.bottom-panelBox.top)).toBeLessThan(0.2)
  const environment=canvas.getByRole('combobox',{name:'Окружение',exact:true})
  await userEvent.selectOptions(environment,'on-dark')
  await expect(root).toHaveAttribute('data-panel-appearance','on-dark')
  await expect((root.querySelector('.ds-role-focus') as HTMLElement).style.color).toBe('var(--text-inverse)')
  await userEvent.selectOptions(environment,'on-light')
  await expect(root).toHaveAttribute('data-panel-appearance','on-light')
  await userEvent.selectOptions(environment,'default')
  await userEvent.click(canvas.getByRole('button',{name:'Neutral',exact:true}))
  await userEvent.selectOptions(canvas.getByRole('combobox',{name:'Слой',exact:true}),'1')
  const x=canvas.getByRole('spinbutton',{name:'X',exact:true}) as HTMLInputElement
  const initial=x.value
  await userEvent.clear(x);await userEvent.type(x,'20')
  await userEvent.selectOptions(canvas.getByRole('combobox',{name:'Слой',exact:true}),'0')
  const titleToggle=canvas.getByRole('checkbox',{name:'Анимация слоя'})
  await expect(titleToggle).toBeEnabled()
  const titleWasEnabled=(titleToggle as HTMLInputElement).checked
  if(!titleWasEnabled)await userEvent.click(titleToggle)
  await expect(canvas.getByRole('spinbutton',{name:'Вязкость ×'})).toBeEnabled()
  await expect(canvas.getByRole('spinbutton',{name:'Амплитуда ×'})).toBeEnabled()
  if(!titleWasEnabled)await userEvent.click(titleToggle)
  await userEvent.selectOptions(canvas.getByRole('combobox',{name:'Слой',exact:true}),'2')
  await expect(canvas.getByRole('checkbox',{name:'Анимация слоя'})).toBeDisabled()
  await userEvent.selectOptions(canvas.getByRole('combobox',{name:'Слой',exact:true}),'1')
  await expect(x).toHaveValue(20)
  await userEvent.click(canvas.getByRole('checkbox',{name:'Анимация слоя'}))
  await expect(canvas.getByRole('spinbutton',{name:'Вязкость ×'})).toBeDisabled()
  await userEvent.click(canvas.getByRole('button',{name:'Копировать JSON',exact:true}))
  const json=JSON.parse((canvas.getByRole('textbox',{name:'JSON всех профилей'}) as HTMLTextAreaElement).value)
  expect(json.component).toBe('ChirpDsHero');expect(Object.keys(json.scenes)).toHaveLength(6)
  await userEvent.clear(x);await userEvent.type(x,initial)
  await userEvent.click(canvas.getByRole('checkbox',{name:'Анимация слоя'}))
  await userEvent.click(canvas.getByRole('button',{name:'Скрыть JSON',exact:true}))
  await userEvent.click(canvas.getByRole('button',{name:'Interaction',exact:true}))
 },
}

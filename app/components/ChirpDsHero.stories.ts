import type {Meta,StoryObj} from '@storybook/vue3-vite'
import {expect,userEvent,waitFor} from 'storybook/test'
import ChirpDsHero from './ChirpDsHero.vue'
import ChirpDsHeroSandbox from './ChirpDsHeroSandbox.vue'
import content from '../../content/cases/chirp-design-system.json'
import {heroBreakpoints,heroReferences,getHeroBreakpoint} from './chirp-ds-hero.scene-context'
const meta={
 title:'Compositions/Case heroes/Chirp-Ds-hero',component:ChirpDsHero,tags:['autodocs', '!dev'],
 args: {panelAppearance:'default',role:content.hero.role,focus:content.hero.focus},
 argTypes: {
  "panelAppearance": {
    "options": [
      "default",
      "on-light",
      "on-dark"
    ],
    "control": {
      "type": "radio"
    }
  },
  "breakpoint": {
    "options": [
      "base",
      "min-768",
      "min-1024",
      "min-1280",
      "min-1440",
      "min-1920"
    ],
    "control": {
      "type": "radio"
    }
  },
  "role": {
    "control": {
      "type": "text"
    }
  },
  "focus": {
    "control": {
      "type": "text"
    }
  }
},
 parameters:{layout:'fullscreen',docs:{description:{component:"Первый экран кейса: знакомит с проектом и задаёт его визуальный контекст."}}},
} satisfies Meta<typeof ChirpDsHero>
meta.parameters.docs.description.component =
  "<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1553-4645\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>\n\n" + meta.parameters.docs.description.component

export default meta
type Story=StoryObj<typeof meta>
export const Preview:Story={
 tags: ['!dev'],
 render:args=>({components:{ChirpDsHero},setup:()=>({args,heroReferences}),template:'<ChirpDsHero v-bind="args" />'}),
}
export const Sandbox:Story={
  tags: ['dev'],
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
  const role=root.querySelector<HTMLElement>('.ds-role-focus')!
  await expect(root.querySelector('.chirp-ds-hero__stage')).not.toContainElement(role)
  if(window.innerWidth<768){
   const label=role.querySelector<HTMLElement>('.ds-role-focus__label')!
   await expect(Math.abs(label.getBoundingClientRect().height-parseFloat(getComputedStyle(label).lineHeight))).toBeLessThan(.2)
   await expect(Math.abs(role.getBoundingClientRect().width-root.clientWidth+32)).toBeLessThan(.2)
  }
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

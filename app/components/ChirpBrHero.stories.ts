import type {Meta,StoryObj} from '@storybook/vue3-vite'
import {expect,waitFor} from 'storybook/test'
import ChirpBrHero from './ChirpBrHero.vue'
import ChirpBrHeroSandbox from './ChirpBrHeroSandbox.vue'
import content from '../../content/cases/chirp-brand.json'
import {createHeroDraft,getHeroBreakpoint} from './chirp-br-hero.scene-context'
const meta={
 title:'Compositions/Case heroes/Chirp-Br-hero',component:ChirpBrHero,tags:['autodocs', '!dev'],
 args:{role:content.hero.role,focus:content.hero.focus},
 parameters:{layout:'fullscreen',docs:{description:{component:"Первый экран кейса: знакомит с проектом и задаёт его визуальный контекст.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1464-7870\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>"}}},

  } satisfies Meta<typeof ChirpBrHero>
export default meta
type Story=StoryObj<typeof meta>
export const Preview: Story = {
  render: args => ({ components: { ChirpBrHero }, setup: () => ({ args }), template: "<ChirpBrHero v-bind=\"args\" />" }),
}

export const Sandbox:Story={
  tags: ['dev'],
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
  const x=canvas.getByRole('spinbutton',{name:'X',exact:true}) as HTMLInputElement
  expect(Number.isFinite(Number(x.value))).toBe(true)
  expect(canvas.getByRole('combobox',{name:'Слой',exact:true}).querySelectorAll('option')).toHaveLength(presets[getHeroBreakpoint(window.innerWidth)].length)
 },
}

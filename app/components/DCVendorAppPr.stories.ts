import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor } from 'storybook/test'
import DCVendorAppPr from './DCVendorAppPr.vue'
import DCVendorAppPrSandbox from './DCVendorAppPrSandbox.vue'
import content from '../../content/cases/dc-vendor-app-pr.json'
import { vendorPrGeometry } from './dc-vendor-app-pr.geometry'
import { getVendorPrSceneProfile } from './dc-vendor-app-pr.scene-context'
import './dc-vendor-app-pr.sandbox.css'

const meta = {
  title: 'Compositions/Showcase cards/DCVendorApp-Pr', component: DCVendorAppPr, tags:['autodocs'],
  args:{title:content.card.title,subtitle:content.card.subtitle,href:'#'},
  parameters:{layout:'fullscreen',docs:{description:{component:`
[Figma 3024:3700](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=3024-3700)

<details><summary>Техническое описание</summary>

Десять оригинальных слоёв; base/min-768 и Default/Hover/ActivePressed. Ширина100%/max430, высота500 ниже462/532 от462. Редактор X/Y/Width/Height/Rotation, сохранение черновика и JSON. Порядок бейджей сохраняет различие исходных breakpoint. Локальный скелетон; CSS выбирает начальную геометрию до JS. Progressive blur использует принятый адаптер карточек. Переход в Sandbox отключён.

</details>`}}},
} satisfies Meta<typeof DCVendorAppPr>
export default meta
type Story=StoryObj<typeof meta>
export const Sandbox:Story={
  render:args=>({components:{DCVendorAppPrSandbox},setup:()=>({args}),template:'<DCVendorAppPrSandbox :card-args="args" />'}),
  play:async({canvas,canvasElement})=>{
    const card=canvas.getByRole('link')
    await waitFor(()=>expect(card).toHaveAttribute('data-media-state','ready'),{timeout:15000})
    await waitFor(()=>expect(card).toHaveAttribute('data-ready','true'))
    await waitFor(()=>expect(card).toHaveAttribute('data-scene-state','ready'))
    expect(getComputedStyle(card).backgroundColor).toBe('rgb(59, 114, 157)')
    const sceneProfile=getVendorPrSceneProfile(window.innerWidth)
    const profile=sceneProfile==='base'?'base':'min-768'
    const expectOstrich=async(state:'Default'|'Hover'|'ActivePressed')=>{
      const target=vendorPrGeometry[profile][state].layers.find(l=>l.name==='09-ostrich')!
      await waitFor(()=>{
        const image=card.querySelector('.dc-vendor-app-pr__pict [data-layer="09-ostrich"] img')!
        const rect=image.getBoundingClientRect()
        expect(rect.width).toBeCloseTo(target.width,1)
        expect(rect.height).toBeCloseTo(target.height,1)
      })
      const city=card.querySelector('.dc-vendor-app-pr__pict [data-layer="05-landform_city-1st"]')!
      expect(city.querySelectorAll('[data-part]')).toHaveLength(11)
      expect([...city.querySelectorAll('img')].every(img=>getComputedStyle(img).opacity==='1')).toBe(true)
    }
    await expect(canvas.getByTestId('scene-breakpoint')).toHaveTextContent(sceneProfile)
    await expect(canvas.getByRole('heading',{level:2})).toHaveTextContent(content.card.title)
    expect(canvas.getAllByRole('listitem').map(n=>n.textContent)).toEqual(content.card.badges[profile])
    expect(canvasElement.querySelectorAll('.dc-vendor-app-pr__pict [data-layer]')).toHaveLength(10)
    const cardBounds=card.getBoundingClientRect()
    for(const name of ['00_sky','04-water','08-dimmer']){
      const bounds=card.querySelector(`.dc-vendor-app-pr__pict [data-layer="${name}"]`)!.getBoundingClientRect()
      expect(bounds.left).toBeLessThanOrEqual(cardBounds.left+.1)
      expect(bounds.right).toBeGreaterThanOrEqual(cardBounds.right-.1)
    }
    expect(card.querySelector('.dc-vendor-app-pr__pict [data-layer="09-ostrich"]')!.getBoundingClientRect().left-cardBounds.left).toBeCloseTo(20,1)
    if(window.matchMedia('(hover: hover)').matches){
      await userEvent.hover(card)
      await expect(card).toHaveAttribute('data-state','Hover')
      await expectOstrich('Hover')
      const pointer=userEvent.setup()
      await pointer.pointer({target:card,keys:'[MouseLeft>]'})
      await expect(card).toHaveAttribute('data-state','ActivePressed')
      expect(card.style.getPropertyValue('--card-duration')).toBe('150ms')
      await expectOstrich('ActivePressed')
      await pointer.pointer({target:card,keys:'[/MouseLeft]'})
      await expect(card).toHaveAttribute('data-state','Hover')
      await expectOstrich('Hover')
      await userEvent.unhover(card)
    }
    card.focus()
    await expect(card).toHaveFocus()
    const keyboard=userEvent.setup()
    await keyboard.keyboard('[Enter>]')
    await expect(card).toHaveAttribute('data-state','ActivePressed')
    await keyboard.keyboard('[/Enter]')
    await expect(card).toHaveAttribute('data-state','Default')
    await userEvent.click(canvas.getByRole('button',{name:'Default',exact:true}))
    const sky=card.querySelector('.dc-vendor-app-pr__pict [data-layer="00_sky"]')!
    expect(Number((canvas.getByRole('spinbutton',{name:'Y',exact:true}) as HTMLInputElement).value)).toBeCloseTo(sky.getBoundingClientRect().top-card.getBoundingClientRect().top,2)
    const x=canvas.getByRole('spinbutton',{name:'X',exact:true}) as HTMLInputElement
    const original=Number(x.value)
    await userEvent.clear(x)
    await userEvent.type(x,String(original+10))
    await waitFor(()=>expect(Number(x.value)).toBeCloseTo(original+10,2))
    await userEvent.click(canvas.getByRole('button',{name:'Hover',exact:true}))
    await expect(card).toHaveAttribute('data-state','Hover')
    await userEvent.click(canvas.getByRole('button',{name:'ActivePressed',exact:true}))
    await expect(card).toHaveAttribute('data-state','ActivePressed')
    await userEvent.click(canvas.getByRole('button',{name:'Сбросить профиль'}))
    await userEvent.click(canvas.getByRole('button',{name:'Копировать JSON'}))
    const payload=JSON.parse((canvas.getByRole('textbox',{name:'JSON всех состояний'}) as HTMLTextAreaElement).value)
    expect(payload.component).toBe('DCVendorAppPr')
    expect(payload.layers).toHaveLength(10)
    await userEvent.click(canvas.getByRole('button',{name:'Interaction',exact:true}))
    await expect(card).toHaveAttribute('data-state','Default')
  },
}

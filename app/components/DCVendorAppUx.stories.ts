import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor } from 'storybook/test'
import DCVendorAppUx from './DCVendorAppUx.vue'
import DCVendorAppUxSandbox from './DCVendorAppUxSandbox.vue'
import content from '../../content/cases/dc-vendor-app-ux.json'
import './dc-vendor-app-ux.sandbox.css'

const meta = {
  title: 'Compositions/Showcase cards/DCVendorApp-UX', component: DCVendorAppUx, tags:['autodocs'],
  args:{title:content.card.title,subtitle:content.card.subtitle,href:'#'},
  parameters:{layout:'fullscreen',docs:{description:{component:`
[Figma 1580:3390](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1580-3390)

<details><summary>Техническое описание</summary>

Девять оригинальных слоёв; base/min-768 и Default/Hover/ActivePressed. Ширина100%/max430, высота500 ниже462/532 от462. Редактор X/Y/Width/Height/Rotation, сохранение черновика и JSON. Порядок бейджей сохраняет различие исходных breakpoint. Локальный скелетон; CSS выбирает начальную геометрию до JS. Progressive blur использует принятый адаптер карточек. Переход в Sandbox отключён.

</details>`}}},
} satisfies Meta<typeof DCVendorAppUx>
export default meta
type Story=StoryObj<typeof meta>
export const Sandbox:Story={
  render:args=>({components:{DCVendorAppUxSandbox},setup:()=>({args}),template:'<DCVendorAppUxSandbox :card-args="args" />'}),
  play:async({canvas,canvasElement})=>{
    const card=canvas.getByRole('link')
    await waitFor(()=>expect(card).toHaveAttribute('data-media-state','ready'),{timeout:15000})
    await waitFor(()=>expect(card).toHaveAttribute('data-ready','true'))
    await waitFor(()=>expect(card).toHaveAttribute('data-scene-state','ready'))
    expect(getComputedStyle(card).backgroundColor).toBe('rgb(52, 48, 45)')
    const profile=window.innerWidth<768?'base':'min-768'
    await expect(canvas.getByTestId('scene-breakpoint')).toHaveTextContent(window.innerWidth<534?'base':'min-768')
    await expect(canvas.getByRole('heading',{level:2})).toHaveTextContent(content.card.title)
    expect(canvas.getAllByRole('listitem').map(n=>n.textContent)).toEqual(content.card.badges[profile])
    expect(canvasElement.querySelectorAll('.dc-vendor-app-ux__pict [data-layer]')).toHaveLength(9)
    if(window.matchMedia('(hover: hover)').matches){
      await userEvent.hover(card)
      await expect(card).toHaveAttribute('data-state','Hover')
      const pointer=userEvent.setup()
      await pointer.pointer({target:card,keys:'[MouseLeft>]'})
      await expect(card).toHaveAttribute('data-state','ActivePressed')
      expect(card.style.getPropertyValue('--card-duration')).toBe('150ms')
      await pointer.pointer({target:card,keys:'[/MouseLeft]'})
      await expect(card).toHaveAttribute('data-state','Hover')
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
    expect(payload.component).toBe('DCVendorAppUx')
    expect(payload.layers).toHaveLength(9)
    await userEvent.click(canvas.getByRole('button',{name:'Interaction',exact:true}))
    await expect(card).toHaveAttribute('data-state','Default')
  },
}

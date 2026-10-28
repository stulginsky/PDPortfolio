import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor } from 'storybook/test'
import RelatedCases from './RelatedCases.vue'
import RelatedCasesSandbox from './RelatedCasesSandbox.vue'

const meta = {
  title: 'Compositions/RelatedCases',
  component: RelatedCases,
  tags: ['autodocs'],
  args: { ariaLabel: 'Другие кейсы', previousLabel: 'Предыдущие кейсы', nextLabel: 'Следующие кейсы' },
  argTypes: {
    cardNames: { control: 'object', description: 'Explicit ordered production component names; omitted keeps the original Chirp catalog.' },
    currentCaseHref: { control: 'select', options: ['', '/cases/chirp-product', '/cases/chirp-ux', '/cases/chirp-brand', '/cases/chirp-design-system', '/cases/dc-vendor-app-pr', '/cases/dc-vendor-app-ux'], description: 'Текущий кейс исключается из ленты. Пустое значение — полный каталог.' },
    ariaLabel: { control: 'text', description: 'Доступное название области ленты.' },
    previousLabel: { control: 'text', description: 'Доступное название стрелки Left.' },
    nextLabel: { control: 'text', description: 'Доступное название стрелки Right.' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `
[Figma 968:7007](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=968-7007)

All showcase cards share the user-approved fixed-height contract in ds/showcase-card-sizing.md: nominal width=min(430,viewport−32); actual width capped by available rail; height500 below462,532 above. Copy scales proportionally only under container compression. Below534 multi-card RelatedCases use288px width; below352 the rail fields are removed to expose24px of the next card at320. No text-driven height, desktop-canvas transform or Chirp/DC exception. Existing navigation and motion preserved.

` } },
  },
} satisfies Meta<typeof RelatedCases>
export default meta
type Story = StoryObj<typeof meta>
const blockNavigation = (event: MouseEvent) => { if ((event.target as HTMLElement).closest('a')) event.preventDefault() }
export const Sandbox: Story = {
 render: args => ({components:{RelatedCasesSandbox},setup:()=>({args}),template:'<RelatedCasesSandbox :component-args="args" />'}),
 play: async ({canvas,canvasElement}) => {
  const root=canvasElement.querySelector<HTMLElement>('.related-cases')!
  const rail=canvasElement.querySelector<HTMLElement>('.related-cases__rail')!
  const card=canvasElement.querySelector<HTMLElement>('.related-cases__card')!
  const expected=window.innerWidth<534?288:Math.min(430,window.innerWidth-32,rail.clientWidth)
  await waitFor(()=>expect(card.getBoundingClientRect().width).toBeCloseTo(expected,0))
  await expect(card.getBoundingClientRect().height).toBe(window.innerWidth>=462?532:500)
  await expect(card.querySelector<HTMLElement>('.related-cases__stage')!.clientWidth).toBeCloseTo(expected,0)
  await expect(getComputedStyle(card.querySelector<HTMLElement>('.related-cases__stage')!).transform).toBe('none')
  await expect(canvas.getAllByRole('link')).toHaveLength(4)
  if(window.innerWidth<534 && canvasElement.clientWidth>=window.innerWidth-1){
   const first=canvasElement.querySelector<HTMLElement>('.related-cases__card')!,second=canvasElement.querySelector<HTMLElement>('.related-cases__card:nth-child(2)')!
   await waitFor(()=>expect(Math.min(second.getBoundingClientRect().right,rail.getBoundingClientRect().right)-Math.max(second.getBoundingClientRect().left,rail.getBoundingClientRect().left)).toBeGreaterThanOrEqual(23.5))
   expect(first.getBoundingClientRect().left).toBeGreaterThanOrEqual(rail.getBoundingClientRect().left-.5)
  }

  if(window.innerWidth>=768){
   await userEvent.click(canvas.getByRole('button',{name:'Следующие кейсы'}))
   await waitFor(()=>expect(rail.scrollLeft).toBeGreaterThan(0))
  }
  rail.dispatchEvent(new KeyboardEvent('keydown',{key:'End',bubbles:true}))
  await waitFor(()=>expect(root.dataset.position).toBe('End'))
  const last=canvasElement.querySelector<HTMLElement>('.related-cases__card:last-child')!.getBoundingClientRect()
  await expect(last.right).toBeLessThanOrEqual(rail.getBoundingClientRect().right+1)
  await userEvent.click(canvas.getByRole('button',{name:'Reset'}))
  await waitFor(()=>expect(canvas.getByTestId('related-position')).toHaveTextContent('Position: Start'))
  const fresh=canvasElement.querySelector<HTMLElement>('.related-cases__rail')!
  await expect(fresh.scrollLeft).toBe(0)
  const first=canvas.getAllByRole('link')[0]!
  first.focus();await userEvent.keyboard('{End}')
  await waitFor(()=>expect(canvas.getByTestId('related-position')).toHaveTextContent('Position: End'))
  await userEvent.keyboard('{Home}')
  await waitFor(()=>expect(canvas.getByTestId('related-position')).toHaveTextContent('Position: Start'))
 },
}

export const ExcludesCurrentCase: Story = {
  render: () => ({
    components: { RelatedCasesSandbox },
    setup() {
      const currentCaseHref = ref('/cases/chirp-product')
      return { currentCaseHref }
    },
    template: `
      <div style="padding:16px;display:flex;gap:8px">
        <button @click="currentCaseHref='/cases/chirp-product'">Product Discovery</button>
        <button @click="currentCaseHref='/cases/chirp-ux'">UX</button>
      </div>
      <RelatedCasesSandbox :component-args="{ currentCaseHref }" />
    `,
  }),
  play: async ({ canvas, canvasElement }) => {
    const urls = () => canvas.getAllByRole('link').map(link => link.getAttribute('href'))
    await waitFor(() => expect(urls()).toEqual([
      '/cases/chirp-ux', '/cases/chirp-brand', '/cases/chirp-design-system',
    ]))
    const rail = canvasElement.querySelector<HTMLElement>('.related-cases__rail')!
    rail.focus()
    rail.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    await waitFor(() => expect(canvas.getByTestId('related-position')).toHaveTextContent('Position: End'))
    await userEvent.click(canvas.getByRole('button', { name: 'UX', exact: true }))
    await waitFor(() => expect(urls()).toEqual([
      '/cases/chirp-product', '/cases/chirp-brand', '/cases/chirp-design-system',
    ]))
    await waitFor(() => expect(rail.scrollLeft).toBe(0))
    await expect(canvas.getByTestId('related-position')).toHaveTextContent('Position: Start')
    await expect(canvasElement.querySelector('.related-cases__status')).toHaveTextContent('Карточка 1 из 3')
    await userEvent.click(canvas.getByRole('button', { name: 'Product Discovery', exact: true }))
    await waitFor(() => expect(urls()[0]).toBe('/cases/chirp-ux'))
  },
}

export const DCSelection: Story = {
  args: { cardNames: ['DCVendorAppPr', 'DCVendorAppUx', 'DCPickerAppUx'], currentCaseHref: '/cases/dc-vendor-app-ux' },
  render: args => ({
    components: { RelatedCases },
    setup() {
      const selected = ref<('DCVendorAppPr' | 'DCVendorAppUx' | 'DCPickerAppUx')[]>([...(args.cardNames ?? [])] as ('DCVendorAppPr' | 'DCVendorAppUx' | 'DCPickerAppUx')[])
      const picker = () => { selected.value = ['DCPickerAppUx'] }
      const empty = () => { selected.value = [] }
      return { args, selected, picker, empty, blockNavigation }
    },
    template: '<div @click.capture="blockNavigation"><div style="padding:16px;display:flex;gap:8px"><button @click="picker">Picker only</button><button @click="empty">Empty selection</button></div><RelatedCases v-bind="args" :card-names="selected" /></div>',
  }),
  play: async ({ canvas, canvasElement }) => {
    const names = () => [...canvasElement.querySelectorAll<HTMLElement>('[data-card-name]')].map(e => e.dataset.cardName)
    await waitFor(() => expect(names()).toEqual(['DCVendorAppPr', 'DCPickerAppUx']))
    await expect(canvasElement.querySelector('a[href="/cases/dc-vendor-app-pr"]')).not.toBeNull()
    await expect(canvasElement.querySelector('a[href="/cases/dc-vendor-app-ux"]')).toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: 'Picker only' }))
    await waitFor(() => expect(names()).toEqual(['DCPickerAppUx']))
    await waitFor(() => expect(canvasElement.querySelectorAll('.related-cases__nav')).toHaveLength(0))
    await userEvent.click(canvas.getByRole('button', { name: 'Empty selection' }))
    await waitFor(() => expect(canvas.getByRole('region', { hidden: true })).not.toBeVisible())
  },
}

export const PickerApp: Story = {
  args: { cardNames: ['DCPickerAppUx'] },
  render: args => ({ components: { RelatedCases }, setup: () => ({ args, blockNavigation }), template: '<RelatedCases v-bind="args" @click.capture="blockNavigation" />' }),
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector<HTMLElement>('[data-card-name="DCPickerAppUx"]')!
    const rail = canvasElement.querySelector<HTMLElement>('.related-cases__rail')!
    await waitFor(() => expect(card.getBoundingClientRect().width).toBeCloseTo(Math.min(430, window.innerWidth - 32, rail.clientWidth), 0))
    const a = card.getBoundingClientRect(), b = rail.getBoundingClientRect()
    await expect(a.left + a.width / 2).toBeCloseTo(b.left + b.width / 2, 0)
    await expect(canvasElement.querySelectorAll('.related-cases__nav')).toHaveLength(0)
    await expect(card.querySelector('a')?.getAttribute('href')).toMatch(/^mailto:stulginsky@gmail.com\?/)
    const image = card.querySelector<HTMLImageElement>('.dc-picker-app-ux__title')!
    await waitFor(() => expect(image.complete && image.naturalWidth > 0).toBe(true))
  },
}

export const DCProductCase: Story = {
 args: { cardNames: ['DCVendorAppPr'], currentCaseHref: '/cases/dc-vendor-app-ux' },
 render: args => ({ components: { RelatedCases }, setup: () => ({ args, blockNavigation }), template: '<RelatedCases v-bind="args" @click.capture="blockNavigation" />' }),
 play: async ({ canvasElement }) => {
  const card=canvasElement.querySelector<HTMLElement>('[data-card-name="DCVendorAppPr"]')!
  const stage=card.querySelector<HTMLElement>('.related-cases__stage')!
  await waitFor(()=>expect(stage.getBoundingClientRect().width).toBeCloseTo(card.getBoundingClientRect().width,0))
  await expect(getComputedStyle(stage).transform).toBe('none')
  await expect(card.querySelector('a')?.getAttribute('href')).toBe('/cases/dc-vendor-app-pr')
  await expect(canvasElement.querySelectorAll('.related-cases__nav')).toHaveLength(0)
 },
}

export const DCProductRelated: Story = {
 args: { cardNames: ['DCVendorAppUx', 'DCPickerAppUx', 'DCVendorAppPr'], currentCaseHref: '/cases/dc-vendor-app-pr' },
 render: args => ({ components: { RelatedCases }, setup: () => ({ args, blockNavigation }), template: '<RelatedCases v-bind="args" @click.capture="blockNavigation" />' }),
 play: async ({ canvasElement }) => {
  await waitFor(()=>expect([...canvasElement.querySelectorAll('[data-card-name]')].map(c=>c.getAttribute('data-card-name'))).toEqual(['DCVendorAppUx','DCPickerAppUx']))
  await expect(canvasElement.querySelector('a[href="/cases/dc-vendor-app-pr"]')).toBeNull()
  await expect(canvasElement.querySelector('a[href="/cases/dc-vendor-app-ux"]')).not.toBeNull()
  await expect(canvasElement.querySelector('a[href^="mailto:stulginsky@gmail.com"]')).not.toBeNull()
 },
}

const allCardNames=['ChirpAiHealthAssistant','ChirpExplainableAiUx','ChirpAiMedicalBrand','ChirpAiDesignSystem','DCVendorAppPr','DCVendorAppUx','DCPickerAppUx'] as const
const checkSizing=async (canvasElement:HTMLElement)=>{
 const rail=canvasElement.querySelector<HTMLElement>('.related-cases__rail')!
 const width=window.innerWidth<534?288:Math.min(430,window.innerWidth-32,rail.clientWidth),height=window.innerWidth>=462?532:500
 await waitFor(()=>{
  const cards=canvasElement.querySelectorAll<HTMLElement>('.related-cases__card')
  expect(cards).toHaveLength(7)
  cards.forEach(card=>{
   expect(card.getBoundingClientRect().width).toBeCloseTo(width,0)
   expect(card.getBoundingClientRect().height).toBe(height)
   const inner=card.querySelector<HTMLElement>('.showcase-card')!
   expect(inner.getBoundingClientRect().height).toBe(height)
   expect(inner.getBoundingClientRect().width).toBeCloseTo(width,0)
   const heading=inner.querySelector<HTMLElement>('[class$="__title"]')
   if(heading&&heading.tagName!=='IMG')expect(parseFloat(getComputedStyle(heading).fontSize)).toBeCloseTo((window.innerWidth>=410?22:18.333333)*Math.min(1,width/Math.min(430,window.innerWidth-32)),1)
   const badge=inner.querySelector<HTMLElement>('.ds-badge__text')
   if(badge)expect(parseFloat(getComputedStyle(badge).fontSize)).toBeCloseTo((window.innerWidth<410?10:12)*Math.min(1,width/Math.min(430,window.innerWidth-32)),1)
  })
 })
}
export const AllCards: Story={
 args:{cardNames:[...allCardNames]},
 render:args=>({components:{RelatedCases},setup:()=>({args,blockNavigation}),template:'<RelatedCases v-bind="args" @click.capture="blockNavigation" />'}),
 play:async({canvasElement})=>checkSizing(canvasElement),
}
export const NarrowContainer: Story={
 args:{cardNames:[...allCardNames]},
 render:args=>({components:{RelatedCases},setup:()=>({args,blockNavigation}),template:'<div style="width:260px;max-width:100%"><RelatedCases v-bind="args" @click.capture="blockNavigation" /></div>'}),
 play:async({canvasElement})=>checkSizing(canvasElement),
}

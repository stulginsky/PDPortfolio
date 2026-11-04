import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import Main from './Main.vue'

const meta = { title:'Pages/Main', component:Main, parameters:{layout:'fullscreen'}, tags:['autodocs'], beforeEach: () => { localStorage.removeItem('pdportfolio:showcase:category') } } satisfies Meta<typeof Main>
export default meta
type Story = StoryObj<typeof meta>
export const Showcase: Story = {
 play: async ({canvasElement}) => {
  const canvas=within(canvasElement)
  await waitFor(()=>expect(canvasElement.querySelectorAll('.main-page__case')).toHaveLength(16))
  await expect(canvasElement.querySelector('[data-case-href="/cases/fox-jw"]')).not.toBeNull()
  await expect(canvasElement.querySelector('[data-case-href="/cases/dragon-heart-jw"]')).not.toBeNull()
  await expect(canvasElement.querySelector('[data-case-href="/cases/sapsan-cr"] .sapsan-cr')).not.toBeNull()
  await expect(canvasElement.querySelector('[data-case-href="/cases/aqua-maris"] .aqua-maris')).not.toBeNull()
  await expect(canvasElement.querySelector('[data-case-href="/cases/absolut"] .absolut')).not.toBeNull()
  await expect(canvasElement.querySelector('[data-case-href="/cases/4real-3dweapon"] .card-4real-3dweapon')).not.toBeNull()
  const picker=canvasElement.querySelector('.dc-picker-app-ux')!
  await expect(picker.querySelectorAll('a')).toHaveLength(1)
  await expect(picker.querySelector('a')?.getAttribute('href')).toMatch(/^mailto:stulginsky@gmail.com\?/)
  const link=canvasElement.querySelector<HTMLAnchorElement>('a[href="/cases/dc-vendor-app-ux"]')!
  await expect(link).not.toBeNull()
  async function selectCategory(label: string, overflow = false) {
    window.scrollTo(0, 0)
    if (window.innerWidth < 1024) {
      await userEvent.click(canvas.getByRole('button',{name:'Выбрать категорию'}))
      await userEvent.click(within(within(document.body).getByRole('dialog')).getByRole('button',{name:label,exact:true}))
    } else {
      if (overflow && window.innerWidth < 1280) await userEvent.click(canvas.getByRole('button',{name:'Gamedev & more',exact:true}))
      await userEvent.click(canvas.getByRole('button',{name:label,exact:true}))
    }
  }
  await selectCategory('Лэндинг', true)
  await expect(localStorage.getItem('pdportfolio:showcase:category')).toBe('landing')
  await expect(canvasElement.querySelectorAll('.main-page__case')).toHaveLength(3)
  await expect(canvasElement.querySelector('.skins4-real')).not.toBeNull()
  await expect(canvasElement.querySelector('.black-gold')).not.toBeNull()
  await selectCategory('UX')
  await expect(localStorage.getItem('pdportfolio:showcase:category')).toBe('ux')
  await waitFor(()=>expect(canvasElement.querySelector('.main-page__cases')?.getAttribute('data-category')).toBe('ux'))
  await expect(canvasElement.querySelectorAll('.main-page__case')).toHaveLength(3)
  await expect(canvasElement.querySelector('a[href="/cases/dc-vendor-app-ux"]')).not.toBeNull()
 },
}

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import Main from './Main.vue'

const meta = { title:'Pages/Main', component:Main, parameters:{layout:'fullscreen'}, tags:['autodocs'] } satisfies Meta<typeof Main>
export default meta
type Story = StoryObj<typeof meta>
export const Showcase: Story = {
 play: async ({canvasElement}) => {
  const canvas=within(canvasElement)
  await waitFor(()=>expect(canvasElement.querySelectorAll('.main-page__case')).toHaveLength(7))
  const picker=canvasElement.querySelector('.dc-picker-app-ux')!
  await expect(picker.querySelectorAll('a')).toHaveLength(1)
  await expect(picker.querySelector('a')?.getAttribute('href')).toMatch(/^mailto:stulginsky@gmail.com\?/)
  const link=canvasElement.querySelector<HTMLAnchorElement>('a[href="/cases/dc-vendor-app-ux"]')!
  await expect(link).not.toBeNull()
  const filter=canvas.getByRole('button',{name:'UX',exact:true})
  await userEvent.click(filter)
  await waitFor(()=>expect(canvasElement.querySelector('.main-page__cases')?.getAttribute('data-category')).toBe('ux'))
  await expect(canvasElement.querySelectorAll('.main-page__case')).toHaveLength(3)
  await expect(canvasElement.querySelector('a[href="/cases/dc-vendor-app-ux"]')).not.toBeNull()
 },
}

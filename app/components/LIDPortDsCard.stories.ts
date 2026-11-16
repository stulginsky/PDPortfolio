import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor } from 'storybook/test'
import LIDPortDsCard from './LIDPortDsCard.vue'
import copy from '../../content/lidport-ds-card.json'

const meta = {
  title: 'Compositions/Showcase cards/LIDPort-DS', component: LIDPortDsCard, tags: ['autodocs', '!dev'],
  args: copy,
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Интерактивная карточка кейса LIDPort Design System\n\n<a href="https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=3772-702" target="_blank" rel="noopener noreferrer">Figma</a>' } } },
} satisfies Meta<typeof LIDPortDsCard>
export default meta
type Story = StoryObj<typeof meta>
export const Preview: Story = { render: args => ({ components:{LIDPortDsCard}, setup:()=>({args}), template:'<div style="width:100%;max-width:430px" @click.capture.prevent><LIDPortDsCard v-bind="args" /></div>' }) }
export const Sandbox: Story = {
  tags:['dev'], render: args => ({ components:{LIDPortDsCard}, setup:()=>({args}), template:'<main style="box-sizing:border-box;min-height:100vh;padding:24px"><div style="width:100%;max-width:430px;margin:auto" @click.capture.prevent><LIDPortDsCard v-bind="args" /></div></main>' }),
  play: async ({canvas}) => { const card=canvas.getByRole('link'); await expect(card).toHaveAttribute('href',copy.href); await expect(canvas.getByRole('heading',{level:2})).toHaveTextContent(copy.title.replace(/\s/g, ' ')); await expect(canvas.getAllByRole('listitem')).toHaveLength(6); if(matchMedia('(hover:hover)').matches){ await userEvent.hover(card); await waitFor(()=>expect(card).toHaveAttribute('data-state','Hover')); await userEvent.unhover(card) } },
}

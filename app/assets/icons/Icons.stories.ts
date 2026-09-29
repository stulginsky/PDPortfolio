import type { Meta, StoryObj } from '@storybook/vue3-vite'
import arrowNavLeft from './arrow-nav-left.svg'
import arrowNavRight from './arrow-nav-right.svg'
import arrowNavUp from './arrow-nav-up.svg'
import chevronDown from './chevron-down.svg'
import chevronUp from './chevron-up.svg'
import cross from './cross.svg'
import download from './download.svg'
import externalLink from './external-link.svg'
import favicon from './favicon.svg'
import figma from './figma.svg'
import gitHub from './git-hub.svg'
import moon from './moon.svg'
import print from './print.svg'
import magnifyingGlass from './magnifying-glass.svg'
import sun from './sun.svg'

const icons = [
  { name: 'Download', src: download },
  { name: 'Print', src: print },
  { name: 'ArrowNavLeft', src: arrowNavLeft },
  { name: 'ArrowNavRight', src: arrowNavRight },
  { name: 'ArrowNavUp', src: arrowNavUp },
  { name: 'Cross', src: cross },
  { name: 'MagnifyingGlass', src: magnifyingGlass },
  { name: 'Sun', src: sun },
  { name: 'Moon', src: moon },
  { name: 'GitHub', src: gitHub },
  { name: 'Figma', src: figma },
  { name: 'ExternalLink', src: externalLink },
  { name: 'Favicon', src: favicon },
  { name: 'ChevronDown', src: chevronDown },
  { name: 'ChevronUp', src: chevronUp },
] as const

const meta = {
  title: 'Foundation/Icons',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Original SVG assets from the Figma [Icons section](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=33-1944).\n\nThe catalog is a Foundation asset inventory, not a replacement for a component API.`,
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Catalog: Story = {
  render: () => ({
    setup: () => ({ icons }),
    template: `
      <main style="display:grid;gap:24px;padding:32px;background:var(--surface-default)">
        <header style="display:grid;gap:4px">
          <h1 style="margin:0">Icons</h1>
          <p style="margin:0">15 original SVG assets from Figma</p>
        </header>
        <section aria-label="Icon catalog" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(144px,1fr));gap:12px">
          <article v-for="icon in icons" :key="icon.name" style="display:grid;justify-items:center;gap:12px;padding:20px 12px;border:1px solid var(--border-default);background:var(--surface-default)">
            <img :src="icon.src" :alt="icon.name" />
            <code>{{ icon.name }}</code>
          </article>
        </section>
      </main>
    `,
  }),
}

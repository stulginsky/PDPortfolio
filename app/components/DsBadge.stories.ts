








import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DsBadge from './DsBadge.vue'
import { ref } from 'vue'
import { expect, waitFor } from 'storybook/test'

/**
 * Badge — DS component 312:1991
 * Figma: https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=312-1991
 * DS docs: ds/components.md § Badge
 *
 * Non-interactive label component. Three variants:
 * - Card (default): DS/Body/xs strong, surface/default
 * - HeroChirp: DS/Body/base strong, surface/badge-chirp (accent/mint)
 * - CardCompact: 5/6 scale mobile endpoint, surface/default
 */
const meta = {
  title: 'Components/Badge',
  component: DsBadge,
  tags: ['autodocs'],
  args: {
    label: 'UX-research',
    type: 'Card',
  },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['Card', 'HeroChirp', 'CardCompact'],
      description: 'DS variant (Type property in Figma)',
      table: {
        type: { summary: 'Card | HeroChirp | CardCompact' },
        defaultValue: { summary: 'Card' },
      },
    },
    label: {
      control: 'text',
      description: 'Badge text content (TEXT override Text#312:0)',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: "[312:1991](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=312-1991)\n\n<details>\n<summary>Техническое описание</summary>\n\nNon-interactive informational label with Hug content sizing.\nThree variants from Figma Component Set [312:1991](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=312-1991).\n\n| Type | Size | Typography | Background |\n|---|---|---|---|\n| Card | 94×29 | DS/Body/xs strong (12px, w600), radius 32px | surface/default |\n| HeroChirp | 123×40 | DS/Body/base strong (16px, w600), radius 32px | surface/badge-chirp (accent/mint) |\n| CardCompact | 79×24 | DS/Badge/Card/min (10px, w600) | surface/default |\n\n</details>",
      },
    },
  },
  decorators: [
    () => ({ template: '<div style="display:flex;gap:8px;flex-wrap:wrap;"><story /></div>' }),
  ],
} satisfies Meta<typeof DsBadge>

export default meta
type Story = StoryObj<typeof meta>

/** Default Card badge — DS/Body/xs strong, surface/default */
export const Card: Story = {
  args: { type: 'Card', label: 'UX-research' },
}

/** HeroChirp — DS/Body/base strong, accent/mint background */
export const HeroChirp: Story = {
  args: { type: 'HeroChirp', label: 'Chirp' },
}

/** CardCompact — 5/6 scale mobile endpoint */
export const CardCompact: Story = {
  args: { type: 'CardCompact', label: 'Mobile' },
}

/** All three variants side by side */
export const AllVariants: Story = {
  render: () => ({
    components: { DsBadge },
    template: `
      <div style="padding:24px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;background:var(--surface-subtle);">
        <DsBadge label="UX-research" type="Card" />
        <DsBadge label="Product Design" type="Card" />
        <DsBadge label="AI-strategy" type="Card" />
        <DsBadge label="Chirp" type="HeroChirp" />
        <DsBadge label="B2B-platform" type="CardCompact" />
        <DsBadge label="MVP" type="CardCompact" />
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
}

/** Scaling regression belongs to Badge, not its card consumers. */
export const Sandbox: Story = {
  render: () => ({
    components: { DsBadge },
    setup: () => ({ scale: ref(.762), types: ['Card', 'HeroChirp', 'CardCompact'], rows: [['B2C', 'B2B', 'MedTech'], ['MVP Scope', 'Mobile UX', 'User Flows']] }),
    template: `
      <div style="padding:24px;background:var(--surface-subtle);font-family:var(--text-font-sans)">
        <label>Масштаб <input aria-label="Масштаб" type="range" min="0.5" max="1.5" step="0.001" v-model.number="scale" /></label>
        <output>{{ scale }}</output>
        <div v-for="type in types" :key="type" style="margin-top:24px" :style="{height:(type === 'HeroChirp' ? 96 : 74)*scale+'px'}">
          <div :data-badge-type="type" :style="{transform:'scale('+scale+')',transformOrigin:'top left',width:'max-content'}">
            <div v-for="(row,index) in rows" :key="index" data-badge-row style="display:flex;gap:8px;margin-bottom:8px">
              <DsBadge v-for="label in row" :key="label" :label="label" :type="type" />
            </div>
          </div>
        </div>
      </div>`,
  }),
  parameters: { layout: 'fullscreen' },
  play: async ({ canvasElement }) => {
    await document.fonts.ready
    const input = canvasElement.querySelector<HTMLInputElement>('input')!
    for (const scale of [.58, .614, .762, 5/6, 1, 1.5]) {
      input.value = String(scale)
      input.dispatchEvent(new Event('input', { bubbles: true }))
      await waitFor(() => expect(canvasElement.querySelector('[data-badge-type]')!.getBoundingClientRect().width).toBeGreaterThan(0))
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      for (const row of canvasElement.querySelectorAll<HTMLElement>('[data-badge-row]')) {
        const badges = [...row.querySelectorAll<HTMLElement>('.ds-badge')]
        const centers = badges.map(badge => {
          const b = badge.getBoundingClientRect(), glyphs = badge.querySelector<HTMLElement>('.ds-badge__glyphs')!.getBoundingClientRect()
          const text = badge.querySelector<HTMLElement>('.ds-badge__text')!
          const textStyle = getComputedStyle(text), badgeStyle = getComputedStyle(badge)
          const actualScale = Number(row.parentElement!.style.transform.match(/scale\(([^)]+)\)/)![1])
          const originalHeight = parseFloat(textStyle.lineHeight) + parseFloat(badgeStyle.paddingTop) + parseFloat(badgeStyle.paddingBottom)
          expect(Math.abs(b.height - originalHeight * actualScale)).toBeLessThan(.05)
          expect(Math.abs((glyphs.top + glyphs.bottom - b.top - b.bottom)/2)).toBeLessThan(.1)
          expect(badge.querySelector<HTMLElement>('.ds-badge__text')!.style.transform).toBe('')
          return glyphs.bottom - b.top
        })
        expect(Math.max(...centers) - Math.min(...centers)).toBeLessThan(.1)
      }
    }
  },
}

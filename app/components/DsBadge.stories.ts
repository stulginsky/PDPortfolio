








import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DsBadge from './DsBadge.vue'

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
        component: `
Non-interactive informational label with Hug content sizing.
Three variants from Figma Component Set [312:1991](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=312-1991).

| Type | Size | Typography | Background |
|---|---|---|---|
| Card | 94×29 | DS/Body/xs strong (12px, w600), radius 32px | surface/default |
| HeroChirp | 123×40 | DS/Body/base strong (16px, w600), radius 32px | surface/badge-chirp (accent/mint) |
| CardCompact | 79×24 | DS/Badge/Card/min (10px, w600) | surface/default |
        `,
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

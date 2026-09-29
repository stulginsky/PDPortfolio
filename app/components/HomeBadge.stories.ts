








import type { Meta, StoryObj } from '@storybook/vue3-vite'
import HomeBadge from './HomeBadge.vue'

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
  component: HomeBadge,
  tags: ['autodocs'],
  args: {
    label: 'UX-research',
    type: 'Card',
    truncate: true,
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
    truncate: {
      control: 'boolean',
      description: 'Single-line with ellipsis overflow; full text in title attribute',
      table: { defaultValue: { summary: 'true' } },
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
| Card | 94×29 | DS/Body/xs strong (12px, w600) | surface/default |
| HeroChirp | 123×40 | DS/Body/base strong (16px, w600) | surface/badge-chirp (accent/mint) |
| CardCompact | 79×24 | DS/Badge/Card/min (10px, w600) | surface/default |
        `,
      },
    },
  },
  // Render as <ul> wrapper since HomeBadge renders <li>
  decorators: [
    () => ({ template: '<ul style="list-style:none;margin:0;padding:0;display:flex;gap:8px;flex-wrap:wrap;"><story /></ul>' }),
  ],
} satisfies Meta<typeof HomeBadge>

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
    components: { HomeBadge },
    template: `
      <ul style="list-style:none;margin:0;padding:24px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;background:var(--surface-subtle);">
        <HomeBadge label="UX-research" type="Card" />
        <HomeBadge label="Product Design" type="Card" />
        <HomeBadge label="AI-strategy" type="Card" />
        <HomeBadge label="Chirp" type="HeroChirp" />
        <HomeBadge label="B2B-platform" type="CardCompact" />
        <HomeBadge label="MVP" type="CardCompact" />
      </ul>
    `,
  }),
  parameters: { layout: 'fullscreen' },
}

/** Truncate behavior — long label is clipped to single line */
export const Truncate: Story = {
  args: {
    type: 'Card',
    label: 'Very long badge text that exceeds available space',
    truncate: true,
  },
  decorators: [
    () => ({
      template: '<ul style="list-style:none;margin:0;padding:0;max-width:140px;"><story /></ul>',
    }),
  ],
}

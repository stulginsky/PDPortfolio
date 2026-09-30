import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import DsFullscreenMenuMob from './DsFullscreenMenuMob.vue'

/**
 * FullscreenMenu/Mob — DS component 1021:3359
 * Figma: https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1021-3359
 */
const meta = {
  title: 'Components/FullscreenMenuMob',
  component: DsFullscreenMenuMob,
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'Все кейсы', value: 'all' },
      { label: 'Продукт', value: 'product' },
      { label: 'UX', value: 'ux' },
      { label: 'Дизайн система', value: 'ds' },
      { label: 'Брендинг', value: 'branding' },
    ],
    modelValue: null,
    placeholder: 'Продукт · креатив · бренд & more',
    ariaLabel: 'Выбрать категорию',
  },
  argTypes: {
    placeholder: { control: 'text' },
    modelValue: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
    viewport: { defaultViewport: 'mobile320' },
    docs: {
      description: {
        component: `
DS FullscreenMenu/Mob 1021:3359. Universal fullscreen single-select menu for mobile (320–767px).

| State | Size | Description |
|---|---|---|
| Default | 97×50 | Closed trigger with label + chevronDown |
| ActivePressed | 97×50 | Press → release: pressed styling + chevronUp |
| Opened | full-screen | Full-screen overlay with items + cross button |

Trigger label = intro placeholder until selection, then selected item name.
The closed trigger also supports the base Button Raised state. Opened uses a 64×4 violet handle,
an inner scroll for long lists, and closes on item select, cross button, or downward touch swipe at scroll top.
        `,
      },
    },
  },
} satisfies Meta<typeof DsFullscreenMenuMob>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Selected: Story = {
  args: {
    modelValue: 'product',
    placeholder: 'Продукт · креатив · бренд & more',
  },
}

export const Raised: Story = {
  args: {
    raised: true,
    placeholder: 'Product · creative · brand & more',
  },
}

/** Sandbox for Filters use-case */
export const FiltersContext: Story = {
  render: () => ({
    components: { DsFullscreenMenuMob },
    data() {
      return {
        selected: null as string | null,
        items: [
          { label: 'Все кейсы', value: 'all' },
          { label: 'Продукт', value: 'product' },
          { label: 'UX', value: 'ux' },
          { label: 'Дизайн система', value: 'ds' },
          { label: 'Брендинг', value: 'branding' },
          { label: 'Kreатив', value: 'creative' },
          { label: 'Gamedev', value: 'gamedev' },
        ],
      }
    },
    template: `
      <div style="padding:24px;font-family:var(--text-font-sans);max-width:375px;">
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">Mobile filter row (base viewport &lt;394px):</p>
        <DsFullscreenMenuMob
          v-model="selected"
          :items="items"
          placeholder="Продукт · креатив · бренд & more"
          aria-label="Выбрать категорию"
        />
        <p style="font-size:14px;color:var(--text-muted);margin-top:16px;">
          Selected: <strong>{{ selected || '(none)' }}</strong>
        </p>
        <p style="font-size:12px;color:var(--text-subtle);margin-top:4px;">
          Tap trigger to open fullscreen overlay
        </p>
      </div>
    `,
  }),
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile320' },
  },
}

export const Interaction: Story = {
  render: () => ({
    components: { DsFullscreenMenuMob },
    data: () => ({ selected: null as string | null }),
    template: `
      <DsFullscreenMenuMob
        v-model="selected"
        :items="[
          { label: 'Product', value: 'product' },
          { label: 'Creative', value: 'creative' },
          { label: 'Brand', value: 'brand' }
        ]"
        placeholder="Product · creative · brand & more"
        aria-label="Choose category"
        raised
      />
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Choose category' })

    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    const dialog = within(document.body).getByRole('dialog', { name: 'Choose category' })
    await expect(dialog).toBeVisible()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Product' }))

    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toHaveTextContent('Product')
    await expect(trigger).toHaveFocus()

    await userEvent.click(trigger)
    const reopenedDialog = within(document.body).getByRole('dialog', { name: 'Choose category' })
    const buttons = within(reopenedDialog).getAllByRole('button')
    await userEvent.click(buttons.at(-1)!)
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

  },
}

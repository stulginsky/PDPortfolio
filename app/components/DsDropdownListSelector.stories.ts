import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import { expect } from 'storybook/test'
import DsDropdownListSelector from './DsDropdownListSelector.vue'
import DsDropdownListItem from './DsDropdownListItem.vue'

/**
 * DropdownListSelector — DS component 1282:6724
 * Figma: https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1282-6724
 */
const meta = {
  title: 'Components/DropdownListSelector',
  component: DsDropdownListSelector,
  tags: ['autodocs'],
  args: { type: 'General' },
  argTypes: {
    type: { control: 'inline-radio', options: ['General', 'Filter'] },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: "[Figma 1282:6724](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1282-6724)\n\n<details>\n<summary>Техническое описание</summary>\n\nDS DropdownListSelector 1282:6724. Shared web surface for dropdown rows.\n\nFigma references Items = 3 | 4 and Type = General | Filter with Shadow/2nd in every variant.\nIn production, the default slot can contain any number of DsDropdownListItem rows.\nGeneral web menus hug the widest row and keep every option on one line. The Sandbox exposes\nthe nested row data without turning it into public Selector props.\n\n</details>",
      },
    },
  },
} satisfies Meta<typeof DsDropdownListSelector>

export default meta
type Story = StoryObj<typeof meta>

const listItems = ['List item', 'List item', 'List item', 'List item']

function renderList(items: string[], type: 'General' | 'Filter', width: number) {
  const dimension = type === 'Filter' ? `width:${width}px;` : `max-width:${width}px;`

  return () => ({
    components: { DsDropdownListSelector, DsDropdownListItem },
    data: () => ({ items }),
    template: `
      <div style="${dimension}">
        <DsDropdownListSelector type="${type}">
          <li v-for="(item, index) in items" :key="index">
            <DsDropdownListItem :label="item" appearance="Sm" />
          </li>
        </DsDropdownListSelector>
      </div>
    `,
  })
}

export const Default: Story = {
  render: renderList(listItems, 'General', 146),
  play: async ({ canvas }) => {
    const list = canvas.getByRole('list')
    const [firstRow] = canvas.getAllByRole('button')

    await expect(firstRow.getBoundingClientRect().width).toBeCloseTo(
      list.getBoundingClientRect().width,
      0,
    )
  },
}

export const Filter: Story = {
  render: renderList(['List item', 'Longer filter value', 'List item'], 'Filter', 256),
}

const iconOptions = [
  'Favicon',
  'Download',
  'Print',
  'ArrowNavLeft',
  'ArrowNavRight',
  'ArrowNavUp',
  'Cross',
  'MagnifyingGlass',
  'Sun',
  'Moon',
  'GitHub',
  'Figma',
  'ExternalLink',
  'ChevronDown',
  'ChevronUp',
  'Check',
]

export const Sandbox: StoryObj = {
  args: {
    itemsCount: 4,
    type: 'General',
    item1Label: 'List item',
    item1Icon: 'Favicon',
    item1ShowIcon: true,
    item2Label: 'List item',
    item2Icon: 'Favicon',
    item2ShowIcon: true,
    item3Label: 'List item',
    item3Icon: 'Favicon',
    item3ShowIcon: true,
    item4Label: 'List item',
    item4Icon: 'Favicon',
    item4ShowIcon: true,
  },
  argTypes: {
    itemsCount: { name: 'Items', control: 'inline-radio', options: [3, 4] },
    item1Label: { name: 'Item 1 / TextListItem', control: 'text' },
    item1Icon: { name: 'Item 1 / Icon', control: 'select', options: iconOptions },
    item1ShowIcon: { name: 'Item 1 / ShowIcon', control: 'boolean' },
    item2Label: { name: 'Item 2 / TextListItem', control: 'text' },
    item2Icon: { name: 'Item 2 / Icon', control: 'select', options: iconOptions },
    item2ShowIcon: { name: 'Item 2 / ShowIcon', control: 'boolean' },
    item3Label: { name: 'Item 3 / TextListItem', control: 'text' },
    item3Icon: { name: 'Item 3 / Icon', control: 'select', options: iconOptions },
    item3ShowIcon: { name: 'Item 3 / ShowIcon', control: 'boolean' },
    item4Label: { name: 'Item 4 / TextListItem', control: 'text' },
    item4Icon: { name: 'Item 4 / Icon', control: 'select', options: iconOptions },
    item4ShowIcon: { name: 'Item 4 / ShowIcon', control: 'boolean' },
  },
  render: (args) => ({
    components: { DsDropdownListSelector, DsDropdownListItem },
    setup() {
      const rows = computed(() => [
        { label: args.item1Label, icon: args.item1Icon, showIcon: args.item1ShowIcon },
        { label: args.item2Label, icon: args.item2Icon, showIcon: args.item2ShowIcon },
        { label: args.item3Label, icon: args.item3Icon, showIcon: args.item3ShowIcon },
        { label: args.item4Label, icon: args.item4Icon, showIcon: args.item4ShowIcon },
      ].slice(0, args.itemsCount))

      return { args, rows }
    },
    template: `
      <div style="max-width:calc(100vw - 32px);">
        <DsDropdownListSelector :type="args.type">
          <li v-for="(row, index) in rows" :key="index">
            <DsDropdownListItem
              :label="row.label"
              :icon="row.icon"
              :show-icon="row.showIcon"
              appearance="Sm"
            />
          </li>
        </DsDropdownListSelector>
      </div>
    `,
  }),
  parameters: { layout: 'centered' },
}

/** Six-row composition from Figma 1650:3549; zoom calculations are deliberately separate. */
export const ViewerZoomMenu: Story = {
  parameters: { docs: { description: { story: 'Figma 1650:3549. Current selection only; image scaling is handled in the next integration step.' } } },
  render: () => ({
    components: { DsDropdownListSelector, DsDropdownListItem },
    setup() {
      const selected = ref('Fit to width')
      const options = ['Zoom 50%', 'Zoom 100%', 'Zoom 150%', 'Fit to width', 'Fit to height', 'Fit to screen']
      return { selected, options }
    },
    template: `
      <DsDropdownListSelector type="General" aria-label="Image scale" style="width:184px">
        <li v-for="option in options" :key="option">
          <DsDropdownListItem
            :label="option" appearance="Sm" icon="Check"
            :show-icon="selected === option"
            :aria-current="selected === option ? 'true' : undefined"
            @click="selected = option"
          />
        </li>
      </DsDropdownListSelector>
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    const list = canvas.getByRole('list', { name: 'Image scale' })
    const rows = canvas.getAllByRole('button')
    await expect(rows).toHaveLength(6)
    await expect(list.getBoundingClientRect().width).toBeCloseTo(184, 0)
    await expect(list.getBoundingClientRect().height).toBeCloseTo(264, 0)
    await expect(rows[3]).toHaveAttribute('aria-current', 'true')
    for (const row of rows) {
      await userEvent.click(row)
      await expect(row).toHaveAttribute('aria-current', 'true')
      await expect(list.querySelectorAll('[aria-current="true"]')).toHaveLength(1)
      await expect(list.querySelectorAll('.ds-dropdown-list-item__icon:not([style*="hidden"])')).toHaveLength(1)
      await expect(list.getBoundingClientRect().width).toBeCloseTo(184, 0)
    }
    rows[3].focus()
    await userEvent.keyboard('{Enter}')
    await expect(rows[3]).toHaveAttribute('aria-current', 'true')
  },
}

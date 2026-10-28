import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'
import DsRoleFocus from './DsRoleFocus.vue'

const meta = {
  title: 'Components/RoleFocus',
  component: DsRoleFocus,
  // Docs is explicitly composed in storybook/components/RoleFocus.mdx.
  args: {
    breakpoint: 'base',
    role: 'Product Designer · UX Researcher',
    focus: 'Product Discovery · Product Architecture · Business Analysis · MVP Scope · AI Product Design',
  },
  argTypes: {
    breakpoint: {
      control: 'radio',
      options: ['base', 'min-425'],
      description: 'Docs: выбор варианта. Sandbox: вариант автоматически определяется viewport.',
    },
    role: { control: 'text', description: 'Typograf: пункты разделены ·, переносятся целиком; разделитель остаётся с предыдущим пунктом.' },
    focus: { control: 'text', description: 'Typograf: пункты разделены ·, переносятся целиком; разделитель остаётся с предыдущим пунктом.' },
  },
  parameters: {
    layout: 'padded',
    controls: { sort: 'none' },
    docs: {
      description: {
        component: '[Figma 1107:7326](https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1107-7326)\n\n<details>\n<summary>Техническое описание</summary>\n\nDocs показывает один вариант: base по умолчанию; радиокнопки breakpoint переключают production-компонент на min-425. Sandbox показывает один адаптивный компонент: ниже425px base, от425px min-425; используйте родной viewport Storybook. Колонка подписей116px, выключка справа только в min-425. Typograf сохраняет целые пункты и прикрепляет разделитель к предыдущему пункту. API role/focus/breakpoint не изменён.\n\n</details>',
      },
    },
  },
} satisfies Meta<typeof DsRoleFocus>

export default meta
type Story = StoryObj<typeof meta>

async function checkComponent(root: Element, horizontal: boolean) {
  await document.fonts.ready
  await expect(root.querySelectorAll('.ds-role-focus__row')).toHaveLength(2)
  await expect(getComputedStyle(root.querySelector('.ds-role-focus__row')!).flexDirection).toBe(horizontal ? 'row' : 'column')
  for (const label of root.querySelectorAll('.ds-role-focus__label')) {
    await expect(getComputedStyle(label).textAlign === 'right').toBe(horizontal)
  }
  for (const value of root.querySelectorAll('.ds-role-focus__value')) {
    const items = [...value.querySelectorAll('.ds-role-focus__item')]
    for (const [index, item] of items.entries()) {
      await expect(getComputedStyle(item).whiteSpace).toBe('nowrap')
      await expect(item.textContent).not.toMatch(/ /)
      const range = document.createRange()
      range.selectNodeContents(item)
      await expect(range.getClientRects()).toHaveLength(1)
      if (index < items.length - 1) await expect(item.textContent).toMatch(/\u00a0·$/)
    }
  }
}

// Primary Docs example only; no extra sidebar entry or second preview.
export const Preview: Story = {
  tags: ['!dev'],
  render: (args) => ({
    components: { DsRoleFocus },
    setup: () => ({ args }),
    template: '<div :style="{ width: args.breakpoint === \'base\' ? \'288px\' : \'924px\', maxWidth: \'100%\' }"><DsRoleFocus v-bind="args" /></div>',
  }),
  play: async ({ canvasElement, args }) => {
    await expect(canvasElement.querySelectorAll('.ds-role-focus')).toHaveLength(1)
    await checkComponent(canvasElement.querySelector('.ds-role-focus')!, args.breakpoint === 'min-425')
  },
}

// No forced breakpoint: native viewport changes exercise production CSS.
export const Sandbox: Story = {
  args: { breakpoint: undefined },
  parameters: {
    controls: { exclude: ['breakpoint'] },
  },
  render: (args) => ({
    components: { DsRoleFocus },
    setup: () => ({ args }),
    template: '<div style="width:100%;max-width:924px;"><DsRoleFocus :role="args.role" :focus="args.focus" /></div>',
  }),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('.ds-role-focus')).toHaveLength(1)
    const root = canvasElement.querySelector('.ds-role-focus')!
    await expect(root.className).not.toMatch(/ds-role-focus--/)
    await checkComponent(root, window.innerWidth >= 425)
  },
}

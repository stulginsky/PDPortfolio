import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { expect, within } from 'storybook/test'
import DsFullscreenMenuMob from './DsFullscreenMenuMob.vue'

const meta = {
  title: 'Components/FullscreenMenu-mob',
  component: DsFullscreenMenuMob,
  tags: ['autodocs', '!dev'],
  args: {
    raised: false,
  },
  argTypes: {
  "items": {
    "description": "Список пунктов `{ label, value, icon?, showIcon?, href? }`. `href` открывается в новой вкладке и не меняет `modelValue`; для Figma задаются `href`, `icon: ExternalLink` и `showIcon: true`.",
    "table": {
      "category": "Содержимое",
      "type": {
        "summary": "MenuItem[]"
      }
    },
    "control": false
  },
  "modelValue": {
    "description": "Выбранное значение. `null` показывает вводную подпись trigger.",
    "table": {
      "category": "Состояние",
      "type": {
        "summary": "string | null"
      },
      "defaultValue": {
        "summary": "null"
      }
    },
    "control": false
  },
  "placeholder": {
    "description": "Вводная подпись закрытого trigger, пока `modelValue` не выбран.",
    "table": {
      "category": "Содержимое",
      "type": {
        "summary": "string"
      },
      "defaultValue": {
        "summary": "Продукт · Креатив · Бренд & ..."
      }
    },
    "control": {
      "type": "text"
    }
  },
  "ariaLabel": {
    "description": "Доступное имя trigger и полноэкранного диалога.",
    "table": {
      "category": "Доступность",
      "type": {
        "summary": "string"
      },
      "defaultValue": {
        "summary": "Открыть меню"
      }
    },
    "control": {
      "type": "text"
    }
  },
  "raised": {
    "description": "Figma Button `Raised=On` для закрытого trigger. В Sandbox применяется ко всем трём примерам.",
    "table": {
      "category": "Внешний вид",
      "type": {
        "summary": "boolean"
      },
      "defaultValue": {
        "summary": "false"
      }
    },
    "control": {
      "type": "boolean"
    }
  },
  "toggled": {
    "description": "Устойчивый Figma Button `State=Toggled`. Применяется потребителем только к выбранному фильтру; navigation и Zoom после выбора возвращаются в Default.",
    "table": {
      "category": "Состояние",
      "type": {
        "summary": "boolean"
      },
      "defaultValue": {
        "summary": "false"
      }
    },
    "control": false
  }
},
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile320',
    },
    docs: {
      description: {
        component:
          "Полноэкранное меню выбора для мобильного интерфейса.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1021-3359\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>",
      },
    },
  },
} satisfies Meta<typeof DsFullscreenMenuMob>

export default meta
type Story = StoryObj<typeof meta>

export const Sandbox: Story = {
  tags: ['dev'],
  render: (args) => ({
    components: { DsFullscreenMenuMob },
    setup() {
      const filterValue = ref<string | null>(null)
      const navigationValue = ref<string | null>('overview')
      const zoomValue = ref<string | null>(null)

      const filterItems = [
        { label: 'Все кейсы', value: 'all' },
        { label: 'Продукт', value: 'product' },
        { label: 'UX', value: 'ux' },
        { label: 'Дизайн система', value: 'design-system' },
        { label: 'Брендинг', value: 'branding' },
        { label: 'Креатив', value: 'creative' },
        { label: 'Jewelry', value: 'jewelry' },
        { label: 'Лэндинг', value: 'landing' },
        { label: 'Gamedev', value: 'gamedev' },
        { label: 'Видео', value: 'video' },
        { label: 'Упаковка', value: 'packaging' },
      ]
      const navigationItems = [
        { label: 'Overview', value: 'overview' },
        { label: 'Foundation.md', value: 'foundation' },
        { label: 'Tokens.json', value: 'tokens' },
        {
          label: 'Figma',
          value: 'figma',
          href: 'https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1021-3359',
          icon: 'ExternalLink',
          showIcon: true,
        },
      ]
      const zoomItems = [
        { label: 'Zoom 75%', value: '75' },
        { label: 'Zoom 100%', value: '100' },
        { label: 'Zoom 125%', value: '125' },
        { label: 'Fit to screen', value: 'fit' },
      ]

      return {
        args,
        filterValue,
        navigationValue,
        zoomValue,
        filterItems,
        navigationItems,
        zoomItems,
      }
    },
    template: `
      <div style="display:flex; flex-direction:column; align-items:flex-start; gap:16px; box-sizing:border-box; width:320px; min-height:100vh; padding:16px;">
        <DsFullscreenMenuMob
          :model-value="filterValue"
          :items="filterItems"
          placeholder="Продукт · Креатив · Бренд & ..."
          aria-label="Выбрать категорию"
          :raised="args.raised"
          :toggled="filterValue !== null"
          @update:model-value="filterValue = $event === 'all' ? null : $event"
        />
        <DsFullscreenMenuMob
          v-model="navigationValue"
          :items="navigationItems"
          placeholder="Overview · Docs · Figma"
          aria-label="Выбрать раздел"
          :raised="args.raised"
        />
        <DsFullscreenMenuMob
          v-model="zoomValue"
          :items="zoomItems"
          placeholder="Zoom 100%"
          aria-label="Выбрать масштаб"
          :raised="args.raised"
        />
      </div>
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    const navigationTrigger = canvas.getByRole('button', { name: 'Выбрать раздел' })
    await expect(navigationTrigger).toHaveTextContent('Overview')
    await userEvent.click(navigationTrigger)
    await expect(document.querySelector('.ds-fs-menu__handle')).toBeNull()

    const overlay = within(document.body)
    const figma = overlay.getByRole('link', { name: 'Figma' })
    await expect(figma).toHaveAttribute('target', '_blank')
    for (const row of document.querySelectorAll<HTMLElement>('.ds-fs-menu__list .ds-dropdown-list-item')) {
      const label = row.querySelector<HTMLElement>('.ds-dropdown-list-item__label')!.getBoundingClientRect()
      await expect(label.left + label.width / 2).toBeCloseTo(window.innerWidth / 2, 0)
    }
    await userEvent.click(figma)
    await expect(overlay.queryByRole('dialog')).toBeNull()
    await expect(canvas.getByRole('button', { name: 'Выбрать раздел' })).toHaveTextContent('Overview')
  },
}

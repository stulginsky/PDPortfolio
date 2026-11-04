import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DsCaseImagePreview from './DsCaseImagePreview.vue'
import sharedMeta, { Sandbox as SharedSandbox } from './DsCaseImagePreview.stories'

const meta = {
  ...sharedMeta,
  tags: ['autodocs', '!dev'],
  title: 'Components/CaseImagePreview-withTitle',
  component: DsCaseImagePreview,
  args: { ...sharedMeta.args, type: 'v1' },
  parameters: {
    ...sharedMeta.parameters,
    docs: { description: { component: "Изображение кейса с заголовком и доступом к увеличенному просмотру.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=1016-9326\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>" } },
  },

  argTypes: {
  "type": {
    "table": {
      "disable": true
    },
    "control": false
  },
  "title": {
    "description": "Заголовок медиа. Переносится при переполнении.",
    "control": {
      "type": "text"
    }
  },
  "instance": {
    "options": [
      "ImgTitle",
      "ImgTitleToolbar"
    ],
    "description": "Одна панель: заголовок с лупой либо заголовок с навигацией документов.",
    "control": {
      "type": "select"
    }
  },
  "showZoom": {
    "if": {
      "arg": "instance",
      "eq": "ImgTitleToolbar"
    },
    "description": "Видимость лупы только для ImgTitleToolbar.",
    "control": {
      "type": "boolean"
    }
  },
  "modelValue": {
    "options": [
      null,
      "overview",
      "foundation",
      "tokens"
    ],
    "description": "Выбранное представление toolbar; Figma не меняет выбор.",
    "control": {
      "type": "select"
    }
  },
  "default": {
    "description": "SLOT медиа. Изображение с исходными размерами и alt. Уменьшается до ширины слота, но не увеличивается.",
    "control": false
  },
  "onZoom": {
    "description": "Запрос потребителю открыть viewer. Preview сам viewer не создаёт."
  }
},
} satisfies Meta<typeof DsCaseImagePreview>
export default meta
type Story = StoryObj<typeof meta>

export const Sandbox: Story = {
  ...SharedSandbox,
  tags: ['dev'],
  args: { ...SharedSandbox.args, type: 'v1' },
  render: (args, context) => SharedSandbox.render!(new Proxy(args, {
    get: (target, key) => key === 'type' ? 'v1' : Reflect.get(target, key),
  }), context),
}


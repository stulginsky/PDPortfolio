import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor } from 'storybook/test'
import { ref } from 'vue'
import DsScroll from './DsScroll.vue'
import './DsScroll.stories.css'

const meta = {
  title: 'Components/Scroll',
  component: DsScroll,
  tags: ['autodocs'],
  args: {
    axis: 'Y',
    scrollId: 'scroll-demo',
  },
  argTypes: {
    axis: { control: 'inline-radio', options: ['X', 'Y'] },
    scrollId: { control: 'text', description: 'ID of the controlled scroll container.' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: "<details>\n<summary>Техническое описание</summary>\n\nScrollable-content indicator. The production thumb follows native X/Y scroll, supports keyboard and desktop drag, and is hidden when its axis has no overflow.\n\n</details>",
      },
    },
  },
} satisfies Meta<typeof DsScroll>

export default meta
type Story = StoryObj<typeof meta>

export const VerticalY: Story = {
  render: () => ({
    components: { DsScroll },
    template: `
      <div style="position:relative;width:260px;height:200px;border:1px solid var(--border-default);border-radius:8px;overflow:hidden">
        <div id="scroll-y-demo" class="scroll-story__content" style="height:200px;overflow-y:auto;padding:16px 28px 16px 16px;scrollbar-width:none">
          <p v-for="i in 16" :key="i" style="margin:0 0 12px;font-family:var(--text-font-sans);font-size:14px;color:var(--text-default)">Line {{ i }}: scrollable content.</p>
        </div>
        <DsScroll axis="Y" scroll-id="scroll-y-demo" style="position:absolute;inset:0 0 0 auto;height:200px" />
      </div>
    `,
  }),
  parameters: { layout: 'centered' },
}

export const HorizontalX: Story = {
  render: () => ({
    components: { DsScroll },
    template: `
      <div style="position:relative;width:320px;height:120px;border:1px solid var(--border-default);border-radius:8px;overflow:hidden">
        <div id="scroll-x-demo" class="scroll-story__content" style="height:100px;overflow-x:auto;padding:16px 16px 0;scrollbar-width:none;white-space:nowrap">
          <span v-for="i in 20" :key="i" style="display:inline-block;margin-right:24px;font-family:var(--text-font-sans);font-size:14px;color:var(--text-default)">Item {{ i }}</span>
        </div>
        <DsScroll axis="X" scroll-id="scroll-x-demo" style="position:absolute;right:0;bottom:0;left:0;width:auto" />
      </div>
    `,
  }),
  parameters: { layout: 'centered' },
}

export const AllVariants: Story = {
  render: () => ({
    components: { DsScroll },
    template: `
      <div style="display:flex;gap:32px;align-items:flex-start;padding:24px;background:var(--surface-default)">
        <div style="position:relative;width:180px;height:120px;border:1px solid var(--border-default);overflow:hidden">
          <div id="scroll-all-y" class="scroll-story__content" style="height:120px;overflow-y:auto;padding:12px 28px 12px 12px;scrollbar-width:none">
            <p v-for="i in 12" :key="i" style="margin:0 0 8px">Line {{ i }}</p>
          </div>
          <DsScroll axis="Y" scroll-id="scroll-all-y" style="position:absolute;inset:0 0 0 auto;height:120px" />
        </div>
        <div style="position:relative;width:220px;height:80px;border:1px solid var(--border-default);overflow:hidden">
          <div id="scroll-all-x" class="scroll-story__content" style="height:60px;overflow-x:auto;scrollbar-width:none;white-space:nowrap">
            <span v-for="i in 12" :key="i" style="display:inline-block;margin-right:16px">Item {{ i }}</span>
          </div>
          <DsScroll axis="X" scroll-id="scroll-all-x" style="position:absolute;right:0;bottom:0;left:0;width:auto" />
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
}

export const Sandbox: Story = {
  render: () => ({
    components: { DsScroll },
    setup() {
      const yPosition = ref(0)
      const xPosition = ref(0)
      return { xPosition, yPosition }
    },
    template: `
      <div style="display:grid;gap:24px;padding:32px;background:var(--surface-default);font-family:var(--text-font-sans)">
        <div style="position:relative;width:320px;height:220px;border:1px solid var(--border-default);border-radius:8px;overflow:hidden">
          <div id="scroll-sandbox" data-testid="scroll-sandbox" class="scroll-story__content" style="width:100%;height:100%;overflow:auto;padding:16px 28px 28px 16px;box-sizing:border-box;scrollbar-width:none" @scroll="yPosition = $event.target.scrollTop; xPosition = $event.target.scrollLeft">
            <div style="width:720px;min-height:560px">
              <p style="margin:0 0 16px;white-space:nowrap">A long text line makes the content overflow horizontally inside this single scrollable area.</p>
              <p v-for="i in 18" :key="i" style="margin:0 0 12px">Paragraph {{ i }}. This text makes the same content overflow vertically.</p>
            </div>
          </div>
          <DsScroll axis="Y" scroll-id="scroll-sandbox" style="position:absolute;top:0;right:0;bottom:20px;height:auto" />
          <DsScroll axis="X" scroll-id="scroll-sandbox" style="position:absolute;right:20px;bottom:0;left:0;width:auto" />
        </div>
        <output role="status" aria-live="polite">Vertical: {{ Math.round(yPosition) }}; Horizontal: {{ Math.round(xPosition) }}</output>
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
  play: async ({ canvas }) => {
    const verticalScroll = canvas.getByRole('scrollbar', { name: 'Vertical scroll' })
    const thumb = verticalScroll.querySelector<HTMLElement>('.ds-scroll__thumb')!
    const horizontalThumb = canvas.getByRole('scrollbar', { name: 'Horizontal scroll' }).querySelector<HTMLElement>('.ds-scroll__thumb')!
    await waitFor(() => expect(getComputedStyle(thumb).backgroundColor).toBe('rgba(55, 65, 81, 0.2)'))
    expect(getComputedStyle(horizontalThumb).backgroundColor).toBe('rgba(55, 65, 81, 0.2)')
    expect(getComputedStyle(thumb).width).toBe('12px')
    expect(getComputedStyle(thumb).left).toBe('4px')
    expect(getComputedStyle(horizontalThumb).height).toBe('12px')
    expect(getComputedStyle(horizontalThumb).top).toBe('4px')
    expect(getComputedStyle(thumb).borderRadius).toBe('8px')
    if (window.matchMedia('(pointer: fine)').matches) {
      await userEvent.hover(thumb)
      await waitFor(() => expect(getComputedStyle(thumb).backgroundColor).toBe('rgba(55, 65, 81, 0.35)'))
      await userEvent.pointer({ target: thumb, keys: '[MouseLeft>]' })
      await waitFor(() => expect(getComputedStyle(thumb).backgroundColor).toBe('rgba(55, 65, 81, 0.5)'))
      await userEvent.pointer({ target: thumb, keys: '[/MouseLeft]' })
      await userEvent.unhover(thumb)
    }
    verticalScroll.focus()
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(canvas.getByRole('status')).not.toHaveTextContent('Vertical: 0; Horizontal: 0'))

    const horizontalScroll = canvas.getByRole('scrollbar', { name: 'Horizontal scroll' })
    horizontalScroll.focus()
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(canvas.getByRole('status')).not.toHaveTextContent('Horizontal: 0'))
  },
}

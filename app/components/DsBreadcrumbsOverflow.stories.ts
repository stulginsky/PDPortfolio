import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DsBreadcrumbsOverflow from './DsBreadcrumbsOverflow.vue'

/**
 * BreadcrumbsOverflow — DS component 1097:4338
 * Figma: https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1097-4338
 */
const meta = {
  title: 'Components/BreadcrumbsOverflow',
  component: DsBreadcrumbsOverflow,
  tags: ['autodocs'],
  args: {
    history: [
      { label: 'Chirp product', href: '/cases/chirp-product' },
    ],
    currentLabel: 'Chirp UX',
  },
  argTypes: {
    currentLabel: { control: 'text' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
DS BreadcrumbsOverflow 1097:4338. Composite breadcrumbs row for session history.

| History depth | Display |
|---|---|
| 0 items | (no breadcrumbs — parent shows only BtnNav/Left) |
| 1 item | A · Current |
| 2+ items | … · Prev · Current (earlier items in overflow menu) |
        `,
      },
    },
  },
} satisfies Meta<typeof DsBreadcrumbsOverflow>

export default meta
type Story = StoryObj<typeof meta>

/** 1 item history → A · Current (no overflow) */
export const OneHistory: Story = {
  args: {
    history: [{ label: 'Chirp product', href: '/cases/chirp-product' }],
    currentLabel: 'Chirp UX',
  },
}

/** 2 item history → … · B · Current */
export const TwoHistory: Story = {
  args: {
    history: [
      { label: 'Chirp product', href: '/cases/chirp-product' },
      { label: 'Chirp UX', href: '/cases/chirp-ux' },
    ],
    currentLabel: 'Chirp DS',
  },
}

/** 3 item history → … · C · Current (A, B in overflow) */
export const ThreeHistory: Story = {
  args: {
    history: [
      { label: 'Chirp product', href: '/cases/chirp-product' },
      { label: 'Chirp UX', href: '/cases/chirp-ux' },
      { label: 'Chirp DS', href: '/cases/chirp-ds' },
    ],
    currentLabel: 'Chirp Brand',
  },
}

/** Interactive sandbox — navigate forward */
export const Sandbox: Story = {
  render: () => ({
    components: { DsBreadcrumbsOverflow },
    data() {
      return {
        cases: [
          { label: 'Chirp product', href: '/cases/chirp-product' },
          { label: 'Chirp UX', href: '/cases/chirp-ux' },
          { label: 'Chirp DS', href: '/cases/chirp-ds' },
          { label: 'Chirp Brand', href: '/cases/chirp-brand' },
        ],
        currentIdx: 1,
      }
    },
    computed: {
      history() {
        return (this as any).cases.slice(0, (this as any).currentIdx)
      },
      currentLabel() {
        return (this as any).cases[(this as any).currentIdx]?.label ?? 'Current'
      },
    },
    template: `
      <div style="padding:32px;font-family:var(--text-font-sans);">
        <div style="display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap;">
          <button
            v-for="(c, i) in cases"
            :key="c.label"
            :disabled="i === currentIdx"
            style="padding:6px 12px;border:1px solid var(--border-default);border-radius:8px;background:none;cursor:pointer;font-family:var(--text-font-sans);font-size:13px;"
            :style="i === currentIdx ? 'opacity:0.4' : ''"
            @click="currentIdx = i"
          >Go to {{ c.label }}</button>
        </div>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">Breadcrumbs (history depth: {{ currentIdx }}):</p>
        <DsBreadcrumbsOverflow
          v-if="currentIdx > 0"
          :history="history"
          :current-label="currentLabel"
        />
        <p v-else style="font-size:14px;color:var(--text-muted);">No breadcrumbs — first case from Vitrina.</p>
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
}

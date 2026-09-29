import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DsTopNav from './DsTopNav.vue'
import DsAvatarSm from './DsAvatarSm.vue'
import DsFilter from './DsFilter.vue'
import DsButtonIcon from './DsButtonIcon.vue'

/**
 * TopNav — DS component 1025:7335
 * Figma: https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=1025-7335
 * Composed from TopNavScroll/Vitrina (1025:5059) and TopNavScroll/Resume (1047:4060).
 */
const meta = {
  title: 'Components/TopNav',
  component: DsTopNav,
  tags: ['autodocs'],
  args: {
    place: 'Vitrina',
  },
  argTypes: {
    place: {
      control: 'inline-radio',
      options: ['Vitrina', 'Resume'],
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
DS TopNav 1025:7335. Sticky navigation shell. Consumer fills via default slot.

| Place | Breakpoint | Height |
|---|---|---|
| Vitrina | base (<394px) | 82px |
| Vitrina | min-394 (394–767px) | 82px |
| Vitrina | min-768 (≥768px) | 90px |
| Resume | base (<534px) | 164px (2-row) |
| Resume | min-534 (534–767px) | 82px |
| Resume | min-768 (≥768px) | 90px |
        `,
      },
    },
  },
} satisfies Meta<typeof DsTopNav>

export default meta
type Story = StoryObj<typeof meta>

/** Vitrina nav — with avatar + filters */
export const Vitrina: Story = {
  render: () => ({
    components: { DsTopNav, DsAvatarSm, DsFilter },
    data() {
      return {
        filters: ['Все кейсы', 'Продукт', 'UX', 'Дизайн система', 'Брендинг'],
        selected: 'Все кейсы',
      }
    },
    template: `
      <DsTopNav place="Vitrina">
        <div style="display:flex;align-items:center;gap:16px;width:100%;justify-content:space-between;">
          <!-- Avatar -->
          <DsAvatarSm />
          <!-- Filters row -->
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <DsFilter
              v-for="f in filters"
              :key="f"
              :label="f"
              :toggled="selected === f"
              @click="selected = f"
            />
          </div>
        </div>
      </DsTopNav>
      <div style="padding:24px;font-family:var(--text-font-sans);font-size:14px;color:var(--text-muted);">
        Page content below nav. Filter: <strong>{{ selected }}</strong>
      </div>
    `,
  }),
}

/** Resume nav */
export const Resume: Story = {
  render: () => ({
    components: { DsTopNav, DsAvatarSm, DsButtonIcon },
    template: `
      <DsTopNav place="Resume">
        <div style="display:flex;align-items:center;gap:16px;width:100%;justify-content:space-between;flex-wrap:wrap;">
          <DsAvatarSm />
          <div style="display:flex;gap:16px;">
            <DsButtonIcon icon="Download" aria-label="Download resume PDF" />
            <DsButtonIcon icon="Print" aria-label="Print resume" />
          </div>
        </div>
      </DsTopNav>
      <div style="padding:24px;font-family:var(--text-font-sans);font-size:14px;color:var(--text-muted);">
        Resume page content.
      </div>
    `,
  }),
  parameters: {
    viewport: { defaultViewport: 'tablet768' },
  },
}

/** Mobile Vitrina — base breakpoint */
export const VitrinaMobile: Story = {
  render: () => ({
    components: { DsTopNav, DsAvatarSm, DsFilter },
    template: `
      <DsTopNav place="Vitrina">
        <div style="display:flex;align-items:center;gap:8px;width:100%;justify-content:space-between;">
          <DsAvatarSm />
          <span style="font-family:var(--text-font-sans);font-size:13px;color:var(--text-muted);">
            [Mobile filter here]
          </span>
        </div>
      </DsTopNav>
    `,
  }),
  parameters: {
    viewport: { defaultViewport: 'mobile320' },
  },
}

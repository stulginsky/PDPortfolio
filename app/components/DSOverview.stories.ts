import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, waitFor, within } from 'storybook/test'
import DSOverview from './DSOverview.vue'
import content from '../../content/cases/chirp-design-system.json'

const meta = {
  title: 'Compositions/Case media/DSOverview',
  component: DSOverview,
  tags: ['autodocs', '!dev'],
  parameters: { layout: 'fullscreen', docs: { description: { component:
    "Адаптивная обложка библиотеки Chirp DS со ссылками на Foundations, Components и Library guide." } } },

  } satisfies Meta<typeof DSOverview>
export default meta
type Story = StoryObj<typeof meta>
export const Sandbox: Story = {
  tags: ['dev'],
  render: () => ({
    components: { DSOverview },
    template: '<div style="padding:0 16px;background:var(--case-image-preview-web);display:flex;justify-content:center"><div style="width:100%;max-width:924px"><DSOverview /></div></div>',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const root = canvasElement.querySelector<HTMLElement>('.ds-overview-cover')!
    const logo = root.querySelector('img')!
    await waitFor(() => expect(logo.complete && logo.naturalWidth > 0).toBe(true))
    expect(root.querySelectorAll('[data-asset]')).toHaveLength(0)
    expect(canvas.getByRole('heading', { name: content.overview.title })).toBeVisible()
    const links = [...root.querySelectorAll('a')]
    expect(links.map(link => link.getAttribute('href'))).toEqual([
      ...content.overview.sections.map(section => section.href), content.overview.guideHref,
    ])
    links.forEach(link => {
      expect(link.target).toBe('_blank')
      expect(link.rel).toContain('noopener')
    })
    const cards = [...root.querySelectorAll<HTMLElement>('[data-section]')]
    expect(cards).toHaveLength(3)
    const first = cards[0]!.getBoundingClientRect()
    const second = cards[1]!.getBoundingClientRect()
    if (innerWidth >= 768) {
      expect(Math.abs(first.top - second.top)).toBeLessThan(1)
      expect(Math.abs(second.left - first.right - 24)).toBeLessThan(1)
    } else {
      expect(Math.abs(first.left - second.left)).toBeLessThan(1)
      expect(Math.abs(second.top - first.bottom - 24)).toBeLessThan(1)
    }
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(innerWidth)
  },
}

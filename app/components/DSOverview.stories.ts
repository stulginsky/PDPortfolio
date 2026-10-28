import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, waitFor } from 'storybook/test'
import DSOverview from './DSOverview.vue'
import manifest from '../../public/cases/chirp-design-system/overview/manifest.json'

const meta = {
  title: 'Compositions/Case media/DSOverview',
  component: DSOverview,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component:
    'Case-specific Figma frame781:3508. Updated source: Chirp-DS40002070:3159,50 original supplied SVGs. Width≤924px, gap32px,3 columns≥1280 /2≥768 /1 below768. Palettes grouped first, then Logotype on narrow layouts; desktop source columns preserved; intrinsic proportions; no background baked into media. Toolbar and full case are separate compositions.' } } },
} satisfies Meta<typeof DSOverview>
export default meta
type Story = StoryObj<typeof meta>
export const Sandbox: Story = {
  render: () => ({
    components: { DSOverview },
    template: '<div style="padding:32px 16px 48px;background:var(--case-image-preview-web);display:flex;justify-content:center"><DSOverview /></div>',
  }),
  play: async ({ canvasElement }) => {
    const figures = [...canvasElement.querySelectorAll<HTMLElement>('[data-asset]')]
    const prefix = ['ColorBrand', 'ColorBlue', 'ColorGreen', 'ColorGray', 'ColorCyan', 'ColorPink', 'ColorRed', 'ColorYellow', 'Logotype'].map(name => 'Asset/' + name)
    expect(figures.map(figure => figure.dataset.asset)).toEqual([
      ...prefix, ...manifest.assets.map(asset => asset.canonicalName).filter(name => !prefix.includes(name)),
    ])
    await waitFor(() => figures.forEach(figure => {
      const image = figure.querySelector('img')!
      expect(image.complete && image.naturalWidth > 0).toBe(true)
    }), { timeout: 20000 })
    const columns = innerWidth >= 1280 ? 3 : innerWidth >= 768 ? 2 : 1
    const first = figures[0]!.getBoundingClientRect()
    for (let index = 0; index < columns; index++) {
      const box = figures[index]!.getBoundingClientRect()
      expect(Math.abs(box.top - first.top)).toBeLessThan(1)
      expect(Math.abs(box.left - first.left - index * (first.width + 32))).toBeLessThan(1)
    }
    const previousByColumn = new Map<number, DOMRect>()
    figures.forEach((figure, index) => {
      const box = figure.getBoundingClientRect(), asset = manifest.assets.find(asset => asset.canonicalName === figure.dataset.asset)!
      expect(Math.abs(box.height / box.width - asset.height / asset.width)).toBeLessThan(.01)
      const column = columns === 3 ? asset.sourceColumn : index % columns
      const previous = previousByColumn.get(column)
      if (previous) {
        expect(Math.abs(box.top - previous.bottom - 32)).toBeLessThan(1)
      }
      previousByColumn.set(column, box)
    })
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(innerWidth)
  },
}

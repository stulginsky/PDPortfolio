import manifest from '../../public/cases/chirp-design-system/overview/manifest.json'

// Native fullscreen source790:3215: three603px columns, two32px gaps.
const columns = [0, 1, 2].map(column => manifest.assets.filter(asset => asset.sourceColumn === column))
export const galleryNativeSize = {
  width: 1873,
  height: Math.max(...columns.map(assets =>
    assets.reduce((height, asset) => height + asset.height / asset.width * 603, 0) + (assets.length - 1) * 32,
  )),
}

import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'

export async function managerNavigationHead(head: string) {
  const result = await build({
    configFile: false,
    publicDir: false,
    logLevel: 'warn',
    plugins: [vue()],
    define: { 'import.meta.env.VITE_SITE_BASE_URL': JSON.stringify('/'), 'process.env.NODE_ENV': JSON.stringify('production') },
    build: {
      write: false,
      lib: {
        entry: fileURLToPath(new URL('./manager-navigation.ts', import.meta.url)),
        name: 'PortfolioNavigation',
        formats: ['iife'],
      },
      minify: true,
    },
  })
  const bundle = Array.isArray(result) ? result[0] : result
  if (!bundle || !('output' in bundle)) throw new Error('Unexpected manager navigation build output')
  const script = bundle.output.find(item => item.type === 'chunk')
  const css = bundle.output.filter(item => item.type === 'asset' && item.fileName.endsWith('.css'))
    .map(item => item.source).join('\n')
  if (!script || !css) throw new Error('Missing manager navigation script or component styles')
  const tokens = await readFile(new URL('../app/assets/css/tokens.css', import.meta.url), 'utf8')
  // Keep DS tokens and component styles inside the island.
  const styles = tokens.replace(/:root\b/g, ':host') + '\n' + css
  const code = `${script.code}\nPortfolioNavigation.mountNavigation(${JSON.stringify(styles)});`
  return `${head}\n<script type="module">${code.replace(/<\/script/gi, '<\\/script')}</script>`
}

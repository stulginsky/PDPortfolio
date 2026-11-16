import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
const output = 'output/lidport-case'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true })
const errors = []
const results = []
try {
  for (const width of [1920, 768, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 1080 }, reducedMotion: 'reduce' })
    page.on('pageerror', error => errors.push(error.message))
    const response = await page.goto('http://127.0.0.1:3000/cases/lidport-design-system', { waitUntil: 'networkidle' })
    if (response.status() !== 200) throw new Error(`HTTP ${response.status()}`)
    await page.evaluate(() => document.fonts.ready)
    await page.locator('.lidport-ds-hero img').evaluateAll(images => Promise.all(images.map(img => img.decode())))
    await page.screenshot({ path: `${output}/${width}-${process.argv[2] || 'full'}.png`, fullPage: true })
    results.push(await page.evaluate(() => ({ width:innerWidth, scrollWidth:document.documentElement.scrollWidth,
      heroHeight:document.querySelector('.lidport-ds-hero').getBoundingClientRect().height,
      frames:[...document.querySelectorAll('[data-figma-frame]')].map(el => ({ id:el.dataset.figmaFrame,x:el.getBoundingClientRect().x,y:el.getBoundingClientRect().y,width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height })),
      images:[...document.images].map(img => ({src:img.getAttribute('src')?.startsWith('data:')?'inline-svg':img.getAttribute('src'),ok:img.complete && img.naturalWidth>0})) })))
    if (results.at(-1).scrollWidth > width) throw new Error(`Overflow at ${width}`)
    if (results.at(-1).images.some(img=>!img.ok)) throw new Error(`Broken image at ${width}`)
    if (process.argv.includes('--documents') && width !== 768) {
      for (const label of ['Foundation.md', 'Tokens.json', 'Overview']) {
        const direct = page.locator('.ds-img-title-toolbar button:visible').filter({hasText:label})
        if (await direct.count()) await direct.first().click()
        else {
          await page.locator('.ds-img-title-toolbar button:visible').filter({hasText:/Overview|Foundation|Tokens/}).first().click()
          await page.getByText(label,{exact:true}).filter({visible:true}).last().click()
        }
        if (label !== 'Overview') {
          await page.getByRole('region',{name:label,exact:true}).waitFor()
          const rendered = await page.locator('.lidport-case__line code').allTextContents()
          if (!rendered.join('\n').includes(label === 'Tokens.json' ? 'org.lidport' : '# LIDPort Design System')) throw new Error(`Wrong ${label}`)
        } else await page.locator('.lidport-overview').waitFor()
        if (await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)) throw new Error(`Document overflow ${label}`)
      }
    }
    await page.close()
  }
  await writeFile(`${output}/verification.json`, JSON.stringify({ results, errors },null,2))
  if(errors.length) throw new Error(errors.join('\n'))
  console.log(JSON.stringify({results,errors},null,2))
} finally { await browser.close() }

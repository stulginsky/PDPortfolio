import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'

const output = 'tmp/dragon-heart-case'
await fs.mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true, channel: 'msedge' })
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const report = []
  for (const width of [1920, 768, 320]) {
    await page.setViewportSize({ width, height: 1080 })
    await page.goto('http://127.0.0.1:3000/cases/dragon-heart-jw', { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.locator('.dragon-heart-case__image img').evaluateAll(images => Promise.all(images.map(image => { image.loading = 'eager'; return image.decode() })))
    await page.waitForFunction(() => document.querySelector('video')?.readyState >= 2)
    const geometry = await page.evaluate(() => {
      const box = selector => document.querySelector(selector).getBoundingClientRect().toJSON()
      const video = document.querySelector('video')
      return { width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth,
        opening: box('.dragon-heart-case__opening'), role: box('.dragon-heart-case__role'), video: box('video'),
        images: [...document.querySelectorAll('.dragon-heart-case__image')].map(el => el.getBoundingClientRect().toJSON()),
        ending: box('.dragon-heart-case__ending'), height: document.querySelector('main').getBoundingClientRect().height,
        videoMetadata: { width: video.videoWidth, height: video.videoHeight, duration: video.duration, error: video.error?.message },
        assets: [...document.querySelectorAll('.dragon-heart-case__image img')].map(img => ({ src: img.getAttribute('src'), width: img.naturalWidth, height: img.naturalHeight })) }
    })
    await fs.writeFile(`${output}/${width}-geometry.json`, JSON.stringify(geometry, null, 2))
    assert.equal(geometry.overflow, false)
    assert.ok(geometry.videoMetadata.duration > 0)
    assert.ok(!geometry.videoMetadata.error)
    assert.equal(geometry.images.length, 3)
    if (width === 1920) {
      assert.equal(geometry.opening.x, 498)
      assert.equal(geometry.opening.y, 144)
      assert.equal(geometry.role.x, 498)
      assert.equal(geometry.role.width, 924)
      assert.equal(geometry.role.y, 416)
      assert.ok(Math.abs(geometry.role.height - 76) < 1)
      assert.ok(Math.abs(geometry.opening.height - 348) < 1, JSON.stringify(geometry))
      assert.ok(Math.abs(geometry.video.y - 636) < 1, JSON.stringify(geometry))
      for (const [i, image] of geometry.images.entries()) {
        assert.equal(image.x, 498)
        assert.equal(image.width, 924)
        assert.ok(Math.abs(image.height - 594) < 1, JSON.stringify(geometry))
        assert.ok(Math.abs(image.y - (1302.688782 + i * 738)) < 1)
      }
      assert.ok(Math.abs(geometry.height - 3942.688782) < 1)
    }
    await page.locator('video').evaluate(async video => { await video.play() })
    await page.waitForFunction(() => document.querySelector('video').currentTime > .2)
    await page.locator('video').evaluate(video => { video.pause(); video.currentTime = 0 })
    await page.screenshot({ path: `${output}/${width}.png`, fullPage: true })
    await page.locator('.dragon-heart-case__role').screenshot({ path: `${output}/${width}-role-focus.png` })
    const preview = page.locator('.dragon-heart-case__image').first()
    await preview.locator('img').click({ position: { x: 20, y: 20 } })
    assert.equal(await page.getByRole('dialog').count(), 0)
    await preview.getByRole('button').click()
    await page.getByRole('dialog').waitFor()
    await page.waitForFunction(() => document.querySelector('[role="dialog"]')?.getAttribute('aria-busy') === 'false')
    const viewer = await page.getByRole('dialog').getByRole('img', { name: 'dragon01', exact: true }).evaluate(img => {
      const image = img.getBoundingClientRect(), media = img.parentElement.getBoundingClientRect()
      return { image: image.toJSON(), media: media.toJSON(), naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, width: img.width, height: img.height }
    })
    assert.equal(viewer.width, viewer.naturalWidth)
    assert.equal(viewer.height, viewer.naturalHeight)
    assert.ok(Math.abs(viewer.image.width - viewer.media.width) < 1, JSON.stringify(viewer))
    assert.ok(Math.abs(viewer.image.height - viewer.media.height) < 1, JSON.stringify(viewer))
    if (width >= 768) assert.ok(Math.abs(viewer.image.width - (width - 128)) < 1, JSON.stringify(viewer))
    await page.screenshot({ path: `${output}/${width}-viewer.png` })
    await page.keyboard.press('Escape')
    await page.getByRole('dialog').waitFor({ state: 'detached' })
    report.push(geometry)
  }
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' })
  const card = page.locator('[data-case-href="/cases/dragon-heart-jw"]')
  await card.scrollIntoViewIfNeeded()
  await card.getByRole('button').click()
  await page.waitForURL(url => /^\/cases\/dragon-heart-jw\/?$/.test(url.pathname))
  assert.deepEqual(errors, [])
  await fs.writeFile(`${output}/verification.json`, JSON.stringify({ report, errors, navigation: 'passed', viewer: 'passed', playback: 'passed' }, null, 2))
  console.log('DragonHeart: geometry 1920/768/320, image decode, video playback, viewer, Escape and showcase navigation passed')
} finally { await browser.close() }

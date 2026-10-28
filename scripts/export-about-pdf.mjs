import { chromium } from 'playwright'
// Run against the current local page after typograf:apply and visual review.
const browser = await chromium.launch({ headless: true, channel: 'chrome' })
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' })
  const response = await page.goto(process.env.ABOUT_URL || 'http://127.0.0.1:3000/resume', { waitUntil: 'networkidle' })
  if (response.status() !== 200) throw new Error(`Resume returned ${response.status()}`)
  await page.evaluate(() => document.fonts.ready)
  await page.waitForFunction(() => [...document.querySelectorAll('.about-page img')].every(img => img.complete && img.naturalWidth > 0))
  await page.pdf({ path: 'public/resume/resume.pdf', format: 'A4', printBackground: true, margin: { top: '12mm', right: '10mm', bottom: '12mm', left: '10mm' } })
  console.log('Updated public/resume/resume.pdf from the current About page')
} finally { await browser.close() }

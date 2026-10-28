import assert from 'node:assert/strict'
import { normalizeCaseEditorial, normalizeCaseParagraphs } from './lib/case-editorial.mjs'

assert.equal(normalizeCaseParagraphs('Первое предложение. Второе.\n\nВопрос?\nОтвет!\nПауза...\nЕщё…'), 'Первое предложение. Второе\n\nВопрос?\nОтвет!\nПауза...\nЕщё…')
assert.equal(normalizeCaseParagraphs('Он сказал: «Спасибо.»'), 'Он сказал: «Спасибо»')
const source = { page: { nodes: { x: { text: 'Первое. Второе.', runs: [{ text: 'Первое.', bold: true }, { text: ' Второе.' }] } } }, hero: { subline: 'Brand tagline.' }, media: [{ src: '/assets/file.svg' }] }
const normalized = normalizeCaseEditorial(source)
assert.equal(normalized.page.nodes.x.runs[0].text, 'Первое.')
assert.equal(normalized.page.nodes.x.runs[1].text, ' Второе')
assert.equal(normalized.page.nodes.x.runs.map(run=>run.text).join(''), normalized.page.nodes.x.text)
assert.deepEqual(normalized.hero, source.hero)
assert.deepEqual(normalized.media, source.media)
assert.equal(source.page.nodes.x.text, 'Первое. Второе.')
assert.deepEqual(normalizeCaseEditorial(normalized), normalized)
console.log('PASS: paragraph endings, internal sentences, question/exclamation/ellipsis, rich-text run boundaries, source preservation, idempotency')

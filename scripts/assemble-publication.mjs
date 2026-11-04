import fs from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'

const source = path.resolve(process.argv[2] || 'storybook-static')
const root = path.resolve('.output/public')
const target = path.join(root, 'storybook')
assert(source !== target && !source.startsWith(target + path.sep), 'Source must be separate from the publication output')
for (const name of ['index.html', 'iframe.html', 'index.json']) await fs.access(path.join(source, name))
await fs.access(path.join(root, 'index.html'))
// Nuxt generate produces a fresh output; never mix builds or replace existing files.
try {
  await fs.lstat(target)
  throw new Error('Storybook output already exists; regenerate the portfolio before assembling a new publication')
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}
await fs.cp(source, target, { recursive: true, errorOnExist: true, force: false })
console.log('Assembled portfolio + Storybook in .output/public')

import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { allowedPath, releasePackage, validatePaths } from './lib/release-policy.mjs'

const policy = JSON.parse(fs.readFileSync('release.config.json', 'utf8'))

test('Only the explicitly classified provenance file may be added beside production sources', () => {
  assert.equal(allowedPath('.release-source.json', policy), true)
  assert.equal(allowedPath('.storybook-source/package.json', policy), false)
  assert.equal(allowedPath('storybook-static/index.html', policy), false)
})
test('Development files cannot enter a release, including newly added root files', () => {
  for (const file of ['.tmp-new.png', 'new-notes.md', 'exports/new-export.png', '.storybook/main.ts', '.codex/config.toml', '.cursor/rules/x.mdc', 'app/components/New.stories.ts', 'app/components/New.stories.css', 'app/components/NewSandbox.vue', 'app/components/new.sandbox.css', 'scripts/new-debug.mjs', 'storybook/New.mdx', 'vitest.config.ts']) assert.equal(allowedPath(file, policy), false, file)
})
test('Production sources, original assets and document imports stay available', () => {
  for (const file of ['app/components/New.vue', 'app/components/new.scene-context.ts', 'app/components/new.scenes.json', 'content/sources/cases/new.json', 'content/sources/cases/new.typograf.txt', 'content/documents/chirp-design-system/foundation.md', 'public/cases/new/original.png']) assert.equal(allowedPath(file, policy), true, file)
})
test('Incomplete and polluted trees fail validation', () => {
  assert.throws(() => validatePaths([], policy), /Missing release files/)
  assert.throws(() => validatePaths([...policy.includeFiles, 'exports/leaked.png'], policy), /Development or unclassified/)
  assert.doesNotThrow(() => validatePaths(policy.includeFiles, policy))
})
test('Release package keeps the lock-compatible dependencies without development commands', () => {
  const source = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const result = releasePackage(source, policy)
  assert(!result.scripts.storybook && !result.scripts['release:prepare'])
  assert.equal(source.scripts['release:prepare'], 'node scripts/prepare-release.mjs')
  assert.deepEqual(result.dependencies, source.dependencies)
  assert.deepEqual(result.devDependencies, source.devDependencies)
  assert(result.scripts.generate && result.scripts.pregenerate && result.scripts['check:release'])
})

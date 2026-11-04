import assert from 'node:assert/strict'
import { git, treeEntries, validatePaths, releasePackage } from './lib/release-policy.mjs'

const ref = process.argv[2] || 'HEAD'
const policy = JSON.parse(git(['show', `${ref}:release.config.json`]))
const files = treeEntries(ref).map(entry => entry.path)
validatePaths(files, policy)
assert(files.includes(policy.releaseSourceFile), 'Release must pin its Storybook source commit')
const provenance = JSON.parse(git(['show', `${ref}:${policy.releaseSourceFile}`]))
assert.match(provenance.sourceCommit, /^[a-f0-9]{40}$/, 'Invalid Storybook source commit')
const pkg = JSON.parse(git(['show', `${ref}:package.json`]))
assert.deepEqual(pkg, releasePackage(pkg, policy), 'Development npm scripts must remain in develop only')
console.log(`Release composition OK: ${files.length} files; no development-only paths.`)

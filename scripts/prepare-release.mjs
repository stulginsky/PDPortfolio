import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import assert from 'node:assert/strict'
import { git, treeEntries, allowedPath, releasePackage, validatePaths } from './lib/release-policy.mjs'
import { githubApi } from './lib/github-auth.mjs'

const planOnly = process.argv.includes('--plan')
const localOnly = process.argv.includes('--local')
const policy = JSON.parse(fs.readFileSync('release.config.json', 'utf8'))
assert.equal(git(['branch', '--show-current']).trim(), policy.sourceBranch, 'Prepare releases from develop only')
assert.equal(git(['status', '--porcelain']).trim(), '', 'Commit development changes before preparing a release')
if (!planOnly) git(['fetch', 'origin', policy.sourceBranch, policy.targetBranch], { stdio: 'inherit' })
const source = git(['rev-parse', 'HEAD']).trim()
const target = git(['rev-parse', `origin/${policy.targetBranch}`]).trim()
if (!planOnly) assert.equal(source, git(['rev-parse', `origin/${policy.sourceBranch}`]).trim(), 'Push develop before preparing a release')
const entries = treeEntries(source)
const selected = entries.filter(entry => allowedPath(entry.path, policy))
validatePaths(selected.map(entry => entry.path), policy)
assert(selected.every(entry => entry.type === 'blob' && ['100644', '100755'].includes(entry.mode)), 'Release must contain regular files only')
const omitted = entries.filter(entry => !allowedPath(entry.path, policy))
console.log(`Source: ${source}\nBase: ${target}\nKeep: ${selected.length}; development-only: ${omitted.length}`)
if (planOnly) {
  console.log('Development-only files:\n' + omitted.map(entry => entry.path).join('\n'))
} else {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'pdportfolio-release-'))
  const env = { ...process.env, GIT_INDEX_FILE: path.join(directory, 'index') }
  let tree
  try {
    const pkg = JSON.parse(git(['show', `${source}:package.json`]))
    const content = JSON.stringify(releasePackage(pkg, policy), null, 2) + '\n'
    const packageSha = git(['hash-object', '-w', '--stdin'], { input: content }).trim()
    const sourceSha = git(['hash-object', '-w', '--stdin'], { input: JSON.stringify({ sourceCommit: source }, null, 2) + '\n' }).trim()
    git(['read-tree', '--empty'], { env })
    git(['update-index', '-z', '--index-info'], { env, input: selected.map(entry => `${entry.mode} ${entry.path === 'package.json' ? packageSha : entry.sha}\t${entry.path}\0`).join('') + `100644 ${sourceSha}\t${policy.releaseSourceFile}\0` })
    tree = git(['write-tree'], { env }).trim()
  } finally {
    // Only remove the exact temporary index and its own newly-created directory.
    fs.rmSync(path.join(directory, 'index'), { force: true })
    fs.rmdirSync(directory)
  }
  if (tree === git(['rev-parse', `${target}^{tree}`]).trim()) {
    console.log('No publication changes. main already matches the filtered source.')
  } else {
    const branch = `${policy.releaseBranchPrefix}${source.slice(0, 12)}`
    const message = `Release portfolio from ${source.slice(0, 12)}\n\nSource-Commit: ${source}\nRelease-Base: ${target}\n`
    const existing = git(['branch', '--list', branch]).trim()
    let commit
    if (existing) {
      commit = git(['rev-parse', branch]).trim()
      assert.equal(git(['rev-parse', `${branch}^{tree}`]).trim(), tree, 'Existing release has different contents; no branch replaced')
      assert.equal(git(['rev-parse', `${branch}^`]).trim(), target, 'Existing release has a different base; review its PR first')
      assert.equal(git(['log', '-1', '--format=%B', branch]).trim(), message.trim(), 'Existing branch has different provenance; no branch replaced')
    } else {
      commit = git(['commit-tree', tree, '-p', target], { input: message }).trim()
      git(['branch', branch, commit])
    }
    git(['show', '--stat', '--oneline', commit], { stdio: 'inherit' })
    git(['--no-pager', 'log', '-1', '--format=%H', branch], { stdio: 'inherit' })
    console.log(`Prepared ${branch}; develop checkout and index unchanged.`)
    if (!localOnly) {
      git(['push', 'origin', branch], { stdio: 'inherit' })
      const api = githubApi()
      const repository = 'stulginsky/PDPortfolio'
      const prs = await api(`/repos/${repository}/pulls?state=open&head=stulginsky:${encodeURIComponent(branch)}&base=main`)
      const pr = prs[0] || await api(`/repos/${repository}/pulls`, {
        method: 'POST',
        body: JSON.stringify({ base: policy.targetBranch, head: branch, title: `Release portfolio ${source.slice(0, 12)}`, body: `Publication sources from develop commit ${source}.\n\nDevelopment-only files remain in develop. This snapshot is based on main ${target}.\n\nThe required release-validation check verifies composition, typography and the static build before merge.` }),
      })
      console.log(`Release PR: ${pr.html_url}`)
    }
  }
}

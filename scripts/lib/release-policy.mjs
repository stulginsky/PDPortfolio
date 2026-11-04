import { execFileSync } from 'node:child_process'

export function git(args, options = {}) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, ...options })
}

export function treeEntries(ref) {
  return git(['ls-tree', '-r', '-z', ref]).split('\0').filter(Boolean).map(row => {
    const tab = row.indexOf('\t')
    const [mode, type, sha] = row.slice(0, tab).split(' ')
    return { mode, type, sha, path: row.slice(tab + 1) }
  })
}

export function allowedPath(file, policy) {
  if (policy.excludePatterns.some(pattern => new RegExp(pattern).test(file))) return false
  return policy.includeFiles.includes(file) || policy.includeDirectories.some(directory => file.startsWith(directory))
}

export function releasePackage(source, policy) {
  const result = structuredClone(source)
  result.scripts = Object.fromEntries(policy.releaseScripts.map(name => {
    if (!source.scripts[name]) throw new Error(`Missing release npm script: ${name}`)
    return [name, source.scripts[name]]
  }))
  return result
}

export function validatePaths(files, policy) {
  const unexpected = files.filter(file => !allowedPath(file, policy))
  const missing = policy.includeFiles.filter(file => !files.includes(file))
  if (unexpected.length || missing.length) throw new Error([
    unexpected.length ? `Development or unclassified files in release:\n${unexpected.join('\n')}` : '',
    missing.length ? `Missing release files:\n${missing.join('\n')}` : '',
  ].filter(Boolean).join('\n'))
}

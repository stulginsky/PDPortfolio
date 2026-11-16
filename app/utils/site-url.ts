import { publicAssetRevisions } from '../generated/public-asset-revisions'

// Nuxt supplies this build-time value; standalone Storybook defaults to `/`.
const baseURL = import.meta.env.VITE_SITE_BASE_URL || '/'

function withAssetRevision(path: string): string {
  const hashIndex = path.indexOf('#')
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : ''
  const pathAndQuery = hashIndex >= 0 ? path.slice(0, hashIndex) : path
  const queryIndex = pathAndQuery.indexOf('?')
  const pathname = queryIndex >= 0 ? pathAndQuery.slice(0, queryIndex) : pathAndQuery
  const query = queryIndex >= 0 ? pathAndQuery.slice(queryIndex + 1) : ''
  const revision = publicAssetRevisions[pathname]

  if (!revision || new URLSearchParams(query).has('v')) return path
  return `${pathname}?${query ? `${query}&` : ''}v=${revision}${hash}`
}

/** Resolve a site-root path at the hosting boundary. Content keeps portable paths. */
export function siteUrl<T extends string | undefined | null>(path: T): T {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return path
  const base = baseURL.replace(/\/$/, '')
  const alreadyBased = Boolean(base && (path === base || path.startsWith(base + '/') || path.startsWith(base + '?') || path.startsWith(base + '#')))
  const rootPath = alreadyBased ? path.slice(base.length) || '/' : path
  const revisionedPath = withAssetRevision(rootPath)

  return `${alreadyBased || base ? base : ''}${revisionedPath}` as T
}

/** Resolve local srcset candidates without touching data or remote URLs. */
export function siteSrcset<T extends string | undefined | null>(value: T): T {
  if (!value) return value
  // Read URLs before descriptors: commas inside a data URL belong to that URL.
  let result = '', index = 0
  while (index < value.length) {
    const start = index
    while (index < value.length && /[\s,]/.test(value[index]!)) index++
    result += value.slice(start, index)
    const urlStart = index
    while (index < value.length && !/\s/.test(value[index]!)) index++
    const token = value.slice(urlStart, index)
    const url = token.replace(/,+$/, '')
    result += siteUrl(url) + token.slice(url.length)
    if (token.endsWith(',')) continue
    const descriptorStart = index
    while (index < value.length && value[index] !== ',') index++
    result += value.slice(descriptorStart, index)
  }
  return result as T
}

/** Convert a same-origin browser pathname to a router path, or reject another app. */
export function siteRoute(pathname: string): string | null {
  const base = baseURL.replace(/\/$/, '')
  if (!base) return pathname
  if (pathname === base) return '/'
  return pathname.startsWith(base + '/') ? pathname.slice(base.length) : null
}

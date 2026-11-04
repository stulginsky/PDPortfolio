<script setup lang="ts">
import favicon from './assets/icons/favicon.svg'
import { siteRoute } from './utils/site-url'

useHead({
  link: [{ rel: 'icon', type: 'image/svg+xml', href: favicon }],
})

const router = useRouter()

function navigateCaseLink(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null
  if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self') || anchor.relList.contains('external')) return
  const url = new URL(anchor.href, window.location.href)
  if (url.origin !== window.location.origin) return
  const routePath = siteRoute(url.pathname)
  if (routePath === null) return
  if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return
  const destination = routePath + url.search + url.hash
  if (!router.resolve(destination).matched.length) return
  event.preventDefault()
  void navigateTo(destination)
}
</script>

<template>
  <div @click="navigateCaseLink">
    <NuxtRouteAnnouncer />
    <NuxtPage :keepalive="{ include: ['index'] }" />
  </div>
</template>

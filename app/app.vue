<script setup lang="ts">
import favicon from './assets/icons/favicon.svg'

useHead({
  link: [{ rel: 'icon', type: 'image/svg+xml', href: favicon }],
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

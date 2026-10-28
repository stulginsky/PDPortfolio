<script setup lang="ts">
import Main from '../components/Main.vue'
import site from '../../content/site.json'

useSeoMeta({
  title: `${site.name} — ${site.role}`,
  description: `${site.role} ${site.experience}`,
})

function openResume() {
  return navigateTo('/resume')
}
</script>

<template>
  <Main @resume="openResume" />
</template>

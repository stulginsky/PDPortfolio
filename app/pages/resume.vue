<script setup lang="ts">
import About from '../components/About.vue'
import site from '../../content/site.json'
useSeoMeta({ title: `Резюме — ${site.name}`, description: `${site.role} ${site.experience}` })
function openProjects() { return navigateTo('/') }
function printResume() { window.print() }
function downloadResume() {
  const link = document.createElement('a')
  link.href = '/resume/resume.pdf'
  link.download = 'Bazarov-Product-Designer-Resume.pdf'
  link.click()
}
</script>
<template>
  <About @projects="openProjects" @download="downloadResume" @print="printResume" />
</template>

<script setup lang="ts">
import { siteUrl } from '../utils/site-url'
import { RESUME_PDF_PATH, RESUME_PDF_FILENAME } from '../constants/resume'
import { printResumePdf } from '../utils/print-resume-pdf'
import About from '../components/About.vue'
import site from '../../content/site.json'
useSeoMeta({ title: `Резюме — ${site.name}`, description: `${site.role} ${site.experience}` })
function openProjects() { return navigateTo('/') }
function printResume() { printResumePdf() }
function downloadResume() {
  const link = document.createElement('a')
  link.href = siteUrl(RESUME_PDF_PATH)
  link.download = RESUME_PDF_FILENAME
  link.click()
}
</script>
<template>
  <About @projects="openProjects" @download="downloadResume" @print="printResume" />
</template>

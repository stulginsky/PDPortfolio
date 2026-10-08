<script setup lang="ts">
import {
  RESUME_PDF_FILENAME,
  RESUME_PDF_PATH,
} from '~/constants/resume'
import { printResumePdf } from '~/utils/print-resume-pdf'
import DsButtonIcon from './DsButtonIcon.vue'
import './resume-actions-motion.css'

const pdfDownloadUrl = RESUME_PDF_PATH
</script>

<template>
  <div class="resume-actions resume-actions-enter">
    <DsButtonIcon
      tag="a"
      :href="pdfDownloadUrl"
      :download="RESUME_PDF_FILENAME"
      icon="Download"
      aria-label="Скачать резюме PDF"
    />
    <DsButtonIcon
      icon="Print"
      aria-label="Печать резюме"
      @click="printResumePdf()"
    />
  </div>
</template>

<style scoped>
.resume-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

</style>

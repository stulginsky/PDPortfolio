<script setup lang="ts">
import {
  RESUME_PDF_FILENAME,
  RESUME_PDF_PATH,
} from '~/constants/resume'
import { printResumePdf } from '~/utils/print-resume-pdf'
import DsButtonIcon from './DsButtonIcon.vue'

const pdfDownloadUrl = RESUME_PDF_PATH
</script>

<template>
  <div class="resume-actions">
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

.resume-actions > :deep(.ds-button-icon) {
  opacity: 0;
  transform: translateX(-8px);
  animation: resume-action-enter 300ms cubic-bezier(0.22, 1, 0.36, 1) 100ms both;
}

.resume-actions > :deep(.ds-button-icon):nth-child(2) {
  animation-delay: 200ms;
}

@keyframes resume-action-enter {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .resume-actions > :deep(.ds-button-icon) {
    opacity: 1;
    transform: none;
    animation: none;
  }
}
</style>

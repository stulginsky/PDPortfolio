<script setup lang="ts">
import { ref } from 'vue'
import RelatedCases from './RelatedCases.vue'
const props = defineProps<{
  componentArgs?: { ariaLabel?: string; previousLabel?: string; nextLabel?: string }
}>()
const lastPosition = ref('Start')
const lastOffset = ref(0)
const resets = ref(0)
function positionChange(value: { position: string; offset: number }) {
  lastPosition.value = value.position
  lastOffset.value = value.offset
}
</script>

<template>
  <div class="related-cases-sandbox">
    <div class="related-cases-sandbox__preview" @click.capture="event => { if ((event.target as HTMLElement).closest('a')) event.preventDefault() }">
      <RelatedCases :key="resets" v-bind="props.componentArgs" @position-change="positionChange" />
    </div>
    <div class="related-cases-sandbox__controls">
      <output data-testid="related-position">Position: {{ lastPosition }} · X: {{ Math.round(lastOffset) }}px</output>
      <button type="button" @click="resets++">Reset</button>
    </div>
  </div>
</template>

<style scoped>
.related-cases-sandbox { font-family: var(--text-font-sans); color: var(--text-default); background: var(--surface-default); }
.related-cases-sandbox__preview { padding-block: var(--space-4); }
.related-cases-sandbox__controls { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-4); padding: var(--space-4); }
@media (min-width: 768px) {
  .related-cases-sandbox__preview { padding-inline: var(--space-8); }
}
</style>

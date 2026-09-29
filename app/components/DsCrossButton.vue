<script setup lang="ts">
import DsButtonIcon from './DsButtonIcon.vue'

withDefaults(
  defineProps<{
    ariaLabel?: string
  }>(),
  {
    ariaLabel: 'Закрыть',
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <DsButtonIcon
    class="ds-cross-button"
    icon="Cross"
    :aria-label="ariaLabel"
    @click="$emit('click', $event)"
  />
</template>

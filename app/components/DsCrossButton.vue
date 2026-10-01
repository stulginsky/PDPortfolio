<script setup lang="ts">
import DsButtonIcon from './DsButtonIcon.vue'

withDefaults(
  defineProps<{
    ariaLabel?: string
    pressedAppearance?: 'ActivePressed' | 'Toggled'
  }>(),
  {
    ariaLabel: 'Закрыть',
    pressedAppearance: 'ActivePressed',
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
    :pressed-appearance="pressedAppearance"
    @click="$emit('click', $event)"
  />
</template>

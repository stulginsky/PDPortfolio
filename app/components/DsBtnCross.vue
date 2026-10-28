<script setup lang="ts">
import DsButtonIcon from './DsButtonIcon.vue'

withDefaults(
  defineProps<{
    ariaLabel?: string
    /** Figma nested ButtonIcon Raised property; Default surface only. */
    raised?: boolean
    pressedAppearance?: 'ActivePressed' | 'Toggled'
  }>(),
  {
    ariaLabel: 'Закрыть',
    raised: false,
    pressedAppearance: 'ActivePressed',
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <DsButtonIcon
    class="ds-btn-cross"
    icon="Cross"
    :raised="raised"
    :aria-label="ariaLabel"
    :pressed-appearance="pressedAppearance"
    @click="$emit('click', $event)"
  />
</template>

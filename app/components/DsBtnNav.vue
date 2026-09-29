<script setup lang="ts">
import { computed } from 'vue'
import DsButtonIcon from './DsButtonIcon.vue'

type Direction = 'Left' | 'Right' | 'Up'

const props = withDefaults(
  defineProps<{
    direction?: Direction
    tag?: 'button' | 'a'
    href?: string
    ariaLabel?: string
  }>(),
  {
    direction: 'Left',
    tag: 'button',
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()

const iconByDirection = {
  Left: 'ArrowNavLeft',
  Right: 'ArrowNavRight',
  Up: 'ArrowNavUp',
}

const labelByDirection: Record<Direction, string> = {
  Left: 'Назад',
  Right: 'Вперёд',
  Up: 'Наверх',
}

const icon = computed(() => iconByDirection[props.direction])
const accessibleLabel = computed(() => props.ariaLabel || labelByDirection[props.direction])
</script>

<template>
  <DsButtonIcon
    class="ds-btn-nav"
    :tag="tag"
    :href="href"
    :icon="icon"
    raised
    :aria-label="accessibleLabel"
    @click="$emit('click', $event)"
  />
</template>

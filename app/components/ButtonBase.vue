<script setup lang="ts">
import { computed, ref, watch } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    toggled?: boolean
    raised?: boolean
    disabled?: boolean
    pressedAppearance?: 'ActivePressed' | 'Toggled'
    tag?: 'button' | 'a'
    href?: string
  }>(),
  {
    toggled: false,
    raised: false,
    disabled: false,
    pressedAppearance: 'ActivePressed',
    tag: 'button',
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const isPressed = ref(false)
const isPointerOver = ref(false)
const suppressHoverUntilLeave = ref(false)

const pressStyle = computed(() => {
  if (!isPressed.value) return undefined

  return {
    background: props.pressedAppearance === 'Toggled'
      ? 'var(--surface-action-toggled)'
      : 'var(--surface-action-pressed)',
    color: 'var(--text-inverse)',
  }
})

const startPress = (event: PointerEvent) => {
  if (props.disabled) return

  isPressed.value = true
  const target = event.currentTarget
  if (target instanceof HTMLElement && target.setPointerCapture) {
    target.setPointerCapture(event.pointerId)
  }
}

const endPress = () => { isPressed.value = false }
const enter = () => { isPointerOver.value = true }
const leave = () => {
  isPointerOver.value = false
  suppressHoverUntilLeave.value = false
}

const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  emit('click', event)
}

watch(
  () => props.toggled,
  (toggled, wasToggled) => {
    if (toggled && !wasToggled && isPointerOver.value) {
      suppressHoverUntilLeave.value = true
    }
    else if (!toggled) {
      suppressHoverUntilLeave.value = false
    }
  },
)
</script>

<template>
  <component
    :is="tag"
    v-bind="$attrs"
    class="button-base"
    :class="{
      'button-base--raised': raised,
      'button-base--toggled': toggled,
      'button-base--pressed': isPressed,
      'button-base--hover-suppressed': suppressHoverUntilLeave,
      'button-base--pressed-appearance-toggled': pressedAppearance === 'Toggled',
    }"
    :href="tag === 'a' ? href : undefined"
    :disabled="tag === 'button' ? disabled : undefined"
    :aria-disabled="tag === 'a' && disabled ? true : undefined"
    :style="pressStyle"
    :type="tag === 'button' ? 'button' : undefined"
    @pointerdown="startPress"
    @pointerenter="enter"
    @pointerleave="leave"
    @pointerup="endPress"
    @pointercancel="endPress"
    @lostpointercapture="endPress"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<style scoped>
.button-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  padding: 0;
  border: none;
  border-radius: var(--radius-xlg);
  background: transparent;
  color: var(--button-base-default-color, var(--text-default));
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.button-base--raised {
  background: var(--surface-raised);
}

@media (hover: hover) and (pointer: fine) {
  .button-base:hover:not(:active):not(:disabled):not([aria-disabled="true"]):not(.button-base--pressed):not(.button-base--hover-suppressed) {
    background: var(--surface-action-hover);
    color: var(--text-default);
  }
}

.button-base--pressed:not(:disabled):not([aria-disabled="true"]),
.button-base:active:not(:disabled):not([aria-disabled="true"]) {
  background: var(--surface-action-pressed);
  color: var(--text-inverse);
}

.button-base--pressed-appearance-toggled.button-base--pressed,
.button-base--pressed-appearance-toggled:active {
  background: var(--surface-action-toggled);
  color: var(--text-inverse);
}

.button-base--toggled {
  background: var(--surface-action-toggled);
  color: var(--text-inverse);
}

.button-base:disabled,
.button-base[aria-disabled="true"] {
  color: var(--text-muted);
  cursor: not-allowed;
}

.button-base:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}
</style>

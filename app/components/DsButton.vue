<script setup lang="ts">
import ButtonBase from './ButtonBase.vue'
import { getButtonIconSource, type ButtonIconName } from './button-icons'

const props = withDefaults(
  defineProps<{
    /** Figma Text#968:17. */
    text?: string
    /** Figma Instance#968:0. Used only while Icon right=On. */
    icon?: ButtonIconName
    /** Figma Icon right=Off / On. */
    iconRight?: boolean
    /** Figma Raised=Off / On; raised is an initial Default surface only. */
    raised?: boolean
    /** Persistent Figma State=Toggled. */
    toggled?: boolean
    /** Native safety state; Figma has no separate Disabled variant. */
    disabled?: boolean
    /** Native action or navigation element. */
    tag?: 'button' | 'a'
    href?: string
    ariaLabel?: string
    ariaControls?: string
    ariaExpanded?: boolean
  }>(),
  {
    text: 'Button',
    icon: 'Favicon',
    iconRight: false,
    raised: false,
    toggled: false,
    disabled: false,
    tag: 'button',
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <ButtonBase
    class="ds-button"
    :class="{ 'ds-button--icon-right': iconRight }"
    :tag="tag"
    :href="href"
    :disabled="disabled"
    :raised="raised"
    :toggled="toggled"
    :aria-label="ariaLabel"
    :aria-controls="ariaControls"
    :aria-expanded="ariaExpanded ?? (ariaControls !== undefined ? toggled : undefined)"
    @click="$emit('click', $event)"
  >
    <span class="ds-button__text">{{ text }}</span>
    <span
      v-if="iconRight"
      class="ds-button__icon"
      :style="{ '--ds-button-icon-mask': `url(&quot;${getButtonIconSource(icon)}&quot;)` }"
      aria-hidden="true"
    />
  </ButtonBase>
</template>

<style scoped>
.ds-button {
  gap: 0;
  padding: 0 var(--space-4);
  font-family: var(--text-font-sans);
  font-size: var(--text-size-base);
  font-weight: var(--text-weight-medium);
  font-variation-settings: "wght" 500, "GRAD" 0, "XOPQ" 96, "XTRA" 468,
    "YOPQ" 79, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712,
    "wdth" 100;
  line-height: 1.35;
  letter-spacing: 0.01em;
  text-decoration: none;
  white-space: nowrap;
}

.ds-button--icon-right {
  gap: var(--space-2);
}

.ds-button__text {
  line-height: inherit;
}

.ds-button__icon {
  display: block;
  width: 16px;
  height: 16px;
  flex: none;
  background: currentColor;
  -webkit-mask-image: var(--ds-button-icon-mask);
  -webkit-mask-position: center;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  mask-image: var(--ds-button-icon-mask);
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: contain;
}
</style>

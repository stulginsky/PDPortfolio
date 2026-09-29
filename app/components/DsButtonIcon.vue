<script setup lang="ts">
import ButtonBase from './ButtonBase.vue'
import { getButtonIconSource, type ButtonIconName } from './button-icons'

const props = withDefaults(
  defineProps<{
    /** Figma ButtonIcon Instance#1258:11, mapped to a canonical Foundation icon. */
    icon?: ButtonIconName
    /** Figma Raised property. The raised surface is the initial state only. */
    raised?: boolean
    /** Persistent Figma State=Toggled. */
    toggled?: boolean
    /** Visual mapping for the physical press; used by semantic wrappers only. */
    pressedAppearance?: 'ActivePressed' | 'Toggled'
    /** Native element for action or navigation semantics. */
    tag?: 'button' | 'a'
    /** Link destination when tag is an anchor. */
    href?: string
    /** Required because this control has no visible text. */
    ariaLabel: string
  }>(),
  {
    icon: 'Favicon',
    raised: false,
    toggled: false,
    pressedAppearance: 'ActivePressed',
    tag: 'button',
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <ButtonBase
    class="ds-button-icon"
    :tag="tag"
    :href="href"
    :raised="raised"
    :toggled="toggled"
    :pressed-appearance="pressedAppearance"
    :aria-label="ariaLabel"
    @click="$emit('click', $event)"
  >
    <span
      class="ds-button-icon__icon"
      :style="{ '--ds-button-icon-mask': `url(&quot;${getButtonIconSource(icon)}&quot;)` }"
      aria-hidden="true"
    />
  </ButtonBase>
</template>

<style scoped>
.ds-button-icon {
  width: 50px;
  height: 50px;
  padding: 0;
  border-radius: 50%;
}

.ds-button-icon__icon {
  display: block;
  width: 24px;
  height: 24px;
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

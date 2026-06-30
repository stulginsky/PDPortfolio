<script setup lang="ts">
defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    /** Строка после typograf:apply (Unicode nbsp, «ёлочки»; без HTML-тегов). */
    content: string;
    tag?: keyof HTMLElementTagNameMap;
  }>(),
  {
    tag: "span",
  },
);
</script>

<template>
  <component
    :is="tag"
    v-bind="$attrs"
  >{{ content }}</component>
</template>

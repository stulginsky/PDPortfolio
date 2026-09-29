<script setup lang="ts">
import DsBtnNav from './DsBtnNav.vue'

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <div class="ds-page-up">
    <DsBtnNav
      direction="Up"
      aria-label="К началу страницы"
      @click="$emit('click', $event)"
    />
  </div>
</template>

<style scoped>
.ds-page-up {
  position: fixed;
  z-index: 20;
  right: 0;
  bottom: 0;
  display: flex;
  width: 98px;
  height: 98px;
  align-items: center;
  justify-content: center;
}
</style>

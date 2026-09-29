<script setup lang="ts">
import avatarPortraitUrl from '../assets/img/avatar-portrait.jpeg'
</script>

<template>
  <div class="ds-avatar-lg" aria-hidden="true">
    <img :src="avatarPortraitUrl" alt="" class="ds-avatar-lg__photo">
  </div>
</template>

<style scoped>
.ds-avatar-lg {
  position: relative;
  flex: 0 0 120px;
  width: 120px;
  height: 120px;
  box-sizing: border-box;
  overflow: hidden;
  border: 2px solid var(--border-default);
  border-radius: 60px;
}

.ds-avatar-lg__photo {
  position: absolute;
  top: -2px;
  left: -2px;
  display: block;
  width: 120px;
  height: 120px;
  object-fit: cover;
  pointer-events: none;
}
</style>

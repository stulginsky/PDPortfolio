<script setup lang="ts">
const images = Array.from({ length: 8 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");

  return {
    src: `/cases/nested-chirp-ai-check/img-signed-${number}.png`,
    alt: `AI-проверка лечения, экран ${index + 1}`,
  };
});

useSiteHead("Как я спроектировал AI-проверку лечения — Chirp AI");
</script>

<template>
  <main class="case-page">
    <NuxtLink to="/cases/chirp-ai-health-assistant" class="back">
      ← К кейсу Chirp AI Health Assistant
    </NuxtLink>

    <section class="content">
      <h1>Как я спроектировал AI-проверку лечения</h1>
      <p>
        Работа с медицинскими данными и эволюция UX-сценария проверки назначений
        и медицинских рисков.
      </p>

      <img
        v-for="image in images"
        :key="image.src"
        :src="image.src"
        :alt="image.alt"
        loading="lazy"
      >
    </section>
  </main>
</template>

<style scoped>
.case-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 20px 56px;
  font-family: var(--font-sans);
  color: var(--text-default);
  background: var(--surface-default);
}

.back {
  display: inline-block;
  margin-bottom: 16px;
  color: var(--text-secondary);
  text-decoration: none;
}

.back:hover {
  text-decoration: underline;
}

.content {
  display: grid;
  gap: 10px;
}

h1 {
  margin: 0 0 8px;
  font-size: clamp(30px, 4vw, 44px);
}

p {
  color: var(--text-secondary);
}

img {
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--border-default);
  background: var(--gray-00);
  margin: 4px 0;
}
</style>

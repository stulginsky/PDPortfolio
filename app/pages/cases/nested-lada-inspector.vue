<template>
  <main class="case-page">
    <NuxtLink to="/cases/platforma-lada-business" class="back">← К кейсу Платформа LADA Business</NuxtLink>

    <section class="content">
      <h1>Deep Dive (object inspector)</h1>
      <p>Подход "детали по запросу" через инспектор объекта для сложных сценариев в B2B.</p>

      <img src="/cases/nested-lada-inspector/img-signed-01.png" alt="Deep Dive object inspector" />
    </section>
  </main>
</template>

<style scoped>
.case-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 20px 56px;
  font-family: Inter, Arial, sans-serif;
  color: #0f172a;
}

.back {
  display: inline-block;
  margin-bottom: 16px;
  color: #334155;
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
  color: #334155;
}

img {
  width: 100%;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #fff;
  margin: 4px 0;
}
</style>

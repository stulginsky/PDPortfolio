<template>
  <main class="case-page">
    <NuxtLink to="/cases/platforma-lada-business" class="back">← К кейсу Платформа LADA Business</NuxtLink>

    <section class="content">
      <h1>Deep Dive (filtering)</h1>

      <ul>
        <li>предварительные фильтры на уровне БД;</li>
        <li>фильтрация отображаемых данных;</li>
        <li>сохранение пользовательских пресетов;</li>
        <li>единая логика для всех разделов продукта.</li>
      </ul>

      <p>Решение значительно повысило скорость работы пользователей с большими массивами данных. Также, унификация подхода, значительно снизила человеко-часы разработки.</p>
      <p><em>Неэкспортируемый блок из Notion: external_object_instance.</em></p>
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

p,
li {
  color: #334155;
}

ul {
  margin: 0;
  padding-left: 20px;
}
</style>

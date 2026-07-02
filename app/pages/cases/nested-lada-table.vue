<template>
  <main class="case-page">
    <NuxtLink to="/cases/platforma-lada-business" class="back">← К кейсу Платформа LADA Business</NuxtLink>

    <section class="content">
      <h1>Deep Dive (table)</h1>
      <p>Микро-UX решения для табличного компонента и сценариев управления колонками/строками.</p>

      <img src="/cases/nested-lada-table/img-signed-01.png" alt="Deep Dive table 1" />
      <img src="/cases/nested-lada-table/img-signed-02.png" alt="Deep Dive table 2" />
      <img src="/cases/nested-lada-table/img-signed-03.png" alt="Deep Dive table 3" />
      <img src="/cases/nested-lada-table/img-signed-04.png" alt="Deep Dive table 4" />
      <img src="/cases/nested-lada-table/img-signed-05.png" alt="Deep Dive table 5" />
      <img src="/cases/nested-lada-table/img-signed-06.png" alt="Deep Dive table 6" />
      <img src="/cases/nested-lada-table/img-signed-07.png" alt="Deep Dive table 7" />
      <img src="/cases/nested-lada-table/img-signed-08.png" alt="Deep Dive table 8" />
      <img src="/cases/nested-lada-table/img-signed-09.png" alt="Deep Dive table 9" />
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

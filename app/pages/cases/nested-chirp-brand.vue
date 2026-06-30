<template>
  <main class="case-page">
    <NuxtLink to="/cases/chirp-ai-health-assistant" class="back">Back to Chirp AI Health Assistant</NuxtLink>

    <section class="content">
      <h1>Deep Dive (brand trust)</h1>
      <p>Visual language as part of the trust mechanics for a medical AI product.</p>

      <img src="/notion-assets/nested-chirp-brand/img-signed-01.png" alt="Chirp brand screen 1" />
      <img src="/notion-assets/nested-chirp-brand/img-signed-02.png" alt="Chirp brand screen 2" />
      <img src="/notion-assets/nested-chirp-brand/img-signed-03.png" alt="Chirp brand screen 3" />
      <img src="/notion-assets/nested-chirp-brand/img-signed-04.png" alt="Chirp brand screen 4" />
      <img src="/notion-assets/nested-chirp-brand/img-signed-05.png" alt="Chirp brand screen 5" />
      <img src="/notion-assets/nested-chirp-brand/img-signed-06.png" alt="Chirp brand screen 6" />
      <img src="/notion-assets/nested-chirp-brand/img-signed-07.png" alt="Chirp brand screen 7" />
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

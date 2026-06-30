<template>
  <main class="case-page">
    <NuxtLink to="/cases/chirp-ai-health-assistant" class="back">Back to Chirp AI Health Assistant</NuxtLink>

    <section class="content">
      <h1>Deep Dive (AI treatment check)</h1>
      <p>Medical-data flow and UX scenario evolution for the AI-assisted treatment check.</p>

      <img src="/notion-assets/nested-chirp-ai-check/img-signed-01.png" alt="AI treatment check screen 1" />
      <img src="/notion-assets/nested-chirp-ai-check/img-signed-02.png" alt="AI treatment check screen 2" />
      <img src="/notion-assets/nested-chirp-ai-check/img-signed-03.png" alt="AI treatment check screen 3" />
      <img src="/notion-assets/nested-chirp-ai-check/img-signed-04.png" alt="AI treatment check screen 4" />
      <img src="/notion-assets/nested-chirp-ai-check/img-signed-05.png" alt="AI treatment check screen 5" />
      <img src="/notion-assets/nested-chirp-ai-check/img-signed-06.png" alt="AI treatment check screen 6" />
      <img src="/notion-assets/nested-chirp-ai-check/img-signed-07.png" alt="AI treatment check screen 7" />
      <img src="/notion-assets/nested-chirp-ai-check/img-signed-08.png" alt="AI treatment check screen 8" />
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

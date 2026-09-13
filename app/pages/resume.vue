<script setup lang="ts">
import resumeData from "#content/resume.json";
import type { ResumeContent } from "~/types/resume";

const resume = resumeData as ResumeContent;

useSiteHead("Резюме — Константин Базаров");
</script>

<template>
  <main class="resume-page">
    <div class="resume-page__inner">
      <SiteHero
        :key="$route.path"
        active-tab="resume"
      />

      <div class="resume-page__body">
        <div class="resume-page__main">
          <ResumeExperienceBlock
            v-for="(block, index) in resume.experience"
            :key="index"
            :block="block"
          />

          <section class="resume-page__education">
            <h2 class="resume-page__section-title">
              {{ resume.education.title }}
            </h2>
            <p
              v-for="(entry, index) in resume.education.entries"
              :key="index"
              class="resume-page__education-entry"
            >
              <strong><TypoText :content="entry.org" /></strong><TypoText :content="entry.detail" />
            </p>
          </section>
        </div>

        <aside class="resume-page__sidebar">
          <div class="resume-page__summary-wrap">
            <img
              src="/resume/quote-left.svg"
              alt=""
              class="resume-page__quote resume-page__quote--left"
              width="262"
              height="260"
            >
            <div class="resume-page__summary">
              <img
                src="/resume/quote-bottom-right.svg"
                alt=""
                class="resume-page__quote resume-page__quote--br"
                width="86"
                height="90"
              >
              <div class="resume-page__summary-content">
                <TypoText
                  v-for="(paragraph, index) in resume.summary"
                  :key="index"
                  :content="paragraph"
                  tag="p"
                  class="resume-page__summary-p"
                />
              </div>
            </div>
          </div>

          <section class="resume-page__block">
            <h2 class="resume-page__section-title">
              {{ resume.highlights.title }}
            </h2>
            <ul class="resume-page__highlights">
              <li
                v-for="(item, index) in resume.highlights.items"
                :key="index"
              >
                <TypoText :content="item.text" />
              </li>
            </ul>
          </section>

          <section
            v-for="(skill, index) in resume.skills"
            :key="index"
            class="resume-page__block"
          >
            <h2 class="resume-page__section-title">
              {{ skill.title }}
            </h2>
            <TypoText
              :content="skill.body"
              tag="p"
              class="resume-page__skill-body"
            />
          </section>
        </aside>
      </div>
    </div>
  </main>
</template>

<style scoped>
.resume-page {
  min-height: 100vh;
  overflow-x: hidden;
  background: var(--surface-default);
}

.resume-page__inner {
  max-width: var(--page-max);
  margin: 0 auto;
  /* Shared showcase grid: matches the Figma portfolio frame and home page. */
  padding: var(--space-16) var(--space-8);
  display: flex;
  flex-direction: column;
  gap: 52px;
}

.resume-page__body {
  display: flex;
  align-items: flex-start;
  gap: var(--resume-column-gap);
  width: 100%;
}

.resume-page__main {
  flex: var(--resume-column-main-fr) 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.resume-page__sidebar {
  flex: var(--resume-column-sidebar-fr) 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 41px;
}

.resume-page__summary-wrap {
  position: relative;
  width: 100%;
}

.resume-page__summary {
  position: relative;
  z-index: 2;
  --quote-br-size: 94px;
  --quote-br-inset-x: 24px;
  --quote-br-inset-y: 32px;
  padding: 48px 64px
    calc(var(--quote-br-inset-y) + var(--quote-br-size) + 8px) 48px;
  border-radius: var(--radius-xlg);
  background: rgba(240, 230, 249, 1);
  overflow: hidden;
}

.resume-page__quote {
  position: absolute;
  pointer-events: none;
  user-select: none;
}

/* Крупные кавычки слева — наполовину за краем карточки (как в Figma) */
.resume-page__quote--left {
  left: -215px;
  top: 0;
  z-index: 1;
  width: min(274px, 46vw);
  height: auto;
  opacity: 0;
  transform: translateX(28px);
  animation: resume-quote-left-enter 650ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both;
}

@keyframes resume-quote-left-enter {
  to {
    opacity: 0.17;
    transform: translateX(0);
  }
}

/* Светлые кавычки справа внизу на фоне */
.resume-page__quote--br {
  right: 24px;
  bottom: 32px;
  z-index: 0;
  width: 94px;
  height: auto;
  transform: rotate(180deg) scaleY(-1);
  opacity: 0.95;
}

.resume-page__summary-content {
  position: relative;
  z-index: 1;
}

:deep(.resume-page__summary-p) {
  margin: 0 0 1em;
  hyphens: auto;
  font-family: var(--font-sans);
  font-size: var(--size-base);
  font-weight: var(--weight-bold);
  font-variation-settings: var(--font-variation-heading-xl);
  line-height: 1.4;
  color: var(--text-default);
}

:deep(.resume-page__summary-p:last-child) {
  margin-bottom: 0;
  padding-inline-end: calc(var(--quote-br-inset-x) + var(--quote-br-size) + 12px);
}

.resume-page__block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.resume-page__section-title {
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--size-xl);
  font-weight: var(--weight-bold);
  font-variation-settings: var(--font-variation-heading-xl);
  line-height: var(--line-height-heading-xl);
  color: var(--text-muted);
}

.resume-page__highlights {
  margin: 0;
  padding-left: 21px;
  font-size: var(--size-sm);
  line-height: 1.4;
  letter-spacing: 0.01em;
  color: var(--text-default);
}

:deep(.resume-page__skill-body) {
  margin: 0;
  font-size: var(--size-sm);
  line-height: 1.4;
  color: var(--text-default);
  white-space: pre-line;
}

.resume-page__education-entry {
  margin: 0 0 0.25em;
  font-size: var(--size-base);
  line-height: 1.45;
  color: var(--text-default);
}

.resume-page__education-entry strong {
  font-weight: var(--weight-medium);
}

@media (max-width: 1100px) {
  .resume-page__body {
    flex-direction: column;
    gap: var(--space-12);
  }

  .resume-page__sidebar {
    order: 1;
    flex: 1 1 auto;
    width: 100%;
    max-width: none;
  }

  .resume-page__main {
    order: 2;
    flex: 1 1 auto;
    width: 100%;
  }

  .resume-page__quote--left {
    display: none;
  }

  .resume-page__summary {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 48px 48px var(--space-6);
    overflow: visible;
  }

  .resume-page__summary-content {
    order: 1;
  }

  :deep(.resume-page__summary-p:last-child) {
    padding-inline-end: 0;
  }

  .resume-page__quote--br {
    position: static;
    order: 2;
    align-self: flex-end;
    flex-shrink: 0;
    margin-top: var(--space-6);
  }
}

@media (max-width: 720px) {
  .resume-page__inner {
    padding: var(--space-8) var(--space-4);
    gap: var(--space-8);
  }

  .resume-page__summary {
    padding: var(--space-6);
  }

  .resume-page__quote--br {
    --quote-br-size: 72px;
    width: var(--quote-br-size);
    margin-top: var(--space-4);
  }
}

@media (prefers-reduced-motion: reduce) {
  .resume-page__quote--left {
    opacity: 0.17;
    transform: none;
    animation: none;
  }
}
</style>

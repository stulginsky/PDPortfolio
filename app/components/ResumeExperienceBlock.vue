<script setup lang="ts">
import type { ResumeExperience } from "~/types/resume";

defineProps<{
  block: ResumeExperience;
}>();
</script>

<template>
  <section class="resume-exp">
    <template v-if="block.headingLines?.length">
      <h2 class="resume-exp__heading text-heading-xl">
        <TypoText
          v-for="(line, index) in block.headingLines"
          :key="index"
          :content="line"
          tag="span"
          class="resume-exp__heading-line"
        />
      </h2>
    </template>
    <TypoText
      v-else
      :content="block.heading"
      tag="h2"
      class="resume-exp__heading text-heading-xl"
    />

    <ul
      v-if="block.bullets?.length"
      class="resume-exp__list"
    >
      <li
        v-for="(bullet, index) in block.bullets"
        :key="index"
        class="resume-exp__item"
      >
        <template v-if="bullet.lines?.length">
          <TypoText
            v-if="bullet.label"
            :content="`${bullet.label}:`"
            tag="span"
            class="resume-exp__label"
          />
          <ul class="resume-exp__sublist">
            <li
              v-for="(line, lineIndex) in bullet.lines"
              :key="lineIndex"
            >
              <TypoText :content="line" />
            </li>
          </ul>
        </template>
        <template v-else>
          <TypoText
            :content="bullet.label ? `${bullet.label}: ${bullet.text}` : (bullet.text ?? '')"
            tag="span"
          />
        </template>
      </li>
    </ul>

    <div
      v-if="block.paragraphs?.length"
      class="resume-exp__paragraphs"
    >
      <TypoText
        v-for="(paragraph, index) in block.paragraphs"
        :key="index"
        :content="paragraph"
        tag="p"
        class="resume-exp__paragraph"
      />
    </div>
  </section>
</template>

<style scoped>
.resume-exp {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

:deep(.resume-exp__heading) {
  margin: 0;
  color: var(--text-muted);
}

:deep(.resume-exp__heading-line) {
  display: block;
}

.resume-exp__list {
  margin: 0;
  padding-left: 24px;
  font-size: var(--size-base);
  font-weight: var(--weight-regular);
  font-variation-settings: var(--font-variation-body-accent);
  line-height: 1.45;
  color: var(--text-body-accent);
}

.resume-exp__sublist {
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.resume-exp__sublist li {
  position: relative;
  padding-left: 0;
}

.resume-exp__sublist li::before {
  content: "– ";
}

:deep(.resume-exp__label) {
  font-weight: var(--weight-medium);
  font-variation-settings: var(--font-variation-body-accent-medium);
}

.resume-exp__paragraphs {
  font-size: var(--size-base);
  font-variation-settings: var(--font-variation-body-accent);
  line-height: 1.45;
  color: var(--text-body-accent);
}

:deep(.resume-exp__paragraph) {
  margin: 0 0 0.35em;
}

:deep(.resume-exp__paragraph:last-child) {
  margin-bottom: 0;
}
</style>

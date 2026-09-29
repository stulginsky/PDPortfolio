<script setup lang="ts">
import homeCardsData from "#content/home-cards.json";
import caseContentData from "#content/cases/chirp-product.json";
import type { HomeCard } from "~/types/home-card";

useSiteHead(caseContentData.pageTitle);

type Media = { title: string; src: string; alt: string; openLabel: string };

const caseContent = caseContentData;
const copy = caseContent.copy;
const caseFocusBreak = copy[4].lastIndexOf(" · ", copy[4].lastIndexOf(" · ") - 1);
const caseFocusDesktop = {
  firstLine: copy[4].slice(0, caseFocusBreak + 3),
  secondLine: copy[4].slice(caseFocusBreak + 3),
};
const media: Media[] = caseContent.media.map(({ title, asset, alt }) => ({
  title,
  src: "/cases/chirp-product/media/" + asset,
  alt,
  openLabel: caseContent.ui.openMedia,
}));
const activeMedia = ref<Media | null>(null);
const relatedCards = (homeCardsData as HomeCard[]).filter((card) => card.href !== "/cases/chirp-product");
</script>

<template>
  <main class="product-case">
    <section class="product-case__hero" aria-labelledby="case-title">
      <NuxtLink to="/" class="product-case__back icon-button" :aria-label="caseContent.backLabel">
        <img src="/cases/chirp-product/media/nav-arrow.svg" alt="" aria-hidden="true">
      </NuxtLink>
      <div class="product-case__hero-art" aria-hidden="true">
        <picture>
          <source media="(min-width: 1441px)" srcset="/cases/chirp-product/hero/hero-1920.png">
          <source media="(min-width: 1281px)" srcset="/cases/chirp-product/hero/hero-1440.png">
          <source media="(min-width: 1025px)" srcset="/cases/chirp-product/hero/hero-1280.png">
          <source media="(min-width: 721px)" srcset="/cases/chirp-product/hero/hero-1024.png">
          <img src="/cases/chirp-product/hero/hero-720.png" alt="">
        </picture>
      </div>
      <TypoText :content="copy[0]" tag="h1" id="case-title" class="visually-hidden" />
    </section>

    <section class="case-copy case-copy--opening">
      <dl class="case-meta">
        <div><TypoText :content="copy[1]" tag="dt" /><TypoText :content="copy[2]" tag="dd" /></div>
        <div>
          <TypoText :content="copy[3]" tag="dt" />
          <dd>
            <TypoText :content="caseFocusDesktop.firstLine" />
            <br class="case-meta__desktop-break">
            <TypoText :content="caseFocusDesktop.secondLine" />
          </dd>
        </div>
      </dl>
      <CaseTextBlock class="case-copy__body">
        <TypoText :content="copy[5]" tag="h2" />
        <TypoText :content="copy[6]" tag="p" />
      </CaseTextBlock>
      <CaseTextBlock class="case-copy__body">
        <TypoText :content="copy[7]" tag="h2" />
        <TypoText :content="copy[8]" tag="p" />
        <TypoText :content="copy[9]" tag="p" class="case-copy__question" />
        <TypoText :content="copy[10]" tag="p" class="case-copy__conclusion" />
      </CaseTextBlock>
    </section>

    <CaseMediaFrame v-bind="media[0]" @open="activeMedia = media[0]" />

    <section class="case-copy case-copy--single case-copy--after-p02">
      <CaseTextBlock class="case-copy__body">
        <TypoText :content="copy[11]" tag="h2" />
        <TypoText :content="copy[12]" tag="p" />
        <TypoText :content="copy[13]" tag="p" />
        <TypoText :content="copy[14]" tag="p" />
      </CaseTextBlock>
      <CaseTextBlock class="case-copy__body">
        <TypoText :content="copy[15]" tag="h2" />
        <TypoText :content="copy[16]" tag="p" />
        <TypoText :content="copy[17]" tag="h3" />
        <TypoText :content="copy[18]" tag="p" />
        <TypoText :content="copy[19]" tag="h3" />
        <TypoText :content="copy[20]" tag="p" />
      </CaseTextBlock>
    </section>

    <CaseMediaFrame v-bind="media[1]" @open="activeMedia = media[1]" />

    <section class="case-copy case-copy--single case-copy--after-p03">
      <TypoText :content="copy[21]" tag="p" />
      <CaseTextBlock class="case-copy__body">
        <TypoText :content="copy[22]" tag="h2" />
        <TypoText :content="copy[23]" tag="p" />
      </CaseTextBlock>
    </section>

    <CaseMediaFrame v-bind="media[2]" @open="activeMedia = media[2]" />

    <section class="case-copy case-copy--single case-copy--after-p04">
      <CaseTextBlock class="case-copy__body">
        <TypoText :content="copy[24]" tag="h2" />
        <TypoText :content="copy[25]" tag="p" />
        <TypoText :content="copy[26]" tag="p" />
      </CaseTextBlock>
    </section>

    <CaseMediaFrame v-bind="media[3]" @open="activeMedia = media[3]" />

    <section class="case-copy case-copy--single case-copy--after-p05">
      <TypoText :content="copy[27]" tag="p" />
      <CaseTextBlock class="case-copy__body">
        <TypoText :content="copy[28]" tag="h2" />
        <TypoText :content="copy[29]" tag="p" />
      </CaseTextBlock>
    </section>

    <CaseMediaFrame v-bind="media[4]" @open="activeMedia = media[4]" />

    <section class="case-copy case-copy--single case-copy--after-p06">
      <TypoText :content="copy[30]" tag="p" />
      <CaseTextBlock class="case-copy__body">
        <TypoText :content="copy[31]" tag="h2" />
        <TypoText :content="copy[32]" tag="p" />
        <TypoText :content="copy[33]" tag="h3" />
        <TypoText :content="copy[34]" tag="p" />
        <TypoText :content="copy[35]" tag="h3" />
        <TypoText :content="copy[36]" tag="p" />
        <TypoText :content="copy[37]" tag="h3" />
        <TypoText :content="copy[38]" tag="p" />
      </CaseTextBlock>
    </section>

    <CaseMediaFrame v-bind="media[5]" @open="activeMedia = media[5]" />

    <section class="case-copy case-copy--single case-copy--after-p07">
      <TypoText :content="copy[39]" tag="p" />
      <CaseTextBlock class="case-copy__body">
        <TypoText :content="copy[40]" tag="h2" />
        <TypoText :content="copy[41]" tag="p" />
      </CaseTextBlock>
      <CaseTextBlock class="case-copy__body">
        <TypoText :content="copy[42]" tag="h2" />
        <TypoText :content="copy[43]" tag="p" />
      </CaseTextBlock>
    </section>

    <CaseMediaFrame v-bind="media[6]" @open="activeMedia = media[6]" />

    <section class="case-copy case-copy--closing">
      <CaseTextBlock class="case-copy__body">
        <TypoText :content="copy[44]" tag="h2" />
        <TypoText :content="copy[45]" tag="p" />
      </CaseTextBlock>
    </section>

    <CaseRelatedCases :cards="relatedCards" :labels="caseContent.ui" />

    <SiteFooter />
    <CaseImageViewer
      :open="Boolean(activeMedia)"
      :src="activeMedia?.src ?? ''"
      :alt="activeMedia?.alt ?? ''"
      :title="activeMedia?.title ?? ''"
      :labels="caseContent.ui"
      @close="activeMedia = null"
    />
  </main>
</template>

<style scoped>
.product-case { overflow: clip; background: var(--surface-default); }
.product-case__hero { position: relative; overflow: hidden; isolation: isolate; background: var(--surface-default); }
.product-case__back { position: absolute; z-index: 2; top: 44px; left: 24px; }
.product-case__back img { width: 18px; height: 18px; }
.product-case__hero-art, .product-case__hero-art picture, .product-case__hero-art img { display: block; width: 100%; }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
.case-copy { width: min(var(--case-content-max), calc(100% - (var(--case-page-x) * 2))); margin-right: auto; margin-left: auto; }
.case-copy--opening { margin-top: 40px; padding-top: 0; }
.case-meta { display: grid; gap: var(--space-3); margin: 0 0 var(--space-16); }
.case-meta div { display: grid; grid-template-columns: 130px 1fr; gap: var(--space-3); }
.case-meta dt { color: var(--text-secondary); font-size: var(--text-size-xl); font-weight: var(--text-weight-semibold); font-variation-settings: var(--font-variation-heading-xl-semibold); text-align: right; }
.case-meta dd { margin: 0; color: var(--text-secondary); font-size: var(--text-size-lg-plus); font-weight: var(--text-weight-light); font-variation-settings: var(--font-variation-body-accent); letter-spacing: 0.2px; }
.case-copy__body { margin-top: var(--case-flow-gap); }
.case-copy--opening .case-copy__body:first-of-type { margin-top: 0; }
.case-copy__body + .case-copy__body { margin-top: var(--case-flow-gap); }
.case-copy--single > p { margin: 0; color: var(--text-default); font-size: var(--case-body-size); font-weight: var(--case-body-weight); font-variation-settings: var(--case-body-variation); letter-spacing: 0.01em; line-height: 1.6; }
.case-copy__question { margin-top: 0 !important; color: var(--text-accent-chirp) !important; font-size: var(--text-size-xl-plus) !important; letter-spacing: 0.72px !important; line-height: 1.6 !important; }
.case-copy__conclusion { margin-top: 0 !important; }
.case-copy--single { box-sizing: border-box; margin-top: var(--case-flow-gap); }
.case-copy--single > p { padding-top: 0; }
.case-copy--closing { padding: var(--space-16) 0 var(--space-8); }
@media (max-width: 767px) { .product-case__back { top: 44px; left: 24px; } .case-meta { gap: var(--space-4); margin-bottom: var(--case-flow-gap); } .case-meta div { grid-template-columns: 130px 1fr; gap: var(--space-2); } .case-meta dt { font-size: var(--text-size-xl); } .case-meta__desktop-break { display: none; } .case-copy__question { font-size: var(--case-accent-size) !important; } .case-copy--closing { padding-top: 0; } }
</style>

<script setup lang="ts">

import avatarUrl from "~/assets/img/konstantin.png";



defineProps<{

  activeTab: "projects" | "resume";
  showCompactNav?: boolean;

}>();



const sentinelRef = ref<HTMLElement | null>(null);

const { isCompact } = useTopNavScroll(sentinelRef);



function scrollToTop() {

  window.scrollTo({ top: 0, behavior: "smooth" });

}



useHead({

  link: [

    {

      rel: "preload",

      as: "image",

      href: avatarUrl,

      type: "image/png",

    },

  ],

});

</script>



<template>

  <header class="hero">

    <div class="hero__profile">

      <div class="hero__avatar-wrap">

        <img

          :src="avatarUrl"

          alt="Константин Базаров"

          class="hero__avatar"

          width="120"

          height="120"

          loading="eager"

          fetchpriority="high"

          decoding="async"

        >

      </div>



      <div class="hero__intro">

        <h1 class="hero__name text-heading-4xl">Константин Базаров</h1>

        <p class="hero__role text-heading-xl text-heading-xl--semibold">

          Продуктовый дизайнер

          <strong>7+ лет опыта в SaaS, E-comm, BI, ERP</strong>

        </p>



        <p class="hero__contacts">

          <a href="mailto:stulginsky@gmail.com">stulginsky@gmail.com</a>

          <span class="hero__sep" aria-hidden="true">·</span>

          <a href="tel:+79258493933">+7 (925) 849 39 33</a>

          <span class="hero__sep" aria-hidden="true">·</span>

          <span>TG @Stulginsky</span>

        </p>

      </div>

    </div>



    <nav class="hero__nav" aria-label="Разделы">

      <div class="hero__tabs">

        <NuxtLink

          to="/"

          class="hero__tab tab-link"

          :class="{ 'tab-link--active': activeTab === 'projects' }"

        >

          Проекты

        </NuxtLink>

        <NuxtLink

          to="/resume"

          class="hero__tab tab-link"

          :class="{ 'tab-link--active': activeTab === 'resume' }"

        >

          Резюме

        </NuxtLink>

      </div>



      <SiteNavResumeActions

        v-if="activeTab === 'resume'"

        class="hero__actions"

      />

    </nav>



    <div

      ref="sentinelRef"

      class="hero__sentinel"

      aria-hidden="true"

    />

  </header>



  <nav

    v-if="showCompactNav !== false"

    class="top-nav-scroll"

    :class="{ 'top-nav-scroll--visible': isCompact }"

    aria-label="Компактная навигация"

  >

    <div class="top-nav-scroll__inner">

      <div class="top-nav-scroll__cluster">

        <button

          type="button"

          class="top-nav-scroll__avatar avatar-sm"

          aria-label="Наверх"

          @click="scrollToTop"

        >

          <img

            :src="avatarUrl"

            alt=""

            width="50"

            height="50"

            loading="lazy"

            decoding="async"

          >

        </button>



        <div class="top-nav-scroll__tabs">

          <NuxtLink

            to="/"

            class="tab-link"

            :class="{ 'tab-link--active': activeTab === 'projects' }"

          >

            Проекты

          </NuxtLink>

          <NuxtLink

            to="/resume"

            class="tab-link"

            :class="{ 'tab-link--active': activeTab === 'resume' }"

          >

            Резюме

          </NuxtLink>

        </div>



        <SiteNavResumeActions v-if="activeTab === 'resume'" />

      </div>

    </div>

  </nav>

</template>



<style scoped>

.hero {

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: var(--space-12);

}



.hero__profile {

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: var(--space-3);

  text-align: center;

}



.hero__avatar-wrap {

  flex-shrink: 0;

  width: 120px;

  height: 120px;

  border-radius: 60px;

  overflow: hidden;

  box-shadow: 0 0 0 1px var(--surface-default);

  background: var(--gray-100);

}



.hero__avatar {

  display: block;

  width: 100%;

  height: 100%;

  object-fit: cover;

}



.hero__intro {

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: var(--space-3);

}



.hero__name {

  margin: 0;

  color: var(--text-default);

}



.hero__role {

  margin: 0 0 var(--space-3) 0;

  color: var(--text-default);

}



.hero__role strong {

  font-weight: inherit;

  font-variation-settings: inherit;

}



.hero__contacts {

  display: flex;

  flex-wrap: wrap;

  align-items: center;

  justify-content: center;

  gap: 5px;

  margin: 0;

  font-size: var(--size-base);

  font-weight: var(--weight-regular);

  font-variation-settings: var(--font-variation-body-accent);

  line-height: 1.35;

  color: var(--text-secondary);

}



.hero__contacts a {

  color: inherit;

  text-decoration: none;

}



.hero__contacts a:hover {

  color: var(--text-default);

}



.hero__sep {

  font-size: var(--size-sm);

}



.hero__nav {

  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  min-height: 50px;

}



.hero__tabs {

  display: flex;

  gap: var(--space-5);

  align-items: center;

}



.hero__actions {

  position: absolute;

  left: calc(100% + 20px);

}



.hero__sentinel {

  width: 100%;

  height: 1px;

  margin-top: -1px;

  pointer-events: none;

  visibility: hidden;

}



/* TopNav/Scroll — Figma 124:1106 */

.top-nav-scroll {

  position: fixed;

  top: 0;

  left: 0;

  right: 0;

  z-index: 100;

  background: var(--surface-default);

  box-shadow: var(--shadow-2nd);

  transform: translateY(-100%);

  opacity: 0;

  pointer-events: none;

  transition:

    transform 0.25s ease,

    opacity 0.25s ease;

}



.top-nav-scroll--visible {

  transform: translateY(0);

  opacity: 1;

  pointer-events: auto;

}



.top-nav-scroll__inner {

  max-width: var(--page-max);

  margin: 0 auto;

  padding: var(--space-4) var(--space-page-x);

}



.top-nav-scroll__cluster {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: var(--space-6);

}



.top-nav-scroll__tabs {

  display: flex;

  gap: var(--space-6);

  align-items: center;

}



@media (prefers-reduced-motion: reduce) {

  .top-nav-scroll {

    transition: none;

  }

}



@media (max-width: 720px) {

  .hero__nav {

    flex-direction: column;

    gap: var(--space-4);

  }



  .hero__actions {

    position: static;

  }



  .hero__name {

    font-size: clamp(32px, 8vw, var(--size-4xl));

  }



  .top-nav-scroll__inner {

    padding: var(--space-4);

  }



  .top-nav-scroll__cluster {

    flex-wrap: wrap;

    gap: var(--space-4);

  }



  .top-nav-scroll__tabs {

    gap: var(--space-5);

  }

}

</style>



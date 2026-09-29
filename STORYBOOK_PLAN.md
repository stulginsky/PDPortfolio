<!-- 
  STORYBOOK IMPLEMENTATION PLAN
  ������: 2026-09-23, ���� 0 (��������������) ���������.
  
  DS-������������ (�������� ������):
    - E:\GitHub\PDPortfolio-DS\ds\CONTRACT.md
    - E:\GitHub\PDPortfolio-DS\ds\components.md
    - E:\GitHub\PDPortfolio-DS\ds\foundation.md
    - E:\GitHub\PDPortfolio-DS\ds\case-layout.md
  
  ���������:
    - E:\GitHub\PDPortfolio-DS\directives\directive_storybook_vue-nuxt.md
  
  ����������: �������� ���� ���� ������� ����� ����������� ���������.
  ���� 0 ��� ������� � �� �������� ��������������, ������� � ���� 1.
-->
# Storybook Vue/Nuxt — каталог DS-компонентов

## Статус предусловий

Nuxt-проект: `E:\GitHub\PDPortfolio` (отдельный репозиторий)

| Предусловие | Статус |
|---|---|
| Nuxt-проект запускается | ✅ Nuxt 4.4.4, Vue 3.5.33 |
| `app/components/` существует | ✅ 16 компонентов |
| `ds/components.md`, `ds/foundation.md`, `ds/CONTRACT.md` | ✅ В `PDPortfolio-DS/ds/` |
| `app/assets/css/tokens.css` и `fonts.css` | ✅ Полные, 59 Primitive + 38 Semantic + typography utilities |

## Инвентаризация (Фаза 0) — сканирование `E:\GitHub\PDPortfolio`

### Существующие Vue-компоненты (16 шт)

| Файл | DS-компонент? | Аудит |
|---|---|---|
| `HomeBadge.vue` | ✅ Badge | Нужен |
| `HomeProjectCard.vue` | ✅ Chirp cards (health) | Нужен |
| `HomeChirpCardScene.vue` | ✅ UX card scene | Нужен |
| `HomeChirpBrandCardScene.vue` | ✅ Brand card scene | Нужен |
| `HomeChirpDesignSystemCardScene.vue` | ✅ DS card scene | Нужен |
| `HomeShowcaseHeader.vue` | ✅ Header + Filters (витрина) | Нужен |
| `SiteHero.vue` | ✅ Header + TopNavScroll | Нужен |
| `SiteFooter.vue` | ✅ Footer | Нужен |
| `SiteScrollToTopButton.vue` | ✅ PageUp (BtnNav/Up) | Нужен |
| `SiteNavResumeActions.vue` | ✅ TopNavScroll/Resume actions | Нужен |
| `CaseImageViewer.vue` | ✅ CaseImageViewer | Нужен |
| `CaseMediaFrame.vue` | ✅ CaseImagePreview/ImgTitleToolbar | Нужен |
| `CaseRelatedCases.vue` | ✅ RelatedCases | Нужен |
| `CaseTextBlock.vue` | ❌ Продуктовый (case layout) | — |
| `ResumeExperienceBlock.vue` | ❌ Продуктовый (resume) | — |
| `TypoText.vue` | ❌ Internal helper | — |

### Существующие CSS-стили в tokens.css

Utility-классы уже определены для:
- `.icon-button` — DS Icon button (43:803) ✅
- `.tab-link` / `.tab-link--active` — DS Tab (33:1544) ✅
- `.avatar-sm` — DS Avatar-Sm (124:712) ✅
- `.text-heading-*` — Typography utilities ✅

### Доступные SVG/ассеты

| Иконка DS | Файл | Статус |
|---|---|---|
| ArrowNavLeft | `app/assets/icons/arrow-nav-left.svg` | ✅ |
| ArrowNavRight | `app/assets/icons/arrow-nav-right.svg` | ✅ |
| ArrowNavUp | `app/assets/icons/arrow-nav-up.svg` | ✅ |
| magnifying-glass | `public/cases/chirp-product/media/magnifying-glass.svg` | ✅ (не в общем assets) |
| Cross (viewer) | `public/cases/chirp-product/media/viewer-close.svg` | ✅ (не в общем assets) |
| chevron-down | `public/cases/chirp-product/media/chevron-down.svg` | ✅ (не в общем assets) |
| nav-arrow (BtnNav) | `public/cases/chirp-product/media/nav-arrow.svg` | ✅ (не в общем assets) |
| download-01 | — | ❌ Отсутствует |
| printer | — | ❌ Отсутствует |
| f-icon | — | ❌ Отсутствует |
| arrow-right | — | ❌ Отсутствует |
| ArrowLeftNav | — | ❌ Отсутствует |
| sun / moon | — | ❌ Отсутствует |
| Github / Figma | — | ❌ Отсутствует |
| ExternalLink | — | ❌ Отсутствует |

> [!IMPORTANT]
> Иконки magnifying-glass, viewer-close, chevron-down и nav-arrow лежат в `public/cases/chirp-product/media/` — привязаны к конкретному кейсу, а не к общей DS. Для Storybook их нужно перенести в `app/assets/icons/` или `public/icons/`.

---

## Матрица DS ↔ Vue ↔ Stories

### Ситуация 2: Компонент уже существует → аудит

| DS component | Figma node | Vue source | Решение |
|---|---|---|---|
| Badge | `312:1991` | `HomeBadge.vue` | Аудит: нет `Type` prop (Card/HeroChirp/CardCompact), нет HeroChirp variant |
| Footer | `1094:6423` | `SiteFooter.vue` | Аудит: нет Breakpoint prop, нет f-icon, content из JSON |
| Tab | `33:1544` | CSS `.tab-link` в tokens.css | Аудит: только CSS, нет Vue SFC |
| Icon button | `43:803` | CSS `.icon-button` в tokens.css | Аудит: только CSS, нет Vue SFC |
| Avatar-Sm | `124:712` | CSS `.avatar-sm` в tokens.css | Аудит: только CSS, нет Vue SFC; inline в SiteHero |
| PageUp | `1094:6509` | `SiteScrollToTopButton.vue` | Аудит: заменяет SVG по состоянию вместо CSS-перехода |
| Header | `1021:5460` | `SiteHero.vue` + `HomeShowcaseHeader.vue` | Аудит: composition, filters inline |
| Filters | `1021:3477` | inline в `HomeShowcaseHeader.vue` | Аудит: нет FullscreenMenu/Mob для `base`, нет dropdown для min-1024 |
| TopNavScroll | `1025:5059` | inline в `SiteHero.vue` | Аудит: встроен в SiteHero, не отдельный компонент |
| Chirp health card | `815:2062` | `HomeProjectCard.vue` | Аудит: health scene inline |
| Chirp UX card | `815:2114` | `HomeChirpCardScene.vue` (ux) | Аудит |
| Chirp brand card | `815:2160` | `HomeChirpBrandCardScene.vue` | Аудит |
| Chirp DS card | `815:2280` | `HomeChirpDesignSystemCardScene.vue` | Аудит |
| CaseImageViewer | `1019:11807` | `CaseImageViewer.vue` | Аудит: zoom/pan реализован, но viewer не совпадает с DS contract (100% initial, scroll) |
| CaseImagePreview | `1016:9326` | `CaseMediaFrame.vue` | Аудит: нет Platform prop, нет toolbar navigation tabs |
| RelatedCases | `968:7007` | `CaseRelatedCases.vue` | Аудит: стрелки и snap, но размеры карточек 400px, а не 430px |

### Ситуация 1: Компонента в коде ещё нет → создать

| DS component | Figma node | Приоритет |
|---|---|---|
| Button | `968:5914` | Волна 1 |
| cross button | `290:1960` | Волна 1 |
| Filter (SFC) | `43:867` | Волна 1 |
| Avatar-Lg | `124:563` | Волна 1 |
| Avatar-Sm (SFC) | `124:712` | Волна 1 |
| BtnNav | `281:506` | Волна 1 |
| Tooltip | `324:2111` | Волна 1 |
| ListItem | `325:1613` | Волна 1 |
| Role-Focus | `1107:7326` | Волна 1 |
| Breadcrumbs | `317:2055` | Волна 2 |
| BreadcrumbsMenu | `325:1622` | Волна 2 |
| BreadcrumbsOverflow | `1097:4338` | Волна 2 |
| DropdownSelect-web | `1015:4517` | Волна 2 |
| DropdownFilter-web | `1016:6638` | Волна 2 |
| FullscreenMenu/Mob | `1021:3359` | Волна 2 |
| Scroll | `968:3619` | Волна 2 |
| TopNav | `1025:7335` | Волна 2 |
| ImgTitleToolbar | `1016:5882` | Волна 3 |
| TopStickyBar | `1019:11604` | Волна 3 |
| Chirp-Pr-hero | `1003:4914` | Волна 3 |
| Cards page (5 шт) | `32:264`+ | Волна 3 |

---

## Open Questions

> [!IMPORTANT]
> **Нужно решение перед началом работы.**

### 1. Куда ставить Storybook?

Директива говорит: stories рядом с компонентами (`app/components/HomeBadge.stories.ts`). Компоненты живут в `E:\GitHub\PDPortfolio`. Но текущий workspace — `E:\GitHub\PDPortfolio-DS`, и у меня нет файлового доступа к `PDPortfolio` через редактор.

Варианты:
- **A) Поставить Storybook в PDPortfolio** — корректно по директиве, но мне нужен workspace-доступ для записи файлов
- **B) Поставить Storybook в PDPortfolio-DS** — stories будут ссылаться на компоненты из соседнего репозитория (нетипично)

### 2. Отсутствующие иконки

8 из 13 DS-иконок отсутствуют (download-01, printer, f-icon, ArrowLeftNav, sun, moon, Github, Figma, ExternalLink). Варианты:
- Экспортировать из Figma перед началом
- Создать минимальные placeholder SVG с TODO-маркером

### 3. Scope первой итерации

**Рекомендация:** начать с установки Storybook + Foundation + Волна 1 (атомарные компоненты: Badge, Button, Filter, Avatar, BtnNav, ListItem, Tooltip, cross button, Role-Focus). Это даст работающий каталог из ~10 компонентов, на котором проверим pipeline. Затем Волна 2 (dropdown/navigation) и Волна 3 (composite/hero/cards).

---

## Proposed Changes

### Phase 1: Install Storybook + configure

```bash
cd E:\GitHub\PDPortfolio
npx storybook@latest init --yes
```

#### [NEW/MODIFY] `.storybook/main.ts`
```ts
import type { StorybookConfig } from '@storybook/vue3-vite'
const config: StorybookConfig = {
  framework: { name: '@storybook/vue3-vite', options: { docgen: 'vue-component-meta' } },
  stories: ['../app/**/*.stories.@(js|ts)', '../storybook/**/*.mdx'],
  // ... addons
}
export default config
```

#### [NEW/MODIFY] `.storybook/preview.ts`
```ts
import '../app/assets/css/fonts.css'
import '../app/assets/css/tokens.css'
// viewport presets: 320, 370, 410, 425, 534, 720, 768, 1024, 1280, 1440, 1920
```

Удалить React-зависимости и авто-примеры после init.

---

### Phase 2: Foundation stories (`.storybook/` mdx)

- Primitive colors, semantic colors, semantic → primitive mapping
- Typography (21 text styles)
- Spacing, radii, effects
- Responsive breakpoints
- Icons

---

### Phase 3+: Component stories

Для каждого DS-компонента:
1. **Аудит** существующего Vue-файла (если есть) vs Figma/CONTRACT.md
2. **Создание/обновление** `.vue` по контракту
3. **Story** (`autodocs`, `AllVariants`, args, argTypes)
4. **Sandbox** (для интерактивных)
5. **Interaction test** (`play` function)

---

## Verification Plan

### Automated Tests
```bash
npm run storybook -- --ci
npm run build-storybook
```

### Manual Verification
- Визуальная сверка с Figma на viewports 320, 768, 1920
- Interaction states: hover, press, toggle
- Keyboard navigation, focus management
- `prefers-reduced-motion` check

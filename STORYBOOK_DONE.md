# Storybook Setup — Walkthrough (обновлено после Волны 2)

## Что сделано

### Фаза 1: Установка и настройка

| Файл | Статус |
|---|---|
| [`package.json`](file:///E:/GitHub/PDPortfolio/package.json) | `storybook dev -p 6006` + `storybook build` ✅ |
| [`.storybook/main.ts`](file:///E:/GitHub/PDPortfolio/.storybook/main.ts) | `@storybook/vue3-vite`, `experimentalDocgenServer`, `@vitejs/plugin-vue` viteFinal ✅ |
| [`.storybook/preview.ts`](file:///E:/GitHub/PDPortfolio/.storybook/preview.ts) | `fonts.css` + `tokens.css` + `setup(TypoText)` + 11 viewport presets ✅ |
| [`tsconfig.storybook.json`](file:///E:/GitHub/PDPortfolio/tsconfig.storybook.json) | Extends `.nuxt/tsconfig.app.json` для `vue-component-meta` ✅ |
| `typescript` | Downgraded 7.0.2 → 5.8.3 (совместимость с `vue-component-meta`) ✅ |
| `@nuxtjs/storybook` | Удалён (version conflict storybook@10 vs ~9.0.5) ✅ |

### Фаза 2: Foundation Stories (MDX)

| Файл | Содержание |
|---|---|
| [`storybook/Foundation/Colors.mdx`](file:///E:/GitHub/PDPortfolio/storybook/Foundation/Colors.mdx) | Accent, Gray, Status, Surface, Text, Border + ColorPalette |
| [`storybook/Foundation/Typography.mdx`](file:///E:/GitHub/PDPortfolio/storybook/Foundation/Typography.mdx) | 21 text style, specimen table |
| [`storybook/Foundation/SpacingRadii.mdx`](file:///E:/GitHub/PDPortfolio/storybook/Foundation/SpacingRadii.mdx) | Space tokens, radius tokens |
| [`storybook/Foundation/Breakpoints.mdx`](file:///E:/GitHub/PDPortfolio/storybook/Foundation/Breakpoints.mdx) | 11 viewport presets, responsive component sets |

### Фаза 3: Волна 1 — Атомарные компоненты

#### Обновлённые Vue SFC

| Компонент | Файл | Изменения |
|---|---|---|
| Badge | [`HomeBadge.vue`](file:///E:/GitHub/PDPortfolio/app/components/HomeBadge.vue) | Добавлен `type` prop (Card/HeroChirp/CardCompact), per-type геометрия, surface tokens |

#### Новые Vue SFC

| Компонент | Файл | DS node |
|---|---|---|
| Button | [`DsButton.vue`](file:///E:/GitHub/PDPortfolio/app/components/DsButton.vue) | `968:5914` |
| Filter | [`DsFilter.vue`](file:///E:/GitHub/PDPortfolio/app/components/DsFilter.vue) | `43:867` |
| Avatar-Lg | [`DsAvatarLg.vue`](file:///E:/GitHub/PDPortfolio/app/components/DsAvatarLg.vue) | `124:563` |
| Avatar-Sm | [`DsAvatarSm.vue`](file:///E:/GitHub/PDPortfolio/app/components/DsAvatarSm.vue) | `124:712` |
| BtnNav | [`DsBtnNav.vue`](file:///E:/GitHub/PDPortfolio/app/components/DsBtnNav.vue) | `281:506` |
| CrossButton | [`DsCrossButton.vue`](file:///E:/GitHub/PDPortfolio/app/components/DsCrossButton.vue) | `290:1960` |
| Tooltip | [`DsTooltip.vue`](file:///E:/GitHub/PDPortfolio/app/components/DsTooltip.vue) | `324:2111` |
| ListItem | [`DsListItem.vue`](file:///E:/GitHub/PDPortfolio/app/components/DsListItem.vue) | `325:1613` |
| RoleFocus | [`DsRoleFocus.vue`](file:///E:/GitHub/PDPortfolio/app/components/DsRoleFocus.vue) | `1107:7326` |

#### Stories

| Story | Файл |
|---|---|
| Badge | [`HomeBadge.stories.ts`](file:///E:/GitHub/PDPortfolio/app/components/HomeBadge.stories.ts) |
| Button | [`DsButton.stories.ts`](file:///E:/GitHub/PDPortfolio/app/components/DsButton.stories.ts) |
| Filter | [`DsFilter.stories.ts`](file:///E:/GitHub/PDPortfolio/app/components/DsFilter.stories.ts) |
| Avatar-Sm | [`DsAvatarSm.stories.ts`](file:///E:/GitHub/PDPortfolio/app/components/DsAvatarSm.stories.ts) |
| Avatar-Lg | [`DsAvatarLg.stories.ts`](file:///E:/GitHub/PDPortfolio/app/components/DsAvatarLg.stories.ts) |
| BtnNav | [`DsBtnNav.stories.ts`](file:///E:/GitHub/PDPortfolio/app/components/DsBtnNav.stories.ts) |
| CrossButton | [`DsCrossButton.stories.ts`](file:///E:/GitHub/PDPortfolio/app/components/DsCrossButton.stories.ts) |
| Tooltip | [`DsTooltip.stories.ts`](file:///E:/GitHub/PDPortfolio/app/components/DsTooltip.stories.ts) |
| ListItem | [`DsListItem.stories.ts`](file:///E:/GitHub/PDPortfolio/app/components/DsListItem.stories.ts) |
| RoleFocus | [`DsRoleFocus.stories.ts`](file:///E:/GitHub/PDPortfolio/app/components/DsRoleFocus.stories.ts) |

### Фаза 3: Волна 2 — Навигация и dropdown-компоненты

#### Новые Vue SFC

| Компонент | Файл | DS node |
|---|---|---|
| Breadcrumbs | [`DsBreadcrumbs.vue`](file:///E:/GitHub/PDPortfolio/app/components/DsBreadcrumbs.vue) | `317:2055` |
| BreadcrumbsMenu | [`DsBreadcrumbsMenu.vue`](file:///E:/GitHub/PDPortfolio/app/components/DsBreadcrumbsMenu.vue) | `325:1622` |
| BreadcrumbsOverflow | [`DsBreadcrumbsOverflow.vue`](file:///E:/GitHub/PDPortfolio/app/components/DsBreadcrumbsOverflow.vue) | `1097:4338` |
| DropdownSelect-web | [`DsDropdownSelect.vue`](file:///E:/GitHub/PDPortfolio/app/components/DsDropdownSelect.vue) | `1015:4517` |
| DropdownFilter-web | [`DsDropdownFilter.vue`](file:///E:/GitHub/PDPortfolio/app/components/DsDropdownFilter.vue) | `1016:6638` |
| FullscreenMenu/Mob | [`DsFullscreenMenuMob.vue`](file:///E:/GitHub/PDPortfolio/app/components/DsFullscreenMenuMob.vue) | `1021:3359` |
| Scroll X/Y | [`DsScroll.vue`](file:///E:/GitHub/PDPortfolio/app/components/DsScroll.vue) | `968:3619` |
| TopNav | [`DsTopNav.vue`](file:///E:/GitHub/PDPortfolio/app/components/DsTopNav.vue) | `1025:7335` |

#### Stories

| Story | Файл |
|---|---|
| Breadcrumbs | [`DsBreadcrumbs.stories.ts`](file:///E:/GitHub/PDPortfolio/app/components/DsBreadcrumbs.stories.ts) |
| BreadcrumbsOverflow | [`DsBreadcrumbsOverflow.stories.ts`](file:///E:/GitHub/PDPortfolio/app/components/DsBreadcrumbsOverflow.stories.ts) |
| DropdownSelect | [`DsDropdownSelect.stories.ts`](file:///E:/GitHub/PDPortfolio/app/components/DsDropdownSelect.stories.ts) |
| DropdownFilter | [`DsDropdownFilter.stories.ts`](file:///E:/GitHub/PDPortfolio/app/components/DsDropdownFilter.stories.ts) |
| FullscreenMenuMob | [`DsFullscreenMenuMob.stories.ts`](file:///E:/GitHub/PDPortfolio/app/components/DsFullscreenMenuMob.stories.ts) |
| Scroll | [`DsScroll.stories.ts`](file:///E:/GitHub/PDPortfolio/app/components/DsScroll.stories.ts) |
| TopNav | [`DsTopNav.stories.ts`](file:///E:/GitHub/PDPortfolio/app/components/DsTopNav.stories.ts) |

**Build: 267 модулей, 0 ошибок ✅**

---

## Запуск

```bash
# Dev server
npm run storybook
# http://localhost:6006

# Production build
npm run build-storybook
# → storybook-static/
```

## Проверка сборки

- **Dev**: `npx storybook dev -p 6006 --ci` — старт за ~14s ✅
- **Build**: `npx storybook build` — 237 модулей, 0 ошибок ✅

## Ключевые решения

| Проблема | Решение |
|---|---|
| `@nuxtjs/storybook` version conflict | Удалён, используется `@storybook/vue3-vite` |
| TypeScript 7.0.2 убрал `readJsonConfigFile` | Downgrade до TS 5.8.3 |
| TypoText.vue не имеет auto-import в Storybook | `setup()` в preview.ts регистрирует глобально |
| TS 7.0.2 `vue-component-meta` crash | TS 5.8.3 |
| Production build: TypoText.vue parse error | `@vitejs/plugin-vue` добавлен в `viteFinal` |
| MDX `@storybook/blocks` не установлен | Импорт из `@storybook/addon-docs/blocks` |
| `experimentalDocgenServer` | Включён для избежания Rollup-конфликта в build |

## Осталось (следующие волны)

### Волна 2
- Breadcrumbs, BreadcrumbsMenu, BreadcrumbsOverflow
- DropdownSelect-web, DropdownFilter-web
- FullscreenMenu/Mob
- Scroll, TopNav

### Волна 3
- ImgTitleToolbar, TopStickyBar
- Chirp-Pr-hero (parallax)
- 5 Case cards

### Audit backlog (existing SFCs)
- SiteFooter.vue → Footer contract `1094:6423`
- SiteScrollToTopButton.vue → PageUp contract `1094:6509`
- SiteHero.vue → Header contract `1021:5460`
- HomeShowcaseHeader.vue → Filters + TopNavScroll

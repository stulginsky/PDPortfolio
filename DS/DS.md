# Дизайн-система — точка входа (PDPortfolio)

Сверка с Figma: 2026-09-10. Канонические документы обновлены; CSS/Vue ещё требуют миграции. Карта всех пяти страниц, неоднозначности и очередь вёрстки: [figma-sync.md](figma-sync.md).

Документация ДС живёт в **соседнем репозитории** (единый источник правды вместе с Figma). Этот файл — индекс и **обязательный чеклист синхронизации** перед любой UI-работой в коде.

## Канонические источники (порядок приоритета)

| Что | Где | Зачем |
|-----|-----|--------|
| **Макеты экранов** | [Figma — PDPortfolio-Prod](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod) | Актуальная вёрстка, контент карточек, раскладка |
| **Главная (фрейм)** | [Main `node-id=46-489`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=46-489) | Hero, сетка карточек, порядок и размеры |
| **Резюме (фрейм)** | [About `node-id=46-515`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=46-515) | Текст резюме, кнопка скачивания PDF |
| **Токены и компоненты ДС** | `E:\GitHub\PDPortfolio-DS\ds\` | CONTRACT, foundation, components, brand-brief |
| **Данные карточек главной** | `content/sources/home-cards.json` → `content/home-cards.json` | Plain в sources; на сайт — после `npm run typograf:apply` |
| **Текст резюме** | `content/sources/resume.json` → `content/resume.json` | То же; типографика — см. `content/TYPOGRAPHY.md` |
| **PDF резюме** | `public/resume/konstantin-bazarov-resume.pdf` | Скачивание по кнопке на `/resume` |
| **Длинные кейсы** | Figma; локальные Vue-страницы, план typed markdown в `review-and-plan.md` | Notion исключён из будущего процесса; `content/notion/` содержит прежние артефакты |

> **Правило:** при расхождении между кодом, JSON и Figma — **верна Figma** (и при необходимости обновляется `PDPortfolio-DS\ds\*.md`, затем код).

## Файлы в `PDPortfolio-DS\ds\`

| Файл | Содержание |
|------|------------|
| `CONTRACT.md` | Как работать с ДС: только UI-кит, Variables, запрет ad-hoc hex в компонентах |
| `foundation.md` | Примитивы и semantic-токены (цвета, типографика, отступы, радиусы) |
| `components.md` | Каталог компонентов Figma (Badge, Tab, Icon button, TopNav, Filter, …) + node-id |
| `brand-brief.md` | Бриф: аудитория, тон, ru+en |

Путь к папке: **`E:\GitHub\PDPortfolio-DS\ds`**

## Зафиксированные решения перед разработкой

Этот раздел — локальная точка входа для реализации DS-кейса. Детали токенов и компонентов не дублируются: их источники — Figma и `PDPortfolio-DS\ds\foundation.md` / `components.md`.

### Представления DS-кейса и вкладки viewer

| Представление | Figma node-id | Контракт вкладки / viewer |
|---|---:|---|
| Overview | `763:5072` (`1920-DS-Overview`) | Стартовая визуальная вкладка; контент — изображения из `E:/GitHub/Cases/Chirp/prod/ds-case-img/overview`. |
| Foundation | `790:3287` (`1920-DS-Foundation.md`) | Текстовый viewer в стиле IDE с нумерацией строк; источник — `E:/GitHub/Cases/Chirp/wip/design-system/Chirp-design-system-ru-final.md`. |
| Tokens | `800:2435` (`1920-DS-Tokens.json`) | Текстовый viewer в стиле IDE с нумерацией строк; источник — `E:/GitHub/Cases/Chirp/wip/design-system/tokens.json`. |
| Fullscreen | `790:2913` (`1920-DS-fullscreen`) | Полноэкранный просмотр Overview; Figma открывается отдельным окном: [Chirp DS](https://www.figma.com/design/Rqb5u7DbMstCGWRnVzZEwc/Chirp-DS?node-id=0-1). |

Это контракт, а не уже реализованный Vue-интерфейс: код и мобильные экраны для него пока не менялись.

### Fullscreen viewer

- Непрозрачный слой на весь viewport; изображение можно панорамировать по X и Y и масштабировать.
- Шапка фиксирована, высота `138px`; для поведения использовать как ориентир `E:/GitHub/Cases/Docs-to-developing/illustrations/ill-task-description.md`.
- Визуальные токены шапки и её Figma-представление описаны в канонических `foundation.md` и `components.md`.

### Адаптация

- Десктопные фреймы `1920` — источник истины для состава и порядка контента.
- Фреймы `720` — ориентир для breakpoint ниже `720px`, но не финальный мобильный контент.
- На мобильном адаптируются реальные текст, контролы и viewer; запрещено уменьшать всю страницу как единое изображение. Целевой узкий viewport — от `360px`.
- Подготовлены mobile-hero: Product `790:2075`, UX `848:4026`; примеры fullscreen — `854:4054` и `854:4119`. Остальные mobile-hero намеренно отложены до подтверждения необходимости в разработке.

## Обязательная синхронизация перед UI в коде

Перед правками `app/**/*.vue`, стилей, `content/sources/home-cards.json` или ассетов под главную:

1. **Прочитать** этот файл (`DS/DS.md`).
2. Для DS-кейса — сверить раздел «Зафиксированные решения перед разработкой» выше; для любой UI-работы **прочитать** `PDPortfolio-DS\ds\CONTRACT.md` (минимум) и при необходимости `foundation.md` / `components.md`.
3. **Открыть в Figma** нужный фрейм (для главной — [Main `46:489`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=46-489)).
4. **Сверить данные:** для карточек — обновить `content/sources/home-cards.json` по макету, затем `npm run typograf:apply`.
5. **Сверить UI:** цвета/типографика/компоненты — из токенов `foundation.md`, не выдумывать новые hex в компонентах (фон карточки — поле данных в `home-cards.json`, как в Figma).
6. **После изменений в Figma или в `PDPortfolio-DS\ds\`:** сначала обновить md в DS-репозитории, затем JSON/код здесь.

Если в DS-репозитории или Figma что-то изменилось, а код ещё нет — **сначала синхронизация, потом реализация**.

## Схема `content/home-cards.json`

| Поле | Описание |
|------|----------|
| `title` | Заголовок карточки |
| `subtitle` | Подзаголовок (компания) |
| `badges` | Теги через запятую → отдельные бейджи в UI |
| `image` | Путь к превью (из `public/cases/<slug>/`) |
| `href` | Ссылка на кейс; пустая строка, если кейса нет |
| `coming-soon.show` | Показать бейдж «скоро» |
| `coming-soon.badge-image` | Картинка бейджа (например `/badges/coming-soon.png`) |
| `background-color` | Фон карточки (hex из Figma) |
| `background-color-hover` | Фон при наведении (десктоп, `hover`) |
| `background-color-active` | Фон при mouse down (десктоп, `:active`) |
| `background-color-tap` | Фон при нажатии на плитку (мобилка, `:active`) |
| `height` | Высота карточки, например `540px` |
| `show` | `true` — показывать на главной, `false` — скрыть |
| `index` | Место на сетке 3×2 (десктоп). Подробно: **`content/home-cards-layout.md`** |

## Компоненты UI-кита в коде

| Figma (components.md) | CSS / Vue |
|----------------------|-----------|
| Tab `33:1544` | `.tab-link`, `.tab-link--active` в `tokens.css` · `SiteHero.vue` |
| Icon button `43:803` | `.icon-button` в `tokens.css` · `SiteHero.vue` |
| Badge set `312:1991`, Card `30:131`, Hero `312:2472` | `HomeBadge.vue` пока не подтверждён для обоих вариантов |
| TopNav/Default `124:824` | `SiteHero.vue` — полный hero |
| TopNav/Scroll `124:1104` | `SiteHero.vue` — `.top-nav-scroll`; сверить новые padding и Shadow/2nd |
| Avatar-Sm set `124:712`, Default `124:582` / Hover `124:713` | `.avatar-sm` — требуется сверка всех состояний |
| Heading/* | `.text-heading-*` в `tokens.css` |

Токены в коде: **`app/assets/css/tokens.css`**. Это прежнее зеркало `foundation.md`; после сверки 2026-09-09 оно не синхронизировано с новой шкалой. Менять значения вместе с потребителями; карта соответствия Text Styles и Variables находится в каноническом foundation.md.

## Что не дублировать

- Не вести второй каталог токенов в этом репозитории — только ссылка сюда и `PDPortfolio-DS\ds\`.
- Не править `content/sources/home-cards.json` «из головы» — только по Figma Main (или явной команде пользователя).

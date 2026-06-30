# Дизайн-система — точка входа (PDPortfolio)

Документация ДС живёт в **соседнем репозитории** (единый источник правды вместе с Figma). Этот файл — индекс и **обязательный чеклист синхронизации** перед любой UI-работой в коде.

## Канонические источники (порядок приоритета)

| Что | Где | Зачем |
|-----|-----|--------|
| **Макеты экранов** | [Figma — Site-Portfolio-Bazarov](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/Site-Portfolio-Bazarov) | Актуальная вёрстка, контент карточек, раскладка |
| **Главная (фрейм)** | [Main `node-id=46-489`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/Site-Portfolio-Bazarov?node-id=46-489) | Hero, сетка карточек, порядок и размеры |
| **Резюме (фрейм)** | [About `node-id=46-515`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/Site-Portfolio-Bazarov?node-id=46-515) | Текст резюме, кнопка скачивания PDF |
| **Токены и компоненты ДС** | `E:\GitHub\PDPortfolio-DS\ds\` | CONTRACT, foundation, components, brand-brief |
| **Данные карточек главной** | `content/sources/home-cards.json` → `content/home-cards.json` | Plain в sources; на сайт — после `npm run typograf:apply` |
| **Текст резюме** | `content/sources/resume.json` → `content/resume.json` | То же; типографика — см. `content/TYPOGRAPHY.md` |
| **PDF резюме** | `public/resume/konstantin-bazarov-resume.pdf` | Скачивание по кнопке на `/resume` |
| **Длинные кейсы** | Notion → `content/notion/` | Тела страниц `/cases/*`, не главная |

> **Правило:** при расхождении между кодом, JSON и Figma — **верна Figma** (и при необходимости обновляется `PDPortfolio-DS\ds\*.md`, затем код).

## Файлы в `PDPortfolio-DS\ds\`

| Файл | Содержание |
|------|------------|
| `CONTRACT.md` | Как работать с ДС: только UI-кит, Variables, запрет ad-hoc hex в компонентах |
| `foundation.md` | Примитивы и semantic-токены (цвета, типографика, отступы, радиусы) |
| `components.md` | Каталог компонентов Figma (Badge, Tab, Icon button, TopNav, Filter, …) + node-id |
| `brand-brief.md` | Бриф: аудитория, тон, ru+en |

Путь к папке: **`E:\GitHub\PDPortfolio-DS\ds`**

## Обязательная синхронизация перед UI в коде

Перед правками `app/**/*.vue`, стилей, `content/sources/home-cards.json` или ассетов под главную:

1. **Прочитать** этот файл (`DS/DS.md`).
2. **Прочитать** `PDPortfolio-DS\ds\CONTRACT.md` (минимум) и при необходимости `foundation.md` / `components.md`.
3. **Открыть в Figma** нужный фрейм (для главной — [Main `46:489`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/Site-Portfolio-Bazarov?node-id=46-489)).
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
| `image` | Путь к превью (из `public/home-cards/`) |
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
| Badge `30:131` | `HomeBadge.vue` |
| TopNav/Default `124:824` | `SiteHero.vue` — полный hero |
| TopNav/Scroll `124:1106` | `SiteHero.vue` — `.top-nav-scroll` (padding `space/4`, `Shadow/2nd`) |
| Avatar-Sm `124:709` / hover `124:713` | `.avatar-sm` — hover border `surface/action-primary-hover` |
| Heading/* | `.text-heading-*` в `tokens.css` |

Токены в коде: **`app/assets/css/tokens.css`** (зеркало `foundation.md`).

## Что не дублировать

- Не вести второй каталог токенов в этом репозитории — только ссылка сюда и `PDPortfolio-DS\ds\`.
- Не править `content/sources/home-cards.json` «из головы» — только по Figma Main (или явной команде пользователя).

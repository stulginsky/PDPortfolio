# Типографика текстов

## Принцип

1. **Редактируем** plain text в `content/sources/*.json` — без `&nbsp;`, без ручных переносов.
2. **Генерируем** типографированный JSON в `content/*.json` командой `npm run typograf:apply`.
3. **На сайте** только вывод готовых строк через **`TypoText`** (обычный текст, Unicode nbsp). Пакет `typograf` в runtime не используется.

Типограф — локальный npm-пакет на этапе сборки/CI, не внешний API и не зависимость для посетителя.

## Команды

```bash
npm run typograf:apply    # sources → content (resume.json, home-cards.json)
npm run typograf:preview  # превью summary из sources (сверка с typograf.ru)
```

`prebuild` и `pregenerate` автоматически вызывают `typograf:apply`.

## Файлы

| Plain (редактировать) | Сгенерированный (импорт в Nuxt) |
|-----------------------|----------------------------------|
| `content/sources/resume.json` | `content/resume.json` |
| `content/sources/home-cards.json` | `content/home-cards.json` |

Оба JSON в git: sources — для правок, `content/*.json` — то, что отдаётся на сайт.

## В коде

```vue
<TypoText :content="paragraph" tag="p" class="resume-page__summary-p" />
```

`content` уже содержит Unicode nbsp и прочие символы после `typograf:apply`. Prop называется **`content`**, не `text` — в Vue prop `text` ломает SSR (пустые узлы).

## Где используется TypoText

| Место | Поля |
|-------|------|
| `/resume` | summary, опыт, highlights, skills, education |
| Главная | `title`, `subtitle`, бейджи |

Заголовки секций резюме (`<h2>` с `title`) — plain в шаблоне или из JSON без типографа по желанию; сейчас `education.title`, `highlights.title` тоже проходят apply.

## Добавление нового текста

1. Добавить plain text в `content/sources/…`.
2. При необходимости расширить `scripts/apply-typograf-content.mjs` (новые поля).
3. `npm run typograf:apply`.
4. Вывести в Vue через `<TypoText :content="..." />`.

## Чего типограф не делает

- Явные мягкие переносы (`&shy;`) — по умолчанию не добавляем; на вебе обычно хватает `&nbsp;` и CSS `hyphens: auto`.
- Повторный apply по уже типографированному `content/*.json` не делайте — правьте только **sources**.

## Тексты из Figma

**Figma — источник смысла и формулировок, не веб-типографики.** В макете нет `&nbsp;` для предлогов; переносы в фрейме — визуальные, не для HTML.

### Цепочка

```
Figma (Main / About) → content/sources/*.json (plain) → typograf:apply → content/*.json → сайт
```

1. Открыть нужный фрейм: [Main](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/Site-Portfolio-Bazarov?node-id=46-489) или [About](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/Site-Portfolio-Bazarov?node-id=46-515).
2. Скопировать текст из слоя **как обычный текст** (Ctrl+C) — одной строкой/абзацем, без переносов из макета.
3. Вставить в **`content/sources/`** (не в `content/resume.json`):
   - карточки главной → `home-cards.json` (`title`, `subtitle`, `badges`);
   - резюме → `sources/resume.json`.
4. При вставке **убрать артефакты Figma**: лишние переводы строк, неразрывные пробелы Unicode (U+00A0), ручные переносы в середине слова. Обычные пробелы и абзацы — ок.
5. `npm run typograf:apply` — nbsp, кавычки «ёлочки», тире для веба.
6. Сверить страницу с макетом (смысл и переносы; пиксель-в-пиксель переносы строк не копируем).

### Что не переносим из Figma


| В Figma | В репозитории |
|---------|----------------|
| Визуальные переносы строк в текстовом фрейме | Один абзац в JSON; переносы даёт браузер + `hyphens` |
| Ручные пробелы/тире «для красоты» | Plain text; правит Типограф |
| `&nbsp;`, `&shy;`, HTML | Только после `typograf:apply` |
| Цвета, высоты карточек | Как сейчас — поля JSON / токены, не типограф |

### Разные источники контента

| Экран / блок | Откуда текст | Куда класть plain |
|--------------|--------------|-------------------|
| Главная, резюме | **Figma** | `content/sources/*.json` |
| Кейсы (длинные) | **Notion** (синк) | пока в `.vue` / `content/notion/` — при миграции тот же паттерн: sources → apply |
| Hero (имя, роль) | Figma, редко меняется | шаблон `SiteHero.vue` или вынести в `sources/site.json` при необходимости |

### Коммит

После правки по Figma коммитим **`content/sources/`** и сгенерированные **`content/*.json`**.

## Ежедневный workflow

1. Меняете текст в `content/sources/…` (в т.ч. вставка из Figma).
2. `npm run typograf:apply` (или `npm run build` / `generate`).
3. Коммит: sources + `content/*.json`.
4. Превью: `npm run typograf:preview`.

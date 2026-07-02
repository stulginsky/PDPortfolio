# Директива 01 — создать дизайн-систему с нуля

Использовать, когда проект стартует без устойчивой дизайн-системы: нет согласованных токенов, UI-kit, компонентного каталога и правил синхронизации Figma с кодом.

## Цель

Поставить минимально жизнеспособную дизайн-систему, которую можно сразу использовать для сборки экранов и постепенно расширять без хаоса.

Результат директивы:

- `brand-brief.md`
- `CONTRACT.md`
- `foundation.md`
- `components.md`
- UI-kit в Figma
- токены в коде
- чеклист использования DS перед каждой UI-задачей

## 1. Зафиксировать `brand-brief.md`

Сначала описать контекст продукта, потому что токены и компоненты не должны появляться из вкусовщины.

Минимальные поля:

| Поле | Что фиксируем |
|---|---|
| Продукт / отрасль | Что проект делает и в каком контексте используется |
| Аудитория | Кто принимает решение, кто пользуется интерфейсом |
| Тон | Например: строгий, тёплый, технологичный, редакционный, игровой |
| Платформы | Web, mobile, desktop, app, responsive breakpoints |
| Локали | Языки, особенности типографики, длина строк |
| Доступность | Минимальный целевой уровень контраста и интерактивных состояний |

Выводы из брифа должны прямо влиять на palette, typography, density, radius, motion и tone of voice.

## 2. Создать `CONTRACT.md`

Контракт отвечает на вопрос: как агент, дизайнер и разработчик имеют право менять интерфейс.

Обязательные разделы:

- источник правды и порядок приоритета;
- что значит “работать через DS”;
- запрет ad-hoc цветов, радиусов, шрифтов и компонентов;
- правило добавления нового токена;
- правило добавления нового компонента;
- правило синхронизации Figma ↔ DS docs ↔ code;
- исключения: когда можно делать ad-hoc и как это маркировать.

Базовое правило:

> Новый экран собирается из существующих токенов и компонентов. Если нужного токена или компонента нет, сначала расширяется DS, затем экран.

## 3. Собрать `foundation.md`

Foundation описывает токены в двух обязательных слоях: primitive и semantic.

### Primitive tokens

Фиксируются сырые значения:

- palette;
- typography family, sizes, weights, line heights, letter spacing;
- spacing scale;
- radius scale;
- shadows/elevation;
- optional: motion, opacity, z-index, grid.

### Semantic tokens

Фиксируются смысловые роли:

- `surface/default`
- `surface/subtle`
- `surface/raised`
- `surface/action-primary`
- `text/default`
- `text/secondary`
- `text/inverse`
- `border/default`
- `border/focus`
- `bg/success`
- `bg/warning`
- `bg/error`
- `bg/info`

Semantic token не должен быть просто копией имени цвета. Он должен объяснять роль в интерфейсе.

## 4. Создать UI-kit в Figma

В Figma нужно создать минимум:

- Variables для primitive и semantic tokens;
- Text Styles с префиксом проекта или `DS/`;
- Effect Styles для теней;
- секцию Foundation / Components;
- базовые компоненты: Badge, Button, Icon button, Tab/Segmented control, Input, Card, TopNav/Header.

Правила:

- компоненты должны использовать Variables, а не прибитые hex;
- текст должен использовать Text Styles;
- секции и компоненты собираются на Auto Layout;
- состояния компонента фиксируются как variants;
- у компонентов должны быть понятные имена и назначение.

## 5. Вести `components.md`

Каждый компонент из UI-kit документируется.

Минимальная запись:

```md
## Component Name
- **Node ID:** `123:456`
- **Назначение:** Где и зачем используется
- **Варианты:** Default / Hover / Active / Disabled
- **Токены:** bg, text, border, radius, spacing
- **Used in:** Экраны или зоны продукта
- **Figma:** ссылка на node
```

Если компонента нет в `components.md`, он не считается частью DS.

## 6. Зеркалить токены в коде

Формат зависит от проекта:

- CSS variables: `tokens.css`;
- JSON tokens: `tokens.json`;
- TypeScript exports: `tokens.ts`;
- design-token pipeline: Style Dictionary, Tokens Studio, custom script.

Важно:

- в коде не заводить второй независимый набор токенов;
- semantic names должны совпадать с `foundation.md`;
- компонентный CSS должен ссылаться на токены, а не на случайные hex;
- исключения должны быть явно описаны.

## 7. Чеклист перед каждой UI-задачей

Перед изменением экрана, компонента, стилей или UI-контента:

1. Открыть нужный Figma frame/node.
2. Прочитать `CONTRACT.md`.
3. Проверить `foundation.md` и `components.md`.
4. Найти существующие токены и компоненты.
5. Если нужного нет, расширить DS.
6. Обновить DS docs.
7. Обновить код.
8. Проверить соответствие Figma, DS docs и code.

## Definition of Done

DS с нуля считается поставленной, когда:

- есть согласованный brand brief;
- есть контракт работы с DS;
- foundation tokens описаны в docs и заведены в Figma;
- базовые компоненты есть в Figma и описаны в `components.md`;
- токены доступны в коде;
- новый экран можно собрать без ad-hoc решений.

## Implementation addendum — Figma MCP

Если директива выполняется через Figma MCP, действуют дополнительные технические правила:

- Сначала согласовать `brand-brief.md`, `CONTRACT.md` и `foundation.md`; до согласования markdown не выполнять write-вызовы в Figma.
- Foundation, UI-kit, wireframes и финальные экраны по умолчанию живут в одном Figma Design-файле.
- Variables создавать в порядке `Primitive` → `Semantic`; semantic variables должны ссылаться на primitive variables через alias, если Figma API это поддерживает.
- UI-kit создавать из настоящих `ComponentNode` / `ComponentSetNode`, а не из декоративных frame.
- Variants объединять через `figma.combineAsVariants()`, имена вариантов задавать в формате `Property=value`.
- Text Styles хранят типографику; цвет текста задаётся отдельной semantic color variable.
- Auto Layout обязателен для секций, компонентов и экранных композиций.
- Мутирующий Figma-вызов не должен завершаться через `throw`; отчёт и проверку делать отдельным read-only вызовом.
- После write проверить component sets, Text Styles, variable bindings и screenshot ключевой секции.

## Агентный указатель

После постановки DS добавить ссылку на `ds/CONTRACT.md` в агентную точку входа проекта: `DS/DS.md`, `AGENTS.md`, `CLAUDE.md` или README-раздел проекта.

Минимальный блок:

```md
## Дизайн-система

Перед любой UI-задачей прочитать `ds/CONTRACT.md`, `ds/foundation.md`, `ds/components.md`.
Новый UI делается только через DS. Если нужного токена или компонента нет, сначала расширить DS.
```


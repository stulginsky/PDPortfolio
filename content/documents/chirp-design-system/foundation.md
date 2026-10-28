# Chirp Design System

**Интерфейсная основа Chirp — от визуального языка до готовых компонентов.**

Цветовые роли, типографика, размеры, эффекты и компоненты собраны в одну систему для спокойных и легко читаемых медицинских интерфейсов.

**Ниже — сама система: её правила, значения и рабочие элементы.**

## Principles

*Основные правила системы*

- Интерфейс использует **semantic roles**, а не прямые значения цвета.
- Цвет, spacing, radius и размеры controls опираются на общие шкалы.
- Типографика построена на **PT Sans Regular / Bold** и связана с variables.
- Компоненты используют **variants и properties** для основных состояний и сценариев.
- Локальные изменения не должны нарушать системные значения и структуру компонентов.

## Color

*Цветовая система*

### Primitive Palette

*Базовая палитра реализации*

| Family | Tokens |
|---|---|
| Blue | `blue-100 #F0FDFF`, `blue-300 #80E8FF`, `blue-400 #46CEEC`, `blue-500 #27AFCD`, `blue-500-12`, `blue-500-20`, `blue-500-30`, `blue-600 #00BCE5`, `blue-700-40`, `blue-800-20` |
| Cyan | `cyan-300 #63FFE3`, `cyan-400 #4FF5F5`, `cyan-500 #1FE1E3`, `cyan-600 #00D1FF`, `cyan-600-30`, `cyan-600-50` |
| Green | `green-300 #80FFC2`, `green-400 #5EEDBE`, `green-500 #00FF85`, `green-500-50`, `green-600 #27CD5E`, `green-700 #4A8468` |
| Yellow | `yellow-100 #FFF4E5`, `yellow-500 #FFB43F` |
| Pink | `pink-400 #FF93D4`, `pink-400-30`, `pink-500 #F96CC2` |
| Red | `red-100 #FFEBEB`, `red-500 #FF6666` |
| Gray | `gray-100 #F5F5F5`, `gray-400 #848484`, `gray-500-25`, `gray-600 #555555`, `gray-900 #424242`, `gray-900-5/10/20/30/40/60/70/90` |
| White | `white-1000 #FFFFFF` |

Суффикс opacity — часть значения токена. Например, `blue-500-20` — это `#27AFCD` с opacity 20%, а `gray-900-70` — `#424242` с opacity 70%.

### Semantic Roles

*Цветовые роли интерфейса*

| Group | Purpose | Token families |
|---|---|---|
| General | Нейтральные surfaces, text, icons, borders и цвета клинических статусов | `color/general/{bg,text,icon,border}/*` |
| Accent | Основные интерактивные actions, links и их states | `color/accent/{bg,text,icon,border}/*` |
| Gender | Состояния профиля Male, Female и unselected | `color/gender/{bg,text,icon}/*` |
| Decorative | Размытые цветовые surfaces в headers и других визуальных акцентах | `color/decorative/bg/*` |
| Effects | Значения цвета, используемые настоящими Figma shadows | `color/effects/shadow/*` |

К ролям General относятся `default`, `secondary`, `muted`, `disabled`, `inverse`, `info`, `success`, `warning` и `critical`. Accent поддерживает основные и subtle interaction states: `default`, `default-hover`, `default-pressed`, `subtle-default`, `subtle-hover` и `subtle-pressed`.

## Layout

*Размеры и пространственный ритм*

### Column Grid

*Единая сетка для mobile и web*

В основе компоновки лежит одна растягиваемая колонка. Она адаптируется к доступной ширине поверхности, а внешний отступ контента сохраняется на уровне 24 px. Поэтому одна и та же сетка работает на мобильных и веб-экранах.

| Token | Value | Role |
| --- | ---: | --- |
| `grid/column/count` | 1 | Количество колонок |
| `grid/column/margin` | 24px | Внешний горизонтальный отступ |
| `grid/column/gutter` | 1px | Технический параметр grid |
| `grid/column/type` | Stretch | Поведение колонки по ширине |
| `grid/column/width` | Auto | Ширина колонки в Figma |
| `grid/column/color` | `#FF0000 @ 8%` | Служебный overlay сетки в Figma |

### Spacing

*Система отступов*

`spacing/0`, `spacing/4`, `spacing/8`, `spacing/12`, `spacing/16`, `spacing/20`, `spacing/24`, `spacing/28`, `spacing/32`, `spacing/36`, `spacing/40`, `spacing/44`, `spacing/48`.

### Radius

*Система скруглений*

`radius/0`, `radius/4`, `radius/8`, `radius/12`, `radius/16`, `radius/20`, `radius/24`, `radius/28`, `radius/32`, `radius/36`, `radius/40`, `radius/44`, `radius/48`, `radius/80`.

### Control Sizes

*Размеры элементов управления*

| Token | Value | Use |
|---|---:|---|
| `size/control/height-Lg` | 52px | Основные buttons и полноразмерные input controls |
| `size/control/height-Sm` | 32px | Компактные controls |
| `size/control/height-XSm` | 24px | Сверхкомпактные controls |

## Typography

*Типографическая система*

Основная гарнитура — **PT Sans**. В продуктовом тексте используются начертания Regular и Bold, минимальный размер 12 px и нулевой letter spacing.

### Display

*Крупные акцентные значения*

| Text style | Size / line height | Weight |
|---|---:|---|
| `text/display/sm` | 30 / 36 | Bold |

Используется для крупных числовых значений и контента display-масштаба в карточках.

### Title

*Заголовки*

| Text style | Size / line height | Weight |
|---|---:|---|
| `text/title/lg` | 24 / 32 | Bold |
| `text/title/md-caps` | 18 / 24 | Regular |
| `text/title/md-strong` | 18 / 24 | Bold |
| `text/title/xsm-strong` | 14 / 20 | Bold |

### Subtitle

*Подзаголовки*

| Text style | Size / line height | Weight |
|---|---:|---|
| `text/Subtitle/lg-strong` | 16 / 20 | Bold |

### Body

*Основной текст*

| Text style | Size / line height | Weight |
|---|---:|---|
| `text/body/xlg` | 18 / 24 | Regular |
| `text/body/xlg-strong` | 18 / 24 | Bold |
| `text/body/lg` | 16 / 24 | Regular |
| `text/body/lg-strong` | 16 / 24 | Bold |
| `text/body/md` | 14 / 20 | Regular |
| `text/body/md-strong` | 14 / 20 | Bold |

### Caption

*Вспомогательный текст*

| Text style | Size / line height | Weight |
|---|---:|---|
| `text/caption/caption` | 14 / 20 | Regular |
| `text/caption/caption-strong` | 14 / 20 | Bold |

## Effects

*Тени и декоративные эффекты*

| Effect style | Use |
|---|---|
| `effect/shadow/card` | Elevation для карточек |
| `effect/shadow/control` | Elevation для controls |
| `effect/shadow/bottom-sheet` | Elevation для bottom sheets |
| `effect/blur/decorative-md` | Средний decorative blur |
| `effect/blur/decorative-lg` | Большой decorative blur |

В decorative glows используются фигуры с заливкой и blur styles. Цвета теней хранятся в отдельной группе `color/effects/*`.

## Components

*Библиотека компонентов*

### Actions & Navigation

*Действия и навигация*

| Component | Description |
|---|---|
| `Button` | Основная action-кнопка с appearances Accent, Fill и Text; размерами Lg и Sm; states Default, Hover и Pressed/Active. |
| `IconButton` | Action-кнопка с иконкой, использующая ту же модель appearance и interaction. |
| `FAB` | Плавающая основная action. |
| `SendButton` | Компактная action для отправки сообщения. |
| `Head`, `HeadReport` | Общий header экрана и header экрана отчёта. |
| `HeaderProfile` | Header профиля с gender и scroll states. |
| `HeaderDiagnosis` | Header диагноза со states Open, Closed и Checking. |
| `Footer` | Footer продукта с точкой входа в Help / FAQ. |
| `Title`, `TitleLgCapsAction` | Образцы title и композиция title/action. |

### Inputs & Selection

*Ввод и выбор*

| Component | Description |
|---|---|
| `InputText` | Текстовое поле с properties label, description, required и value. |
| `InputSelect` | Поле выбора для контекстов Mobile и Web. |
| `InputSearch` | Поле поиска с опциональными cursor, microphone, control и risk indicator. |
| `InputCheckbox` | Checkbox со states Checked, Indeterminate и Unchecked. |
| `InputToggleSwitch` | Переключатель On/off. |
| `GenderSelector` | Control выбора Male, Female и NotChosen. |
| `GenderOptionMale`, `GenderOptionFemale` | Отдельные варианты выбора gender со states Default, Pressed и Toggled. |
| `DatePickerBoundary`, `DatePickerBoundaryItem` | Controls границ диапазона start/finish и ячейки дат. |
| `DatePickerStandard`, `DatePickerStandardItem` | Представления календаря и переиспользуемые ячейки дня, месяца и года. |

### Content, Feedback & Layout

*Контент, обратная связь и композиция*

| Component | Description |
|---|---|
| `CardProfile` | Карточка-сводка профиля с gender и press states. |
| `CardReport` | Карточка отчёта для контента типов default, analysis, medicine и bullet. |
| `ReportIndicatorRiskCard` | Индикатор отчёта со states neutral, summary, low-risk и high-risk. |
| `AvatarDiagnosis`, `AvatarProfile`, `AvatarProfileImages` | Композиции avatar для диагноза и профиля. |
| `RowDiagnosis`, `RowListItem`, `QueryResultRow` | Переиспользуемые строки диагноза, списка и результатов поиска. |
| `Progress`, `ProgressBullet` | Индикаторы прогресса Waiting, InProgress и Done. |
| `ChatBubble`, `ChatBubbleHeader` | Контейнер сообщения в диалоге и header участника. |
| `Dialog`, `BottomSheet`, `SwapArea` | Slot-based композиция modal и bottom-sheet. |
| `Toast` | Feedback-сообщение типов Neutral, Info, Warning и Critical. |
| `Scroll` | Горизонтальный или вертикальный scroll indicator. |

## Icons & Assets

*Иконки и графические материалы*

`Icon/Product/*` содержит navigation, status и action icons, включая AI camera и speech, arrows, chevrons, copy, history, iteration, risk, search и recycling actions.

Brand и вспомогательные assets организованы в группах `Asset/Logo/*`, `Asset/Tooltip` и `Asset/Animation/Chirp`.

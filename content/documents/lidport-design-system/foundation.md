# LIDPort Design System

Интерфейсная основа дилерского портала Lada Image: семантические цвета, размерные шкалы, типографика и компоненты.

Источник: [LIDPORT-DS](https://www.figma.com/design/IfUIEROTKbSr3LIfUh8wPx/LIDPORT-DS). Срез: 2026-11-16. Файл Figma не изменялся.

## Principles

Используйте экземпляры компонентов и предусмотренные свойства. Выбирайте семантические цвета по назначению и сохраняйте иерархию действий. Компоненты используют общие текстовые стили, семантические цветовые роли и размерные шкалы.

## Token architecture

`Primitives` содержит исходные значения; `Color`, `Dimensions` и `Typography` сохраняют ссылки на них. Имена и связи экспортируются без переименования. В `tokens.json` ссылки записаны как `{Collection.token.path}`; исходные Figma ID, тип и значения всех режимов сохранены в `$extensions`.

| Collection | Mode | Variables |
| --- | --- | ---: |
| Primitives | Value | 81 |
| Color | Light | 102 |
| Dimensions | Value | 42 |
| Typography | Value | 232 |

Всего: **457 переменных**.

## Typography

LADA Pragmatica используется для заголовков; Roboto Flex — для повседневной работы, кнопок и таблиц. Параметры ниже прочитаны из Text Styles Figma.

| Style | Family | Style | Size | Line height | Letter spacing |
| --- | --- | --- | ---: | ---: | ---: |
| `typography/heading/h1` | LADA Pragmatica | Bold | 32px | 32px | 0px |
| `typography/heading/h2` | LADA Pragmatica | Bold | 24px | 24px | 0px |
| `typography/heading/h3-bold` | LADA Pragmatica | Bold | 19px | 19px | 0px |
| `typography/heading/h3-regular` | LADA Pragmatica | Regular | 19px | 19px | 0px |
| `typography/heading/h4-single-line` | LADA Pragmatica | Bold | 16px | 16px | 0px |
| `typography/heading/h4-multiline` | LADA Pragmatica | Bold | 16px | 21.600000381469727px | 0px |
| `typography/heading/h5` | LADA Pragmatica | Bold | 14px | 14px | 0px |
| `typography/body/16-regular` | Roboto Flex | Regular | 16px | 24px | 0px |
| `typography/body/16-medium` | Roboto Flex | Medium | 16px | 24px | 0px |
| `typography/body/14-regular` | Roboto Flex | Regular | 14px | 19.600000381469727px | 0px |
| `typography/body/14-medium` | Roboto Flex | Medium | 14px | 19.600000381469727px | 0px |
| `typography/body/12-regular` | Roboto Flex | Regular | 12px | 16.799999237060547px | 0px |
| `typography/button/40` | Roboto Flex | Medium | 16px | 16px | 0px |
| `typography/button/toolbar` | Roboto Flex | Medium | 12px | 12px | 0px |
| `typography/button/24` | Roboto Flex | Medium | 12px | 15.600000381469727px | 0px |
| `typography/table/header` | Roboto Flex | Medium | 14px | 14px | 0.20999999344348907px |
| `typography/table/header-total` | Roboto Flex | SemiBold | 14px | 14px | 0.20999999344348907px |
| `typography/table/body` | Roboto Flex | Regular | 14px | 14px | 0.20999999344348907px |
| `typography/table/body-total` | Roboto Flex | SemiBold | 14px | 14px | 0.20999999344348907px |

## Grid

### Desktop

```json
[
  {
    "pattern": "COLUMNS",
    "visible": true,
    "color": {
      "r": 0.47058823704719543,
      "g": 0.47058823704719543,
      "b": 0.47058823704719543,
      "a": 0.20000000298023224
    },
    "gutterSize": 20,
    "alignment": "STRETCH",
    "count": 12,
    "offset": 0,
    "boundVariables": {}
  }
]
```

### Mobile

```json
[
  {
    "pattern": "COLUMNS",
    "visible": true,
    "color": {
      "r": 0.47058823704719543,
      "g": 0.47058823704719543,
      "b": 0.47058823704719543,
      "a": 0.20000000298023224
    },
    "gutterSize": 20,
    "alignment": "STRETCH",
    "count": 1,
    "offset": 0,
    "boundVariables": {}
  }
]
```

## Effects

### effect/elevation/overlay

```json
[
  {
    "type": "DROP_SHADOW",
    "visible": true,
    "radius": 24,
    "boundVariables": {},
    "color": {
      "r": 0.6653157472610474,
      "g": 0.6653157472610474,
      "b": 0.6653157472610474,
      "a": 0.11999999731779099
    },
    "offset": {
      "x": 1,
      "y": 4
    },
    "spread": 0,
    "blendMode": "NORMAL",
    "showShadowBehindNode": false
  },
  {
    "type": "DROP_SHADOW",
    "visible": true,
    "radius": 12,
    "boundVariables": {},
    "color": {
      "r": 0,
      "g": 0,
      "b": 0,
      "a": 0.05000000074505806
    },
    "offset": {
      "x": 2,
      "y": 4
    },
    "spread": 0,
    "blendMode": "NORMAL",
    "showShadowBehindNode": false
  }
]
```

## Primitives

| Token | Type | Value / alias |
| --- | --- | --- |
| `color/palette/neutral/950` | COLOR | `color(srgb 0.10588235408067703 0.10588235408067703 0.10588235408067703 / 1)` |
| `color/palette/neutral/700` | COLOR | `color(srgb 0.30000001192092896 0.30000001192092896 0.30000001192092896 / 1)` |
| `color/palette/neutral/0` | COLOR | `color(srgb 1 1 1 / 1)` |
| `color/palette/slate/700` | COLOR | `color(srgb 0.3019607961177826 0.3490196168422699 0.3921568691730499 / 1)` |
| `color/palette/slate/400` | COLOR | `color(srgb 0.6470588445663452 0.6784313917160034 0.7137255072593689 / 1)` |
| `color/palette/neutral/300` | COLOR | `color(srgb 0.8156862854957581 0.8235294222831726 0.8274509906768799 / 1)` |
| `color/palette/slate/200` | COLOR | `color(srgb 0.8666666746139526 0.8784313797950745 0.8901960849761963 / 1)` |
| `color/palette/slate/100` | COLOR | `color(srgb 0.9137254953384399 0.9215686321258545 0.929411768913269 / 1)` |
| `color/palette/lime/400` | COLOR | `color(srgb 0.772549033164978 0.8549019694328308 0.5058823823928833 / 1)` |
| `color/palette/lime/100` | COLOR | `color(srgb 0.8941176533699036 0.9333333373069763 0.7686274647712708 / 1)` |
| `color/palette/red/500` | COLOR | `color(srgb 0.9372549057006836 0.42352941632270813 0.42352941632270813 / 1)` |
| `color/palette/red/100` | COLOR | `color(srgb 0.9647058844566345 0.7490196228027344 0.7333333492279053 / 1)` |
| `color/palette/amber/400` | COLOR | `color(srgb 1 0.8117647171020508 0.47843137383461 / 1)` |
| `color/palette/amber/100` | COLOR | `color(srgb 1 0.9215686321258545 0.7803921699523926 / 1)` |
| `color/palette/blue/400` | COLOR | `color(srgb 0.5058823823928833 0.6431372761726379 0.9333333373069763 / 1)` |
| `color/palette/blue/50` | COLOR | `color(srgb 0.8941176533699036 0.9215686321258545 0.9843137264251709 / 1)` |
| `color/palette/blue/700` | COLOR | `color(srgb 0.09803921729326248 0.3019607961177826 0.7372549176216125 / 1)` |
| `color/palette/violet/700` | COLOR | `color(srgb 0.37254902720451355 0.13333334028720856 0.7254902124404907 / 1)` |
| `color/palette/neutral/900` | COLOR | `color(srgb 0.10999999940395355 0.10999999940395355 0.10999999940395355 / 1)` |
| `color/palette/neutral/1000-a0` | COLOR | `color(srgb 0 0 0 / 0)` |
| `color/palette/slate/300` | COLOR | `color(srgb 0.7520879507064819 0.762637197971344 0.7679120898246765 / 1)` |
| `color/palette/orange/100` | COLOR | `color(srgb 1 0.8399999737739563 0.699999988079071 / 1)` |
| `color/palette/neutral/800` | COLOR | `color(srgb 0.20000000298023224 0.20000000298023224 0.20000000298023224 / 1)` |
| `color/palette/orange/50` | COLOR | `color(srgb 1 0.9539999961853027 0.8799999952316284 / 1)` |
| `number/shared/0` | FLOAT | `0` |
| `number/shared/1` | FLOAT | `1` |
| `number/shared/2` | FLOAT | `2` |
| `number/dimension/4` | FLOAT | `4` |
| `number/geometry/brand/spacing/5` | FLOAT | `5` |
| `number/dimension/8` | FLOAT | `8` |
| `number/geometry/brand/spacing/10` | FLOAT | `10` |
| `number/shared/12` | FLOAT | `12` |
| `number/typography/font-size-line-height/14` | FLOAT | `14` |
| `number/shared/16` | FLOAT | `16` |
| `number/shared/20` | FLOAT | `20` |
| `number/typography/font-size-line-height/21` | FLOAT | `21` |
| `number/shared/24` | FLOAT | `24` |
| `number/dimension/28` | FLOAT | `28` |
| `number/shared/32` | FLOAT | `32` |
| `number/dimension/40` | FLOAT | `40` |
| `number/dimension/48` | FLOAT | `48` |
| `number/border/3` | FLOAT | `3` |
| `number/radius/1000` | FLOAT | `1000` |
| `number/size/36` | FLOAT | `36` |
| `number/size/56` | FLOAT | `56` |
| `number/size/60` | FLOAT | `60` |
| `number/size/64` | FLOAT | `64` |
| `number/size/68` | FLOAT | `68` |
| `number/border/0-5` | FLOAT | `0.5` |
| `number/border/2-5` | FLOAT | `2.5` |
| `color/palette/orange/700` | COLOR | `color(srgb 0.7254902124404907 0.27450981736183167 0.03921568766236305 / 1)` |
| `color/palette/orange/800` | COLOR | `color(srgb 0.6470588445663452 0.239215686917305 0.0313725508749485 / 1)` |
| `color/palette/neutral/1000` | COLOR | `color(srgb 0 0 0 / 1)` |
| `color/palette/neutral/100` | COLOR | `color(srgb 0.9215686321258545 0.9215686321258545 0.9215686321258545 / 1)` |
| `color/palette/slate/900` | COLOR | `color(srgb 0.0784313753247261 0.10588235408067703 0.20392157137393951 / 1)` |
| `color/palette/neutral/200` | COLOR | `color(srgb 0.8509804010391235 0.8509804010391235 0.8509804010391235 / 1)` |
| `color/palette/red/700` | COLOR | `color(srgb 0.843137264251709 0.0313725508749485 0.0313725508749485 / 1)` |
| `color/palette/neutral/0-a80` | COLOR | `color(srgb 1 1 1 / 0.800000011920929)` |
| `color/palette/neutral/950-a30` | COLOR | `color(srgb 0.10588235408067703 0.10588235408067703 0.10588235408067703 / 0.30000001192092896)` |
| `color/palette/neutral/950-a50` | COLOR | `color(srgb 0.10588235408067703 0.10588235408067703 0.10588235408067703 / 0.5)` |
| `color/palette/red/400` | COLOR | `color(srgb 0.949999988079071 0.43145832419395447 0.43145832419395447 / 1)` |
| `typography/family/lada-pragmatica` | STRING | `LADA Pragmatica` |
| `number/typography/font-weight/700` | FLOAT | `700` |
| `number/typography/font-size-line-height/19` | FLOAT | `19` |
| `number/typography/font-weight/400` | FLOAT | `400` |
| `number/typography/line-height/21-6` | FLOAT | `21.600000381469727` |
| `typography/family/roboto-flex` | STRING | `Roboto Flex` |
| `number/typography/font-weight/500` | FLOAT | `500` |
| `number/typography/line-height/19-6` | FLOAT | `19.600000381469727` |
| `number/typography/line-height/16-8` | FLOAT | `16.799999237060547` |
| `number/typography/line-height/15-6` | FLOAT | `15.600000381469727` |
| `number/typography/letter-spacing/0-21` | FLOAT | `0.20999999344348907` |
| `number/typography/font-weight/600` | FLOAT | `600` |
| `number/typography/font-weight/541` | FLOAT | `541` |
| `number/typography/letter-spacing/0-16` | FLOAT | `0.1599999964237213` |
| `number/typography/letter-spacing/0-8` | FLOAT | `0.800000011920929` |
| `number/typography/font-size-line-height/18` | FLOAT | `18` |
| `number/typography/line-height/22` | FLOAT | `22` |
| `color/palette/slate/600` | COLOR | `color(srgb 0.3764705955982208 0.41960784792900085 0.4588235318660736 / 1)` |
| `color/palette/slate/500` | COLOR | `color(srgb 0.47843137383461 0.5176470875740051 0.5529412031173706 / 1)` |
| `color/palette/slate/50` | COLOR | `color(srgb 0.95686274766922 0.9607843160629272 0.9647058844566345 / 1)` |

## Color

| Token | Type | Value / alias |
| --- | --- | --- |
| `color/side-menu/text/default` | COLOR | `{Primitives.color.palette.slate.700}` |
| `color/side-menu/text/hover` | COLOR | `{Primitives.color.palette.neutral.700}` |
| `color/side-menu/text/active` | COLOR | `{Primitives.color.palette.neutral.950}` |
| `color/side-menu/text/disabled` | COLOR | `{Primitives.color.palette.slate.400}` |
| `color/side-menu/icon/default` | COLOR | `{Primitives.color.palette.slate.600}` |
| `color/side-menu/icon/hover` | COLOR | `{Primitives.color.palette.slate.700}` |
| `color/side-menu/icon/active` | COLOR | `{Primitives.color.palette.neutral.950}` |
| `color/side-menu/icon/disabled` | COLOR | `{Primitives.color.palette.neutral.300}` |
| `color/side-menu/background/default` | COLOR | `{Primitives.color.palette.slate.50}` |
| `color/text/primary` | COLOR | `{Primitives.color.palette.neutral.950}` |
| `color/text/inverse` | COLOR | `{Primitives.color.palette.neutral.0}` |
| `color/text/secondary` | COLOR | `{Primitives.color.palette.slate.700}` |
| `color/text/disabled` | COLOR | `{Primitives.color.palette.slate.400}` |
| `color/text/placeholder` | COLOR | `{Primitives.color.palette.slate.600}` |
| `color/status/neutral/default` | COLOR | `{Primitives.color.palette.slate.200}` |
| `color/status/neutral/subtle` | COLOR | `{Primitives.color.palette.slate.100}` |
| `color/status/positive/default` | COLOR | `{Primitives.color.palette.lime.400}` |
| `color/status/positive/subtle` | COLOR | `{Primitives.color.palette.lime.100}` |
| `color/status/negative/default` | COLOR | `{Primitives.color.palette.red.500}` |
| `color/status/negative/subtle` | COLOR | `{Primitives.color.palette.red.100}` |
| `color/status/warning/default` | COLOR | `{Primitives.color.palette.amber.400}` |
| `color/status/warning/subtle` | COLOR | `{Primitives.color.palette.amber.100}` |
| `color/status/info/default` | COLOR | `{Primitives.color.palette.blue.400}` |
| `color/status/info/subtle` | COLOR | `{Primitives.color.palette.blue.50}` |
| `color/link/default` | COLOR | `{Primitives.color.palette.blue.700}` |
| `color/link/hover` | COLOR | `{Primitives.color.palette.blue.700}` |
| `color/link/active` | COLOR | `{Primitives.color.palette.blue.700}` |
| `color/link/visited` | COLOR | `{Primitives.color.palette.violet.700}` |
| `color/background/default` | COLOR | `{Primitives.color.palette.neutral.0}` |
| `color/background/subtle` | COLOR | `{Primitives.color.palette.slate.50}` |
| `color/button/accent-neutral/background/default` | COLOR | `{Primitives.color.palette.neutral.900}` |
| `color/button/accent-neutral/background/hover` | COLOR | `{Primitives.color.palette.neutral.700}` |
| `color/button/accent-neutral/background/active` | COLOR | `{Primitives.color.palette.neutral.950}` |
| `color/button/accent-neutral/background/disabled` | COLOR | `{Primitives.color.palette.slate.50}` |
| `color/button/regular/background/default` | COLOR | `{Primitives.color.palette.slate.50}` |
| `color/button/regular/background/hover` | COLOR | `{Primitives.color.palette.slate.100}` |
| `color/button/regular/background/active` | COLOR | `{Primitives.color.palette.neutral.900}` |
| `color/button/regular/background/disabled` | COLOR | `{Primitives.color.palette.slate.50}` |
| `color/button/text/background/default` | COLOR | `{Primitives.color.palette.neutral.1000-a0}` |
| `color/button/text/background/hover` | COLOR | `{Primitives.color.palette.slate.100}` |
| `color/button/text/background/active` | COLOR | `{Primitives.color.palette.neutral.900}` |
| `color/button/text/background/disabled` | COLOR | `{Primitives.color.palette.neutral.1000-a0}` |
| `color/button/toolbar/background/default` | COLOR | `{Primitives.color.palette.neutral.1000-a0}` |
| `color/button/toolbar/background/hover` | COLOR | `{Primitives.color.palette.slate.100}` |
| `color/button/toolbar/background/active` | COLOR | `{Primitives.color.palette.slate.200}` |
| `color/button/toolbar/background/disabled` | COLOR | `{Primitives.color.palette.neutral.1000-a0}` |
| `color/button/toolbar/text/disabled` | COLOR | `{Primitives.color.palette.slate.400}` |
| `color/button/toolbar/text/default` | COLOR | `{Primitives.color.palette.neutral.900}` |
| `color/border/default` | COLOR | `{Primitives.color.palette.slate.500}` |
| `color/border/inverse` | COLOR | `{Primitives.color.palette.neutral.0-a80}` |
| `color/border/hover` | COLOR | `{Primitives.color.palette.slate.600}` |
| `color/border/active` | COLOR | `{Primitives.color.palette.slate.700}` |
| `color/border/disabled` | COLOR | `{Primitives.color.palette.neutral.1000-a0}` |
| `color/tooltip/background/default` | COLOR | `{Primitives.color.palette.neutral.950}` |
| `color/focus/ring` | COLOR | `{Primitives.color.palette.orange.700}` |
| `color/icon/default` | COLOR | `{Primitives.color.palette.slate.600}` |
| `color/selection/default` | COLOR | `{Primitives.color.palette.neutral.950}` |
| `color/selection/hover` | COLOR | `{Primitives.color.palette.neutral.800}` |
| `color/selection/active` | COLOR | `{Primitives.color.palette.neutral.950}` |
| `color/selection/disabled` | COLOR | `{Primitives.color.palette.slate.100}` |
| `color/dropdown/row/background/default` | COLOR | `{Primitives.color.palette.neutral.1000-a0}` |
| `color/dropdown/row/background/hover` | COLOR | `{Primitives.color.palette.slate.50}` |
| `color/dropdown/row/background/active` | COLOR | `{Primitives.color.palette.neutral.1000-a0}` |
| `color/scroll/thumb/default` | COLOR | `{Primitives.color.palette.slate.600}` |
| `color/scroll/thumb/hover` | COLOR | `{Primitives.color.palette.slate.700}` |
| `color/scroll/thumb/active` | COLOR | `{Primitives.color.palette.neutral.950}` |
| `color/table/row/background/header` | COLOR | `{Primitives.color.palette.slate.50}` |
| `color/table/row/background/default` | COLOR | `{Primitives.color.palette.neutral.1000-a0}` |
| `color/table/row/background/hover` | COLOR | `{Primitives.color.palette.orange.50}` |
| `color/table/row/background/active` | COLOR | `{Primitives.color.palette.orange.50}` |
| `color/icon/control` | COLOR | `{Primitives.color.palette.slate.700}` |
| `color/button/accent-brand/background/default` | COLOR | `{Primitives.color.palette.orange.700}` |
| `color/button/accent-brand/background/active` | COLOR | `{Primitives.color.palette.orange.700}` |
| `color/button/accent-brand/background/hover` | COLOR | `{Primitives.color.palette.orange.800}` |
| `color/button/accent-brand/background/disabled` | COLOR | `{Primitives.color.palette.slate.50}` |
| `color/button/text/default` | COLOR | `{Primitives.color.palette.neutral.950}` |
| `color/button/icon/default` | COLOR | `{Primitives.color.palette.neutral.950}` |
| `color/button/text/inverse` | COLOR | `{Primitives.color.palette.neutral.0}` |
| `color/button/icon/inverse` | COLOR | `{Primitives.color.palette.neutral.0}` |
| `color/button/text/disabled` | COLOR | `{Primitives.color.palette.slate.400}` |
| `color/button/icon/disabled` | COLOR | `{Primitives.color.palette.slate.400}` |
| `color/control/track/on/default` | COLOR | `{Primitives.color.palette.neutral.950}` |
| `color/control/track/off/default` | COLOR | `{Primitives.color.palette.slate.500}` |
| `color/control/track/on/hover` | COLOR | `{Primitives.color.palette.neutral.800}` |
| `color/control/track/off/hover` | COLOR | `{Primitives.color.palette.slate.600}` |
| `color/control/track/on/active` | COLOR | `{Primitives.color.palette.neutral.950}` |
| `color/control/track/off/active` | COLOR | `{Primitives.color.palette.slate.700}` |
| `color/control/track/on/disabled` | COLOR | `{Primitives.color.palette.slate.100}` |
| `color/control/track/off/disabled` | COLOR | `{Primitives.color.palette.slate.100}` |
| `color/control/indicator/default` | COLOR | `{Primitives.color.palette.neutral.0}` |
| `color/control/indicator/disabled` | COLOR | `{Primitives.color.palette.slate.400}` |
| `color/text/strong` | COLOR | `{Primitives.color.palette.neutral.1000}` |
| `color/border/subtle` | COLOR | `{Primitives.color.palette.neutral.100}` |
| `color/icon/ink` | COLOR | `{Primitives.color.palette.slate.900}` |
| `color/icon/muted` | COLOR | `{Primitives.color.palette.neutral.200}` |
| `color/icon/strong` | COLOR | `{Primitives.color.palette.neutral.1000}` |
| `color/icon/negative` | COLOR | `{Primitives.color.palette.red.700}` |
| `color/brand/logo/accent` | COLOR | `{Primitives.color.palette.red.400}` |
| `color/brand/logo/ink` | COLOR | `{Primitives.color.palette.neutral.1000}` |
| `color/text/negative` | COLOR | `{Primitives.color.palette.red.700}` |
| `color/border/negative` | COLOR | `{Primitives.color.palette.red.700}` |
| `color/selection/text/background` | COLOR | `{Primitives.color.palette.orange.100}` |

## Dimensions

| Token | Type | Value / alias |
| --- | --- | --- |
| `spacing/0` | FLOAT | `{Primitives.number.shared.0}` |
| `spacing/4` | FLOAT | `{Primitives.number.dimension.4}` |
| `spacing/8` | FLOAT | `{Primitives.number.dimension.8}` |
| `spacing/12` | FLOAT | `{Primitives.number.shared.12}` |
| `spacing/16` | FLOAT | `{Primitives.number.shared.16}` |
| `spacing/20` | FLOAT | `{Primitives.number.shared.20}` |
| `spacing/24` | FLOAT | `{Primitives.number.shared.24}` |
| `spacing/28` | FLOAT | `{Primitives.number.dimension.28}` |
| `spacing/32` | FLOAT | `{Primitives.number.shared.32}` |
| `spacing/40` | FLOAT | `{Primitives.number.dimension.40}` |
| `spacing/48` | FLOAT | `{Primitives.number.dimension.48}` |
| `radius/0` | FLOAT | `{Primitives.number.shared.0}` |
| `radius/4` | FLOAT | `{Primitives.number.dimension.4}` |
| `radius/8` | FLOAT | `{Primitives.number.dimension.8}` |
| `radius/12` | FLOAT | `{Primitives.number.shared.12}` |
| `radius/16` | FLOAT | `{Primitives.number.shared.16}` |
| `radius/full` | FLOAT | `{Primitives.number.radius.1000}` |
| `size/8` | FLOAT | `{Primitives.number.dimension.8}` |
| `size/16` | FLOAT | `{Primitives.number.shared.16}` |
| `size/20` | FLOAT | `{Primitives.number.shared.20}` |
| `size/24` | FLOAT | `{Primitives.number.shared.24}` |
| `size/28` | FLOAT | `{Primitives.number.dimension.28}` |
| `size/32` | FLOAT | `{Primitives.number.shared.32}` |
| `size/36` | FLOAT | `{Primitives.number.size.36}` |
| `size/40` | FLOAT | `{Primitives.number.dimension.40}` |
| `size/48` | FLOAT | `{Primitives.number.dimension.48}` |
| `size/56` | FLOAT | `{Primitives.number.size.56}` |
| `size/60` | FLOAT | `{Primitives.number.size.60}` |
| `size/64` | FLOAT | `{Primitives.number.size.64}` |
| `size/68` | FLOAT | `{Primitives.number.size.68}` |
| `border/0` | FLOAT | `{Primitives.number.shared.0}` |
| `border/0-5` | FLOAT | `{Primitives.number.border.0-5}` |
| `border/1` | FLOAT | `{Primitives.number.shared.1}` |
| `border/2` | FLOAT | `{Primitives.number.shared.2}` |
| `border/2-5` | FLOAT | `{Primitives.number.border.2-5}` |
| `border/3` | FLOAT | `{Primitives.number.border.3}` |
| `geometry/brand/spacing/5` | FLOAT | `{Primitives.number.geometry.brand.spacing.5}` |
| `geometry/brand/spacing/10` | FLOAT | `{Primitives.number.geometry.brand.spacing.10}` |
| `geometry/brand/spacing/2` | FLOAT | `{Primitives.number.shared.2}` |
| `geometry/brand/spacing/1` | FLOAT | `{Primitives.number.shared.1}` |
| `geometry/icon/radius/1` | FLOAT | `{Primitives.number.shared.1}` |
| `size/12` | FLOAT | `{Primitives.number.shared.12}` |

## Typography

| Token | Type | Value / alias |
| --- | --- | --- |
| `typography/heading/h1/font-family` | STRING | `{Primitives.typography.family.lada-pragmatica}` |
| `typography/heading/h1/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.700}` |
| `typography/heading/h1/font-size` | FLOAT | `{Primitives.number.shared.32}` |
| `typography/heading/h1/line-height` | FLOAT | `{Primitives.number.shared.32}` |
| `typography/heading/h1/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/heading/h1/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/heading/h1/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/heading/h2/font-family` | STRING | `{Primitives.typography.family.lada-pragmatica}` |
| `typography/heading/h2/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.700}` |
| `typography/heading/h2/font-size` | FLOAT | `{Primitives.number.shared.24}` |
| `typography/heading/h2/line-height` | FLOAT | `{Primitives.number.shared.24}` |
| `typography/heading/h2/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/heading/h2/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/heading/h2/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/heading/h3-bold/font-family` | STRING | `{Primitives.typography.family.lada-pragmatica}` |
| `typography/heading/h3-bold/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.700}` |
| `typography/heading/h3-bold/font-size` | FLOAT | `{Primitives.number.typography.font-size-line-height.19}` |
| `typography/heading/h3-bold/line-height` | FLOAT | `{Primitives.number.typography.font-size-line-height.19}` |
| `typography/heading/h3-bold/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/heading/h3-bold/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/heading/h3-bold/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/heading/h3-regular/font-family` | STRING | `{Primitives.typography.family.lada-pragmatica}` |
| `typography/heading/h3-regular/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.400}` |
| `typography/heading/h3-regular/font-size` | FLOAT | `{Primitives.number.typography.font-size-line-height.19}` |
| `typography/heading/h3-regular/line-height` | FLOAT | `{Primitives.number.typography.font-size-line-height.19}` |
| `typography/heading/h3-regular/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/heading/h3-regular/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/heading/h3-regular/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/heading/h4-single-line/font-family` | STRING | `{Primitives.typography.family.lada-pragmatica}` |
| `typography/heading/h4-single-line/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.700}` |
| `typography/heading/h4-single-line/font-size` | FLOAT | `{Primitives.number.shared.16}` |
| `typography/heading/h4-single-line/line-height` | FLOAT | `{Primitives.number.shared.16}` |
| `typography/heading/h4-single-line/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/heading/h4-single-line/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/heading/h4-single-line/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/heading/h4-multiline/font-family` | STRING | `{Primitives.typography.family.lada-pragmatica}` |
| `typography/heading/h4-multiline/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.700}` |
| `typography/heading/h4-multiline/font-size` | FLOAT | `{Primitives.number.shared.16}` |
| `typography/heading/h4-multiline/line-height` | FLOAT | `{Primitives.number.typography.line-height.21-6}` |
| `typography/heading/h4-multiline/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/heading/h4-multiline/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/heading/h4-multiline/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/heading/h5/font-family` | STRING | `{Primitives.typography.family.lada-pragmatica}` |
| `typography/heading/h5/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.700}` |
| `typography/heading/h5/font-size` | FLOAT | `{Primitives.number.typography.font-size-line-height.14}` |
| `typography/heading/h5/line-height` | FLOAT | `{Primitives.number.typography.font-size-line-height.14}` |
| `typography/heading/h5/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/heading/h5/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/heading/h5/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/body/16-regular/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/body/16-regular/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.400}` |
| `typography/body/16-regular/font-size` | FLOAT | `{Primitives.number.shared.16}` |
| `typography/body/16-regular/line-height` | FLOAT | `{Primitives.number.shared.24}` |
| `typography/body/16-regular/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/body/16-regular/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/body/16-regular/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/body/16-medium/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/body/16-medium/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.500}` |
| `typography/body/16-medium/font-size` | FLOAT | `{Primitives.number.shared.16}` |
| `typography/body/16-medium/line-height` | FLOAT | `{Primitives.number.shared.24}` |
| `typography/body/16-medium/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/body/16-medium/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/body/16-medium/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/body/14-regular/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/body/14-regular/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.400}` |
| `typography/body/14-regular/font-size` | FLOAT | `{Primitives.number.typography.font-size-line-height.14}` |
| `typography/body/14-regular/line-height` | FLOAT | `{Primitives.number.typography.line-height.19-6}` |
| `typography/body/14-regular/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/body/14-regular/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/body/14-regular/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/body/14-medium/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/body/14-medium/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.500}` |
| `typography/body/14-medium/font-size` | FLOAT | `{Primitives.number.typography.font-size-line-height.14}` |
| `typography/body/14-medium/line-height` | FLOAT | `{Primitives.number.typography.line-height.19-6}` |
| `typography/body/14-medium/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/body/14-medium/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/body/14-medium/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/body/12-regular/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/body/12-regular/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.400}` |
| `typography/body/12-regular/font-size` | FLOAT | `{Primitives.number.shared.12}` |
| `typography/body/12-regular/line-height` | FLOAT | `{Primitives.number.typography.line-height.16-8}` |
| `typography/body/12-regular/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/body/12-regular/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/body/12-regular/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/button/40/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/button/40/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.500}` |
| `typography/button/40/font-size` | FLOAT | `{Primitives.number.shared.16}` |
| `typography/button/40/line-height` | FLOAT | `{Primitives.number.shared.16}` |
| `typography/button/40/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/button/40/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/button/40/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/button/toolbar/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/button/toolbar/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.500}` |
| `typography/button/toolbar/font-size` | FLOAT | `{Primitives.number.shared.12}` |
| `typography/button/toolbar/line-height` | FLOAT | `{Primitives.number.shared.12}` |
| `typography/button/toolbar/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/button/toolbar/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/button/toolbar/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/button/24/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/button/24/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.500}` |
| `typography/button/24/font-size` | FLOAT | `{Primitives.number.shared.12}` |
| `typography/button/24/line-height` | FLOAT | `{Primitives.number.typography.line-height.15-6}` |
| `typography/button/24/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/button/24/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/button/24/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/header/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/table/header/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.500}` |
| `typography/table/header/font-size` | FLOAT | `{Primitives.number.typography.font-size-line-height.14}` |
| `typography/table/header/line-height` | FLOAT | `{Primitives.number.typography.font-size-line-height.14}` |
| `typography/table/header/letter-spacing` | FLOAT | `{Primitives.number.typography.letter-spacing.0-21}` |
| `typography/table/header/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/header/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/header-total/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/table/header-total/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.600}` |
| `typography/table/header-total/font-size` | FLOAT | `{Primitives.number.typography.font-size-line-height.14}` |
| `typography/table/header-total/line-height` | FLOAT | `{Primitives.number.typography.font-size-line-height.14}` |
| `typography/table/header-total/letter-spacing` | FLOAT | `{Primitives.number.typography.letter-spacing.0-21}` |
| `typography/table/header-total/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/header-total/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/body/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/table/body/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.400}` |
| `typography/table/body/font-size` | FLOAT | `{Primitives.number.typography.font-size-line-height.14}` |
| `typography/table/body/line-height` | FLOAT | `{Primitives.number.typography.font-size-line-height.14}` |
| `typography/table/body/letter-spacing` | FLOAT | `{Primitives.number.typography.letter-spacing.0-21}` |
| `typography/table/body/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/body/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/body-total/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/table/body-total/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.600}` |
| `typography/table/body-total/font-size` | FLOAT | `{Primitives.number.typography.font-size-line-height.14}` |
| `typography/table/body-total/line-height` | FLOAT | `{Primitives.number.typography.font-size-line-height.14}` |
| `typography/table/body-total/letter-spacing` | FLOAT | `{Primitives.number.typography.letter-spacing.0-21}` |
| `typography/table/body-total/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/body-total/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/navigation/item/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/navigation/item/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.500}` |
| `typography/navigation/item/font-size` | FLOAT | `{Primitives.number.shared.16}` |
| `typography/navigation/item/line-height` | FLOAT | `{Primitives.number.shared.20}` |
| `typography/navigation/item/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/navigation/item/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/navigation/item/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/brand/wordmark-large/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/brand/wordmark-large/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.541}` |
| `typography/brand/wordmark-large/font-size` | FLOAT | `{Primitives.number.typography.font-size-line-height.21}` |
| `typography/brand/wordmark-large/line-height` | FLOAT | `{Primitives.number.typography.font-size-line-height.21}` |
| `typography/brand/wordmark-large/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/brand/wordmark-large/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/brand/wordmark-large/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/brand/wordmark-compact/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/brand/wordmark-compact/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.400}` |
| `typography/brand/wordmark-compact/font-size` | FLOAT | `{Primitives.number.shared.16}` |
| `typography/brand/wordmark-compact/line-height` | FLOAT | `{Primitives.number.shared.16}` |
| `typography/brand/wordmark-compact/tracking-regular/letter-spacing` | FLOAT | `{Primitives.number.typography.letter-spacing.0-16}` |
| `typography/brand/wordmark-compact/tracking-expanded/letter-spacing` | FLOAT | `{Primitives.number.typography.letter-spacing.0-8}` |
| `typography/brand/wordmark-compact/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/brand/wordmark-compact/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/badge/count-32/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/badge/count-32/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.500}` |
| `typography/badge/count-32/font-size` | FLOAT | `{Primitives.number.typography.font-size-line-height.18}` |
| `typography/badge/count-32/line-height` | FLOAT | `{Primitives.number.shared.24}` |
| `typography/badge/count-32/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/badge/count-32/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/badge/count-32/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/badge/count-24/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/badge/count-24/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.500}` |
| `typography/badge/count-24/font-size` | FLOAT | `{Primitives.number.typography.font-size-line-height.14}` |
| `typography/badge/count-24/line-height` | FLOAT | `{Primitives.number.typography.font-size-line-height.18}` |
| `typography/badge/count-24/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/badge/count-24/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/badge/count-24/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/badge/count-16/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/badge/count-16/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.500}` |
| `typography/badge/count-16/font-size` | FLOAT | `{Primitives.number.shared.12}` |
| `typography/badge/count-16/line-height` | FLOAT | `{Primitives.number.shared.16}` |
| `typography/badge/count-16/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/badge/count-16/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/badge/count-16/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/menu/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/table/menu/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.400}` |
| `typography/table/menu/font-size` | FLOAT | `{Primitives.number.shared.12}` |
| `typography/table/menu/line-height` | FLOAT | `{Primitives.number.shared.16}` |
| `typography/table/menu/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/menu/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/menu/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/menu-item/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/table/menu-item/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.400}` |
| `typography/table/menu-item/font-size` | FLOAT | `{Primitives.number.typography.font-size-line-height.14}` |
| `typography/table/menu-item/line-height` | FLOAT | `{Primitives.number.shared.20}` |
| `typography/table/menu-item/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/menu-item/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/menu-item/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/select-value/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/table/select-value/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.400}` |
| `typography/table/select-value/font-size` | FLOAT | `{Primitives.number.shared.16}` |
| `typography/table/select-value/line-height` | FLOAT | `{Primitives.number.shared.24}` |
| `typography/table/select-value/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/select-value/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/select-value/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/filter-label/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/table/filter-label/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.400}` |
| `typography/table/filter-label/font-size` | FLOAT | `{Primitives.number.shared.16}` |
| `typography/table/filter-label/line-height` | FLOAT | `{Primitives.number.typography.line-height.22}` |
| `typography/table/filter-label/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/filter-label/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/filter-label/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/action-small/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/table/action-small/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.500}` |
| `typography/table/action-small/font-size` | FLOAT | `{Primitives.number.shared.12}` |
| `typography/table/action-small/line-height` | FLOAT | `{Primitives.number.shared.16}` |
| `typography/table/action-small/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/action-small/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/action-small/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/action/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/table/action/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.500}` |
| `typography/table/action/font-size` | FLOAT | `{Primitives.number.shared.16}` |
| `typography/table/action/line-height` | FLOAT | `{Primitives.number.shared.20}` |
| `typography/table/action/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/action/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/action/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/input-value/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/table/input-value/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.400}` |
| `typography/table/input-value/font-size` | FLOAT | `{Primitives.number.shared.16}` |
| `typography/table/input-value/line-height` | FLOAT | `{Primitives.number.typography.line-height.22}` |
| `typography/table/input-value/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/input-value/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/table/input-value/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/documentation/placeholder/font-family` | STRING | `{Primitives.typography.family.roboto-flex}` |
| `typography/documentation/placeholder/font-weight` | FLOAT | `{Primitives.number.typography.font-weight.500}` |
| `typography/documentation/placeholder/font-size` | FLOAT | `{Primitives.number.typography.font-size-line-height.18}` |
| `typography/documentation/placeholder/line-height` | FLOAT | `{Primitives.number.shared.24}` |
| `typography/documentation/placeholder/letter-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/documentation/placeholder/paragraph-spacing` | FLOAT | `{Primitives.number.shared.0}` |
| `typography/documentation/placeholder/paragraph-indent` | FLOAT | `{Primitives.number.shared.0}` |

## Use

Цвета выбираются по семантическим ролям из `Color`, размеры — из `Dimensions`, типографика — из `Typography`. Примитивы служат значениями реализации. Не заменяйте ссылки на примитивы копиями значений: это разрывает связь системы.

[Foundations](https://www.figma.com/design/IfUIEROTKbSr3LIfUh8wPx/LIDPORT-DS?node-id=8122-2) · [Components](https://www.figma.com/design/IfUIEROTKbSr3LIfUh8wPx/LIDPORT-DS?node-id=8124-162) · [Library guide](https://www.figma.com/design/IfUIEROTKbSr3LIfUh8wPx/LIDPORT-DS?node-id=8137-128)


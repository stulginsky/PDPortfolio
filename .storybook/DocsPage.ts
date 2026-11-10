import { createElement as h, Fragment } from 'react'
import { Title, Subtitle, Description, Primary, Controls, Source, useOf } from '@storybook/addon-docs/blocks'
import { guideFor } from './docs-guides'

function guideTable(title: string, headers: string[], rows?: string[][]) {
  if (!rows?.length) return null
  return h(Fragment, { key: title },
    h('h2', null, title),
    h('table', null,
      h('thead', null, h('tr', null, ...headers.map(text => h('th', { key: text, scope: 'col' }, text)))),
      h('tbody', null, ...rows.map((row, index) => h('tr', { key: index },
        ...row.map((text, column) => h(column === 0 ? 'th' : 'td', { key: column, ...(column === 0 ? { scope: 'row' } : {}) }, text))))),
    ),
  )
}

export function DocsGuidance() {
  const resolved = useOf('meta', ['meta'])
  const meta = resolved.preparedMeta
  const guide = guideFor(meta.title, meta.args)
  if (!guide) return null
  return h(Fragment, null,
    guideTable('Варианты', ['Свойство или вариант', 'Когда использовать'], guide.variants),
    guideTable('Состояния', ['Состояние', 'Как проверить', 'Поведение'], guide.states),
    h('h2', null, 'Использование'),
    ...guide.usage.map(text => h('p', { key: text }, text)),
    h('h3', null, 'Пример кода'),
    meta.title === 'Foundation/Icons'
      ? h(Source, { language: 'vue', code: "<script setup>\nimport download from '~/assets/icons/download.svg'\n</script>\n\n<template>\n  <img :src=\"download\" alt=\"\" aria-hidden=\"true\" />\n</template>" })
      : h(Source, { of: 'story' }),
    guide.accessibility?.length ? h(Fragment, null,
      h('h2', null, 'Доступность'),
      h('ul', null, ...guide.accessibility.map(text => h('li', { key: text }, text))),
    ) : null,
  )
}

export function DocsPage() {
  return h(Fragment, null,
    h(Title), h(Subtitle), h(Description, { of: 'meta' }),
    h('h2', null, 'Интерактивный пример'),
    h('p', null, 'Доступные свойства можно изменить в Controls. Для интерактивных элементов проверьте наведение, нажатие и фокус прямо в примере.'),
    h(Primary), h(Controls), h(DocsGuidance),
  )
}

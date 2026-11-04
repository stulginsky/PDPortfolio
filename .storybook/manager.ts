import { createElement } from 'react'
import { addons, types } from 'storybook/manager-api'

const hosting = window.location.pathname.match(/^(.*)\/storybook(?:\/|$)/)
const showcase = hosting ? `${hosting[1]}/` : 'http://127.0.0.1:3000/'

addons.register('portfolio/navigation', () => {
  addons.add('portfolio/navigation/showcase', {
    type: types.TOOLEXTRA,
    title: 'На витрину',
    render: () => createElement('a', {
      href: showcase,
      style: { display: 'inline-flex', alignItems: 'center', padding: '0 12px', height: 40, color: 'inherit', fontSize: 13, whiteSpace: 'nowrap' },
    }, '← На витрину'),
  })
})

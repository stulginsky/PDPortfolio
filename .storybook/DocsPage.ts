import { createElement, Fragment } from 'react'
import { Title, Subtitle, Description, Primary, Controls } from '@storybook/addon-docs/blocks'

// Stories remain available to the test runner and direct links.
// Docs has a single interactive example instead of repeating every test fixture.
export function DocsPage() {
  return createElement(Fragment, null,
    createElement(Title),
    createElement(Subtitle),
    createElement(Description, { of: 'meta' }),
    createElement(Primary),
    createElement(Controls),
  )
}

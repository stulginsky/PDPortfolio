/** Editorial normalization for narrative case text, independent of Typograf. */
export function paragraphPeriodIndexes(text) {
  // Keep ellipses and punctuation other than a single full stop.
  return [...text.matchAll(/(?<!\.)\.(?!\.)(?=[»”"')\]]*[\t \u00a0]*(?:\r?\n|\u2029|$))/gu)].map(match => match.index)
}

export function normalizeCaseParagraphs(text) {
  const removed = new Set(paragraphPeriodIndexes(text))
  return Array.from({ length: text.length }, (_, index) => removed.has(index) ? '' : text[index]).join('')
}

export function normalizeCaseEditorial(source) {
  const result = structuredClone(source)
  for (const [id, node] of Object.entries(result.page?.nodes ?? {})) {
    if (typeof node === 'string') {
      result.page.nodes[id] = normalizeCaseParagraphs(node)
      continue
    }
    if (!node || typeof node.text !== 'string') continue
    const removed = new Set(paragraphPeriodIndexes(node.text))
    if (!removed.size) continue
    if (node.runs) {
      if (node.runs.map(run => run.text).join('') !== node.text) throw new Error(`Case rich-text mismatch: ${id}`)
      let offset = 0
      node.runs = node.runs.map(run => {
        const start = offset
        offset += run.text.length
        return { ...run, text: Array.from({ length: run.text.length }, (_, index) => removed.has(start + index) ? '' : run.text[index]).join('') }
      })
    }
    node.text = normalizeCaseParagraphs(node.text)
  }
  if (Array.isArray(result.copy)) result.copy = result.copy.map(value => typeof value === 'string' ? normalizeCaseParagraphs(value) : value)
  return result
}

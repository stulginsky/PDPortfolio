// Local bridge to the project's HTTP Storybook MCP when no named connector is exposed.
const [name, input] = process.argv.slice(2)
const args = input ? name === 'docs-show' ? { id: input } : ['test-run','stories-preview'].includes(name) ? { stories: input.split(',').map(storyId => ({storyId})) } : JSON.parse(Buffer.from(input, 'base64').toString()) : name === 'docs-list' ? { withStoryIds: true } : {}
const response = await fetch('http://127.0.0.1:6006/mcp', {
  signal: AbortSignal.timeout(30000),
  method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
  body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: name === '--list' ? 'tools/list' : 'tools/call',
    params: name === '--list' ? {} : { name, arguments: args } }),
})
const body = await response.text()
if (!response.ok) throw new Error(`${response.status}: ${body}`)
const message = body.startsWith('event:') ? JSON.parse(body.split('\n').find(line => line.startsWith('data:')).slice(5)) : JSON.parse(body)
if (message.error) throw new Error(JSON.stringify(message.error))
console.log(JSON.stringify(name === '--list' ? message.result.tools.filter(t => /docs-/.test(t.name)) : message.result, null, 2))

import { git } from './release-policy.mjs'

// Credentials stay in process memory. Never print or persist the helper response.
export function githubApi() {
  let token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  if (!token) {
    let credential
    try {
      credential = git(['credential', 'fill'], {
        input: 'protocol=https\nhost=github.com\n\n',
        env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never' },
        stdio: ['pipe', 'pipe', 'pipe'],
      })
    } catch {
      // Do not propagate child-process output: it may contain partial credentials.
      throw new Error('Git HTTPS authentication unavailable. Configure credentials or GITHUB_TOKEN and retry.')
    }
    token = credential.split('\n').find(line => line.startsWith('password='))?.slice(9)
  }
  if (!token) throw new Error('GitHub authentication unavailable. Configure Git HTTPS credentials or GITHUB_TOKEN.')
  return async (endpoint, options = {}) => {
    const response = await fetch('https://api.github.com' + endpoint, {
      ...options,
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', ...options.headers },
    })
    if (!response.ok) throw new Error(`GitHub API ${response.status} ${endpoint}: ${(await response.json()).message}`)
    return response.status === 204 ? null : response.json()
  }
}

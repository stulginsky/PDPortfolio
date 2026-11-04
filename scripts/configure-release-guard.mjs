import { githubApi } from './lib/github-auth.mjs'

const api = githubApi()
const endpoint = '/repos/stulginsky/PDPortfolio/branches/main/protection'
let current = null
try { current = await api(endpoint) }
catch (error) { if (!error.message.includes('404') || !error.message.includes('Branch not protected')) throw error }
console.log(JSON.stringify({ protection: current }, null, 2))
if (process.argv.includes('--apply')) {
  if (current) {
    if (!current.required_status_checks?.contexts?.includes('release-validation') || !current.required_status_checks.strict || !current.enforce_admins?.enabled || !current.required_pull_request_reviews) {
      throw new Error('Existing protection differs. Review it before changing settings; no protection overwritten.')
    }
    console.log('Required release protection already active.')
  } else {
    const result = await api(endpoint, {
      method: 'PUT',
      body: JSON.stringify({
        required_status_checks: { strict: true, contexts: ['release-validation'] },
        enforce_admins: true,
        required_pull_request_reviews: { required_approving_review_count: 0 },
        restrictions: null,
        allow_force_pushes: false,
        allow_deletions: false,
      }),
    })
    console.log(JSON.stringify({ enabled: true, requiredChecks: result.required_status_checks.contexts, enforceAdmins: result.enforce_admins.enabled, pullRequestRequired: !!result.required_pull_request_reviews }))
  }
}

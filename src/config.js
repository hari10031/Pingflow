// Central place to tweak project-wide constants.
// Update GITHUB_REPO to point at your own fork once deployed.
export const GITHUB_REPO = 'https://github.com/hari10031/pingflow'
export const DOCS_URL = 'https://github.com/hari10031/pingflow#readme'

// How often GitHub Actions pings each service (minutes).
export const PING_INTERVAL_MINUTES = 10

// Public submissions are moderated: visitors open a pre-filled issue, a
// maintainer reviews it, then adds it to services.json.
export const SUBMIT_SERVICE_URL = `${GITHUB_REPO}/issues/new?template=add-service.yml`
export const ISSUES_URL = `${GITHUB_REPO}/issues`

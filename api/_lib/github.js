// GitHub Contents API helper for the serverless functions.
//
// Reads/writes src/data/services.json using a token kept in a Vercel env var
// (GITHUB_TOKEN) — server-side only, never shipped to the browser. Runs on
// Vercel's Node runtime, so global fetch and Buffer are available.

const API = 'https://api.github.com'

function env() {
  return {
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    branch: process.env.GITHUB_BRANCH || 'main',
    path: process.env.SERVICES_PATH || 'src/data/services.json',
  }
}

export function isConfigured() {
  const { token, owner, repo } = env()
  return Boolean(token && owner && repo)
}

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

function contentsUrl({ owner, repo, path }) {
  const encoded = path.split('/').map(encodeURIComponent).join('/')
  return `${API}/repos/${owner}/${repo}/contents/${encoded}`
}

async function messageFrom(res) {
  try {
    return (await res.json())?.message || ''
  } catch {
    return ''
  }
}

/** Fetch the current services array plus the blob sha needed to commit. */
export async function getServicesFile() {
  const cfg = env()
  const res = await fetch(`${contentsUrl(cfg)}?ref=${encodeURIComponent(cfg.branch)}`, {
    headers: headers(cfg.token),
  })
  if (!res.ok) {
    const msg = await messageFrom(res)
    throw new Error(`Could not read services.json (${res.status}${msg ? `: ${msg}` : ''})`)
  }
  const data = await res.json()
  let services = []
  try {
    const parsed = JSON.parse(Buffer.from(data.content || '', 'base64').toString('utf8'))
    if (Array.isArray(parsed)) services = parsed
  } catch {
    services = []
  }
  return { services, sha: data.sha }
}

/** Commit a new services array. Returns { ok, commitUrl } or { ok:false, conflict, error }. */
export async function commitServices(services, sha, message) {
  const cfg = env()
  const res = await fetch(contentsUrl(cfg), {
    method: 'PUT',
    headers: { ...headers(cfg.token), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: Buffer.from(`${JSON.stringify(services, null, 2)}\n`, 'utf8').toString('base64'),
      sha,
      branch: cfg.branch,
    }),
  })

  if (res.ok) {
    const data = await res.json()
    return { ok: true, commitUrl: data?.commit?.html_url }
  }
  // 409 = the file moved under us (concurrent commit); caller may retry with a fresh sha.
  if (res.status === 409) return { ok: false, conflict: true }
  const msg = await messageFrom(res)
  return { ok: false, error: `Commit failed (${res.status}${msg ? `: ${msg}` : ''})` }
}

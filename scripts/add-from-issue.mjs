// Parses a submitted "Add service" issue and, if it passes the safety checks,
// appends it to services.json. Run by the auto-add-service workflow.
//
// Results are written to $GITHUB_OUTPUT so later workflow steps can comment,
// commit, and close the issue accordingly.

import { readFile, writeFile } from 'node:fs/promises'
import { appendFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SERVICES_PATH = resolve(__dirname, '../src/data/services.json')

const MAX_SERVICES = 100
const PING_TIMEOUT_MS = 12000

function output(obj) {
  const file = process.env.GITHUB_OUTPUT
  if (!file) {
    console.log(obj)
    return
  }
  for (const [key, value] of Object.entries(obj)) {
    appendFileSync(file, `${key}=${String(value).replace(/\r?\n/g, ' ')}\n`)
  }
}

// GitHub issue forms render fields as "### Label\n\nvalue\n\n### Next".
function parseField(body, label) {
  const re = new RegExp(`###\\s*${label}\\s*\\n+([\\s\\S]*?)(?:\\n###|$)`, 'i')
  const m = body.match(re)
  if (!m) return ''
  const value = m[1].trim()
  return value === '_No response_' ? '' : value
}

async function ping(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), PING_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'PingFlow/1.0 (+github-actions)' },
    })
    return res.status
  } finally {
    clearTimeout(timer)
  }
}

async function main() {
  const body = process.env.ISSUE_BODY || ''
  const name = parseField(body, 'Service name')
  const rawUrl = parseField(body, 'Health URL')

  if (!name || !rawUrl) {
    return output({ added: false, reason: 'Could not read a service name and URL from the form.' })
  }

  let parsed
  try {
    parsed = new URL(rawUrl)
  } catch {
    return output({ added: false, reason: `"${rawUrl}" is not a valid URL.` })
  }
  if (parsed.protocol !== 'https:') {
    return output({ added: false, reason: 'Only https:// URLs are accepted.' })
  }
  const url = parsed.toString()

  let services
  try {
    services = JSON.parse(await readFile(SERVICES_PATH, 'utf8'))
  } catch {
    return output({ added: false, reason: 'services.json could not be read.' })
  }
  if (!Array.isArray(services)) {
    return output({ added: false, reason: 'services.json is not a JSON array.' })
  }
  if (services.length >= MAX_SERVICES) {
    return output({ added: false, reason: `The list is full (max ${MAX_SERVICES}).` })
  }
  if (services.some((s) => s.url === url)) {
    return output({ added: false, reason: 'That URL is already on the list.' })
  }

  // Must be reachable to count as a real service (protects the ping quota).
  let status
  try {
    status = await ping(url)
  } catch {
    return output({ added: false, reason: 'Could not reach the URL (timed out or refused).' })
  }
  if (status >= 500) {
    return output({ added: false, reason: `The endpoint returned ${status}.` })
  }

  services.push({ name, url })
  await writeFile(SERVICES_PATH, `${JSON.stringify(services, null, 2)}\n`)
  output({ added: true, name, url, status })
}

main().catch((err) => {
  output({ added: false, reason: `Unexpected error: ${err.message}` })
})

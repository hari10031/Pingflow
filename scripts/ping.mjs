// Reads services from src/data/services.json and pings each URL.
// - Retries failures up to 3 times (with backoff)
// - Continues past failures so one dead service never blocks the rest
// - Logs HTTP status and response time for every attempt
//
// Runs in GitHub Actions on Node 20+, where fetch is available globally.

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SERVICES_PATH = resolve(__dirname, '../src/data/services.json')

const MAX_RETRIES = 3
const TIMEOUT_MS = 15000
const RETRY_BACKOFF_MS = 2000

function ms() {
  return performance.now()
}

async function pingOnce(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const start = ms()
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'PingFlow/1.0 (+github-actions)' },
    })
    const elapsed = Math.round(ms() - start)
    return { ok: res.ok, status: res.status, elapsed }
  } finally {
    clearTimeout(timer)
  }
}

async function pingService(service) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { ok, status, elapsed } = await pingOnce(service.url)
      if (ok) {
        console.log(`✅ ${service.name} — ${status} in ${elapsed}ms (attempt ${attempt})`)
        return { name: service.name, ok: true, status, elapsed }
      }
      console.log(
        `⚠️  ${service.name} — HTTP ${status} in ${elapsed}ms (attempt ${attempt}/${MAX_RETRIES})`,
      )
    } catch (err) {
      const reason = err?.name === 'AbortError' ? 'timeout' : err?.message || 'network error'
      console.log(`❌ ${service.name} — ${reason} (attempt ${attempt}/${MAX_RETRIES})`)
    }

    if (attempt < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, RETRY_BACKOFF_MS * attempt))
    }
  }
  return { name: service.name, ok: false }
}

async function main() {
  const file = await readFile(SERVICES_PATH, 'utf8')
  const services = JSON.parse(file)

  if (!Array.isArray(services) || services.length === 0) {
    console.log('No services found in services.json — nothing to ping.')
    return
  }

  console.log(`🫀 PingFlow — pinging ${services.length} service(s)\n`)

  const results = []
  for (const service of services) {
    if (!service?.url) {
      console.log(`↷ Skipping "${service?.name || 'unnamed'}" — missing url`)
      continue
    }
    results.push(await pingService(service))
  }

  const awake = results.filter((r) => r.ok).length
  const asleep = results.length - awake
  console.log(`\n📊 Summary: ${awake} awake · ${asleep} unreachable`)

  // Never fail the workflow on an unreachable service — keep the schedule alive.
  process.exit(0)
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  // Even on a script-level error, exit 0 so the cron keeps running next cycle.
  process.exit(0)
})

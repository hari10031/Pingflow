// Shared validation for the serverless functions. Mirrors the guardrails in
// scripts/add-from-issue.mjs so the API and the GitHub-issue path behave the same.

export const MAX_SERVICES = 100
const PING_TIMEOUT_MS = 12000

/** Normalize to an absolute https/http URL string, or '' if it isn't a URL. */
export function normalizeUrl(input) {
  const trimmed = (input || '').trim()
  if (!trimmed) return ''
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    return new URL(withProto).toString()
  } catch {
    return ''
  }
}

/** Ping a URL once. Returns the HTTP status, or null if it couldn't be reached. */
export async function checkReachable(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), PING_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'PingFlow/1.0 (+vercel)' },
    })
    return res.status
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

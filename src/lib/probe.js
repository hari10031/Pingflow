// Live, in-browser reachability probe.
//
// Browsers block reading a cross-origin response unless the target sends CORS
// headers — most /health endpoints don't. So we degrade gracefully:
//   1. Try a normal (CORS) fetch  → if it works we can read the real status.
//   2. Fall back to a no-cors fetch → resolves opaquely if the server is
//      reachable (we get timing but NOT the status code), throws if it isn't.
// The GitHub Action runs server-side and always sees the true status.

const TIMEOUT_MS = 12000

function withTimeout() {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS)
  return { signal: controller.signal, clear: () => clearTimeout(id) }
}

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

export async function probeUrl(rawUrl) {
  const url = normalizeUrl(rawUrl)
  if (!url) return { kind: 'invalid' }

  // Attempt 1 — readable CORS request.
  {
    const start = performance.now()
    const t = withTimeout()
    try {
      const res = await fetch(url, { mode: 'cors', signal: t.signal, redirect: 'follow' })
      t.clear()
      return {
        kind: 'readable',
        ok: res.ok,
        status: res.status,
        ms: Math.round(performance.now() - start),
      }
    } catch {
      t.clear()
      // fall through
    }
  }

  // Attempt 2 — opaque reachability probe.
  {
    const start = performance.now()
    const t = withTimeout()
    try {
      await fetch(url, { mode: 'no-cors', signal: t.signal, redirect: 'follow' })
      t.clear()
      return { kind: 'opaque', ms: Math.round(performance.now() - start) }
    } catch (err) {
      t.clear()
      return {
        kind: 'unreachable',
        reason: err?.name === 'AbortError' ? 'Timed out after 12s' : 'Could not connect',
      }
    }
  }
}

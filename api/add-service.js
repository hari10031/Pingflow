// POST /api/add-service  { name?, url }
//
// Validates the endpoint and commits it to services.json on GitHub using a
// server-side token. Public, so the same guardrails as the issue flow apply:
// https-only, must be reachable, no duplicates, capped list.

import { getServicesFile, commitServices, isConfigured } from './_lib/github.js'
import { normalizeUrl, checkReachable, MAX_SERVICES } from './_lib/validate.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed.' })
  }
  if (!isConfigured()) {
    return res.status(500).json({ ok: false, error: 'Server is missing GitHub configuration.' })
  }

  try {
    // Vercel parses JSON bodies; guard against strings/missing bodies anyway.
    const body = typeof req.body === 'string' ? safeJson(req.body) : req.body || {}
    const url = normalizeUrl(body.url)
    if (!url) {
      return res.status(400).json({ ok: false, error: 'Enter a valid URL.' })
    }
    if (!url.startsWith('https://')) {
      return res.status(400).json({ ok: false, error: 'Only https:// URLs are accepted.' })
    }

    let name = (body.name || '').trim()
    if (!name) {
      name = new URL(url).hostname.replace(/^www\./, '')
    }

    // Must actually respond — protects the ping quota from junk submissions.
    const status = await checkReachable(url)
    if (status === null) {
      return res.status(400).json({ ok: false, error: 'Could not reach that URL (timed out or refused).' })
    }
    if (status >= 500) {
      return res.status(400).json({ ok: false, error: `The endpoint returned ${status}.` })
    }

    // Read → append → commit, retrying once if a concurrent commit moved the sha.
    for (let attempt = 0; attempt < 2; attempt++) {
      const { services, sha } = await getServicesFile()

      if (services.length >= MAX_SERVICES) {
        return res.status(409).json({ ok: false, error: `The list is full (max ${MAX_SERVICES}).` })
      }
      if (services.some((s) => s.url === url)) {
        return res.status(409).json({ ok: false, error: 'That URL is already on the list.' })
      }

      const next = [...services, { name, url }]
      const result = await commitServices(next, sha, `Add ${name} via PingFlow`)

      if (result.ok) {
        return res.status(200).json({ ok: true, name, url, status, commitUrl: result.commitUrl })
      }
      if (!result.conflict) {
        return res.status(502).json({ ok: false, error: result.error || 'Commit failed.' })
      }
      // conflict → loop once more with a fresh sha
    }

    return res.status(409).json({ ok: false, error: 'Could not save — please try again.' })
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Unexpected server error.' })
  }
}

function safeJson(str) {
  try {
    return JSON.parse(str)
  } catch {
    return {}
  }
}

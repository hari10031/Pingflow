// GET|POST /api/wake            → pings every service in services.json
// GET|POST /api/wake?url=https… → pings just that one
//
// The "wake any time" lever: hit it manually, from an uptime monitor, or any
// external scheduler to keep services warm on demand (GitHub Actions still runs
// the every-10-minute schedule). Optionally gated by WAKE_SECRET.

import { getServicesFile, isConfigured } from './_lib/github.js'
import { normalizeUrl, checkReachable } from './_lib/validate.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end()

  const secret = process.env.WAKE_SECRET
  if (secret && req.query?.key !== secret) {
    return res.status(401).json({ ok: false, error: 'Invalid or missing key.' })
  }

  try {
    let targets
    const single = normalizeUrl(req.query?.url)
    if (single) {
      targets = [{ name: single, url: single }]
    } else {
      if (!isConfigured()) {
        return res.status(500).json({ ok: false, error: 'Server is missing GitHub configuration.' })
      }
      targets = (await getServicesFile()).services
    }

    const results = []
    for (const svc of targets) {
      const start = Date.now()
      const status = await checkReachable(svc.url)
      results.push({
        name: svc.name,
        url: svc.url,
        status,
        ms: Date.now() - start,
        ok: status !== null && status < 500,
      })
    }

    const awake = results.filter((r) => r.ok).length
    return res.status(200).json({ ok: true, count: results.length, awake, results })
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Unexpected server error.' })
  }
}

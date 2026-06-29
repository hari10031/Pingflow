import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Plus,
  ShieldAlert,
  Wifi,
  WifiOff,
  XCircle,
} from 'lucide-react'
import SectionHeading from './SectionHeading'
import { probeUrl, normalizeUrl } from '../lib/probe'

export default function TryIt() {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [checking, setChecking] = useState(false)
  const [adding, setAdding] = useState(false)
  const [result, setResult] = useState(null)
  const [added, setAdded] = useState(null)
  const [error, setError] = useState('')

  async function handleCheck(e) {
    e.preventDefault()
    setError('')
    setAdded(null)
    if (!normalizeUrl(url)) {
      setError('Enter a valid URL, e.g. https://api.example.com/health')
      return
    }
    setChecking(true)
    const res = await probeUrl(url)
    setChecking(false)
    setResult(res)
  }

  async function handleAdd() {
    setError('')
    setResult(null)
    setAdded(null)
    const cleanUrl = normalizeUrl(url)
    if (!cleanUrl) {
      setError('Enter a valid URL before adding it.')
      return
    }
    let label = name.trim()
    if (!label) {
      try {
        label = new URL(cleanUrl).hostname.replace(/^www\./, '')
      } catch {
        label = 'My Service'
      }
    }

    setAdding(true)
    try {
      const res = await fetch('/api/add-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: label, url: cleanUrl }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) {
        setError(data.error || 'Could not add the service. Please try again.')
        return
      }
      setAdded({ name: label, url: cleanUrl, commitUrl: data.commitUrl })
      setName('')
      setUrl('')
    } catch {
      setError('Network error — please try again.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <section id="try" className="section-pad py-20 sm:py-28">
      <SectionHeading
        eyebrow="Try it"
        title="Check a URL, then add it"
        subtitle="Ping any backend URL right here in your browser, then add it. Reachable services are committed to services.json instantly and pinged every 10 minutes."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="glass mx-auto mt-12 max-w-2xl rounded-3xl p-5 sm:p-7"
      >
        <form onSubmit={handleCheck} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_1.4fr]">
            <label className="block">
              <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
                Name <span className="text-ink-600">· optional</span>
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Portfolio API"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-sm text-ink-100 placeholder:text-ink-600 transition-colors focus:border-signal-400/40 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
                Health URL
              </span>
              <input
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  if (error) setError('')
                }}
                inputMode="url"
                placeholder="https://api.example.com/health"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 font-mono text-sm text-ink-100 placeholder:text-ink-600 transition-colors focus:border-signal-400/40 focus:outline-none"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={checking}
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.02] px-5 py-3 font-semibold text-ink-100 transition-colors hover:border-white/25 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {checking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Activity className="h-4 w-4" strokeWidth={2.5} />
              )}
              {checking ? 'Pinging…' : 'Check response'}
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={adding}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-signal-gradient px-5 py-3 font-semibold text-void-900 shadow-glow transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {adding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" strokeWidth={2.6} />
              )}
              {adding ? 'Adding…' : 'Add'}
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-3 flex items-center gap-2 text-sm text-rose-300">
            <XCircle className="h-4 w-4 shrink-0" /> {error}
          </p>
        )}

        <AnimatePresence mode="wait">
          {result && <ResultPanel key="result" result={result} />}
          {added && <AddedPanel key="added" added={added} />}
        </AnimatePresence>

        <p className="mt-5 text-center font-mono text-[11px] leading-relaxed text-ink-600">
          Add commits the service to services.json for you. Only reachable https URLs are accepted —
          no account, no signup.
        </p>
      </motion.div>
    </section>
  )
}

function Panel({ children, tone = 'neutral' }) {
  const ring = {
    good: 'border-signal-400/30 bg-signal-500/[0.07]',
    warn: 'border-amber-400/30 bg-amber-500/[0.06]',
    info: 'border-beam-400/30 bg-beam-500/[0.06]',
    bad: 'border-rose-400/30 bg-rose-500/[0.06]',
    neutral: 'border-white/10 bg-white/[0.03]',
  }[tone]
  return (
    <motion.div
      initial={{ opacity: 0, height: 0, marginTop: 0 }}
      animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`rounded-2xl border p-4 sm:p-5 ${ring}`}>{children}</div>
    </motion.div>
  )
}

function ResultPanel({ result }) {
  if (result.kind === 'invalid') {
    return (
      <Panel tone="bad">
        <span className="inline-flex items-center gap-2 font-display font-semibold">
          <XCircle className="h-5 w-5 text-rose-400" /> That doesn’t look like a valid URL
        </span>
      </Panel>
    )
  }

  if (result.kind === 'readable') {
    const good = result.ok
    return (
      <Panel tone={good ? 'good' : 'warn'}>
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 font-display font-semibold">
            {good ? (
              <Wifi className="h-5 w-5 text-signal-400" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-amber-400" />
            )}
            {good ? 'Responding' : 'Reachable, non-200'}
          </span>
          <span className="font-mono text-sm">
            <span className={good ? 'text-signal-300' : 'text-amber-300'}>
              HTTP {result.status}
            </span>
            <span className="text-ink-500"> · {result.ms}ms</span>
          </span>
        </div>
      </Panel>
    )
  }

  if (result.kind === 'opaque') {
    return (
      <Panel tone="info">
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 font-display font-semibold">
            <Wifi className="h-5 w-5 text-beam-400" /> Reachable
          </span>
          <span className="font-mono text-sm text-ink-300">~{result.ms}ms</span>
        </div>
        <p className="mt-2 text-sm text-ink-300">
          Your server responded. The browser hid the status code (no CORS headers) — normal for a
          health endpoint. GitHub Actions reads the real status server-side.
        </p>
      </Panel>
    )
  }

  return (
    <Panel tone="bad">
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-2 font-display font-semibold">
          <WifiOff className="h-5 w-5 text-rose-400" /> Unreachable
        </span>
        <span className="font-mono text-sm text-rose-300">{result.reason}</span>
      </div>
      <p className="mt-2 text-sm text-ink-300">
        Double-check the URL — or a fully asleep free-tier service may need a moment to wake. Try
        again shortly.
      </p>
    </Panel>
  )
}

function AddedPanel({ added }) {
  return (
    <Panel tone="good">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <span className="inline-flex items-center gap-2 font-display font-semibold">
          <CheckCircle2 className="h-5 w-5 text-signal-400" />
          Added “{added.name}” to services.json
        </span>
        <div className="flex items-center gap-4">
          {added.commitUrl && (
            <a
              href={added.commitUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-ink-300 hover:text-ink-100"
            >
              View commit <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <a
            href="#services"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-signal-300 hover:text-signal-400"
          >
            Dashboard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
      <p className="mt-2 text-sm text-ink-300">
        Committed to the repo. It starts getting pinged on the next scheduled run, and appears on
        the dashboard once the site redeploys (about a minute).
      </p>
    </Panel>
  )
}

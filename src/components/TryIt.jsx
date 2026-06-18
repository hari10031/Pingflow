import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  ExternalLink,
  GitPullRequestArrow,
  Loader2,
  Send,
  ShieldAlert,
  Wifi,
  WifiOff,
  XCircle,
} from 'lucide-react'
import SectionHeading from './SectionHeading'
import { probeUrl, normalizeUrl } from '../lib/probe'
import { GITHUB_REPO } from '../config'

function buildIssueUrl({ name, url }) {
  const params = new URLSearchParams({
    template: 'add-service.yml',
    title: `Add service: ${name}`,
    'service-name': name,
    'service-url': url,
  })
  return `${GITHUB_REPO}/issues/new?${params.toString()}`
}

export default function TryIt() {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState(null)
  const [submitted, setSubmitted] = useState(null)
  const [error, setError] = useState('')

  async function handleCheck(e) {
    e.preventDefault()
    setError('')
    setSubmitted(null)
    if (!normalizeUrl(url)) {
      setError('Enter a valid URL, e.g. https://api.example.com/health')
      return
    }
    setChecking(true)
    const res = await probeUrl(url)
    setChecking(false)
    setResult(res)
  }

  function handleSubmit() {
    setError('')
    setResult(null)
    const cleanUrl = normalizeUrl(url)
    if (!cleanUrl) {
      setError('Enter a valid URL before submitting it.')
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
    const issueUrl = buildIssueUrl({ name: label, url: cleanUrl })
    setSubmitted({ name: label, url: issueUrl })
    // Opened by a direct click, so popup blockers leave this alone.
    window.open(issueUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="try" className="section-pad py-20 sm:py-28">
      <SectionHeading
        eyebrow="Try it"
        title="Check a URL, then submit it"
        subtitle="Ping any backend URL right here in your browser, then submit it for review. Approved services get added to services.json and pinged every 10 minutes."
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
              onClick={handleSubmit}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-signal-gradient px-5 py-3 font-semibold text-void-900 shadow-glow transition-transform hover:-translate-y-0.5"
            >
              <Send className="h-4 w-4" strokeWidth={2.4} />
              Submit a service
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
          {submitted && <SubmittedPanel key="submitted" submitted={submitted} />}
        </AnimatePresence>

        <p className="mt-5 text-center font-mono text-[11px] leading-relaxed text-ink-600">
          Submitting opens a pre-filled GitHub issue. A maintainer reviews it before it’s added —
          no account beyond GitHub, nothing installed.
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

function SubmittedPanel({ submitted }) {
  return (
    <Panel tone="good">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <span className="inline-flex items-center gap-2 font-display font-semibold">
          <GitPullRequestArrow className="h-5 w-5 text-signal-400" />
          Submitting “{submitted.name}”
        </span>
        <a
          href={submitted.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-signal-300 hover:text-signal-400"
        >
          Open the issue <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      <p className="mt-2 text-sm text-ink-300">
        A pre-filled GitHub issue should have opened in a new tab. Submit it there — a maintainer
        reviews each request before it joins the ping list. If nothing opened, use the link above.
      </p>
    </Panel>
  )
}

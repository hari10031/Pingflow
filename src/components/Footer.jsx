import { Activity, Github, BookOpen, Star, Send, Inbox } from 'lucide-react'
import PulseLine from './PulseLine'
import { GITHUB_REPO, DOCS_URL, SUBMIT_SERVICE_URL, ISSUES_URL } from '../config'

export default function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-white/[0.06]">
      {/* faint heartbeat echo in the footer ties back to the hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-30">
        <PulseLine className="h-full w-full" strokeWidth={1.5} />
      </div>

      <div className="section-pad py-14">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-signal-gradient shadow-glow">
                <Activity className="h-5 w-5 text-void-900" strokeWidth={2.6} />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">
                Ping<span className="gradient-text">Flow</span>
              </span>
            </div>
            <p className="mt-4 leading-relaxed text-ink-300">
              Keep your free-tier backends responsive — for free, forever. Powered by GitHub
              Actions and a single JSON file.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-signal-400/20 bg-signal-500/10 px-3 py-1.5 font-mono text-xs text-signal-300">
              <Star className="h-3.5 w-3.5" /> Open Source · MIT
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-500">Links</span>
            <a
              href={SUBMIT_SERVICE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-ink-300 transition-colors hover:text-ink-100"
            >
              <Send className="h-4 w-4" /> Submit a service
            </a>
            <a
              href={ISSUES_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-ink-300 transition-colors hover:text-ink-100"
            >
              <Inbox className="h-4 w-4" /> Open requests
            </a>
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-ink-300 transition-colors hover:text-ink-100"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
            <a
              href={DOCS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-ink-300 transition-colors hover:text-ink-100"
            >
              <BookOpen className="h-4 w-4" /> Documentation
            </a>
          </div>
        </div>

        <div className="signal-rule mt-12" />
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-sm text-ink-500 sm:flex-row">
          <p>© {new Date().getFullYear()} PingFlow. Built for the free tier.</p>
          <p className="font-mono text-xs">No backend · No database · No cost</p>
        </div>
      </div>
    </footer>
  )
}

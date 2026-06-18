import { motion } from 'framer-motion'
import { ExternalLink, HeartPulse } from 'lucide-react'
import StatusDot from './StatusDot'

function hostOf(url) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function pathOf(url) {
  try {
    return new URL(url).pathname || '/'
  } catch {
    return '/health'
  }
}

export default function ServiceCard({ service, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="glass glass-hover group relative overflow-hidden rounded-2xl p-5"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-signal-500/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-signal-400/20 bg-signal-500/10 text-signal-400">
            <HeartPulse className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-semibold tracking-tight">
              {service.name}
            </h3>
            <p className="truncate font-mono text-xs text-ink-500">{hostOf(service.url)}</p>
          </div>
        </div>
        <StatusDot label="Active" />
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-void-900/50 px-2.5 py-1.5 font-mono text-xs text-ink-300">
          <span className="h-1.5 w-1.5 rounded-full bg-beam-400" />
          {pathOf(service.url)}
        </span>

        <a
          href={service.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-ink-500 transition-colors hover:text-signal-300"
        >
          Open
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </motion.div>
  )
}

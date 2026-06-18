import { motion } from 'framer-motion'
import { ArrowRight, Github, Heart, Zap } from 'lucide-react'
import PulseLine from './PulseLine'
import StatusDot from './StatusDot'
import { GITHUB_REPO, PING_INTERVAL_MINUTES } from '../config'

const badges = ['100% Free', 'No Backend Required', 'GitHub Powered', 'Open Source']

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.08 },
  }),
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 sm:pt-40">
      {/* faint grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-faint [background-size:48px_48px] [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]"
        aria-hidden
      />

      <div className="section-pad">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="eyebrow rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
              <Heart className="h-3.5 w-3.5" /> Uptime, without a server
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Keep Your Backend
            <br />
            <span className="gradient-text">Awake For Free</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-300 text-pretty"
          >
            Free-tier backends fall asleep when idle. PingFlow automatically pings your services
            every {PING_INTERVAL_MINUTES} minutes using GitHub Actions — so the first request is
            never the slow one.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-7 flex flex-wrap items-center justify-center gap-2.5"
          >
            {badges.map((b) => (
              <span
                key={b}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-ink-300"
              >
                {b}
              </span>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <a
              href="#services"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-signal-gradient px-6 py-3.5 font-semibold text-void-900 shadow-glow transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              View Services
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.02] px-6 py-3.5 font-semibold text-ink-100 transition-colors hover:border-white/25 hover:bg-white/5 sm:w-auto"
            >
              <Github className="h-4 w-4" />
              GitHub Repository
            </a>
          </motion.div>
        </div>

        {/* Signature: the live heartbeat console */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-16 max-w-4xl"
        >
          <div className="glass overflow-hidden rounded-3xl">
            {/* console header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-white/15" />
                <span className="h-3 w-3 rounded-full bg-white/15" />
                <span className="h-3 w-3 rounded-full bg-white/15" />
                <span className="ml-3 font-mono text-xs text-ink-500">
                  ping-services.yml · running
                </span>
              </div>
              <StatusDot label="Live" />
            </div>

            {/* pulse */}
            <div className="relative h-40 w-full bg-gradient-to-b from-transparent to-signal-500/[0.04] sm:h-52">
              <PulseLine className="absolute inset-0 h-full w-full" />
            </div>

            {/* console log */}
            <div className="space-y-1.5 border-t border-white/[0.06] px-5 py-4 font-mono text-[12.5px] sm:px-6">
              <p className="text-ink-500">
                <span className="text-signal-400">→</span> GET portfolio-api/health{' '}
                <span className="text-signal-300">200 OK</span>{' '}
                <span className="text-ink-600">· 142ms</span>
              </p>
              <p className="text-ink-500">
                <span className="text-beam-400">→</span> GET workshop-api/health{' '}
                <span className="text-signal-300">200 OK</span>{' '}
                <span className="text-ink-600">· 98ms</span>
              </p>
              <p className="text-ink-600">
                <Zap className="mr-1 inline h-3.5 w-3.5 text-signal-400" />
                next run in {PING_INTERVAL_MINUTES}m · all services responsive
              </p>
            </div>
          </div>

          {/* ambient glow */}
          <div className="pointer-events-none absolute -inset-x-10 -bottom-10 -z-10 h-40 bg-signal-500/20 blur-[80px]" />
        </motion.div>
      </div>
    </section>
  )
}

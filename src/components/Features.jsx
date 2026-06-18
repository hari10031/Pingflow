import { motion } from 'framer-motion'
import { Repeat, Database, BadgeDollarSign, GitFork } from 'lucide-react'
import SectionHeading from './SectionHeading'

const features = [
  {
    icon: Repeat,
    title: 'Automatic Pinging',
    body: 'GitHub Actions wakes every service on a 10-minute schedule, around the clock. No cron servers to babysit.',
  },
  {
    icon: Database,
    title: 'No Database',
    body: 'Every service lives in a single services.json file. Edit it, commit it, done — your config is just version control.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Completely Free',
    body: 'Runs entirely on the GitHub Actions free tier. No monthly bill, no credit card, no surprise invoices.',
  },
  {
    icon: GitFork,
    title: 'Open Source',
    body: 'A fully transparent implementation you can read, fork, and trust. Nothing happens off-screen.',
  },
]

export default function Features() {
  return (
    <section id="features" className="section-pad py-20 sm:py-28">
      <SectionHeading
        eyebrow="Why PingFlow"
        title="Uptime that runs itself"
        subtitle="Four moving parts, none of which you have to maintain. Set it once and let GitHub do the rest."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {features.map((f, i) => (
          <motion.article
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="glass glass-hover group relative overflow-hidden rounded-2xl p-6 sm:p-7"
          >
            {/* hover glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-signal-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

            <div className="grid h-12 w-12 place-items-center rounded-xl border border-signal-400/20 bg-signal-500/10 text-signal-400 transition-colors group-hover:border-signal-400/40">
              <f.icon className="h-6 w-6" strokeWidth={2} />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-2.5 leading-relaxed text-ink-300">{f.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

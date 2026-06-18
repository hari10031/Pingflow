import { motion } from 'framer-motion'
import { Boxes, Radio, Timer, GitBranch } from 'lucide-react'
import Counter from './Counter'
import services from '../data/services.json'
import { PING_INTERVAL_MINUTES } from '../config'

// Runs accumulate at 6/hour, 144/day. This is derived, not fetched —
// it reflects the cadence of the workflow rather than a live API count.
const runsPerDay = (60 / PING_INTERVAL_MINUTES) * 24

export default function Stats() {
  const stats = [
    { icon: Boxes, label: 'Total Services', value: services.length, suffix: '' },
    { icon: Radio, label: 'Active Services', value: services.length, suffix: '' },
    { icon: Timer, label: 'Ping Interval', value: PING_INTERVAL_MINUTES, suffix: 'min' },
    { icon: GitBranch, label: 'Runs / Day', value: runsPerDay, suffix: '' },
  ]

  return (
    <section className="section-pad py-16 sm:py-20">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass glass-hover rounded-2xl p-5 sm:p-6"
          >
            <s.icon className="h-5 w-5 text-signal-400" strokeWidth={2} />
            <div className="mt-4 flex items-baseline gap-1.5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              <Counter value={s.value} />
              {s.suffix && (
                <span className="text-base font-medium text-ink-500 sm:text-lg">{s.suffix}</span>
              )}
            </div>
            <p className="mt-1 font-mono text-xs uppercase tracking-wider text-ink-500">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

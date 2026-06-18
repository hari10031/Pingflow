import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, SatelliteDish } from 'lucide-react'
import SectionHeading from './SectionHeading'
import ServiceCard from './ServiceCard'
import SkeletonCard from './SkeletonCard'
import services from '../data/services.json'

export default function ServicesDashboard() {
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  // Briefly show skeletons on first paint so the dashboard reads the same way
  // it would against a slower source.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return services
    return services.filter(
      (s) => s.name.toLowerCase().includes(q) || s.url.toLowerCase().includes(q),
    )
  }, [query, services])

  return (
    <section id="services" className="section-pad py-20 sm:py-28">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          align="left"
          eyebrow="Services dashboard"
          title="Everything you're keeping awake"
          subtitle="Read straight from services.json. Each card is a service the workflow pings on schedule."
        />

        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services…"
            aria-label="Search services"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-ink-100 placeholder:text-ink-500 transition-colors focus:border-signal-400/40 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: Math.max(services.length, 3) }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        ) : filtered.length > 0 ? (
          filtered.map((service, i) => (
            <ServiceCard key={service.url} service={service} index={i} />
          ))
        ) : (
          <EmptyState query={query} onClear={() => setQuery('')} />
        )}
      </div>
    </section>
  )
}

function EmptyState({ query, onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass col-span-full flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center"
    >
      <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-ink-500">
        <SatelliteDish className="h-7 w-7" />
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold">
        {query ? `No services match “${query}”` : 'No services yet'}
      </h3>
      <p className="mt-1.5 max-w-sm text-ink-300">
        {query ? (
          <>Try a different name or URL, or clear the search.</>
        ) : (
          <>
            Add entries to <code className="font-mono text-signal-300">services.json</code> and
            commit them to see them here.
          </>
        )}
      </p>
      {query && (
        <button
          onClick={onClear}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/12 px-4 py-2.5 text-sm font-medium text-ink-100 transition-colors hover:border-white/25 hover:bg-white/5"
        >
          Clear search
        </button>
      )}
    </motion.div>
  )
}

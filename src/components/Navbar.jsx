import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Github, Menu, X } from 'lucide-react'
import { GITHUB_REPO } from '../config'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Try it', href: '#try' },
  { label: 'Services', href: '#services' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="section-pad pt-3 sm:pt-4">
        <nav
          className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 ${
            scrolled ? 'glass' : 'border border-transparent'
          }`}
        >
          <a href="#top" className="group flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-signal-gradient shadow-glow">
              <Activity className="h-5 w-5 text-void-900" strokeWidth={2.6} />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Ping<span className="gradient-text">Flow</span>
            </span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-ink-300 transition-colors hover:text-ink-100"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-2 text-sm text-ink-100 transition-colors hover:border-white/25 hover:bg-white/5"
            >
              <Github className="h-4 w-4" />
              Star
            </a>
            <a
              href="#services"
              className="inline-flex items-center rounded-xl bg-signal-gradient px-4 py-2 text-sm font-semibold text-void-900 shadow-glow transition-transform hover:-translate-y-0.5"
            >
              View Services
            </a>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-ink-100 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass mt-2 flex flex-col gap-1 rounded-2xl p-3 md:hidden"
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm text-ink-300 hover:bg-white/5 hover:text-ink-100"
              >
                {l.label}
              </a>
            ))}
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-signal-gradient px-4 py-3 text-sm font-semibold text-void-900"
            >
              <Github className="h-4 w-4" /> GitHub Repository
            </a>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}

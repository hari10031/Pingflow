import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import SectionHeading from './SectionHeading'

const faqs = [
  {
    q: 'Is PingFlow free?',
    a: 'Yes — completely. PingFlow runs on the GitHub Actions free tier and stores everything in a JSON file. There is no backend to pay for and no subscription.',
  },
  {
    q: 'Does it work with Render?',
    a: 'Absolutely. Render free web services sleep after inactivity. Point PingFlow at your Render health endpoint and it will keep the instance warm.',
  },
  {
    q: 'Does it work with Railway?',
    a: 'Yes. Add your Railway service URL to services.json and the workflow pings it on the same 10-minute schedule as every other service.',
  },
  {
    q: 'Do I need a database?',
    a: 'No. Your services live in a single services.json file tracked in git. Adding, editing, or removing a service is just a commit — there is nothing else to manage.',
  },
  {
    q: 'How often are services pinged?',
    a: 'Every 10 minutes by default, on a GitHub Actions cron schedule. You can change the interval by editing the cron expression in the workflow file.',
  },
]

function Item({ faq, isOpen, onToggle, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="glass overflow-hidden rounded-2xl"
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
      >
        <span className="font-display text-base font-semibold tracking-tight sm:text-lg">
          {faq.q}
        </span>
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-signal-400 transition-transform duration-300 ${
            isOpen ? 'rotate-45 border-signal-400/40 bg-signal-500/10' : ''
          }`}
        >
          <Plus className="h-4 w-4" />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="px-5 pb-5 leading-relaxed text-ink-300 sm:px-6">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="section-pad py-20 sm:py-28">
      <SectionHeading
        eyebrow="FAQ"
        title="Questions, answered"
        subtitle="Everything you might want to know before pointing PingFlow at your services."
      />

      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {faqs.map((faq, i) => (
          <Item
            key={faq.q}
            faq={faq}
            index={i}
            isOpen={open === i}
            onToggle={() => setOpen(open === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  )
}

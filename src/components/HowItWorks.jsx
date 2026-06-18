import { motion } from 'framer-motion'
import { FilePlus2, UploadCloud, PlayCircle, HeartPulse } from 'lucide-react'
import SectionHeading from './SectionHeading'

const steps = [
  {
    icon: FilePlus2,
    title: 'Add your backend URL',
    body: 'Drop your service name and health endpoint into services.json.',
    code: '{ "name": "Portfolio API", "url": ".../health" }',
  },
  {
    icon: UploadCloud,
    title: 'Push changes to GitHub',
    body: 'Commit the file. That commit is the only deploy step there is.',
    code: 'git commit -m "add service" && git push',
  },
  {
    icon: PlayCircle,
    title: 'Actions runs automatically',
    body: 'A scheduled workflow fires every 10 minutes and pings each URL.',
    code: 'schedule: cron "*/10 * * * *"',
  },
  {
    icon: HeartPulse,
    title: 'Your backend stays responsive',
    body: 'Idle never sets in, so real users always hit a warm server.',
    code: '200 OK · service is awake',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-pad py-20 sm:py-28">
      <SectionHeading
        eyebrow="How it works"
        title="From file to heartbeat in four steps"
        subtitle="No dashboards to configure and no infrastructure to provision. The whole pipeline is a JSON file and a workflow."
      />

      <div className="relative mt-16">
        {/* vertical signal spine (desktop) */}
        <div
          className="absolute left-[27px] top-2 bottom-2 hidden w-px bg-gradient-to-b from-signal-400/60 via-beam-400/40 to-transparent md:block"
          aria-hidden
        />

        <ol className="space-y-5">
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex gap-4 sm:gap-6"
            >
              {/* numbered node */}
              <div className="relative z-10 flex shrink-0 flex-col items-center">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-void-700 shadow-glass">
                  <s.icon className="h-6 w-6 text-signal-400" strokeWidth={2} />
                </div>
                <span className="mt-2 font-mono text-xs text-ink-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="glass glass-hover flex-1 rounded-2xl p-5 sm:p-6">
                <h3 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
                  {s.title}
                </h3>
                <p className="mt-1.5 leading-relaxed text-ink-300">{s.body}</p>
                <code className="mt-4 block overflow-x-auto rounded-lg border border-white/[0.06] bg-void-900/60 px-3.5 py-2.5 font-mono text-[12.5px] text-signal-300">
                  {s.code}
                </code>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

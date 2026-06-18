/**
 * A radar-style "live" indicator: a solid core with an expanding ripple,
 * echoing the ping signal that keeps each service awake.
 */
export default function StatusDot({ label = 'Active' }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ripple rounded-full bg-signal-400/70" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-signal-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.7)]" />
      </span>
      <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-signal-300">
        {label}
      </span>
    </span>
  )
}

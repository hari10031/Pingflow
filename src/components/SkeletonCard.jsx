export default function SkeletonCard() {
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 shrink-0 rounded-xl bg-white/[0.06]" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-2/3 rounded bg-white/[0.06]" />
          <div className="h-2.5 w-1/2 rounded bg-white/[0.04]" />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
        <div className="h-6 w-24 rounded-lg bg-white/[0.05]" />
        <div className="h-3 w-12 rounded bg-white/[0.04]" />
      </div>

      {/* shimmer sweep */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
    </div>
  )
}

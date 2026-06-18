import { motion } from 'framer-motion'

/**
 * The signature element: an EKG-style heartbeat that "draws" itself on a loop.
 * It's the visual thesis of PingFlow — your backend has a pulse.
 */
export default function PulseLine({ className = '', strokeWidth = 2.5 }) {
  // A single heartbeat segment, tiled horizontally so the line never looks empty.
  const beat = 'l14 0 l5 -22 l7 44 l6 -28 l4 14 l3 -8 l16 0'

  return (
    <svg
      viewBox="0 0 760 120"
      preserveAspectRatio="none"
      className={className}
      role="img"
      aria-label="Animated heartbeat representing live service pings"
    >
      <defs>
        <linearGradient id="pulseStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#10b981" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="pulseFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#070b10" stopOpacity="1" />
          <stop offset="0.08" stopColor="#070b10" stopOpacity="0" />
          <stop offset="0.92" stopColor="#070b10" stopOpacity="0" />
          <stop offset="1" stopColor="#070b10" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* faint baseline */}
      <line x1="0" y1="60" x2="760" y2="60" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

      <motion.path
        d={`M0 60 ${beat} ${beat} ${beat} ${beat} ${beat} ${beat} ${beat} ${beat} ${beat} ${beat}`}
        fill="none"
        stroke="url(#pulseStroke)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0.2 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 3.4, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' },
          opacity: { duration: 0.6 },
        }}
        style={{ filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.55))' }}
      />

      {/* edge fade so the tiling reads as an infinite signal */}
      <rect x="0" y="0" width="760" height="120" fill="url(#pulseFade)" />
    </svg>
  )
}

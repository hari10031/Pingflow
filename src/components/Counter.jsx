import { useEffect, useRef } from 'react'
import { animate, useInView, useMotionValue, useTransform, motion } from 'framer-motion'

/**
 * Counts up to `value` the first time it scrolls into view.
 * Honors prefers-reduced-motion by snapping straight to the final value.
 */
export default function Counter({ value, decimals = 0, duration = 1.6 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) =>
    decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toLocaleString(),
  )

  useEffect(() => {
    if (!inView) return
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      count.set(value)
      return
    }
    const controls = animate(count, value, { duration, ease: [0.22, 1, 0.36, 1] })
    return controls.stop
  }, [inView, value, duration, count])

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
    </span>
  )
}

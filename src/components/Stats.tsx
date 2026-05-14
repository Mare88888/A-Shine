'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { motion, useInView } from 'framer-motion'
import { cardHover } from '@/lib/motion'

const STATS = [
  { value: '100+', key: 'vehicles' },
  { value: '200 km', key: 'radius' },
  { value: '50 km', key: 'free' },
  { value: '5★', key: 'rating' },
] as const

export default function Stats() {
  const t = useTranslations('stats')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })

  return (
    <div ref={ref} role="region" aria-label="Key figures" className="bg-border-default py-px">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
        {STATS.map(({ value, key }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.09, ease: [0.32, 0.72, 0, 1] }}
            whileHover={cardHover}
            className="group relative bg-premium-black flex flex-col items-center justify-center py-5 px-6 text-center gap-1 cursor-default transition-colors duration-300 hover:bg-premium-charcoal motion-reduce:transition-none"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-6 bottom-2 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-premium-accent to-transparent opacity-0 transition-all duration-300 ease-out group-hover:scale-x-100 group-hover:opacity-100 motion-reduce:transition-none"
            />
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-premium-accent leading-none transition-transform duration-300 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
              {value}
            </span>
            <span className="text-[11px] uppercase tracking-[0.16em] text-text-muted transition-colors duration-300 group-hover:text-text-secondary motion-reduce:transition-none">
              {t(key)}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

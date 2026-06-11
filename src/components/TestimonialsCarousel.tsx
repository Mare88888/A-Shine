'use client'

import { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ease } from '@/lib/motion'
import {
  reviewQuote,
  reviewRelativeTime,
  type GoogleReview,
} from '@/lib/google-reviews'

const SLIDES_DESKTOP = 3
const SLIDES_MOBILE = 1
const MOBILE_BREAKPOINT = 640
const GAP_PX = 24
const TRACK_BUFFER_PX = 4
const MIN_CARD_WIDTH_PX = 200
const CAROUSEL_TRANSITION = { duration: 0.55, ease }

const CAROUSEL_BTN_CLASS =
  'absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border-default bg-premium-charcoal text-text-primary hover:text-premium-accent hover:border-premium-accent transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-premium-accent focus:ring-offset-2 focus:ring-offset-premium-black'
const PROGRESS_THUMB_RATIO = 0.34

type Props = {
  reviews: GoogleReview[]
  rating: number
  total: number
  mapsUri: string
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <motion.div
      className="flex items-center gap-0.5 mb-3"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-premium-accent' : 'text-border-default'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
        </svg>
      ))}
    </motion.div>
  )
}

function ReviewCard({
  review,
  locale,
  googleReviewLabel,
}: {
  review: GoogleReview
  locale: string
  googleReviewLabel: string
}) {
  const quote = reviewQuote(review, locale)
  const when = reviewRelativeTime(review, locale)
  const author = review.authorUrl ? (
    <a
      href={review.authorUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="not-italic font-semibold text-text-primary text-body-sm hover:text-premium-accent transition-colors"
    >
      {review.author}
    </a>
  ) : (
    <cite className="not-italic font-semibold text-text-primary text-body-sm">
      {review.author}
    </cite>
  )

  return (
    <blockquote className="flex flex-col h-full p-5 sm:p-6 rounded-card bg-premium-charcoal border border-border-default min-h-[200px] shrink-0">
      <StarRating rating={review.rating} />
      <p className="flex-1 text-text-secondary italic text-body-sm sm:text-body">
        &ldquo;{quote}&rdquo;
      </p>
      <footer className="mt-4 shrink-0">
        {author}
        <span className="text-text-muted text-body-sm flex items-center gap-1.5 mt-1">
          <GoogleIcon className="h-3.5 w-3.5 shrink-0" />
          {googleReviewLabel}
          {when ? <span aria-hidden> · {when}</span> : null}
        </span>
      </footer>
    </blockquote>
  )
}

export default function TestimonialsCarousel({
  reviews,
  rating,
  total,
  mapsUri,
}: Props) {
  const t = useTranslations('testimonials')
  const locale = useLocale()
  const count = reviews.length
  const [index, setIndex] = useState(0)
  const [stepPx, setStepPx] = useState(0)
  const [layoutReady, setLayoutReady] = useState(false)
  const [slidesVisible, setSlidesVisible] = useState(SLIDES_DESKTOP)
  const trackRef = useRef<HTMLDivElement>(null)
  const prevIndexRef = useRef(0)
  const prevStepPxRef = useRef(0)
  const maxIndex = Math.max(0, count - slidesVisible)

  useLayoutEffect(() => {
    const el = trackRef.current
    if (!el) return
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const update = () => {
      const mobile = mq.matches
      const vis = mobile ? SLIDES_MOBILE : SLIDES_DESKTOP
      setSlidesVisible(vis)

      const w = el.getBoundingClientRect().width
      const contentWidth = Math.max(MIN_CARD_WIDTH_PX, w - TRACK_BUFFER_PX)
      setStepPx((contentWidth + GAP_PX) / vis)
      setLayoutReady(true)
    }
    update()

    const ro = new ResizeObserver(update)
    ro.observe(el)
    mq.addEventListener('change', update)
    return () => {
      ro.disconnect()
      mq.removeEventListener('change', update)
    }
  }, [])

  // Animate the slide only when the index actually changes - never on the
  // first measurement or on resize (those should snap, not glide).
  const indexChanged = layoutReady && prevIndexRef.current !== index
  const stepChanged = layoutReady && prevStepPxRef.current !== stepPx
  const slideTransition =
    indexChanged && !stepChanged ? CAROUSEL_TRANSITION : { duration: 0 }

  useLayoutEffect(() => {
    prevIndexRef.current = index
    prevStepPxRef.current = stepPx
  }, [index, stepPx])

  useEffect(() => {
    if (index > maxIndex) setIndex(maxIndex)
  }, [index, maxIndex])

  const goTo = useCallback(
    (nextIndex: number) => {
      setIndex(Math.max(0, Math.min(maxIndex, nextIndex)))
    },
    [maxIndex],
  )

  const goPrev = useCallback(() => goTo(index - 1), [index, goTo])
  const goNext = useCallback(() => goTo(index + 1), [index, goTo])

  const seekFromTrack = useCallback(
    (clientX: number, track: HTMLDivElement) => {
      const { left, width } = track.getBoundingClientRect()
      const pct = Math.max(0, Math.min(1, (clientX - left) / width))
      goTo(Math.round(pct * maxIndex))
    },
    [goTo, maxIndex],
  )

  if (count === 0) return null

  const progress = maxIndex > 0 ? index / maxIndex : 0
  const thumbTravelPct = (1 - PROGRESS_THUMB_RATIO) * 100

  const ratingDisplay = Number.isInteger(rating) ? String(rating) : rating.toFixed(1)

  return (
    <>
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 sm:mb-10"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <a href={mapsUri} target="_blank" rel="noopener noreferrer">
          <motion.div
            className="inline-flex items-center gap-3 rounded-card border border-border-default bg-premium-charcoal px-5 py-3"
            aria-label={t('ratingSummary', { rating: ratingDisplay, count: total })}
          >
            <GoogleIcon className="h-6 w-6" />
            <div className="text-left">
              <p className="text-h3 text-text-primary leading-none">
                {ratingDisplay}
                <span className="text-premium-accent ml-1" aria-hidden>
                  ★
                </span>
              </p>
              <p className="text-body-sm text-text-muted mt-0.5">
                {t('ratingSummary', { rating: ratingDisplay, count: total })}
              </p>
            </div>
          </motion.div>
        </a>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={mapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-body-sm px-5 py-2.5"
          >
            {t('seeAllReviews')}
          </a>
          <a
            href={mapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-body-sm font-medium text-premium-accent hover:text-premium-accent-light transition-colors"
          >
            {t('writeReview')}
          </a>
        </div>
      </motion.div>

      <div className="relative">
        {maxIndex > 0 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              disabled={index === 0}
              className={`left-0 -translate-x-2 sm:translate-x-0 ${CAROUSEL_BTN_CLASS} disabled:opacity-40 disabled:pointer-events-none`}
              aria-label={t('prev')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={index >= maxIndex}
              className={`right-0 translate-x-2 sm:translate-x-0 ${CAROUSEL_BTN_CLASS} disabled:opacity-40 disabled:pointer-events-none`}
              aria-label={t('next')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        <motion.div className="overflow-hidden pl-14 pr-14 sm:pl-20 sm:pr-20 relative min-h-[240px] sm:min-h-[220px]">
          <div ref={trackRef} className="w-full overflow-hidden">
            <motion.div
              className="flex gap-6 min-h-[240px] sm:min-h-[220px]"
              style={{ width: 'max-content' }}
              initial={false}
              animate={{ x: layoutReady ? -index * stepPx : 0 }}
              transition={slideTransition}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="shrink-0"
                  style={
                    layoutReady
                      ? { width: stepPx - GAP_PX, minWidth: stepPx - GAP_PX }
                      : {
                        flex: `0 0 calc((100% - ${(slidesVisible - 1) * GAP_PX}px) / ${slidesVisible})`,
                      }
                  }
                >
                  <ReviewCard
                    review={review}
                    locale={locale}
                    googleReviewLabel={t('googleReview')}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {maxIndex > 0 && (
          <div className="flex justify-center mt-6">
            <div
              className="relative h-1 w-28 sm:w-36 rounded-full bg-premium-graphite cursor-pointer"
              role="slider"
              aria-valuemin={0}
              aria-valuemax={maxIndex}
              aria-valuenow={index}
              aria-label={t('carouselNav')}
              tabIndex={0}
              onClick={(e) => seekFromTrack(e.clientX, e.currentTarget)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') {
                  e.preventDefault()
                  goPrev()
                } else if (e.key === 'ArrowRight') {
                  e.preventDefault()
                  goNext()
                }
              }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-premium-accent pointer-events-none"
                style={{ width: `${PROGRESS_THUMB_RATIO * 100}%` }}
                animate={{ left: `${progress * thumbTravelPct}%` }}
                transition={slideTransition}
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

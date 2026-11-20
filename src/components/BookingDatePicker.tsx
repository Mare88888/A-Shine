'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  addDaysIso,
  endOfMonthIso,
  fetchAvailabilityDays,
  startOfMonthIso,
  todayInMaribor,
} from '@/lib/booking-api'

type Props = {
  id: string
  name: string
  value: string
  serviceCode: string | null
  minDate: string
  required?: boolean
  disabled?: boolean
  invalid?: boolean
  describedBy?: string
  className?: string
  onChange: (date: string) => void
  onBlur?: () => void
}

const WEEKDAYS_SL = ['Po', 'To', 'Sr', 'Če', 'Pe', 'So', 'Ne']
const WEEKDAYS_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function monthLabel(isoMonthStart: string, locale: string): string {
  const [y, m] = isoMonthStart.split('-').map(Number)
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'sl-SI', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(y, m - 1, 1)))
}

function buildMonthCells(monthStart: string): (string | null)[] {
  const [y, m] = monthStart.split('-').map(Number)
  const first = new Date(Date.UTC(y, m - 1, 1))
  // Mon=0 … Sun=6
  const mondayIndex = (first.getUTCDay() + 6) % 7
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate()
  const cells: (string | null)[] = []
  for (let i = 0; i < mondayIndex; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(
      `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    )
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export default function BookingDatePicker({
  id,
  name,
  value,
  serviceCode,
  minDate,
  required,
  disabled,
  invalid,
  describedBy,
  className = '',
  onChange,
  onBlur,
}: Props) {
  const t = useTranslations('contact')
  const locale = useLocale()
  const today = todayInMaribor()
  const effectiveMin = minDate > today ? minDate : today

  const initialMonth = startOfMonthIso(value || effectiveMin)
  const [monthStart, setMonthStart] = useState(initialMonth)
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set())
  const [loadingDays, setLoadingDays] = useState(false)
  const [daysFailed, setDaysFailed] = useState(false)

  const weekdays = locale === 'en' ? WEEKDAYS_EN : WEEKDAYS_SL
  const cells = useMemo(() => buildMonthCells(monthStart), [monthStart])

  useEffect(() => {
    if (value) {
      setMonthStart(startOfMonthIso(value))
    }
  }, [value])

  useEffect(() => {
    if (!serviceCode) {
      setUnavailable(new Set())
      setLoadingDays(false)
      setDaysFailed(false)
      return
    }
    const from = startOfMonthIso(monthStart)
    const to = endOfMonthIso(addDaysIso(monthStart, 40)) // cover this + next month peek
    const ac = new AbortController()
    setLoadingDays(true)
    setDaysFailed(false)
    fetchAvailabilityDays(from, to, serviceCode, ac.signal)
      .then((data) => {
        const blocked = new Set(
          data.days.filter((d) => !d.available).map((d) => d.date)
        )
        setUnavailable(blocked)
        if (value && blocked.has(value)) {
          onChange('')
        }
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setUnavailable(new Set())
        setDaysFailed(true)
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoadingDays(false)
      })
    return () => ac.abort()
  }, [serviceCode, monthStart])

  function shiftMonth(delta: number) {
    const [y, m] = monthStart.split('-').map(Number)
    const next = new Date(Date.UTC(y, m - 1 + delta, 1))
    setMonthStart(
      `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, '0')}-01`
    )
  }

  function isDisabled(date: string): boolean {
    if (date < effectiveMin) return true
    if (!serviceCode) return true
    if (daysFailed) return false
    return unavailable.has(date)
  }

  return (
    <div className={className}>
      <input type="hidden" id={id} name={name} value={value} required={required} />
      <div
        className={`rounded-sharp border bg-premium-black/40 p-3 ${
          invalid ? 'border-error' : 'border-border-default'
        }`}
        onBlur={onBlur}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            disabled={disabled || endOfMonthIso(addDaysIso(monthStart, -1)) < effectiveMin}
            className="rounded-sharp px-2 py-1 text-text-secondary hover:text-premium-accent disabled:opacity-30"
            aria-label={t('prevMonth')}
          >
            ‹
          </button>
          <p className="text-body-sm font-medium capitalize text-text-primary">
            {monthLabel(monthStart, locale)}
          </p>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            disabled={disabled}
            className="rounded-sharp px-2 py-1 text-text-secondary hover:text-premium-accent disabled:opacity-30"
            aria-label={t('nextMonth')}
          >
            ›
          </button>
        </div>

        {!serviceCode ? (
          <p className="py-6 text-center text-body-sm text-text-muted">{t('selectServiceForDates')}</p>
        ) : (
          <>
            <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[0.7rem] uppercase tracking-wide text-text-muted">
              {weekdays.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            <div
              className="grid grid-cols-7 gap-1"
              role="grid"
              aria-label={t('preferredDate')}
              aria-describedby={describedBy}
            >
              {cells.map((date, index) => {
                if (!date) {
                  return <span key={`e-${index}`} className="aspect-square" />
                }
                const selected = value === date
                const unavailableDay = isDisabled(date)
                return (
                  <button
                    key={date}
                    type="button"
                    disabled={disabled || unavailableDay || loadingDays}
                    onClick={() => onChange(date)}
                    aria-pressed={selected}
                    aria-disabled={unavailableDay}
                    title={
                      unavailableDay && date >= effectiveMin
                        ? t('dateUnavailable')
                        : undefined
                    }
                    className={[
                      'aspect-square rounded-sharp text-body-sm transition-colors',
                      selected
                        ? 'bg-premium-accent text-white'
                        : unavailableDay
                          ? 'cursor-not-allowed bg-premium-graphite/40 text-text-disabled line-through opacity-50'
                          : 'text-text-primary hover:bg-premium-accent/20 hover:text-premium-accent',
                    ].join(' ')}
                  >
                    {Number(date.slice(8))}
                  </button>
                )
              })}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[0.7rem] text-text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-premium-accent/80" aria-hidden />
                {t('dateAvailable')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-sm bg-premium-graphite/80 line-through opacity-70"
                  aria-hidden
                />
                {t('dateUnavailable')}
              </span>
              {loadingDays && <span>{t('loadingDays')}</span>}
              {daysFailed && (
                <span className="text-error">{t('errors.daysLoad')}</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { readStoredLocale } from '@/lib/locale-storage'
import type { Locale } from '@/i18n/routing'

export default function LocaleFromStorage() {
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()
  const applied = useRef(false)

  useEffect(() => {
    if (applied.current) return
    const stored = readStoredLocale()
    if (!stored || stored === locale) {
      applied.current = true
      return
    }
    applied.current = true
    router.replace(pathname, { locale: stored })
  }, [locale, pathname, router])

  return null
}

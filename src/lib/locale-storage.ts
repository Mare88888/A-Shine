import { routing, type Locale } from '@/i18n/routing'

export const LOCALE_STORAGE_KEY = 'ashine_locale'

export function readStoredLocale(): Locale | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (!raw) return null
    return routing.locales.includes(raw as Locale) ? (raw as Locale) : null
  } catch {
    return null
  }
}

export function writeStoredLocale(locale: Locale): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // Private mode / blocked storage — ignore
  }
}

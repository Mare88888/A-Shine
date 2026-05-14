import { routing, type Locale } from '@/i18n/routing'
import { SITE_URL } from '@/config/site'

/** Open Graph `locale` value per next-intl locale. */
export const OG_LOCALE: Record<Locale, string> = {
  sl: 'sl_SI',
  en: 'en_GB',
}

/** Canonical absolute URL for `<locale>/<path?>`. Default locale has no prefix. */
export function localePath(locale: Locale, path = ''): string {
  const cleanPath = path.replace(/^\/+/, '')
  const base =
    locale === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${locale}`
  return cleanPath ? `${base}/${cleanPath}` : base
}

/**
 * Build `alternates.languages` for a given path (without locale prefix).
 * Includes `x-default` pointing to the default locale.
 */
export function languageAlternates(path = ''): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of routing.locales) {
    languages[locale] = localePath(locale, path)
  }
  languages['x-default'] = localePath(routing.defaultLocale, path)
  return languages
}

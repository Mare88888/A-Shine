import type { MetadataRoute } from 'next'
import { routing, type Locale } from '@/i18n/routing'
import { SITE_URL } from '@/config/site'

const STATIC_PAGES = ['privacy', 'terms', 'cookies'] as const
type StaticPage = (typeof STATIC_PAGES)[number]

function urlFor(locale: Locale, page?: StaticPage): string {
  const base =
    locale === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${locale}`
  return page ? `${base}/${page}` : base
}

function languageAlternates(page?: StaticPage): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of routing.locales) {
    languages[locale] = urlFor(locale, page)
  }
  languages['x-default'] = urlFor(routing.defaultLocale, page)
  return languages
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const locale of routing.locales) {
    entries.push({
      url: urlFor(locale),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages: languageAlternates() },
    })
    for (const page of STATIC_PAGES) {
      entries.push({
        url: urlFor(locale, page),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.5,
        alternates: { languages: languageAlternates(page) },
      })
    }
  }

  return entries
}

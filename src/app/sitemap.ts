import type { MetadataRoute } from 'next'
import { routing, type Locale } from '@/i18n/routing'
import { languageAlternates, localePath } from '@/lib/seo'

const STATIC_PAGES = ['privacy', 'terms', 'cookies'] as const
type StaticPage = (typeof STATIC_PAGES)[number]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const locale of routing.locales) {
    entries.push({
      url: localePath(locale as Locale),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages: languageAlternates() },
    })
    for (const page of STATIC_PAGES) {
      entries.push({
        url: localePath(locale as Locale, page),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.5,
        alternates: { languages: languageAlternates(page) },
      })
    }
  }

  return entries
}

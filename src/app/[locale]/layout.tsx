import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { languageAlternates, localePath, OG_LOCALE } from '@/lib/seo'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'
import MobileCTABar from '@/components/MobileCTABar'
import LocaleFromStorage from '@/components/LocaleFromStorage'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

function isValidLocale(locale: string): locale is Locale {
  return routing.locales.includes(locale as Locale)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  return {
    openGraph: {
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE[l]),
      url: localePath(locale),
    },
    alternates: {
      canonical: localePath(locale),
      languages: languageAlternates(),
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleFromStorage />
      <Nav />
      <main className="flex-1" id="main-content">
        {children}
      </main>
      <Footer />
      <MobileCTABar />
      <CookieBanner />
    </NextIntlClientProvider>
  )
}

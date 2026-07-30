import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing, type Locale } from '@/i18n/routing'
import { languageAlternates, localePath } from '@/lib/seo'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Gallery from '@/components/Gallery'
import Pricing from '@/components/Pricing'
import MapSection from '@/components/MapSection'
import Testimonials from '@/components/Testimonials'
import Contact from '@/components/Contact'
import { JsonLd } from '@/components'
import Stats from '@/components/Stats'

type Props = { params: Promise<{ locale: string }> }

function isValidLocale(locale: string): locale is Locale {
  return routing.locales.includes(locale as Locale)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  const t = await getTranslations({ locale, namespace: 'metadata' })
  const url = localePath(locale)
  return {
    title: { absolute: t('homeTitle') },
    description: t('homeDescription'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url,
    },
    twitter: {
      title: t('ogTitle'),
      description: t('ogDescription'),
    },
    alternates: {
      canonical: url,
      languages: languageAlternates(),
    },
  }
}

export default async function Home({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <JsonLd />
      <Hero backgroundVideo="/HeroVideoNew.webm" />
      <Stats />
      <About />
      <Gallery />
      <Pricing />
      <MapSection />
      <Testimonials />
      <Contact />
    </>
  )
}

import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { CONTACT_EMAIL } from '@/config/site'
import { routing, type Locale } from '@/i18n/routing'
import { languageAlternates, localePath } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!routing.locales.includes(locale as Locale)) return {}
  const t = await getTranslations({ locale, namespace: 'privacy' })
  const url = localePath(locale as Locale, 'privacy')
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: url,
      languages: languageAlternates('privacy'),
    },
    openGraph: { url },
  }
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('privacy')

  return (
    <article className="section-padding bg-premium-black min-h-screen">
      <div className="container-narrow">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-body-sm text-text-muted hover:text-premium-accent transition-colors mb-8"
        >
          {t('backToHome')}
        </Link>
        <h1 className="text-h1 text-text-primary mb-2">{t('title')}</h1>
        <p className="text-body-sm text-text-muted mb-10">{t('lastUpdated')}</p>

        <div className="prose prose-invert max-w-none space-y-6 text-body text-text-secondary">
          <section>
            <h2 className="text-h4 text-text-primary mt-8 mb-3">{t('whoWeAreTitle')}</h2>
            <p>{t('whoWeAreBody')}</p>
          </section>

          <section>
            <h2 className="text-h4 text-text-primary mt-8 mb-3">{t('dataWeCollectTitle')}</h2>
            <p>{t('dataWeCollectIntro')}</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>{t('dataWeCollect1')}</li>
              <li>{t('dataWeCollect2')}</li>
              <li>{t('dataWeCollect3')}</li>
              <li>{t('dataWeCollect4')}</li>
              <li>{t('dataWeCollect5')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h4 text-text-primary mt-8 mb-3">{t('howWeUseTitle')}</h2>
            <p>{t('howWeUseIntro')}</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>{t('howWeUse1')}</li>
              <li>{t('howWeUse2')}</li>
              <li>{t('howWeUse3')}</li>
              <li>{t('howWeUse4')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h4 text-text-primary mt-8 mb-3">{t('appointmentsTitle')}</h2>
            <p>{t('appointmentsStored')}</p>
            <p className="mt-3">{t('appointmentsAccess')}</p>
            <p className="mt-3">{t('appointmentsRetention')}</p>
          </section>

          <section>
            <h2 className="text-h4 text-text-primary mt-8 mb-3">{t('legalBasisTitle')}</h2>
            <p>{t('legalBasisBody')}</p>
          </section>

          <section>
            <h2 className="text-h4 text-text-primary mt-8 mb-3">{t('sharingTitle')}</h2>
            <p>{t('sharingBody')}</p>
          </section>

          <section>
            <h2 className="text-h4 text-text-primary mt-8 mb-3">{t('additionalTitle')}</h2>
            <p>{t('additionalProcessors')}</p>
            <p className="mt-3">{t('additionalSecurity')}</p>
            <p className="mt-3">{t('additionalDevice')}</p>
          </section>

          <section>
            <h2 className="text-h4 text-text-primary mt-8 mb-3">{t('yourRightsTitle')}</h2>
            <p>
              {t('yourRightsBody')}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-premium-accent hover:underline">
                {CONTACT_EMAIL}
              </a>
              {t('yourRightsSuffix')}
            </p>
          </section>

          <section>
            <h2 className="text-h4 text-text-primary mt-8 mb-3">{t('changesTitle')}</h2>
            <p>{t('changesBody')}</p>
          </section>
        </div>
      </div>
    </article>
  )
}

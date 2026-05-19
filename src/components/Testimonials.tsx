import { getTranslations } from 'next-intl/server'
import { SectionEntrance } from '@/components/MotionSection'
import { getGoogleReviews } from '@/lib/google-reviews'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'

export default async function Testimonials() {
  const t = await getTranslations('testimonials')
  const { reviews, rating, total, mapsUri } = await getGoogleReviews()

  return (
    <SectionEntrance
      id="testimonials"
      className="section-padding bg-premium-black scroll-mt-20"
      aria-labelledby="testimonials-heading"
    >
      <div className="container-narrow">
        <header className="text-center mb-6 sm:mb-8">
          <p className="text-premium-accent text-overline uppercase mb-2">{t('overline')}</p>
          <h2 id="testimonials-heading" className="text-h2 text-text-primary">
            {t('heading')}
          </h2>
          <p className="mt-4 text-body text-text-secondary max-w-2xl mx-auto">{t('subheading')}</p>
        </header>

        <TestimonialsCarousel
          reviews={reviews}
          rating={rating}
          total={total}
          mapsUri={mapsUri}
        />
      </div>
    </SectionEntrance>
  )
}

'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { BRAND, CONTACT_EMAIL } from '@/config/site'
import { motion } from 'framer-motion'

export function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1-.25 11.36 11.36 0 0 0 3.48.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .56 3.48 1 1 0 0 1-.25 1l-2.2 2.2z" />
    </svg>
  )
}
export function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7-8 5.34L4 8.7V6l8 5.33L20 6v2.7z" />
    </svg>
  )
}
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

const footerNavKeys = [
  { sectionId: 'about' as const, key: 'about' as const },
  { sectionId: 'gallery' as const, key: 'gallery' as const },
  { sectionId: 'pricing' as const, key: 'pricing' as const },
  { sectionId: 'map' as const, key: 'map' as const },
  { sectionId: 'testimonials' as const, key: 'testimonials' as const },
  { sectionId: 'contact' as const, key: 'bookNow' as const },
]

const SOCIAL_LINKS = [
  { href: 'https://www.instagram.com/ashinemobile/', label: 'Instagram' as const, Icon: InstagramIcon },
  { href: 'https://www.facebook.com/people/A-Shine/61576376247443/#', label: 'Facebook' as const, Icon: FacebookIcon },
  {
    href: 'https://www.tiktok.com/@ashinemobileslo?is_from_webapp=1&sender_device=pc',
    label: 'TikTok' as const,
    Icon: TikTokIcon,
  },
] as const

function isHomePath(pathname: string): boolean {
  return pathname === '/' || pathname === '/en' || pathname === '/sl'
}

function scrollToTop(e: React.MouseEvent<HTMLAnchorElement>) {
  if (typeof window === 'undefined') return
  if (isHomePath(window.location.pathname)) {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function BackToTop() {
  return (
    <motion.button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Back to top"
      className="inline-flex items-center gap-1.5 text-body-sm text-text-muted hover:text-premium-accent transition-colors duration-200 group"
    >
      <svg
        className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
      Back to top
    </motion.button>
  )
}

export default function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  return (
    <footer id="footer-root" className="bg-premium-black relative">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-premium-accent to-transparent" aria-hidden />
      <div className="container-narrow section-padding-x pt-8 pb-5 sm:pt-10 sm:pb-6 lg:pt-12 lg:pb-8">
        <div className="text-center max-w-md mx-auto mb-6 lg:mb-8">
          <Link
            href="/"
            onClick={scrollToTop}
            className="text-h4 text-text-primary hover:text-premium-accent transition-colors leading-tight"
          >
            {BRAND.name}
          </Link>
          <p className="mt-2 text-body-sm text-text-muted leading-snug">
            {t('tagline')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
          <div className="flex flex-col items-center text-center">
            <h4 className="text-[0.6875rem] font-semibold text-text-secondary uppercase tracking-wider mb-3">{t('quickLinks')}</h4>
            <div className="grid grid-flow-col grid-rows-3 gap-x-6 sm:gap-x-8 gap-y-1.5 text-left">
              {footerNavKeys.map((link) => (
                <Link
                  key={link.sectionId}
                  href="/"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault()
                    document.getElementById(link.sectionId)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-text-muted hover:text-premium-accent transition-colors duration-ui text-body-sm"
                >
                  {tNav(link.key)}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <h4 className="text-[0.6875rem] font-semibold text-text-secondary uppercase tracking-wider mb-3">{t('contact')}</h4>
            <ul className="space-y-1.5 text-body-sm text-text-muted">
              <li>
                <a href="tel:+38670742363" className="inline-flex items-center gap-2 hover:text-premium-accent transition-colors">
                  <PhoneIcon className="shrink-0" />
                  <span>+386 70 742 363</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 hover:text-premium-accent transition-colors">
                  <EmailIcon className="shrink-0" />
                  <span>{CONTACT_EMAIL}</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center text-center">
            <h4 className="text-[0.6875rem] font-semibold text-text-secondary uppercase tracking-wider mb-3">{t('follow')}</h4>
            <ul className="flex flex-col gap-1.5">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-text-secondary hover:text-premium-accent transition-colors duration-ui text-body-sm"
                  >
                    <Icon className="shrink-0" />
                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border-default flex flex-col items-center gap-2 text-center">
          <p className="hidden md:block text-[0.625rem] leading-snug text-text-muted/90 max-w-3xl px-2">
            {t('legalNameFull')}
          </p>
          <p className="text-text-muted text-[0.8125rem]">
            © {new Date().getFullYear()} {t('legalNameShort')} - {t('rights')}
          </p>
          <p className="text-text-muted text-[0.7rem]">
            Made by{' '}
            <a
              href="https://my-portfolio-nine-neon-53.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-text-secondary hover:text-premium-accent transition-colors underline-offset-2 hover:underline"
            >
              Marko Lempl
            </a>
          </p>
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.8125rem]">
            <Link href="/privacy" className="text-text-muted hover:text-premium-accent transition-colors">
              {t('privacy')}
            </Link>
            <span className="text-text-disabled">·</span>
            <Link href="/terms" className="text-text-muted hover:text-premium-accent transition-colors">
              {t('terms')}
            </Link>
            <span className="text-text-disabled">·</span>
            <Link href="/cookies" className="text-text-muted hover:text-premium-accent transition-colors">
              {t('cookies')}
            </Link>
          </nav>
          <BackToTop />
        </div>
      </div>
    </footer>
  )
}

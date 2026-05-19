import { ImageResponse } from 'next/og'
import { BRAND } from '@/config/site'
import { routing, type Locale } from '@/i18n/routing'
import enMessages from '../../../strings/en.json'
import slMessages from '../../../strings/sl.json'

const MESSAGES = { en: enMessages, sl: slMessages } as const

export const alt = `${BRAND.seoName} - Car Detailing & Mobile Valeting | Slovenia`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Props = { params: Promise<{ locale: string }> }

export default async function OpenGraphImage({ params }: Props) {
  const { locale } = await params
  const safeLocale: Locale = routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : routing.defaultLocale
  const m = MESSAGES[safeLocale].metadata

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          backgroundColor: BRAND.bg,
          color: '#ffffff',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 480,
            height: 480,
            borderRadius: 9999,
            backgroundColor: BRAND.accent,
            opacity: 0.12,
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 28,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: BRAND.accent,
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 9999,
              backgroundColor: BRAND.accent,
            }}
          />
          {BRAND.seoName}
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 88,
            lineHeight: 1.05,
            fontWeight: 700,
            letterSpacing: -1.5,
            maxWidth: 980,
          }}
        >
          {m.ogImageTitle}
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            color: '#9ca3af',
            maxWidth: 1040,
            lineHeight: 1.3,
          }}
        >
          {m.ogImageSubtitle}
        </div>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 22,
            color: '#6b7280',
            width: '100%',
          }}
        >
          <span>{m.ogImageAddress}</span>
          <span style={{ color: BRAND.accent }}>ashine.si</span>
        </div>
      </div>
    ),
    size,
  )
}

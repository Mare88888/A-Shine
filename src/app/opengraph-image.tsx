import { ImageResponse } from 'next/og'
import { BRAND } from '@/config/site'

export const alt = 'AShine — Car Detailing & Mobile Valeting | Slovenia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: `radial-gradient(ellipse at top right, ${BRAND.accent}33 0%, transparent 60%), ${BRAND.bg}`,
          color: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
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
              borderRadius: 999,
              background: BRAND.accent,
              boxShadow: `0 0 24px ${BRAND.accent}`,
            }}
          />
          AShine
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
          Car Detailing & Mobile Valeting
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            color: '#9ca3af',
            maxWidth: 900,
            lineHeight: 1.3,
          }}
        >
          Slovenia · Ceramic coating · Paint correction · We come to you
        </div>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 22,
            color: '#6b7280',
          }}
        >
          <span>Celestrina 19, Malečnik</span>
          <span style={{ color: BRAND.accent }}>ashine.si</span>
        </div>
      </div>
    ),
    size,
  )
}

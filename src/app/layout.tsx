import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import { SITE_URL, BRAND } from '@/config/site'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'AShine',
  title: { template: '%s | AShine', default: 'AShine' },
  authors: [{ name: 'AShine', url: SITE_URL }],
  creator: 'AShine',
  publisher: 'AShine',
  openGraph: {
    type: 'website',
    siteName: 'AShine',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  category: 'automotive',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon', type: 'image/png', sizes: '180x180' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: BRAND.bg,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-premium-black text-text-primary">
        {children}
      </body>
    </html>
  )
}

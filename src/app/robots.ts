import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/config/site'

const IS_PRODUCTION_DEPLOY =
  process.env.VERCEL_ENV === 'production' ||
  (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV)

const AI_TRAINING_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
  'Applebot-Extended',
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',
  'FacebookBot',
  'CCBot',
  'PerplexityBot',
  'Bytespider',
  'Amazonbot',
  'cohere-ai',
  'MistralAI-User',
  'DuckAssistBot',
  'YouBot',
  'iaskspider/2.0',
  'Diffbot',
  'Timpibot',
  'omgili',
  'ImagesiftBot',
]

export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION_DEPLOY) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      { userAgent: AI_TRAINING_BOTS, disallow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

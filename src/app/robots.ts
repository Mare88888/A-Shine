import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/config/site'

const IS_PRODUCTION_DEPLOY =
  process.env.VERCEL_ENV === 'production' ||
  (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV)

/**
 * Bots that crawl the web to train generative models. Blocked so our content
 * is not used as training data. Search/agent crawlers (ChatGPT-User,
 * PerplexityBot, etc.) are intentionally NOT in this list so AI assistants can
 * still cite the site in real-time answers. See also /llms.txt.
 */
const AI_TRAINING_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
  'Applebot-Extended',
  'Meta-ExternalAgent',
  'FacebookBot',
  'Bytespider',
  'cohere-ai',
  'CCBot',
  'Diffbot',
  'Timpibot',
  'omgili',
  'ImagesiftBot',
  'Amazonbot',
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

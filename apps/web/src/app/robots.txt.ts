// app/robots.txt.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/*', '/admin/*', '/privacy-policy'],
    },
    sitemap: 'https://casiry.com/sitemap.xml',
    host: 'casiry.com'
  }
}
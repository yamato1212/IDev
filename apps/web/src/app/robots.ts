// app/robots.ts
import { MetadataRoute } from 'next';

// 単純に直接URLを指定
const baseUrl = 'https://casiry.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
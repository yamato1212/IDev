// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/privacy-policy'],
      },
    ],
    // 直接URLを指定して二重プロトコルを防ぐ
    sitemap: 'https://casiry.com/sitemap.xml',
    // ドメインのみを指定
    host: 'casiry.com',
  };
}
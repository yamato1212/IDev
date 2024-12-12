// app/sitemap.ts
import { db } from "@/lib/prisma";
import { MetadataRoute } from "next";

// 単純に直接URLを指定
const baseUrl = 'https://casiry.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const books = await db.book.findMany({
    select: {
      slug: true,
      updatedAt: true,
      bookChapters: {
        select: {
          bookSections: {
            select: {
              slug: true,
              updatedAt: true,
              bookSubSections: {
                select: {
                  id: true,
                  updatedAt: true,
                }
              }
            }
          }
        }
      }
    }
  });

  const routes: MetadataRoute.Sitemap = [];

  // 静的ルート
  routes.push(
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/books`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }
  );

  // 動的ルート
  books.forEach((book) => {
    routes.push({
      url: `${baseUrl}/books/${book.slug}`,
      lastModified: book.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    book.bookChapters.forEach(chapter => {
      chapter.bookSections.forEach(section => {
        routes.push({
          url: `${baseUrl}/books/${book.slug}/${section.slug}`,
          lastModified: section.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.7,
        });

        section.bookSubSections.forEach(subsection => {
          routes.push({
            url: `${baseUrl}/books/${book.slug}/${section.slug}/${subsection.id}`,
            lastModified: subsection.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.6,
          });
        });
      });
    });
  });

  return routes;
}
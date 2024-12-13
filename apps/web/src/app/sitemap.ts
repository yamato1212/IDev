// app/sitemap.ts
import { db } from "@/lib/prisma"
import { MetadataRoute } from 'next'

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
  })

  // メインページ
  const routes: MetadataRoute.Sitemap = [
    {
      url: 'https://casiry.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    }
  ]

  // 書籍一覧ページ
  routes.push({
    url: 'https://casiry.com/books',
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  })

  // 各書籍のページ
  for (const book of books) {
    // 書籍詳細ページ
    routes.push({
      url: `https://casiry.com/books/${book.slug}`,
      lastModified: book.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    })

    // 書籍のセクションページ
    book.bookChapters.forEach(chapter => {
      chapter.bookSections.forEach(section => {
        routes.push({
          url: `https://casiry.com/books/${book.slug}/${section.slug}`,
          lastModified: section.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.7,
        })

        // サブセクションページ
        section.bookSubSections.forEach(subsection => {
          routes.push({
            url: `https://casiry.com/books/${book.slug}/${section.slug}/${subsection.id}`,
            lastModified: subsection.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.6,
          })
        })
      })
    })
  }

  return routes
}
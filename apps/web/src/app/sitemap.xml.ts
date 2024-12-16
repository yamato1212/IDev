// app/sitemap.xml.ts
import { db } from "@/lib/prisma"
import type { MetadataRoute } from 'next'

type Frequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
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

    const routes: MetadataRoute.Sitemap = [
      {
        url: 'https://casiry.com',
        lastModified: new Date(),
        changeFrequency: 'daily' as Frequency,
        priority: 1,
      },
      {
        url: 'https://casiry.com/books',
        lastModified: new Date(),
        changeFrequency: 'daily' as Frequency,
        priority: 0.9,
      }
    ]

    for (const book of books) {
      routes.push({
        url: `https://casiry.com/books/${book.slug}`,
        lastModified: book.updatedAt,
        changeFrequency: 'weekly' as Frequency,
        priority: 0.8,
      })

      book.bookChapters.forEach(chapter => {
        chapter.bookSections.forEach(section => {
          routes.push({
            url: `https://casiry.com/books/${book.slug}/${section.slug}`,
            lastModified: section.updatedAt,
            changeFrequency: 'weekly' as Frequency,
            priority: 0.7,
          })

          section.bookSubSections.forEach(subsection => {
            routes.push({
              url: `https://casiry.com/books/${book.slug}/${section.slug}/${subsection.id}`,
              lastModified: subsection.updatedAt,
              changeFrequency: 'weekly' as Frequency,
              priority: 0.6,
            })
          })
        })
      })
    }

    return routes
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return []
  }
}
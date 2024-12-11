import { db } from "@/lib/prisma";
import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_URL
  ? `https://${process.env.NEXT_PUBLIC_URL}`
  : "http://localhost:3000";

type Route = {
  url: string;
  lastModified: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

export const dynamic = "force-dynamic";

async function getBookRoutes(): Promise<Route[]> {
  const books = await db.book.findMany({
    select: {
      slug: true,
      updatedAt: true,
      bookChapters: {
        select: {
          slug: true,
          updatedAt: true,
          bookSections: {
            select: {
              slug: true,
              updatedAt: true,
              bookSubSections: {
                select: {
                  slug: true,
                  updatedAt: true,
                }
              }
            }
          }
        }
      }
    }
  });

  const routes: Route[] = [];

  // Book routes
  books.forEach((book) => {
    routes.push({
      url: `${baseUrl}/books/${book.slug}`,
      lastModified: book.updatedAt.toISOString(),
      changefreq: "weekly",
      priority: 1.0
    });

    // Chapter routes
    book.bookChapters.forEach((chapter) => {
      routes.push({
        url: `${baseUrl}/books/${book.slug}/chapters/${chapter.slug}`,
        lastModified: chapter.updatedAt.toISOString(),
        changefreq: "weekly",
        priority: 0.9
      });

      // Section routes
      chapter.bookSections.forEach((section) => {
        routes.push({
          url: `${baseUrl}/books/${book.slug}/chapters/${chapter.slug}/sections/${section.slug}`,
          lastModified: section.updatedAt.toISOString(),
          changefreq: "weekly",
          priority: 0.8
        });

        // SubSection routes
        section.bookSubSections.forEach((subsection) => {
          routes.push({
            url: `${baseUrl}/books/${book.slug}/chapters/${chapter.slug}/sections/${section.slug}/subsections/${subsection.slug}`,
            lastModified: subsection.updatedAt.toISOString(),
            changefreq: "weekly",
            priority: 0.7
          });
        });
      });
    });
  });

  return routes;
}




export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: Route[] = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changefreq: "daily",
      priority: 1.0
    },
    {
      url: `${baseUrl}/books`,
      lastModified: new Date().toISOString(),
      changefreq: "daily",
      priority: 0.9
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date().toISOString(),
      changefreq: "weekly",
      priority: 0.8
    }
  ];

  try {
    // Fetch dynamic routes
    const [bookRoutes, ] = await Promise.all([
      getBookRoutes(),
     
    ]);

    return [...staticRoutes, ...bookRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}
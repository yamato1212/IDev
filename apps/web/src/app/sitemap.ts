// app/sitemap.ts
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

  const routes: Route[] = [];

  // Book routes
  books.forEach((book) => {
    routes.push({
      url: `${baseUrl}/books/${book.slug}`,
      lastModified: book.updatedAt.toISOString(),
      changefreq: "weekly",
      priority: 1.0
    });

    // Section and Subsection routes
    book.bookChapters.forEach((chapter) => {
      chapter.bookSections.forEach((section) => {
        // Section route
        routes.push({
          url: `${baseUrl}/books/${book.slug}/${section.slug}`,
          lastModified: section.updatedAt.toISOString(),
          changefreq: "weekly",
          priority: 0.8
        });

        // SubSection routes
        section.bookSubSections.forEach((subsection) => {
          routes.push({
            url: `${baseUrl}/books/${book.slug}/${section.slug}/${subsection.id}`,
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
    }
  ];

  try {
    const bookRoutes = await getBookRoutes();
    return [...staticRoutes, ...bookRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}
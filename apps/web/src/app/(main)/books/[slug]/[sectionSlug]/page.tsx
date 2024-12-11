// app/books/[slug]/[sectionSlug]/page.tsx
import { Button } from "@/components/ui/button";
import { db } from "@/lib/prisma";
import { ArrowLeft, Clock } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

async function getSectionData(bookSlug: string, sectionSlug: string) {
  const book = await db.book.findFirst({
    where: { slug: bookSlug },
    include: {
      bookChapters: {
        include: {
          bookSections: {
            where: { slug: sectionSlug },
            include: {
              bookSubSections: {
                orderBy: {
                  order: "asc"
                }
              }
            }
          }
        }
      }
    }
  });

  const section = book?.bookChapters
    .flatMap(chapter => chapter.bookSections)
    .find(section => section.slug === sectionSlug);

  return { book, section };
}

export async function generateMetadata(
  { params }: { params: { slug: string; sectionSlug: string } }
): Promise<Metadata> {
  const { book, section } = await getSectionData(params.slug, params.sectionSlug);

  if (!book || !section) {
    return {
      title: "Section Not Found | AI Book Hub",
      description: "The requested book section could not be found.",
    };
  }

  // Calculate total estimated time for the section
  const totalEstimatedMinutes = section.bookSubSections.reduce(
    (total, subsection) => total + (subsection.estimatedMinutes || 0),
    0
  );

  // Get subsection titles for keywords
  const subsectionTitles = section.bookSubSections.map(
    subsection => subsection.title
  );

  const baseUrl = process.env.NEXT_PUBLIC_URL
    ? `https://${process.env.NEXT_PUBLIC_URL}`
    : "http://localhost:3000";

  const fullTitle = `${section.title} - ${book.title}`;
  
  return {
    title: fullTitle,
    description: `${section.description} Learn about ${subsectionTitles.join(", ")} in this comprehensive guide.`,
    
    keywords: [
      book.title,
      section.title,
      ...subsectionTitles,
      "Technical Guide",
      "Programming Tutorial",
      "Learning Resource",
      book.category || "",
      ...(book.prerequisites || [])
    ].filter(Boolean),

    authors: [
      {
        name: "IDev",
        url: baseUrl,
      }
    ],

    openGraph: {
      type: "article",
      title: fullTitle,
      description: section.description,
      images: [
        {
          url: book.icon,
          width: 1200,
          height: 630,
          alt: `${section.title} - ${book.title}`,
        }
      ],
      publishedTime: section.createdAt.toISOString(),
      modifiedTime: section.updatedAt.toISOString(),
      section: book.category || "Technology",
      tags: [
        ...subsectionTitles,
        book.category || "Technology",
        ...(book.prerequisites || [])
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: section.description,
      images: [book.icon],
    },

    other: {
      "estimated-reading-time": `${totalEstimatedMinutes} minutes`,
      "section-subsections": subsectionTitles.length.toString(),
      "book-category": book.category || "Technology",
    },

    alternates: {
      canonical: `${baseUrl}/books/${book.slug}/${section.slug}`,
      languages: {
        'en-US': `${baseUrl}/books/${book.slug}/${section.slug}`,
      },
    },
  };
}

type Props = {
  params: Promise<{ slug: string; sectionSlug: string }>;
};

export default async function BookSectionPage({ params }: Props) {
  const { slug, sectionSlug } = await params;

  const book = await db.book.findFirst({
    where: {
      slug: slug,
    },
    include: {
      bookChapters: {
        orderBy: {
          order: 'asc'
        },
        include: {
          bookSections: {
            orderBy: {
              order: 'asc'
            },
            include: {
              bookSubSections: {
                orderBy: {
                  order: "asc"
                }
              }
            }
          }
        },
      }
    }
  });

  if (!book) return null;

  // すべてのサブセクションをフラット化
  const allSubSections = book.bookChapters.flatMap(chapter => 
    chapter.bookSections.flatMap(section => 
      section.bookSubSections.map(subsection => ({
        ...subsection,
        sectionSlug: section.slug,
        sectionTitle: section.title,
        chapterTitle: chapter.title
      }))
    )
  );

  // 現在のセクションの情報を取得
  const currentSection = book.bookChapters
    .flatMap(chapter => chapter.bookSections)
    .find(section => section.slug === sectionSlug);

  if (!currentSection) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-gray-600">Coming Soon</div>
      </div>
    );
  }

  // セクションページが表示されたら、自動的に最初のサブセクションにリダイレクト
  if (currentSection.bookSubSections.length > 0) {
    return (
      <div className="max-w-5xl mx-auto p-6 pt-20">
        <div className="flex flex-col gap-8">
          {/* ヘッダー */}
          <div className="flex items-center justify-between">
            <Link
              href={`/books/${slug}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {book.title}
            </Link>
          </div>

          {/* セクション情報 */}
          <div className="prose dark:prose-invert max-w-none">
            <h1>{currentSection.title}</h1>
            <p>{currentSection.description}</p>
          </div>

          {/* サブセクション一覧 */}
          <div className="space-y-4">
            {currentSection.bookSubSections.map((subsection, index) => (
              <Link 
                key={subsection.id}
                href={`/books/${slug}/${sectionSlug}/${subsection.id}`}
                className="block p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{index + 1}. {subsection.title}</h3>
                    <p className="text-sm text-gray-600">{subsection.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {subsection.estimatedMinutes} min
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 自動リダイレクトのボタン */}
          <div className="flex justify-center">
            <Button asChild className="w-full md:w-auto">
              <Link href={`/books/${slug}/${sectionSlug}/${currentSection.bookSubSections[0]?.id}`}>
                Start Reading
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // サブセクションがない場合
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center text-gray-600">
        No content available in this section.
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const books = await db.book.findMany({
    include: {
      bookChapters: {
        include: {
          bookSections: true,
        },
      },
    },
  });

  return books.flatMap((book) =>
    book.bookChapters.flatMap((chapter) =>
      chapter.bookSections.map((section) => ({
        slug: book.slug,
        sectionSlug: section.slug,
      }))
    )
  );
}
// app/books/[slug]/[sectionSlug]/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { ArrowLeft, Clock, Timer } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string; sectionSlug: string }>;
};

export default async function BookSectionPage({ params }: Props) {
  const { slug, sectionSlug } = await params;

  // セクションと前後のセクションを取得
  const book = await db.book.findFirst({
    where: {
      slug: slug,
    },
    include: {
      bookChapters: {
        include: {
          bookSections: {
            orderBy: {
              order: 'asc'
            }
          }
        },

          

      }
    }
  });

  if (!book) return null;

  // 全セクションをフラット化して配列にする
  const allSections = book.bookChapters.flatMap(chapter => 
    chapter.bookSections.map(section => ({
      ...section,
      chapterTitle: chapter.title
    }))
  );

  // 現在のセクションのインデックスを見つける
  const currentIndex = allSections.findIndex(section => section.slug === sectionSlug);
  const currentSection = allSections[currentIndex];
  const previousSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
  const nextSection = currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : null;

  if (!currentSection) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-gray-600">Coming Soon</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 pt-20">
      <div className="flex flex-col gap-8">
        {/* ナビゲーション */}
        <div className="flex items-center justify-between">
          <Link
            href={`/books/${slug}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {book.title}
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              {currentSection.estimatedMinutes} minutes read
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <article className="space-y-8">
          {/* ヘッダー */}
          <header className="space-y-4">
            <div
              className="w-16 h-1 rounded"
              style={{ backgroundColor: `#${book.color}` }}
            />
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{currentSection.title}</h1>
              <p className="text-gray-600">{currentSection.description}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Chapter: {currentSection.chapterTitle}</span>
            </div>
          </header>

          {/* 本文 */}
          <div className="prose dark:prose-invert max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: currentSection.aiContent || "Content coming soon...",
              }}
            />
          </div>
        </article>

        {/* ナビゲーションフッター */}
        <footer className="border-t pt-8 mt-8">
          <div className="flex justify-between items-center">
            {previousSection ? (
              <Button variant="outline" asChild className="flex items-center gap-2">
                <Link href={`/books/${slug}/${previousSection.slug}`}>
                  <ArrowLeft className="h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-500">Previous</span>
                    <span className="text-sm truncate max-w-[200px]">{previousSection.title}</span>
                  </div>
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href={`/books/${slug}`}>
                  <div className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Book
                  </div>
                </Link>
              </Button>
            )}

            {nextSection && (
              <Button variant="outline" asChild className="flex items-center gap-2">
                <Link href={`/books/${slug}/${nextSection.slug}`}>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">Next</span>
                    <span className="text-sm truncate max-w-[200px]">{nextSection.title}</span>
                  </div>
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              </Button>
            )}
          </div>
        </footer>
      </div>

      {/* モバイル向けの固定ナビゲーション */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:hidden">
        <div className="flex justify-between max-w-5xl mx-auto">
          {previousSection ? (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/books/${slug}/${previousSection.slug}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/books/${slug}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Book
              </Link>
            </Button>
          )}

          {nextSection && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/books/${slug}/${nextSection.slug}`}>
                Next
                <ArrowLeft className="h-4 w-4 rotate-180 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// 静的生成のためのパラメータ生成
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
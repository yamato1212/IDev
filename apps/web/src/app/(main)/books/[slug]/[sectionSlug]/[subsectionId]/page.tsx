// app/books/[slug]/[sectionSlug]/[subsectionId]/page.tsx
import { Button } from "@/components/ui/button";
import { db } from "@/lib/prisma";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

type Props = {
  params: {
    slug: string;
    sectionSlug: string;
    subsectionId: string;
  };
};

export default async function BookSubSectionPage({ params }: Props) {
  const { slug, sectionSlug, subsectionId } = params;

  // Fetch book and nested structure
  const book = await db.book.findFirst({
    where: { slug },
    include: {
      bookChapters: {
        orderBy: { order: "asc" },
        include: {
          bookSections: {
            orderBy: { order: "asc" },
            include: {
              bookSubSections: { orderBy: { order: "asc" } },
            },
          },
        },
      },
    },
  });

  if (!book) return <div className="text-center text-gray-600">Book not found.</div>;

  // Flatten all subsections with metadata
  const allSubSections = book.bookChapters.flatMap((chapter, chapterIndex) =>
    chapter.bookSections.flatMap((section, sectionIndex) =>
      section.bookSubSections.map((subsection) => ({
        ...subsection,
        sectionSlug: section.slug,
        sectionTitle: section.title,
        chapterTitle: chapter.title,
        globalOrder: chapterIndex * 1e6 + sectionIndex * 1e3 + subsection.order,
      }))
    )
  ).sort((a, b) => a.globalOrder - b.globalOrder);

  // Find current, previous, and next subsections
  const currentIndex = allSubSections.findIndex((s) => s.id === subsectionId);
  const currentSubSection = allSubSections[currentIndex];
  const previousSubSection = allSubSections[currentIndex - 1] || null;
  const nextSubSection = allSubSections[currentIndex + 1] || null;

  if (!currentSubSection) return <div className="text-center text-gray-600">Coming Soon</div>;

  const subsection = await db.bookSubSection.findUnique({ where: { id: subsectionId } });

  return (
    <div className="max-w-5xl mx-auto p-6 pt-20">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href={`/books/${slug}/${sectionSlug}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {currentSubSection.sectionTitle}
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            {currentSubSection.estimatedMinutes} minutes read
          </div>
        </div>

        {/* Content */}
        <article className="space-y-8">
          <h1 className="text-3xl font-bold">{currentSubSection.title}</h1>
          <div className="text-sm text-gray-600">
            Chapter: {currentSubSection.chapterTitle} / Section: {currentSubSection.sectionTitle}
          </div>
          <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');

          return !inline && match ? (
            <SyntaxHighlighter style={dracula} PreTag="div" language={match[1]} {...props}>
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {currentSubSection.aiContent}
    </ReactMarkdown>
        </article>

        {/* Footer Navigation */}
        <footer className="border-t pt-8 mt-8">
          <div className="flex flex-col md:flex-row-reverse gap-4 justify-between items-center">
            {nextSubSection && (
              <Button variant="outline" asChild className="flex items-center gap-2 w-full py-12">
                <Link href={`/books/${slug}/${nextSubSection.sectionSlug}/${nextSubSection.id}`}>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">Next</span>
                    <span className="text-sm">{nextSubSection.title}</span>
                  </div>
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              </Button>
            )}
            {previousSubSection ? (
              <Button variant="outline" asChild className="flex items-center gap-2 w-full">
                <Link href={`/books/${slug}/${previousSubSection.sectionSlug}/${previousSubSection.id}`}>
                  <ArrowLeft className="h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-500">Previous</span>
                    <span className="text-sm truncate max-w-[200px]">{previousSubSection.title}</span>
                  </div>
                </Link>
              </Button>
            ) : (
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/books/${slug}`}>
                  <div className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Book
                  </div>
                </Link>
              </Button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const books = await db.book.findMany({
    include: {
      bookChapters: {
        include: {
          bookSections: {
            include: {
              bookSubSections: true,
            },
          },
        },
      },
    },
  });

  return books.flatMap((book) =>
    book.bookChapters.flatMap((chapter) =>
      chapter.bookSections.flatMap((section) =>
        section.bookSubSections.map((subsection) => ({
          slug: book.slug,
          sectionSlug: section.slug,
          subsectionId: subsection.id,
        }))
      )
    )
  );
}
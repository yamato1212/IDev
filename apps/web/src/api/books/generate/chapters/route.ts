// app/api/books/generate/chapters/route.ts
import { db } from "@/lib/prisma";
import { generateBookStructure } from "@/lib/claude";

function logDebug(message: string, data?: any) {
  console.log(`[/api/books/generate/chapters] ${message}`, data ? data : '');
}

function logError(error: any, context?: any) {
  console.error(`[/api/books/generate/chapters] Error:`, error);
  if (context) {
    console.error(`[/api/books/generate/chapters] Context:`, context);
  }
}



export async function POST(req: Request) {
  try {
    logDebug('Starting book content generation');
    
    const { bookId } = await req.json();
    if (!bookId) {
      return Response.json({ error: "Book ID is required" }, { status: 400 });
    }

    const book = await db.book.findUnique({
      where: { id: bookId }
    });

    if (!book) {
      return Response.json({ error: "Book not found" }, { status: 404 });
    }

    const structure = await generateBookStructure(book.title, book.description);
    if (!structure || !structure.chapters) {
      return Response.json({
        error: "Invalid book structure generated",
        details: "Generated structure does not match required format"
      }, { status: 500 });
    }
    const createdChapters = [];
    for (const [chapterIndex, chapter] of structure.chapters.entries()) {
      const chapterSlug = `${book.slug}-chapter-${chapterIndex + 1}`;
      const createdChapter = await db.bookChapter.create({
        data: {
          title: chapter.title,
          description: chapter.description,
          slug: chapterSlug,
          bookId: book.id,
          order: chapterIndex
        }
      });

      const sections = await Promise.all(
        chapter.sections.map(async (section: any, sectionIndex: number) => {
          const sectionSlug = `${chapterSlug}-section-${sectionIndex + 1}`;
          const createdSection = await db.bookSection.create({
            data: {
              title: section.title,
              description: section.description,
              slug: sectionSlug,
              order: sectionIndex,
              estimatedMinutes: section.estimatedMinutes || 30,
              bookChapterId: createdChapter.id,
              bookId: book.id
            }
          });

          const subSections = await Promise.all(
            section.subSections.map(async (subsection: any, subsectionIndex: number) => {
              const subsectionSlug = `${sectionSlug}-subsection-${subsectionIndex + 1}`;
              return db.bookSubSection.create({
                data: {
                  title: subsection.title,
                  description: subsection.description,
                  slug: subsectionSlug,
                  order: subsection.order || subsectionIndex,
                  estimatedMinutes: subsection.estimatedMinutes || 15,
                  bookSectionId: createdSection.id
                }
              });
            })
          );

          return {
            ...createdSection,
            bookSubSections: subSections
          };
        })
      );

      createdChapters.push({
        ...createdChapter,
        bookSections: sections
      });

      await new Promise(resolve => setTimeout(resolve, 100));
    }  // forループの終わり

    return Response.json({
      success: true,
      chapters: createdChapters,
      message: `Created ${createdChapters.length} chapters with sections and subsections`
    });

  } catch (error) {
    logError(error, { path: '/api/books/generate/chapters' });
    return Response.json({
      error: "Failed to generate book content",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
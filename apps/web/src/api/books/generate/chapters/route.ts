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

// スラッグ生成用のユーティリティ関数
async function generateUniqueChapterSlug(baseSlug: string, bookId: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existing = await db.bookChapter.findFirst({
      where: {
        slug,
        bookId
      }
    });
    
    if (!existing) {
      return slug;
    }
    
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}

async function generateUniqueSectionSlug(baseSlug: string, bookId: string, chapterId: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existing = await db.bookSection.findFirst({
      where: {
        slug,
        bookId,
        bookChapterId: chapterId
      }
    });
    
    if (!existing) {
      return slug;
    }
    
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}

// app/api/books/generate/chapters/route.ts

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
    
    // チャプターを一つずつ処理
    const createdChapters = [];
    for (const [chapterIndex, chapter] of structure.chapters.entries()) {
      // チャプターを作成
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

      // チャプターのセクションを作成
      const sections = await Promise.all(
        chapter.sections.map(async (section : any, sectionIndex: any) => {
          const sectionSlug = `${chapterSlug}-section-${sectionIndex + 1}`;
          return db.bookSection.create({
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
        })
      );

      createdChapters.push({
        ...createdChapter,
        bookSections: sections
      });

      // 各チャプター処理後に少し待機
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return Response.json({ 
      success: true, 
      chapters: createdChapters,
      message: `Created ${createdChapters.length} chapters with their sections`
    });

  } catch (error) {
    logError(error, { path: '/api/books/generate/chapters' });
    return Response.json({
      error: "Failed to generate book content",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
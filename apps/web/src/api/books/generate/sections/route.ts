// app/api/books/generate/sections/route.ts
import { db } from "@/lib/prisma";
import { generateSectionStructure } from "@/lib/claude";

function logDebug(message: string, data?: any) {
  console.log(`[/api/books/generate/sections] ${message}`, data ? data : '');
}

function logError(error: any, context?: any) {
  console.error(`[/api/books/generate/sections] Error:`, error);
  if (context) {
    console.error(`[/api/books/generate/sections] Context:`, context);
  }
}

async function generateUniqueSlug(baseSlug: string, bookId: string, chapterId: string): Promise<string> {
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

export async function POST(req: Request) {
  try {
    logDebug('Starting section generation');
    
    const { bookId, chapterId } = await req.json();
    logDebug('Received request with:', { bookId, chapterId });

    if (!bookId || !chapterId) {
      logDebug('Missing required parameters');
      return Response.json({ error: "Book ID and Chapter ID are required" }, { status: 400 });
    }

    const [book, chapter] = await Promise.all([
      db.book.findUnique({ where: { id: bookId } }),
      db.bookChapter.findUnique({ 
        where: { id: chapterId },
        include: { bookSections: true }
      })
    ]);
    
    logDebug('Retrieved book and chapter:', { book, chapter });

    if (!book || !chapter) {
      logDebug('Book or chapter not found');
      return Response.json({ error: "Book or Chapter not found" }, { status: 404 });
    }

    // セクション構造を生成
    const sectionStructure = await generateSectionStructure(
      book.title,
      chapter.title,
      chapter.description
    );

    logDebug('Generated section structure:', sectionStructure);

    // セクションを生成して保存
    const sections = [];
    for (const [index, sectionInfo] of sectionStructure.entries()) {
      try {
        logDebug(`Creating section ${index + 1}/${sectionStructure.length}:`, sectionInfo);

        // ユニークなスラッグを生成
        const baseSlug = `${book.slug}-${chapter.slug}-section-${index + 1}`;
        const uniqueSlug = await generateUniqueSlug(baseSlug, book.id, chapter.id);

        // セクションを保存（aiContentなし）
        const section = await db.bookSection.create({
          data: {
            title: sectionInfo.title,
            description: sectionInfo.description,
            slug: uniqueSlug,
            order: index + 1,
            estimatedMinutes: sectionInfo.estimatedMinutes || 30,
            bookChapterId: chapter.id,
            bookId: book.id
          }
        });

        sections.push(section);
        logDebug(`Created section ${index + 1}:`, { title: section.title, id: section.id });

        // レート制限対策
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (sectionError) {
        logError(sectionError, { sectionInfo, index, chapterId });
        throw sectionError;
      }
    }

    return Response.json({ 
      success: true, 
      sections,
      message: `Generated ${sections.length} sections for chapter "${chapter.title}"`
    });

  } catch (error) {
    logError(error, { path: '/api/books/generate/sections' });
    return Response.json({ 
      error: "Failed to generate sections",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
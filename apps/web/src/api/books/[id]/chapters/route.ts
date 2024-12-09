// app/api/books/[id]/chapters/route.ts
import { db } from "@/lib/prisma";

function logDebug(message: string, data?: any) {
  console.log(`[/api/books/[id]/chapters] ${message}`, data ? data : '');
}

function logError(error: any, context?: any) {
  console.error(`[/api/books/[id]/chapters] Error:`, error);
  if (context) {
    console.error(`[/api/books/[id]/chapters] Context:`, context);
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    logDebug('Fetching chapters for book:', params.id);

    // 本の存在確認
    const book = await db.book.findUnique({
      where: {
        id: params.id
      }
    });

    if (!book) {
      logDebug('Book not found');
      return Response.json({ error: "Book not found" }, { status: 404 });
    }

    // チャプターとセクションを取得
    const chapters = await db.bookChapter.findMany({
      where: {
        bookId: params.id
      },
      include: {
        bookSections: {
          orderBy: {
            order: 'asc'
          }
          
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    logDebug('Found chapters:', {
      bookId: params.id,
      chapterCount: chapters.length,
      chaptersWithSections: chapters.map(ch => ({
        id: ch.id,
        sectionCount: ch.bookSections.length
      }))
    });

    return Response.json({ 
      success: true,
      chapters: chapters.map(chapter => ({
        ...chapter,
        sectionCount: chapter.bookSections.length,
        hasContent: chapter.bookSections.length > 0
      }))
    });

  } catch (error) {
    logError(error, { bookId: params.id });
    return Response.json({ 
      error: "Failed to fetch chapters",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
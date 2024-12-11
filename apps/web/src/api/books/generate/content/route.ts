// app/api/books/generate/subsection-content/route.ts
import { db } from "@/lib/prisma";
import { generateSubSectionContent } from "@/lib/claude";

function logDebug(message: string, data?: any) {
  console.log(`[/api/books/generate/subsection-content] ${message}`, data ? data : '');
}

function logError(error: any, context?: any) {
  console.error(`[/api/books/generate/subsection-content] Error:`, error);
  if (context) {
    console.error(`[/api/books/generate/subsection-content] Context:`, context);
  }
}

export async function POST(req: Request) {
  try {
    logDebug('Starting subsection content generation');

    const { bookId, subsectionId } = await req.json();
    logDebug('Received request with:', { bookId, subsectionId });

    if (!bookId || !subsectionId) {
      logDebug('Missing required parameters');
      return Response.json({ error: "Book ID and SubSection ID are required" }, { status: 400 });
    }

    // サブセクションとその関連データを取得
    const subsection = await db.bookSubSection.findUnique({
      where: { id: subsectionId },
      include: {
        BookSection: {
          include: {
            bookChapter: true,
            book: true
          }
        }
      }
    });

    if (!subsection) {
      logDebug('SubSection not found');
      return Response.json({ error: "SubSection not found" }, { status: 404 });
    }

    // コンテンツを生成
    logDebug('Generating content for subsection:', subsection.title);
    const content = await generateSubSectionContent(
      subsection.BookSection.book.title,
      subsection.BookSection.bookChapter.title,
      subsection.BookSection.title,
      subsection.title,
      subsection.description
    );

    // 生成したコンテンツを保存
    const updatedSubSection = await db.bookSubSection.update({
      where: { id: subsectionId },
      data: { aiContent: content }
    });

    logDebug('Successfully generated and saved content for subsection:', subsection.title);

    return Response.json({
      success: true,
      subsection: updatedSubSection,
      message: `Generated content for "${subsection.title}"`
    });

  } catch (error) {
    logError(error, { path: '/api/books/generate/subsection-content' });
    return Response.json({
      error: "Failed to generate content",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
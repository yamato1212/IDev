import { db } from "@/lib/prisma";
import { generateSectionContent } from "@/lib/claude";

function logDebug(message: string, data?: any) {
  console.log(`[/api/books/generate/content] ${message}`, data ? data : '');
}

function logError(error: any, context?: any) {
  console.error(`[/api/books/generate/content] Error:`, error);
  if (context) {
    console.error(`[/api/books/generate/content] Context:`, context);
  }
}

export async function POST(req: Request) {
  try {
    logDebug('Starting content generation');
    
    const { bookId, sectionId } = await req.json();
    logDebug('Received request with:', { bookId, sectionId });

    if (!bookId || !sectionId) {
      logDebug('Missing required parameters');
      return Response.json({ error: "Book ID and Section ID are required" }, { status: 400 });
    }

    // セクションとその関連データを取得
    const section = await db.bookSection.findUnique({
      where: { id: sectionId },
      include: {
        bookChapter: true,
        book: true
      }
    });
    
    if (!section) {
      logDebug('Section not found');
      return Response.json({ error: "Section not found" }, { status: 404 });
    }

    // セクションのコンテンツを生成
    logDebug('Generating content for section:', section.title);
    const content = await generateSectionContent(
      section.book.title,
      section.bookChapter.title,
      section.title,
      section.description
    );

    // 生成したコンテンツを保存
    const updatedSection = await db.bookSection.update({
      where: { id: sectionId },
      data: { aiContent: content }
    });

    logDebug('Successfully generated and saved content for section:', section.title);

    return Response.json({
      success: true,
      section: updatedSection,
      message: `Generated content for "${section.title}"`
    });

  } catch (error) {
    logError(error, { path: '/api/books/generate/content' });
    return Response.json({
      error: "Failed to generate content",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
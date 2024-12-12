import { db } from "@/lib/prisma";
import { generateSubSectionContent } from "@/lib/claude";

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateContentForSubSection(subsection: any) {
  try {
    const content = await generateSubSectionContent(
      subsection.BookSection.book.title,
      subsection.BookSection.bookChapter.title,
      subsection.BookSection.title,
      subsection.title,
      subsection.description
    );

    await db.bookSubSection.update({
      where: { id: subsection.id },
      data: { aiContent: content }
    });

    console.log(`✅ Generated content for "${subsection.title}"`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to generate content for "${subsection.title}":`, error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const { bookId } = await req.json();

    // すべてのサブセクションを取得（aiContentがnullのもののみ）
    const subsections = await db.bookSubSection.findMany({
      where: {
        BookSection: {
          bookId: bookId
        },
        aiContent: null
      },
      include: {
        BookSection: {
          include: {
            bookChapter: true,
            book: true
          }
        }
      },
      orderBy: [
        { 'BookSection': { bookChapter: { order: 'asc' } } },
        { 'BookSection': { order: 'asc' } },
        { order: 'asc' }
      ]
    });

    if (subsections.length === 0) {
      return Response.json({
        message: "No subsections found that need content generation"
      });
    }

    // 最初のサブセクションのみ処理
    const subsection = subsections[0];
    const success = await generateContentForSubSection(subsection);

    const remainingCount = subsections.length - 1;

    return Response.json({
      success: success,
      message: success 
        ? `Successfully generated content for "${subsection?.title}". ${remainingCount} subsections remaining.`
        : `Failed to generate content for "${subsection?.title}"`,
      remainingCount,
      nextSubSection: remainingCount > 0 ? subsections[1]?.title : null
    });

  } catch (error) {
    console.error("Failed to process content generation:", error);
    return Response.json({
      error: "Failed to process content generation",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
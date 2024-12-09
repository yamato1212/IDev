// app/api/books/generate/route.ts
import { db } from "@/lib/prisma";
import { generateBookStructure, generateSectionContent } from "@/lib/claude";

export async function POST(req: Request) {
  try {
    const { bookId } = await req.json();
    
    // Validate bookId
    if (!bookId) {
      return Response.json({ error: "Book ID is required" }, { status: 400 });
    }

    // 本の情報を取得
    const book = await db.book.findUnique({
      where: { id: bookId }
    });
    
    if (!book) {
      return Response.json({ error: "Book not found" }, { status: 404 });
    }

    // 本の構造を生成
    const response = await generateBookStructure(book.title, book.description);
    const structure = typeof response === 'string' ? JSON.parse(response) : response;

    if (!structure?.chapters || !Array.isArray(structure.chapters)) {
      throw new Error("Invalid book structure generated");
    }

    // チャプターとセクションを作成（1チャプターずつ）
    for (const [chapterIndex, chapter] of structure.chapters.entries()) {
      try {
        // チャプターを作成
        const createdChapter = await db.bookChapter.create({
          data: {
            title: chapter.title,
            description: chapter.description || "",
            slug: `${book.slug}-chapter-${chapterIndex + 1}`,
            bookId: book.id
          }
        });

        // セクションを作成して内容を生成
        if (chapter.sections && Array.isArray(chapter.sections)) {
          for (const [sectionIndex, section] of chapter.sections.entries()) {
            try {
              const sectionContent = await generateSectionContent(
                book.title,
                chapter.title,
                section.title,
                section.description || ""
              );

              await db.bookSection.create({
                data: {
                  title: section.title,
                  description: section.description || "",
                  slug: `${book.slug}-chapter-${chapterIndex + 1}-section-${sectionIndex + 1}`,
                  order: section.order || sectionIndex,
                  estimatedMinutes: section.estimatedMinutes || 30,
                  aiContent: typeof sectionContent === 'string' ? sectionContent : JSON.stringify(sectionContent),
                  bookChapterId: createdChapter.id,
                  bookId: book.id
                }
              });

              // レート制限対策
              await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
              console.error(`Error creating section ${sectionIndex + 1} in chapter ${chapterIndex + 1}:`, error);
              throw error;
            }
          }
        }
      } catch (error) {
        console.error(`Error creating chapter ${chapterIndex + 1}:`, error);
        throw error;
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error generating book content:', error);
    return Response.json({ 
      error: "Failed to generate content",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
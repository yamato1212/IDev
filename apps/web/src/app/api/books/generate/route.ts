// app/api/books/generate/route.ts
import { db } from "@/lib/prisma";
import { generateBookStructure, generateSectionContent } from "@/lib/claude";

export async function POST(req: Request) {
  try {
    const { bookId } = await req.json();

    // 本の情報を取得
    const book = await db.book.findUnique({
      where: { id: bookId }
    });

    if (!book) {
      return Response.json({ error: "Book not found" }, { status: 404 });
    }

    // 本の構造を生成
    const structure = await generateBookStructure(book.title, book.description) as any

    // チャプターとセクションを作成（1チャプターずつ）
    for (const [chapterIndex, chapter] of structure.chapters.entries()) {
      // チャプターを作成
      const createdChapter = await db.bookChapter.create({
        data: {
          title: chapter.title,
          description: chapter.description,
          slug: `${book.slug}-chapter-${chapterIndex + 1}`,
          bookId: book.id
        }
      });

      // セクションを作成して内容を生成
      for (const [sectionIndex, section] of chapter.sections.entries()) {
        const sectionContent = await generateSectionContent(
          book.title,
          chapter.title,
          section.title,
          section.description
        ) as any

        await db.bookSection.create({
          data: {
            title: section.title,
            description: section.description,
            slug: `${book.slug}-${createdChapter.slug}-section-${sectionIndex + 1}`,
            order: section.order,
            estimatedMinutes: section.estimatedMinutes,
            aiContent: sectionContent,
            bookChapterId: createdChapter.id,
            bookId: book.id
          }
        });

        // レート制限対策
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error generating book content:', error);
    return Response.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
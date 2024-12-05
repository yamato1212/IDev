// app/admin/books/page.tsx
import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default async function AdminBooksPage() {
  const books = await db.book.findMany({
    include: {
      bookChapters: {
        include: {
          bookSections: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Books Management</h1>
        <Button asChild>
          <Link href="/admin/books/new">新規作成</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {books.map((book) => {
          // 生成状況の計算
          const totalSections = book.bookChapters.reduce(
            (acc, chapter) => acc + chapter.bookSections.length,
            0
          );
          const sectionsWithContent = book.bookChapters.reduce(
            (acc, chapter) => 
              acc + chapter.bookSections.filter(section => section.aiContent).length,
            0
          );

          return (
            <div key={book.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  {book.icon && (
                    <div className="w-12 h-12 relative">
                      <Image
                        src={book.icon}
                        alt={book.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-semibold">{book.title}</h2>
                    <p className="text-sm text-gray-500">{book.slug}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/books/${book.id}/edit`}>編集</Link>
                  </Button>
                  <Button variant="default" size="sm" asChild>
                    <Link href={`/admin/books/${book.id}/generate`}>
                      コンテンツ生成
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="border rounded p-2">
                  <div className="text-gray-500">チャプター数</div>
                  <div className="font-semibold">{book.bookChapters.length}</div>
                </div>
                <div className="border rounded p-2">
                  <div className="text-gray-500">セクション数</div>
                  <div className="font-semibold">{totalSections}</div>
                </div>
                <div className="border rounded p-2">
                  <div className="text-gray-500">生成済みセクション</div>
                  <div className="font-semibold">{sectionsWithContent}</div>
                </div>
                <div className="border rounded p-2">
                  <div className="text-gray-500">生成率</div>
                  <div className="font-semibold">
                    {totalSections === 0
                      ? '0'
                      : Math.round((sectionsWithContent / totalSections) * 100)}%
                  </div>
                </div>
              </div>

              {book.bookChapters.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Chapters</h3>
                  <div className="grid gap-2">
                    {book.bookChapters.map((chapter) => (
                      <div key={chapter.id} className="text-sm">
                        {chapter.title} 
                        ({chapter.bookSections.filter(s => s.aiContent).length}/
                        {chapter.bookSections.length} セクション生成済み)
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
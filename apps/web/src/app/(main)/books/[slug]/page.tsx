import BookChapters from "@/components/main/book/BookChapters";
import { Button } from "@/components/ui/button";
// app/books/[slug]/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/prisma";
import { cn, formatNumber } from "@/lib/utils";

import { BookTemplate, Eye, Timer } from "lucide-react";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

const getCachedBook = unstable_cache(
	async (s: string) => {
    const book = await db.book.findFirst({
      where: {
        slug: s,
      },
      include: {
        children: true,
        bookBestPractices: {
          include: {
            bookBestPracticeItems: true
          }
        },
  
        bookChapters: {
          include: {
            bookSections:  {
              orderBy: {
                order:"asc"
              },
              include: {
                bookSubSections: {
                  orderBy: {
                    order:"asc"
                  }
                }
              }
            }
          },
          orderBy: {
            order: "asc"
          }
        },
      },
    });

    return book
	},
	["shot-detail"],
	{
		revalidate: 120,
		tags: ["shot-detail"],
	},
)

export default async function BookPage({ params }: Props) {
  const s = (await params).slug;
    const book = await getCachedBook(s);




  if (!book) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-gray-600">
          Coming Soon
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 pt-20">
      <div className="flex flex-col md:flex-row gap-8 relative min-h-[calc(100vh-theme(spacing.32))]">
        {/* 左側固定部分 */}
        <div className="md:w-80 md:flex-shrink-0 md:sticky md:top-20 h-fit flex justify-center items-center">
          <div className="space-y-8">
            <div className="z-1 mb-2 flex relative bg-white">
              <div className={cn("w-2 rounded-md border shadow-md ")} />
              <div
                className={cn(
                  "flex  flex-col border py-28 text-center   w-[280px] shadow-md"
                )}
              >
                <div className="flex-1">
                  <h3 className="md:text-2xl text-lg font-semibold">
                    {book.title}
                  </h3>
                </div>
                <div className="flex justify-center p-4 ">
                  <Image
                    src={book.icon}
                    alt={book.title}
                    width={60}
                    height={60}
                  />
                </div>
              </div>
            </div>

            {/* <div className="flex gap-4">
              <Button>Read start</Button>
              <Button variant="outline">Read start</Button>
            </div> */}

            <div className="">
              {/* {book.category && (
                <div className="flex flex-col gap-2">
                  <div className="text-xs">カテゴリー</div>
                  <div className="flex pb-4 gap-2">
                    <div className="text-xs text-gray-400">{book.category}</div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <div className="text-xs">前提知識</div>
                <div className="flex pb-4 gap-2">
                  {...Array.from({ length: 2 }).map((_, index) => (
                    <div className="text-xs text-gray-400">基本情報</div>
                  ))}
                </div>
              </div> */}

              {book.documentUrl && (
                <div className="flex flex-col gap-2">
                  <div className="text-xs">document</div>
                  <div className="flex pb-4 gap-2">
                    <div className="text-xs text-gray-400">
                      {book.documentUrl}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

       
      
<div>
{book.bookBestPractices.length > 0 && (
  <div className="mt-8">
    <h2 className="text-xl font-semibold mb-4">ベストプラクティス</h2>
    {book.bookBestPractices.map((practice) => (
      <div key={practice.id} className="mb-6">
        <h3 className="text-lg font-semibold">{practice.title}</h3>
        {practice.bookBestPracticeItems.map((item) => (
  <div key={item.id} className="p-4 border-b">
    <div className="text-sm font-medium">{item.title || "No Title"}</div>
    {item.link && (
      <div
        dangerouslySetInnerHTML={{ __html: item.link }} // 保存されたHTMLを直接レンダリング
      ></div>
    )}
  </div>
))}

      </div>
    ))}
  </div>
)}
     <BookChapters book={book} slug={s}/>
</div>
      </div>

      <div>
        {book.children && book.children.length > 0 && (
          <div className="mt-8">
            <div className="text-xl font-semibold mb-4">関連コンテンツ</div>
            <div className="space-y-4">
              {book.children.map((child: any) => (
                <a
                  key={child.id}
                  href={`/books/${child.slug}`}
                  className="block"
                >
                  <div className="z-1 mb-2 flex relative bg-white">
                    <div className={cn("w-2 rounded-md border shadow-md ")} />
                    <div
                      className={cn(
                        "flex  flex-col border py-12 text-center   w-[120px] shadow-md"
                      )}
                    >
                      <div className="flex-1">
                        <h3 className="md:text-md text-xs font-semibold">
                          {child.title}
                        </h3>
                      </div>
                      <div className="flex justify-center p-4 ">
                        <Image
                          src={child.icon}
                          alt={child.title}
                          width={30}
                          height={30}
                        />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import BookChapters from "@/components/main/book/BookChapters";
import { Button, buttonVariants } from "@/components/ui/button";
// app/books/[slug]/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/prisma";
import { cn, formatNumber } from "@/lib/utils";

import { ArrowRight, Book, BookTemplate, Eye, Star, Timer } from "lucide-react";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const books = await db.book.findMany({
    select: {
      slug: true,
    },
  });

  return books.map((book) => ({
    slug: book.slug,
  }));
}

async function getBookData(slug: string) {
  const book = await db.book.findFirst({
    where: { slug },
    include: {
      children: true,
      bookBestPractices: {
        include: {
          bookBestPracticeItems: true
        }
      },
      bookChapters: {
        include: {
          bookSections: {
            orderBy: {
              order: "asc"
            },
            include: {
              bookSubSections: {
                orderBy: {
                  order: "asc"
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

  return book;
}

// Generate metadata for book pages
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const book = await getBookData((await params).slug);
  
  if (!book) {
    return {
      title: "Book Not Found | IDev",
      description: "The requested book could not be found.",
    };
  }

  const totalEstimatedMinutes = book.bookChapters.reduce((total, chapter) => {
    return total + chapter.bookSections.reduce((sectionTotal, section) => {
      return sectionTotal + (section.estimatedMinutes || 0);
    }, 0);
  }, 0);

  const chapterTitles = book.bookChapters.map(chapter => chapter.title);
  const bestPracticeTitles = book.bookBestPractices.map(practice => practice.title);

  const baseUrl = process.env.NEXT_PUBLIC_URL
    ? `https://${process.env.NEXT_PUBLIC_URL}`
    : "http://localhost:3000";

  return {
    title: `${book.title} - IDev`,
    description: book.description,
    keywords: [
      book.title,
      ...chapterTitles,
      ...bestPracticeTitles,
      "AI Book",
      "Technology Guide",
      "Programming Resource",
      book.category || "",
      ...(book.prerequisites || []),
    ].filter(Boolean),
    authors: [
      {
        name: "IDev",
        url: baseUrl,
      }
    ],
    openGraph: {
      type: "article",
      title: book.title,
      description: book.description,
      images: [
        {
          url: book.icon,
          width: 1200,
          height: 630,
          alt: book.title,
        }
      ],
      publishedTime: book.createdAt.toISOString(),
      modifiedTime: book.updatedAt.toISOString(),
      section: book.category || "Technology",
      tags: book.prerequisites,
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description: book.description,
      images: [book.icon],
    },
    other: {
      "reading-time": `${totalEstimatedMinutes} minutes`,
      "book-category": book.category || "Technology",
      "book-prerequisites": book.prerequisites?.join(", "),
    },
    alternates: {
      canonical: `${baseUrl}/books/${book.slug}`,
      languages: {
        'en-US': `${baseUrl}/books/${book.slug}`,
      },
    },
  };
}


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
    <div className="mx-auto p-6 pt-20">
      <div className="flex flex-col md:flex-row gap-8 relative">
        {/* 左側固定部分 */}
        <div className="md:w-80 md:flex-shrink-0  md:top-20 flex justify-center">
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

            <div className="flex gap-4 w-full">
              <Link href={`/books/${book.slug}/${book.bookChapters[0]?.bookSections[0]?.slug}/`} className={cn(buttonVariants(), "w-full")}>
                Start read {book.slug} book
              </Link>
             
            </div>

            <div className="">
             
             {book.bookBestPractices.length > 0 && (
  <div className="space-y-6">
  <div className="flex items-center gap-2">
    <Star className="w-5 h-5 text-yellow-500" />
    <h2 className="text-xl font-semibold">Best Practices</h2>
  </div>
  
  <div className="border p-2 rounded-xl">
    {book.bookBestPractices.map((practice) => (
      <Link 
        key={practice.id} 
        href={`/books/${book.slug}/best-practice/${practice.id}`}
      >
     
       
          
            
        
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-sm text-gray-900">
                  {practice.title}
                </h3>
              
              </div>
              
              <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                {practice.description}
              </p>
              
             
        
      
    
    
      </Link>
    ))}
  </div>
</div>
)}
            </div>
          </div>

        


        </div>

       
      
<div>

     <BookChapters book={book} slug={s}/>
</div>
      </div>

      <div>
        {book.children && book.children.length > 0 && (
          <div className="mt-8">
            <div className="text-xl font-semibold mb-4">Book</div>
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

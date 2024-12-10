import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { db } from "@/lib/prisma";

import { cn } from "@/lib/utils";
import { MarqueeDemo } from "@/sections/main/Hero";


import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const books = await db.book.findMany();

  return (
    <div className="pt-20">
         <section className="mb-12 flex justify-center flex-col gap-8 items-center mx-auto px-2 text-center">
        <div className="max-w-[600px]  flex flex-col gap-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Explore the World of AI-Generated Technology and Books,
          </h1>
          <p className="text-sm md:text-lg text-gray-600">
            Discover a variety of books and articles that harness the power of
            AI to generate unique insights into technology. Dive in and explore
            innovations and resources curated to broaden your knowledge.
          </p>
          
        </div>

      
      </section>

      <MarqueeDemo />

      <div className="w-full pt-12 space-y-8  px-4 md:px-12">
        <div className="space-y-4">
          <div className="text-lg font-bold pb-8">Best Books</div>
          <div className="flex gap-4 overflow-x-scroll pb-2 ">
            {books.map((item: any) => (
              <Link
                href={`/books/${item.slug}`}
                className="flex h-52 flex-col items-center justify-between border px-4 py-2"
                key={item.id}
                style={{
                  boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.2)", // 影の設定
                  borderRadius: "4px", // 角の丸み
                }}
              >
                <div
                  className="text-xs font-semibold tracking-tight"
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "upright",
                  }}
                >
                  {item.title}
                </div>
                <Image src={item.icon} alt="" width={20} height={20} />
              </Link>
            ))}
          </div>
        </div>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <div className="flex justify-between items-center ">
            <div className="text-lg font-bold pb-8">Programming Language</div>
            <div className="flex gap-4">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </div>

          <CarouselContent>
            {books?.map((book: any) => (
              <CarouselItem key={book.id} className="md:basis-1/2 lg:basis-1/3">
                <Link href={`/books/${book.slug}`}>
                  <Card className="flex flex-col p-2">
                    <div className="py-6 bg-gray-50 w-full flex justify-center rounded-xl">
                      <div className="z-1 mb-2 flex relative bg-white">
                        <div
                          className={cn("w-2 rounded-md border shadow-md ")}
                        />
                        <div
                          className={cn(
                            "flex  flex-col border py-12 text-center   w-[120px] shadow-md"
                          )}
                        >
                          <div className="flex-1">
                            <h3 className="md:text-md text-xs font-semibold">
                              {book.title}
                            </h3>
                          </div>
                          <div className="flex justify-center p-4 ">
                            <Image
                              src={book.icon}
                              alt={book.title}
                              width={30}
                              height={30}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-md font-bold pt-2 dark:text-white">
                      {book.title}
                    </div>

                    <div className="text-xs text-gray-400 line-clamp-4 pt-2 dark:text-white">
                      {book.description}
                    </div>

                    {/* <div className="flex flex-col gap-2 pt-4">
                      <div className="text-xs">前提知識</div>
                      <div className="flex pb-4 gap-2">
                        {...Array.from({ length: 2 }).map((_, index) => (
                          <div className="text-xs text-gray-400">基本情報</div>
                        ))}
                      </div>
                    </div> */}
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {books?.map((book: any) => (
            <Link href={`/books/${book.slug}`} key={book.id}>
              <Card className="flex gap-4 p-2">
                <div className="bg-gray-50 rounded-xl  py-4 px-8">
                  <div className="z-1 mb-2 flex relative bg-white">
                    <div className={cn("w-1 rounded-md border shadow-md ")} />
                    <div
                      className={cn(
                        "flex  flex-col border py-6 text-center   w-[80px] shadow-md"
                      )}
                    >
                      <div className="flex-1">
                        <h3 className="md:text-md text-xs font-semibold">
                          {book.title}
                        </h3>
                      </div>
                      <div className="flex justify-center p-4 ">
                        <Image
                          src={book.icon}
                          alt={book.title}
                          width={30}
                          height={30}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pr-4 flex flex-col justify-between">
                  <div>
                    <div className="text-md font-bold pt-8 dark:text-white">
                      {book.title}
                    </div>

                    <p className="text-sm text-gray-400 line-clamp-2">
                      {book.description}
                    </p>
                  </div>

                  {/* <div className="flex flex-col gap-2">
                    <div className="text-xs">前提知識</div>
                    <div className="flex pb-4 gap-2">
                      {...Array.from({ length: 2 }).map((_, index) => (
                        <div className="text-xs text-gray-400">基本情報</div>
                      ))}
                    </div>
                  </div> */}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

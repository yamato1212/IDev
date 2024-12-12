// app/books/[slug]/best-practice/[practiceId]/page.tsx
import { db } from "@/lib/prisma";
import Image from "next/image";
import { Medal, Clock, Users, Star, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  params: {
    slug: string;
    bestId: string;
  };
};


export default async function BestPracticePage({ params }: Props) {
  const practice = await db.bookBestPractice.findFirst({
    where: {
      id: params.bestId,
    },
    include: {
      bookBestPracticeItems: true
      
    
    
    }
  });

  if (!practice) return <div>Not found</div>;



  return (
    <div className="max-w-4xl mx-auto p-6 pt-20">
      <Link 
        href={`/books/${params.slug}`}
        className="text-sm text-gray-600 hover:text-gray-900 mb-4 block"
      >
        ← Back 
      </Link>

      <h1 className="md:text-3xl text-xl font-bold mb-4">{practice.title}</h1>
      <p className="text-gray-600 text-xs mb-8">{practice.description}</p>

      <div className="space-y-8">
        {practice.bookBestPracticeItems.map((item, index) => (
          <Card key={item.id} className="p-6">
            <div className=" gap-6 space-y-4">
              {/* ランク表示 */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center w-8 rounded-full bg-blue-400 h-8 text-white ">
                <span className="text-2xl font-bold">{index + 1}</span>
              </div>

              {/* メインコンテンツ */}
              <div className="flex-1 space-y-4">
                

               
                {item.link && (
                  <div className="border flex justify-center items-center rounded-lg p-4 bg-gray-50">
                    <div
                      dangerouslySetInnerHTML={{ __html: item.link }}
                      className=""
                    />
                   
                  </div>
                )}

<div>
                  <h2 className="text-md font-semibold mb-2">{item.title}</h2>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>


                {item.link && (

                <div className=" justify-end">
                      <Button 
                        asChild 
                        className="bg-[#a435f0] hover:bg-[#8710f0] text-white flex items-center gap-2"
                      >
                        <a 
                          href={`${item.link.match(/href="([^"]*)/)?.[1]}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          View Course on Udemy
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                )}

              
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
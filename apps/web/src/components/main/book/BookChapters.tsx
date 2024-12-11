"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

type SubSection = {
  id: string;
  title: string;
  description: string;
  slug: string;
  estimatedMinutes: number;
};

type Section = {
  id: string;
  title: string;
  description: string;
  slug: string;
  estimatedMinutes: number;
  bookSubSections: SubSection[];
};

type Chapter = {
  id: string;
  title: string;
  description: string;
  bookSections: Section[];
};

type BookChaptersProps = {
  book: {
    description: string;
    bookChapters: Chapter[];
  };
  slug: string;
};

function BookChapters({ book, slug }: BookChaptersProps) {
  const [expandedChapters, setExpandedChapters] = useState<{ [key: string]: boolean }>({});

  // フラットな順序配列を作成
  const orderedContent = book.bookChapters.flatMap(chapter => 
    chapter.bookSections.flatMap(section => [
      {
        type: 'section',
        id: section.id,
        title: section.title,
        description: section.description,
        slug: section.slug
      },
      ...(section.bookSubSections.map(subsection => ({
        type: 'subsection',
        id: subsection.id,
        title: subsection.title,
        description: subsection.description,
        slug: `${section.slug}/${subsection.id}`,
        parentSectionId: section.id
      })))
    ])
  );

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="space-y-6">
        <div className="prose dark:prose-invert max-w-none text-slate-600 text-sm">
          <p>{book.description}</p>
        </div>

        {book.bookChapters?.length > 0 ? (
          <div className="space-y-4">
            {book.bookChapters.map((chapter) => (
              <div key={chapter.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleChapter(chapter.id)}
                >
                  {expandedChapters[chapter.id] ? (
                    <ChevronDown className="w-5 h-5 mr-2" />
                  ) : (
                    <ChevronRight className="w-5 h-5 mr-2" />
                  )}
                  <div>
                    <h3 className="font-bold text-sm">{chapter.title}</h3>
                  </div>
                </div>

                {expandedChapters[chapter.id] && chapter.bookSections?.length > 0 && (
                  <div className="ml-7 mt-4 space-y-3">
                    {chapter.bookSections.map((section) => {
                      const sectionIndex = orderedContent.findIndex(
                        content => content.type === 'section' && content.id === section.id
                      );
                      
                      return (
                        <div key={section.id} className="space-y-2">
                          <Link
                            href={`/books/${slug}/${section.slug}`}
                            className="flex items-center justify-between hover:bg-gray-50"
                          >
                            <div>
                              <h4 className="font-medium text-sm line-clamp-1">{section.title}</h4>
                              <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{section.description}</p>
                            
                            </div>
                          
                          </Link>

                          {section.bookSubSections?.length > 0 && (
                            <div className="ml-2 space-y-2">
                              {section.bookSubSections.map((subsection, subIndex) => (
                                <div 
                                  key={subsection.id}
                                  className="border-l-2 border-gray-200 "
                                >
                                  <Link
                                    href={`/books/${slug}/${section.slug}/${subsection.id}`}
                                    className="block hover:bg-gray-50 rounded p-2"
                                  >
                                    <h5 className="font-medium text-sm line-clamp-1">{subsection.title}</h5>
                                    <p className="text-xs text-gray-600 line-clamp-2">{subsection.description}</p>
                                    
                                  </Link>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            チャプターがありません。
          </div>
        )}
      </div>
    </div>
  );
}

export default BookChapters;
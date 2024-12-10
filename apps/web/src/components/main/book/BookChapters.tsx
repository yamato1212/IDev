"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

function BookChapters({ book, slug }: any) {
  const [expandedChapters, setExpandedChapters] = useState<{ [key: string]: boolean }>({});
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
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
            {book.bookChapters.map((chapter: any) => (
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
                    <h3 className="font-medium">{chapter.title}</h3>
                  </div>
                </div>

                {expandedChapters[chapter.id] && chapter.bookSections?.length > 0 && (
                  <div className="ml-7 mt-4 space-y-3">
                    {chapter.bookSections.map((section: any) => (
                      <div key={section.id}>
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => toggleSection(section.id)}
                        >
                          {expandedSections[section.id] ? (
                            <ChevronDown className="w-5 h-5 mr-2" />
                          ) : (
                            <ChevronRight className="w-5 h-5 mr-2" />
                          )}
                          <div className="flex justify-between w-full items-center">
                            <div>
                              <h4 className="font-medium">{section.title}</h4>
                              <p className="text-sm text-gray-600">{section.description}</p>
                            </div>
                          </div>
                        </div>

                        {expandedSections[section.id] && section.bookSubSections?.length > 0 && (
                          <div className="ml-6 mt-3">
                            {section.bookSubSections.map((sub: any) => (
                              <div
                                key={sub.id}
                                className="border-l-2 border-gray-200 pl-4 py-2"
                              >
                                <h5 className="font-medium text-sm">{sub.title}</h5>
                                <p className="text-sm text-gray-600">{sub.description}</p>
                                <span className="text-xs text-gray-500">
                                  予想読了時間: {sub.estimatedMinutes}分
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-400">
            チャプターがありません。
          </div>
        )}
      </div>
    </div>
  );
}

export default BookChapters;

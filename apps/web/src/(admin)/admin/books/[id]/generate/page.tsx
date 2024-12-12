'use client';

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { AddChapterModal } from "@/components/admin/book/AddChapterModal";
import { AddSectionModal } from "@/components/admin/book/AddSectionModal";
import { AddSubSectionModal } from "@/components/admin/book/AddSubSectionModal";
import ReactMarkdown from "react-markdown"

type Chapter = {
  id: string;
  title: string;
  description: string;
  slug: string;
  bookId: string;
  createdAt: string;
  updatedAt: string;
  bookSections: Section[];
};

type Section = {
  id: string;
  title: string;
  description: string;
  slug: string;
  estimatedMinutes: number;
  order: number;
  aiContent: string | null;
  bookChapterId: string;
  bookId: string;
  createdAt: string;
  updatedAt: string;

  bookSubSections: SubSection[];
};

type SubSection = {
  id: string;
  title: string;
  description: string;
  slug: string;
  estimatedMinutes: number;
  order: number;
  aiContent: string | null;
  bookChapterId: string;
  bookId: string;
  createdAt: string;
  updatedAt: string;
};

export default function GenerateBookContent({ params }: { params: { id: string } }) {
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isSubSectionModalOpen, setIsSubSectionModalOpen] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [expandedChapters, setExpandedChapters] = useState<{[key: string]: boolean}>({});
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const [generatingContent, setGeneratingContent] = useState<{[key: string]: boolean}>({});
const [remainingCount, setRemainingCount] = useState(0);


  const fetchChapters = async () => {
    try {
      const response = await fetch(`/api/books/${params.id}/chapters`);
      if (response.ok) {
        const data = await response.json();
        setChapters(data.chapters);
      }
    } catch (error) {
      console.error('Failed to fetch chapters:', error);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [params.id]);

  const handleGenerateSubSectionContent = async (subsectionId: string) => {
    try {
      setGeneratingContent(prev => ({ ...prev, [subsectionId]: true }));
      const subsection = chapters.flatMap(c => 
        c.bookSections.flatMap(s => 
          s.bookSubSections
        )
      ).find(s => s.id === subsectionId);
      
      setStatus(`${subsection?.title}の内容を生成中...`);
  
      const response = await fetch('/api/books/generate/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookId: params.id,
          subsectionId 
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate subsection content');
      }
  
      const result = await response.json();
      setStatus(`${result.message}`);
      await fetchChapters();
  
    } catch (error) {
      console.error('Failed to generate subsection content:', error);
      setStatus('サブセクションのコンテンツ生成中にエラーが発生しました');
    } finally {
      setGeneratingContent(prev => ({ ...prev, [subsectionId]: false }));
    }
  };

  const handleGenerateNextContent = async () => {
    if (isGenerating) return;
  
    try {
      setIsGenerating(true);
      const response = await fetch('/api/books/generate/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: params.id }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate content');
      }
  
      const data = await response.json();
      setStatus(data.message);
      setRemainingCount(data.remainingCount);
  
      // コンテンツが生成されたら、チャプター一覧を更新
      await fetchChapters();
  
      // 残りのサブセクションがある場合、少し待ってから次のコンテンツを生成
      if (data.remainingCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5秒待機
        handleGenerateNextContent();
      }
  
    } catch (error) {
      console.error('Content generation failed:', error);
      setStatus('コンテンツ生成中にエラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddChapter = async (data: { title: string; description: string; order: number }) => {
    try {
      const response = await fetch(`/api/books/${params.id}/chapter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        await fetchChapters();
      }
    } catch (error) {
      console.error("Failed to add chapter:", error);
    }
  };

  const handleAddSection = async (data: { title: string; description: string; order: number }) => {
    if (!selectedChapterId) return;
    try {
      const response = await fetch(
        `/api/books/${params.id}/chapter/${selectedChapterId}/sections`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        await fetchChapters();
      }
    } catch (error) {
      console.error("Failed to add section:", error);
    }
  };

  const handleAddSubSection = async (data: { title: string; description: string; order: number }) => {
    if (!selectedChapterId || !selectedSectionId) return;
    try {
      const response = await fetch(
        `/api/books/${params.id}/chapter/${selectedChapterId}/sections/${selectedSectionId}/subsections`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        await fetchChapters();
      }
    } catch (error) {
      console.error("Failed to add subsection:", error);
    }
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };


  return (
    <div className="max-w-4xl mx-auto p-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">本の構造管理</h1>
        <Button onClick={() => setIsChapterModalOpen(true)}>
          チャプターを追加
        </Button>
      </div>

      <Button
  onClick={handleGenerateNextContent}
  disabled={isGenerating}
>
  {isGenerating ? (
    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 生成中</>
  ) : (
    '未生成のコンテンツを生成'
  )}
</Button>
{remainingCount > 0 && (
  <p className="text-sm text-gray-600">
    残り{remainingCount}個のサブセクション
  </p>
)}

      {/* チャプター一覧 */}
      <div className="space-y-4">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => toggleChapter(chapter.id)}>
                {expandedChapters[chapter.id] ? 
                  <ChevronDown className="w-5 h-5" /> : 
                  <ChevronRight className="w-5 h-5" />
                }
                <div>
                  <h3 className="font-medium">{chapter.title}</h3>
                  <p className="text-sm text-gray-600">{chapter.description}</p>
                </div>
              </div>
              <Button
                onClick={() => {
                  setSelectedChapterId(chapter.id);
                  setIsSectionModalOpen(true);
                }}
              >
                セクションを追加
              </Button>
            </div>

            {/* セクション一覧 */}
            {expandedChapters[chapter.id] && chapter.bookSections?.length > 0 && (
              <div className="ml-8 mt-4 space-y-4">
                {chapter.bookSections.map((section) => (
                  <div key={section.id} className="border-l-2 pl-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => toggleSection(section.id)}>
                        {expandedSections[section.id] ? 
                          <ChevronDown className="w-5 h-5" /> : 
                          <ChevronRight className="w-5 h-5" />
                        }
                        <div>
                          <h4 className="font-medium">{section.title}</h4>
                          <p className="text-sm text-gray-600">{section.description}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedChapterId(chapter.id);
                          setSelectedSectionId(section.id);
                          setIsSubSectionModalOpen(true);
                        }}
                      >
                        サブセクションを追加
                      </Button>
                    </div>
                    
                    {/* サブセクション一覧 */}
                    {expandedSections[section.id] && section.bookSubSections?.length > 0 && (
                      <div className="ml-8 mt-4 space-y-2">
                        {section.bookSubSections.map((subsection) => (
                          <div key={subsection.id} className="border-l-2 pl-4 py-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <h5 className="font-medium text-sm">{subsection.title}</h5>
                                <p className="text-sm text-gray-600">{subsection.description}</p>
                                <span className="text-xs text-gray-500">
                                  予想読了時間: {subsection.estimatedMinutes}分
                                </span>
                              </div>
                              <Button
                                onClick={() => handleGenerateSubSectionContent(subsection.id)}
                                disabled={generatingContent[subsection.id]}
                                variant="outline"
                                size="sm"
                              >
                                {generatingContent[subsection.id] ? (
                                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 生成中</>
                                ) : (
                                  subsection.aiContent ? 'コンテンツを再生成' : 'コンテンツを生成'
                                )}
                              </Button>
                            </div>
                            {subsection.aiContent && (
                              <div className="mt-2 p-2 bg-gray-50 rounded">
                                true
                              </div>
                            )}
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

      {/* モーダル */}
      <AddChapterModal
        isOpen={isChapterModalOpen}
        onClose={() => setIsChapterModalOpen(false)}
        onSubmit={handleAddChapter}
      />
      <AddSectionModal
        isOpen={isSectionModalOpen}
        onClose={() => {
          setIsSectionModalOpen(false);
          setSelectedChapterId(null);
        }}
        onSubmit={handleAddSection}
      />
      <AddSubSectionModal
        isOpen={isSubSectionModalOpen}
        onClose={() => {
          setIsSubSectionModalOpen(false);
          setSelectedChapterId(null);
          setSelectedSectionId(null);
        }}
        onSubmit={handleAddSubSection}
      />
    </div>
  );
}
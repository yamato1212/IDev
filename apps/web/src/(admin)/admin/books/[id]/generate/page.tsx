'use client';

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Loader2, ChevronDown, ChevronRight } from "lucide-react";

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
};

export default function GenerateBookContent({ params }: { params: { id: string } }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<{[key: string]: boolean}>({});
  const [generatingContent, setGeneratingContent] = useState<{[key: string]: boolean}>({});

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

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setStatus('本の構造を生成中...');
      setProgress(0);

      const response = await fetch('/api/books/generate/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: params.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate book structure');
      }

      setStatus('本の構造の生成が完了しました');
      setProgress(100);
      
      await fetchChapters();
    } catch (error) {
      setStatus('エラーが発生しました');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateContent = async (sectionId: string) => {
    try {
      setGeneratingContent(prev => ({ ...prev, [sectionId]: true }));
      const section = chapters.flatMap(c => c.bookSections).find(s => s.id === sectionId);
      setStatus(`${section?.title}の内容を生成中...`);

      const response = await fetch('/api/books/generate/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookId: params.id,
          sectionId 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const result = await response.json();
      setStatus(`${result.message}`);
      await fetchChapters();

    } catch (error) {
      console.error('Failed to generate content:', error);
      setStatus('コンテンツの生成中にエラーが発生しました');
    } finally {
      setGeneratingContent(prev => ({ ...prev, [sectionId]: false }));
    }
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-20">
      <h1 className="text-2xl font-bold mb-4">本のコンテンツを生成</h1>
      
      <div className="mb-8">
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating}
          className="mb-4"
        >
          {isGenerating ? '生成中...' : '本の構造を生成'}
        </Button>

        {status && (
          <div className="mt-4">
            <div className="text-gray-600 mb-2">{status}</div>
            {isGenerating && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">チャプター一覧</h2>
        {chapters.map((chapter) => (
          <div 
            key={chapter.id} 
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => toggleChapter(chapter.id)}
            >
              {expandedChapters[chapter.id] ? 
                <ChevronDown className="w-5 h-5 mr-2" /> : 
                <ChevronRight className="w-5 h-5 mr-2" />
              }
              <div>
                <h3 className="font-medium">{chapter.title}</h3>
                <p className="text-sm text-gray-600">{chapter.description}</p>
              </div>
            </div>
            
            {expandedChapters[chapter.id] && chapter.bookSections?.length > 0 && (
              <div className="ml-7 mt-4 space-y-3">
                {chapter.bookSections.map((section) => (
                  <div 
                    key={section.id}
                    className="border-l-2 border-gray-200 pl-4 py-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{section.title}</h4>
                        <p className="text-sm text-gray-600">{section.description}</p>
                        <span className="text-xs text-gray-500">
                          予想読了時間: {section.estimatedMinutes}分
                        </span>
                      </div>
                      <Button
                        onClick={() => handleGenerateContent(section.id)}
                        disabled={generatingContent[section.id]}
                        variant="outline"
                        size="sm"
                      >
                        {generatingContent[section.id] ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 生成中</>
                        ) : (
                          section.aiContent ? 'コンテンツを再生成' : 'コンテンツを生成'
                        )}
                      </Button>
                    </div>
                    {section.aiContent && (
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                          {section.aiContent}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {chapters.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            チャプターがありません。「本の構造を生成」ボタンをクリックしてチャプターを作成してください。
          </p>
        )}
      </div>
    </div>
  );
}
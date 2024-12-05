// app/admin/books/[id]/generate/page.tsx
'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function GenerateBookContent({ params }: { params: { id: string } }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setStatus('コンテンツの生成を開始...');

      const response = await fetch('/api/books/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: params.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      setStatus('コンテンツの生成が完了しました！');
    } catch (error) {
      setStatus('エラーが発生しました');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">本のコンテンツを生成</h1>
      <Button 
        onClick={handleGenerate} 
        disabled={isGenerating}
      >
        {isGenerating ? '生成中...' : 'コンテンツを生成'}
      </Button>
      {status && (
        <div className="mt-4 text-gray-600">
          {status}
        </div>
      )}
    </div>
  );
}
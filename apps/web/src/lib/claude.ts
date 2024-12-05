// lib/claude.ts
import { Anthropic } from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY!,
});

// 本の構造（チャプターとセクション）を生成
export async function generateBookStructure(bookTitle: string, description: string) {
  const prompt = `
あなたは技術書の構造を設計するエキスパートです。
以下の本のチャプター構造を作成してください：

本のタイトル: ${bookTitle}
説明: ${description}

以下の形式でJSON形式で出力してください：
{
  "chapters": [
    {
      "title": "チャプタータイトル",
      "description": "チャプターの説明",
      "sections": [
        {
          "title": "セクションタイトル",
          "description": "セクションの説明",
          "estimatedMinutes": 30,
          "order": 1
        }
      ]
    }
  ]
}

全て英語のテキストで生成してください
チャプターは本を学ぶ順番でどんどん追加されていく、各チャプターは必要な数のセクションを持つようにしてください。`;


  const response = await client.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content[0];
}

// セクションのコンテンツを生成
export async function generateSectionContent(
  bookTitle: string,
  chapterTitle: string,
  sectionTitle: string,
  sectionDescription: string
) {
  const prompt = `
あなたは${bookTitle}の技術書の執筆者です。
以下のセクションの内容を記述してください：

チャプター: ${chapterTitle}
セクション: ${sectionTitle}
説明: ${sectionDescription}

以下の点に注意して執筆してください：
- SEOを意識した構造化された内容
- 初心者にもわかりやすい説明
固有名詞の説明
- 具体的なコード例の提示
- 実践的なユースケースの解説
1. 見出しは # と ## を使用
2. コードブロックは \`\`\` で囲む
3. 説明は初心者にもわかりやすく
4. 実践的なコード例を含める
5. セクションの長さは3000文字程度 ~ 4000文字程度 状況に応じて変更してください

全て英語のテキストで生成してください


Markdownフォーマットで出力してください。`;

  const response = await client.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content[0]
}
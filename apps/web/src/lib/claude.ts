// lib/claude.ts
import { Anthropic } from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY!,
});

// ログユーティリティ
function logDebug(functionName: string, message: string, data?: any) {
  console.log(`[${functionName}] ${message}`, data ? data : '');
}

function logError(functionName: string, error: any, context?: any) {
  console.error(`[${functionName}] Error:`, error);
  if (context) {
    console.error(`[${functionName}] Context:`, context);
  }
}





export async function generateBookStructure(bookTitle: string, description: string) {
  const functionName = 'generateBookStructure';
  try {
    logDebug(functionName, 'Starting generation with:', { bookTitle, description });

    const prompt = `Generate a comprehensive book structure in JSON format based on the provided book title and description. The structure should be tailored to the topic and cover all relevant aspects necessary for readers to thoroughly understand the subject. Use the following exact JSON format and return **only valid JSON**:

    bookTItle: ${bookTitle}
    description: ${description}

{
  "chapters": [
    {
      "title": "Chapter 1: [Placeholder for Chapter Title]",
      "description": "Brief description of the chapter's focus",
      "sections": [
        {
          "title": "Section Title",
          "description": "Overview of the section's content",
          "estimatedMinutes": 20,
          "order": 1,
          "subSections": [
            {
              "title": "Subsection Title",
              "description": "Detailed explanation or practical example",
              "estimatedMinutes": 10,
              "order": 1
            }
          ]
        }
      ]
    }
  ]
}

**Input**:
- Book Title: {{bookTitle}}
- Description: {{description}}

**Guidelines**:
1. Use the book title and description as context to determine the appropriate topics, chapters, and structure.
2. Each chapter should focus on a single key theme or concept, broken into logical sections and subsections.
3. Adapt the complexity of the content to suit the book's purpose (e.g., beginner-friendly for introductory topics, advanced details for expert-level books).
4. Include practical examples, real-world use cases, or case studies where relevant.
5. Ensure the book structure progresses logically, covering fundamentals before moving to more advanced topics.
6. Chapters, sections, and subsections can be added as needed, with no strict limits.

**Important**:
- Ensure the JSON is valid and well-structured.
- Output only JSON without any text outside the format.
- Keep the structure flexible and relevant to the topic based on the title and description provided.

Example Titles and Descriptions:
- "Mastering SwiftUI" with "A book to guide developers through all aspects of SwiftUI development."
- "Introduction to Machine Learning" with "A comprehensive beginner's guide to machine learning concepts and applications."
- "Cooking for Beginners" with "A step-by-step guide to mastering basic cooking skills and recipes."

Adjust chapters, sections, and subsections to fit the provided topic while maintaining a logical and educational flow.
`;

    const response = await client.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }) as any;

    const content = response.content[0].text;
    
    // デバッグログ追加
    logDebug(functionName, 'Raw response:', content);

    try {
      // JSON部分の抽出を改善
      let jsonContent = content;
      if (content.includes('{')) {
        const start = content.indexOf('{');
        const end = content.lastIndexOf('}') + 1;
        jsonContent = content.slice(start, end);
      }

      // JSONとしての妥当性をチェック
      if (!jsonContent.trim().startsWith('{') || !jsonContent.trim().endsWith('}')) {
        throw new Error('Invalid JSON structure');
      }

      const parsedContent = JSON.parse(jsonContent);

      // 構造の検証
      if (!parsedContent || !parsedContent.chapters || !Array.isArray(parsedContent.chapters)) {
        throw new Error('Invalid book structure: missing chapters array');
      }

      // すべての必要なプロパティが存在することを確認
      parsedContent.chapters.forEach((chapter: any, i: number) => {
        if (!chapter.title || !chapter.description || !Array.isArray(chapter.sections)) {
          throw new Error(`Invalid chapter structure at index ${i}`);
        }

        chapter.sections.forEach((section: any, j: number) => {
          if (!section.title || !section.description || !Array.isArray(section.subSections)) {
            throw new Error(`Invalid section structure at chapter ${i}, section ${j}`);
          }
        });
      });

      return parsedContent;

    } catch (parseError) {
      logError(functionName, 'JSON parse error:', {
        error: parseError,
        content: content
      });
      throw parseError;
    }

  } catch (error) {
    logError(functionName, error, { bookTitle, description });
    throw error;
  }
}
export async function generateSectionStructure(
  bookTitle: string,
  chapterTitle: string,
  chapterDescription: string
) {
  const functionName = 'generateSectionStructure';
  try {
    logDebug(functionName, 'Starting generation with:', {
      bookTitle,
      chapterTitle,
      chapterDescription
    });

    const prompt = `Create a comprehensive list of sections for the following chapter in the technical book "${bookTitle}".

Chapter: ${chapterTitle}
Description: ${chapterDescription}

Return ONLY a JSON array of sections. Each section should include:
- A clear title
- A detailed description
- Estimated reading time
- Content type

Example format:
[
  {
    "title": "Section Title",
    "description": "Detailed section description",
    "estimatedMinutes": 30,
    "type": "concept|tutorial|practice|reference"
  }
]


Requirements:
- Cover all necessary topics for this chapter
- Progress from basic to advanced concepts
- Include both theory and practice
- Break complex topics into digestible sections
- No text before or after the JSON`;

    const response = await client.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    }) as any;

    logDebug(functionName, 'Received response from Claude');
    
    const content = response.content[0].text;
    logDebug(functionName, 'Raw response:', content);

    // JSON部分を抽出
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const jsonContent = jsonMatch[0];
    logDebug(functionName, 'Extracted JSON:', jsonContent);

    return JSON.parse(jsonContent);
  } catch (error) {
    logError(functionName, error, {
      bookTitle,
      chapterTitle,
      chapterDescription
    });
    throw error;
  }
}

export async function generateSectionContent(
  bookTitle: string,
  chapterTitle: string,
  sectionTitle: string,
  sectionDescription: string
) {
  const functionName = 'generateSectionContent';
  try {
    logDebug(functionName, 'Starting generation with:', {
      bookTitle,
      chapterTitle,
      sectionTitle,
      sectionDescription
    });

    const prompt = `You are writing content for the technical book "${bookTitle}".
Create comprehensive content for the following section in Markdown format:

Chapter: ${chapterTitle}
Section: ${sectionTitle}
Description: ${sectionDescription}

Guidelines:
1. Use # for main heading and ## for subheadings
2. Wrap code blocks in triple backticks with language specification
3. Keep explanations beginner-friendly
4. Include practical code examples
5. Section length: 3000-4000 characters
6. Output in English only
7. Use Markdown formatting

Structure the content with:
- Clear introduction
- Well-organized subsections
- Code examples where relevant
- Summary and key takeaways

OUTPUT IN MARKDOWN FORMAT ONLY.`;

    logDebug(functionName, 'Sending prompt to Claude');

    const response = await client.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    }) as any;

    logDebug(functionName, 'Received response from Claude');
    
    const content = response.content[0].text;
    logDebug(functionName, 'Response content length:', content.length);

    return content;
  } catch (error) {
    logError(functionName, error, {
      bookTitle,
      chapterTitle,
      sectionTitle,
      sectionDescription
    });
    throw error;
  }
}


export async function generateSubSectionContent(
  bookTitle: string,
  chapterTitle: string,
  sectionTitle: string,
  subsectionTitle: string,
  subsectionDescription: string
) {
  const functionName = 'generateSubSectionContent';
  try {
    logDebug(functionName, 'Starting generation with:', {
      bookTitle,
      chapterTitle,
      sectionTitle,
      subsectionTitle,
      subsectionDescription
    });

    const prompt = `You are writing content for the technical book "${bookTitle}". 
Create a comprehensive, SEO-optimized article in React-Markdown compatible format.

Target Content:
Chapter: ${chapterTitle}
Section: ${sectionTitle}
SubSection: ${subsectionTitle}
Description: ${subsectionDescription}

Required Structure:

# ${subsectionTitle}

> A comprehensive guide to ${subsectionTitle} in ${bookTitle}. Learn about [main concept] with clear explanations. Perfect for beginners starting with ${bookTitle}.

## Introduction
[Hook and value proposition explaining why this topic matters]
[Clear explanation of what readers will learn]

## Core Concepts
[Main concept explanations with examples]

## Implementation Details
[Step-by-step implementation guide]

## Best Practices
[Key best practices and recommendations]

## Common Pitfalls
[Common mistakes to avoid]

## Practical Examples
[Real-world examples with explanations]

## Summary and Next Steps
[Key takeaways and what to learn next]

Content Requirements:
1. Format:
   - Use proper markdown heading hierarchy (h1 > h2)
   - Create clear paragraph breaks
   - Use bullet points for lists
   - Include code blocks where relevant
   - Length: ~3000 characters

2. Style:
   - Write in clear, beginner-friendly language
   - Define all technical terms
   - Use practical examples
   - Include code samples where appropriate

3. SEO Elements:
   - Use descriptive headers
   - Include relevant keywords naturally
   - Write engaging meta description
   - Create scannable content structure

IMPORTANT: Output clean Markdown that works well with react-markdown. No table of contents or extra formatting - focus on content that renders well in the UI.

OUTPUT IN MARKDOWN FORMAT ONLY.`;

    logDebug(functionName, 'Sending prompt to Claude');

    const response = await client.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    }) as any;

    logDebug(functionName, 'Received response from Claude');
    
    const content = response.content[0].text;
    logDebug(functionName, 'Response content length:', content.length);

    return content;

  } catch (error) {
    logError(functionName, error, {
      bookTitle,
      chapterTitle,
      sectionTitle,
      subsectionTitle,
      subsectionDescription
    });
    throw error;
  }
}
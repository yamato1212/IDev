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

    const prompt = `Generate a professional technical book structure in JSON format for a programming guide.

Book Title: ${bookTitle}
Description: ${description}

Return ONLY the following JSON structure with no additional text:
{
  "chapters": [
    {
      "title": "Chapter Title",
      "description": "Chapter Description",
      "pageEstimate": 30,
      "sections": [
        {
          "title": "Section Title",
          "description": "Section Description",
          "estimatedMinutes": 30,
          "order": 1,
        
        }
      ]
    }
  ]
}

Content Organization Requirements:

1. Complete Coverage:
   - Break down large topics into dedicated chapters
   - Cover each concept thoroughly with multiple sections
   - Include all variations and use cases
   - No artificial limits on content length

2. Detailed Breakdown:
   Example for "React Hooks":
   - Individual chapters for complex topics
   - Detailed sections for each hook type
   - All common patterns and use cases
   - Error handling and edge cases
   - Integration with other features

3. Progressive Learning:
   - Start with foundational knowledge
   - Build complexity gradually
   - Include advanced scenarios
   - Cover production considerations

4. Practical Focus:
   - Real-world examples
   - Common patterns
   - Best practices
   - Anti-patterns to avoid
   - Debugging and troubleshooting
   - Performance optimization

5. Content Requirements:
   - Each concept should be fully explained
   - Include setup and configuration
   - Cover testing strategies
   - Include deployment considerations
   - Address security concerns
   - Performance best practices

Technical Requirements:
- Valid JSON format
- Detailed descriptions
- Clear prerequisites
- Specific learning objectives
- Logical content progression
- No external content

Goal: Create a structure for a definitive guide that covers everything a developer needs to know about the subject.`;

    logDebug(functionName, 'Sending prompt to Claude');

    const response = await client.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    }) as any;

    logDebug(functionName, 'Received response from Claude');
    
    const content = response.content[0].text;
    logDebug(functionName, 'Raw response:', content);

    // JSON部分を抽出
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const jsonContent = jsonMatch[0];
    logDebug(functionName, 'Extracted JSON:', jsonContent);

    const parsedContent = JSON.parse(jsonContent);
    logDebug(functionName, 'Successfully parsed JSON');

    return parsedContent;
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

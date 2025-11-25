import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { descriptions, text } = body;

    if (!descriptions || !Array.isArray(descriptions) || descriptions.length === 0) {
      return NextResponse.json(
        { error: 'Descriptions array is required and must not be empty' },
        { status: 400 }
      );
    }

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Construct the prompt with user descriptions and text
    const promptMessage = `You are a text formatting assistant helping people with dyslexia read more easily.

The user has indicated the following reading challenges:
${descriptions.map((desc, i) => `${i + 1}. ${desc}`).join('\n')}

Please reformat the following text to make it more readable based on these specific needs. Apply appropriate formatting such as:
- Increased spacing between lines and paragraphs
- Breaking up dense text blocks
- Using bullet points or numbered lists where appropriate
- Adding clear headings and structure
- Ensuring proper contrast and readability
- Any other formatting that addresses the specific challenges mentioned

Text to format:
${text}

IMPORTANT: Structure your response in TWO parts separated by the marker "---FORMATTED_TEXT---":

1. FIRST, provide a brief explanation (2-4 bullet points) of the formatting decisions you made and why they help with the specific challenges mentioned. Use plain HTML formatting for this section.

2. THEN, after the marker "---FORMATTED_TEXT---", provide the reformatted text with HTML formatting.

Do NOT wrap any part of your response in markdown code blocks or backticks. Return the HTML directly.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: promptMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Extract the formatted text from the response
    let content = response.choices[0]?.message?.content || text;

    // Remove markdown code blocks if present (```html ... ``` or ``` ... ```)
    // Handle multiple formats and newlines
    content = content
      .replace(/^```html\s*\n?/gi, '')
      .replace(/^```\s*\n?/g, '')
      .replace(/\n?\s*```$/g, '')
      .trim();

    // Split the response into explanation and formatted text
    const parts = content.split('---FORMATTED_TEXT---');
    let explanation = '';
    let formattedText = content;

    if (parts.length === 2) {
      explanation = parts[0].trim();
      formattedText = parts[1].trim();
    }

    return NextResponse.json({
      formattedText,
      explanation,
    });
  } catch (error) {
    console.error('Error formatting text:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to format text', 
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.name : 'Unknown'
      },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ message: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: 'AI service not configured' }, { status: 500 });
    }

    // Create a context-aware prompt
    const prompt = `You are an intelligent attendance tracking assistant for a university student. Help them with attendance-related questions, calculations, and advice.

User message: ${message}

Provide helpful, concise responses about:
- Attendance percentage calculations
- Attendance requirements (75% rule)
- Study tips for improving attendance
- Time management
- Academic advice

Keep responses friendly and under 150 words.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error('Gemini API error:', data.error);
      return NextResponse.json({ message: 'AI service error' }, { status: 500 });
    }

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ message: 'Failed to get AI response' }, { status: 500 });
  }
}

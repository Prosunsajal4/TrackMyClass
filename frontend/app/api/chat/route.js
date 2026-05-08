import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { message: "Message is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Chat error: missing GEMINI_API_KEY");
      return NextResponse.json(
        { message: "AI service not configured. Contact the site admin." },
        { status: 503 },
      );
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

    const modelList = (process.env.GEMINI_MODEL_LIST || "")
      .split(",")
      .map((model) => model.trim())
      .filter(Boolean);
    const defaultModels = [
      process.env.GEMINI_MODEL || "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-1.0-pro",
    ];
    const modelsToTry = modelList.length ? modelList : defaultModels;
    const endpointBase =
      process.env.GEMINI_API_BASE ||
      "https://generativelanguage.googleapis.com/v1/models";
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const callModel = async (modelName) =>
      fetch(`${endpointBase}/${modelName}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

    let response;
    let lastText = "";
    let lastStatus = null;
    for (const modelName of modelsToTry) {
      response = await callModel(modelName);
      if (response.ok) {
        break;
      }

      const text = await response.text().catch(() => "");
      lastText = text;
      lastStatus = response.status;

      if (response.status === 404) {
        console.warn("Model not found, trying next", modelName);
        continue;
      }

      console.error("Gemini API responded with status", response.status, text);
      return NextResponse.json(
        { message: "AI service error", details: text },
        { status: 502 },
      );
    }

    if (!response || !response.ok) {
      console.error("No Gemini model matched", lastStatus, lastText);
      return NextResponse.json(
        { message: "AI model not found", details: lastText },
        { status: 502 },
      );
    }

    const data = await response.json();
    if (data.error) {
      console.error("Gemini API error:", data.error);
      return NextResponse.json(
        { message: "AI service error", details: data.error },
        { status: 502 },
      );
    }

    const aiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I could not generate a response.";

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { message: "Failed to get AI response" },
      { status: 500 },
    );
  }
}

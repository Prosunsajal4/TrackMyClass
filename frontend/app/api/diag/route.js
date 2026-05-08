import { NextResponse } from "next/server";

export async function GET() {
  try {
    const hasKey = !!process.env.GEMINI_API_KEY;
    return NextResponse.json({
      hasGeminiKey: hasKey,
      nodeEnv: process.env.NODE_ENV || null,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

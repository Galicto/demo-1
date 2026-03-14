import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    
    // Determine the last user message
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || !lastMessage.content) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    
    // Prepare history for context if needed, but for simplicity we can send a system prompt + the last message
    // or pass the entire conversation history.
    const promptContext = `You are Lumi, an expert customer support AI for "Lumitop", a premium dropshipping store selling the Lumitop Sunset Projection LED Lamp. 
    Key info to know:
    - Product: Lumitop Sunset Lamp (4 interchangeable color films: Sunset Red, Sun Light, Rainbow, and Halo).
    - Price: ₹149 (Massive 85% discount from ₹999).
    - Features: Heavy metal base, ultra-bright LED, high-quality optical lens.
    - Shipping: FREE delivery. Takes 3-5 business days across India.
    - Payment: Cash on Delivery (COD) is available. Prepaid online payments get an extra 10% instant discount.
    - Warranty: 1-Year replacement warranty for manufacturing defects.
    - Return Policy: 7-day hassle-free replacement.
    Tone: Friendly, concise, helpful, and highly energetic. Use emojis. Keep answers under 3 sentences to stay punchy. Guide users to "Buy Now" or "Add to Cart" if they want to purchase.
    
    User says: ${lastMessage.content}`;

    const result = await model.generateContent(promptContext);
    const responseText = result.response.text();

    return NextResponse.json({ 
      role: 'assistant', 
      content: responseText 
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}


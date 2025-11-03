import { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI } from '@google/genai';

// Type definitions for Vercel serverless functions
type VercelRequest = IncomingMessage & {
  body?: any;
  query?: Record<string, string>;
  cookies?: Record<string, string>;
  method?: string;
  headers: Record<string, string>;
};

type VercelResponse = ServerResponse & {
  status(code: number): VercelResponse;
  json(data: any): void;
  send(data?: any): void;
};


export const config = {
  runtime: 'nodejs18.x',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // No authentication required for now

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.error("Gemini API key not found in environment variables");
      return res.status(500).json({ error: "Gemini API key is not configured" });
    }

    const { messages, systemPrompt } = req.body;
    if (!messages || !systemPrompt) {
      return res.status(400).json({ error: "The function requires 'messages' and 'systemPrompt'." });
    }

    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    
    const contents = messages.map((msg: { sender: string; text: string; }) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    const aiResponseText = response.text;
    return res.status(200).json({ text: aiResponseText });
  } catch (error) {
    console.error("Error in continueChat:", error);
    return res.status(500).json({ error: "Failed to get AI response." });
  }
}
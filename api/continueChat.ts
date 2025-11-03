import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify Firebase ID token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    if (!decodedToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

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
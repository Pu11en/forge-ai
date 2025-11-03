import { collection, query, where, orderBy, getDocs, addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from './config';
import type { ChatSession, Message } from '../types';

const sessionsCollection = 'chatSessions';

// Helper to convert Firestore doc to ChatSession
const docToChatSession = (doc: any): ChatSession => {
    const data = doc.data();
    return {
        id: doc.id,
        title: data.title,
        systemPrompt: data.systemPrompt,
        messages: data.messages || [], // Ensure messages is always an array
    };
};

// Get all chat sessions for a user
export const getChatSessions = async (userId: string): Promise<ChatSession[]> => {
    const q = query(
        collection(db, sessionsCollection),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToChatSession);
};

// Create a new chat session
export const createChatSession = async (userId: string, title: string, systemPrompt: string): Promise<ChatSession> => {
    const sessionData = {
        userId,
        title,
        systemPrompt,
        messages: [], // Start with an empty array; the first message is now fetched from the AI
        createdAt: serverTimestamp(),
    };

    const newSessionRef = await addDoc(collection(db, sessionsCollection), sessionData);

    return {
        id: newSessionRef.id,
        title,
        systemPrompt,
        messages: [],
    };
};

// Update messages in a chat session
export const updateChatMessages = async (sessionId: string, messages: Message[]): Promise<void> => {
    const sessionRef = doc(db, sessionsCollection, sessionId);
    await setDoc(sessionRef, { messages }, { merge: true });
};


import * as firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { db } from './config';
import type { ChatSession, Message } from '../types';

const sessionsCollection = 'chatSessions';

type DocumentData = firebase.firestore.DocumentData;

// Helper to convert Firestore doc to ChatSession
const docToChatSession = (doc: firebase.firestore.QueryDocumentSnapshot<DocumentData>): ChatSession => {
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
    const querySnapshot = await db.collection(sessionsCollection)
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
    return querySnapshot.docs.map(docToChatSession);
};

// Create a new chat session
export const createChatSession = async (userId: string, title: string, systemPrompt: string): Promise<ChatSession> => {
    const sessionData = {
        userId,
        title,
        systemPrompt,
        messages: [], // Start with an empty array; the first message is now fetched from the AI
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    const newSessionRef = await db.collection(sessionsCollection).add(sessionData);

    return {
        id: newSessionRef.id,
        title,
        systemPrompt,
        messages: [],
    };
};

// Update messages in a chat session
export const updateChatMessages = async (sessionId: string, messages: Message[]): Promise<void> => {
    const sessionRef = db.collection(sessionsCollection).doc(sessionId);
    await sessionRef.set({ messages }, { merge: true });
};
import type { ChatSession, Message } from '../types';

const SESSIONS_KEY = 'archeforge_chat_sessions';

// Get all chat sessions from local storage
export const getChatSessions = (): ChatSession[] => {
  try {
    const sessionsJson = localStorage.getItem(SESSIONS_KEY);
    if (!sessionsJson) return [];
    
    const sessions = JSON.parse(sessionsJson);
    return sessions.map((session: any) => ({
      ...session,
      createdAt: session.createdAt || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error loading chat sessions:', error);
    return [];
  }
};

// Create a new chat session
export const createChatSession = (title: string, systemPrompt: string): ChatSession => {
  const newSession: ChatSession = {
    id: Date.now().toString(), // Simple ID generation
    title,
    systemPrompt,
    messages: [],
    createdAt: new Date().toISOString()
  };
  
  try {
    const sessions = getChatSessions();
    const updatedSessions = [newSession, ...sessions];
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updatedSessions));
    return newSession;
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw new Error('Failed to create chat session');
  }
};

// Update messages in a chat session
export const updateChatMessages = (sessionId: string, messages: Message[]): void => {
  try {
    const sessions = getChatSessions();
    const updatedSessions = sessions.map(session => 
      session.id === sessionId ? { ...session, messages } : session
    );
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updatedSessions));
  } catch (error) {
    console.error('Error updating chat messages:', error);
    throw new Error('Failed to update chat messages');
  }
};

// Delete a chat session
export const deleteChatSession = (sessionId: string): void => {
  try {
    const sessions = getChatSessions();
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updatedSessions));
  } catch (error) {
    console.error('Error deleting chat session:', error);
    throw new Error('Failed to delete chat session');
  }
};
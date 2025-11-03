
export interface Pillar {
    title: string;
    defines: string;
    matters: string;
    extracts: string[];
    questions: string[];
}

export type AppState = 'welcome' | 'questionnaire' | 'processing' | 'report' | 'chat' | 'error';

export interface Answers {
    [pillarTitle: string]: string[];
}

export interface PillarSummaries {
    [pillarTitle:string]: string;
}

export interface Message {
    sender: 'user' | 'ai';
    text: string;
}

export interface ChatSession {
    id: string;
    title: string;
    systemPrompt: string;
    messages: Message[];
    createdAt?: string;
}
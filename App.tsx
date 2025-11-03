

import React, { useState, useEffect, useCallback } from 'react';
import type * as firebase from 'firebase/compat/app';

import WelcomeScreen from './components/WelcomeScreen';
import PillarQuestionnaire from './components/PillarQuestionnaire';
import ProcessingScreen from './components/ProcessingScreen';
import ReportScreen from './components/ReportScreen';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import AuthScreen from './components/AuthScreen';

import { PILLARS } from './constants';
import type { AppState, Answers, PillarSummaries, ChatSession, Message } from './types';
import { auth, functions } from './firebase/config';
import { getChatSessions, createChatSession, updateChatMessages } from './firebase/firestore';


const App: React.FC = () => {
    const [user, setUser] = useState<firebase.User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [appState, setAppState] = useState<AppState>('welcome');
    
    // Questionnaire State
    const [answers, setAnswers] = useState<Answers>({});
    const [currentPillarIndex, setCurrentPillarIndex] = useState(0);

    // Report State
    const [pillarSummaries, setPillarSummaries] = useState<PillarSummaries>({});
    const [systemPrompt, setSystemPrompt] = useState<string>('');
    
    // Chat State
    const [isProcessingChat, setIsProcessingChat] = useState(false);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

    // Firebase Functions
    const generateSoulPrint = functions.httpsCallable('generateSoulPrint');
    const continueChat = functions.httpsCallable('continueChat');

    // Authentication Effect
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const sessions = await getChatSessions(currentUser.uid);
                setChatSessions(sessions);
                if (sessions.length > 0) {
                    setActiveSessionId(sessions[0].id);
                    setAppState('chat');
                } else {
                    setAppState('welcome');
                }
            } else {
                // Reset all state on logout
                setAnswers({});
                setCurrentPillarIndex(0);
                setPillarSummaries({});
                setSystemPrompt('');
                setChatSessions([]);
                setActiveSessionId(null);
                setAppState('welcome');
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleAnswerChange = (questionIndex: number, value: string) => {
        const pillarTitle = PILLARS[currentPillarIndex].title;
        setAnswers(prev => {
            const newPillarAnswers = [...(prev[pillarTitle] || [])];
            newPillarAnswers[questionIndex] = value;
            return { ...prev, [pillarTitle]: newPillarAnswers };
        });
    };

    const handleFinishQuestionnaire = useCallback(async () => {
        setAppState('processing');
        try {
            const result: any = await generateSoulPrint({ answers });
            setPillarSummaries(result.data.pillarSummaries);
            setSystemPrompt(result.data.systemPrompt);
            setAppState('report');
        } catch (error) {
            console.error("Error generating SoulPrint:", error);
            setAppState('error');
        }
    }, [answers, generateSoulPrint]);

    const handleStartChat = async (promptOverride?: string) => {
        if (!user) return;
        const finalSystemPrompt = promptOverride || systemPrompt;
        if (!finalSystemPrompt) {
            console.error("Cannot start chat without a system prompt.");
            setAppState('error');
            return;
        }

        setIsLoading(true);
        try {
            // 1. Create the session object in Firestore (with empty messages)
            const newSession = await createChatSession(user.uid, "New SoulPrint Chat", finalSystemPrompt);
            
            // 2. Immediately get the AI's first message from the backend
            const result: any = await continueChat({
                messages: [], // Send empty history to get the initial greeting
                systemPrompt: newSession.systemPrompt
            });
            const initialAiMessage: Message = { sender: 'ai', text: result.data.text };
            
            // 3. Update the new session with the first message
            const sessionWithFirstMessage: ChatSession = { ...newSession, messages: [initialAiMessage] };
            
            // 4. Save the first message to Firestore
            await updateChatMessages(sessionWithFirstMessage.id, sessionWithFirstMessage.messages);

            // 5. Update local state to display the new chat
            setChatSessions(prev => [sessionWithFirstMessage, ...prev]);
            setActiveSessionId(sessionWithFirstMessage.id);
            setAppState('chat');

        } catch (error) {
            console.error("Error creating chat session:", error);
            setAppState('error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSkipToDemo = () => {
        const demoPrompt = `You are an AI assistant designed to showcase the capabilities of the ArcheForge SoulPrint system. Your persona is that of a generally helpful, insightful, and slightly curious guide. You are aware that the user has skipped the detailed questionnaire, so you should not assume any deep personal knowledge about them. Instead, your goal is to demonstrate what a personalized AI *could* be like.

        Your Core Directives:
        1.  **Be Welcoming and Informative:** Start by acknowledging they're in a demo mode. Explain that a full SoulPrint would tailor the conversation to their unique personality.
        2.  **Encourage Exploration:** Prompt them with questions that hint at the different "pillars" of the SoulPrint (e.g., "How do you usually approach difficult decisions?" or "What kind of communication style do you find most engaging?").
        3.  **Adapt Slightly:** Based on their answers, subtly shift your tone. If they give a very logical answer, become a bit more analytical. If they are expressive, use more evocative language. This demonstrates the core concept of resonance.
        4.  **Do Not Hallucinate a Persona:** Do not invent a personality for the user. Maintain a neutral but engaging guide persona.
        5.  **Start the first conversation:** Begin the first interaction by saying: "Welcome to the SoulPrint demo! I don't have your full psychological imprint, but I'm here to show you what a conversation with a truly personalized AI could feel like. What's on your mind?"`;
        
        // Set state for consistency, but pass the prompt directly to the handler
        setSystemPrompt(demoPrompt);
        setPillarSummaries({ "Demo Mode": "This is a demo session. A full SoulPrint would provide a detailed psychological analysis here." });
        
        // Call the chat handler with the prompt override to prevent a state race condition
        handleStartChat(demoPrompt);
    };

    const handleNewChat = () => {
        setAnswers({});
        setCurrentPillarIndex(0);
        setPillarSummaries({});
        setSystemPrompt('');
        setActiveSessionId(null);
        setAppState('welcome');
    };
    
    const handleSendMessage = async (messageText: string) => {
        if (!activeSessionId || !user) return;
        
        const activeSession = chatSessions.find(s => s.id === activeSessionId);
        if (!activeSession) return;

        const newMessage: Message = { sender: 'user', text: messageText };
        const updatedMessages = [...activeSession.messages, newMessage];
        
        // Optimistically update UI
        const updatedSessions = chatSessions.map(s => s.id === activeSessionId ? { ...s, messages: updatedMessages } : s);
        setChatSessions(updatedSessions);
        setIsProcessingChat(true);

        try {
            // Update DB with user message first
            await updateChatMessages(activeSessionId, updatedMessages);
            
            const result: any = await continueChat({
                messages: updatedMessages,
                systemPrompt: activeSession.systemPrompt
            });

            const aiMessage: Message = { sender: 'ai', text: result.data.text };
            const finalMessages = [...updatedMessages, aiMessage];

            const finalSessions = chatSessions.map(s => s.id === activeSessionId ? { ...s, messages: finalMessages } : s);
            setChatSessions(finalSessions);

            // Update DB with AI message
            await updateChatMessages(activeSessionId, finalMessages);

        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: Message = { sender: 'ai', text: "Sorry, I encountered an error. Please try again." };
            const finalMessages = [...updatedMessages, errorMessage];
            const finalSessions = chatSessions.map(s => s.id === activeSessionId ? { ...s, messages: finalMessages } : s);
            setChatSessions(finalSessions);
            await updateChatMessages(activeSessionId, finalMessages);
        } finally {
            setIsProcessingChat(false);
        }
    };

    const handleLogout = async () => {
        await auth.signOut();
    };

    const renderContent = () => {
        switch (appState) {
            case 'welcome':
                return <WelcomeScreen onStart={() => setAppState('questionnaire')} onSkip={handleSkipToDemo} />;
            case 'questionnaire':
                return <PillarQuestionnaire
                    pillar={PILLARS[currentPillarIndex]}
                    answers={answers[PILLARS[currentPillarIndex].title] || []}
                    onAnswerChange={handleAnswerChange}
                    onNext={() => setCurrentPillarIndex(i => i + 1)}
                    onBack={() => setCurrentPillarIndex(i => i - 1)}
                    onFinish={handleFinishQuestionnaire}
                    currentPillarIndex={currentPillarIndex}
                    totalPillars={PILLARS.length}
                />;
            case 'processing':
                return <ProcessingScreen />;
            case 'report':
                return <ReportScreen summaries={pillarSummaries} systemPrompt={systemPrompt} onStartChat={() => handleStartChat()} />;
            case 'chat':
                const activeSession = chatSessions.find(s => s.id === activeSessionId);
                return (
                    <div className="flex w-full h-screen bg-gray-900">
                        <Sidebar
                            sessions={chatSessions}
                            activeSessionId={activeSessionId}
                            onSessionSelect={setActiveSessionId}
                            onNewChat={handleNewChat}
                            onLogout={handleLogout}
                            userEmail={user?.email || null}
                        />
                        <ChatInterface 
                            session={activeSession || null}
                            onSendMessage={handleSendMessage}
                            isProcessing={isProcessingChat}
                            onNewChat={handleNewChat}
                        />
                    </div>
                );
            case 'error':
                 return (
                    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
                        <h1 className="text-3xl font-bold text-red-600 mb-4">An Error Occurred</h1>
                        <p className="text-gray-700 mb-6">We're sorry, but something went wrong. Please try again.</p>
                        <button onClick={handleNewChat} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg">
                            Start Over
                        </button>
                    </div>
                );
            default:
                return <WelcomeScreen onStart={() => setAppState('questionnaire')} onSkip={handleSkipToDemo}/>;
        }
    };
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
            </div>
        );
    }
    
    if (!user) {
        return <AuthScreen />;
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
            {renderContent()}
        </main>
    );
};

export default App;

import React, { useState, useRef, useEffect } from 'react';
import type { Message, ChatSession } from '../types';

interface ChatInterfaceProps {
  session: ChatSession | null;
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  onNewChat: () => void;
  onToggleSidebar?: () => void;
  showMobileSidebar?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  session,
  onSendMessage,
  isProcessing,
  onNewChat,
  onToggleSidebar,
  showMobileSidebar = false
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages, isProcessing]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !isProcessing) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  if (!session) {
      return (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4 bg-gray-100">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Welcome to ArcheForge</h2>
              <p className="text-gray-500 mb-4">Start a new SoulPrint to begin chatting with your AI.</p>
              <button
                onClick={onNewChat}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors"
              >
                Create New SoulPrint
              </button>
          </div>
      );
  }

  return (
    <div className="flex-grow flex flex-col bg-gray-100">
      <header className="p-4 border-b bg-white flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">{session.title}</h2>
          {/* Hamburger menu for mobile */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
      </header>
      <main className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {session.messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xl p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-800 border'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))}
          {isProcessing && (
             <div className="flex items-end gap-2 justify-start">
                <div className="max-w-xl p-3 rounded-lg bg-white text-gray-800 border">
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <footer className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="flex-grow p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isProcessing}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 disabled:bg-indigo-300 transition-colors"
            disabled={isProcessing || !newMessage.trim()}
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatInterface;

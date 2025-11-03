import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import Sidebar from './Sidebar';
import type { ChatSession } from '../types';

interface ChatLayoutProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSessionSelect: (id: string) => void;
  onNewChat: () => void;
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  onLogout?: () => void;
  userEmail: string | null;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
  sessions,
  activeSessionId,
  onSessionSelect,
  onNewChat,
  onSendMessage,
  isProcessing,
  onLogout,
  userEmail
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const activeSession = sessions.find(s => s.id === activeSessionId);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex w-full h-screen bg-gray-900 relative">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Mobile sidebar - slide out from left */}
      <div className={`fixed md:relative w-64 h-full z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSessionSelect={onSessionSelect}
          onNewChat={onNewChat}
          onLogout={onLogout}
          userEmail={userEmail}
          isMobile={true}
          onClose={closeSidebar}
        />
      </div>
      
      {/* Chat panel */}
      <div className="flex-1 flex flex-col md:ml-0">
        <ChatInterface
          session={activeSession || null}
          onSendMessage={onSendMessage}
          isProcessing={isProcessing}
          onNewChat={onNewChat}
          onToggleSidebar={toggleSidebar}
          showMobileSidebar={sidebarOpen}
        />
      </div>
    </div>
  );
};

export default ChatLayout;
import React, { useState } from 'react';
import type { ChatSession } from '../types';

interface SidebarProps {
    sessions: ChatSession[];
    activeSessionId: string | null;
    onSessionSelect: (id: string) => void;
    onNewChat: () => void;
    onLogout?: () => void;
    userEmail: string | null;
    isMobile?: boolean;
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    sessions,
    activeSessionId,
    onSessionSelect,
    onNewChat,
    onLogout,
    userEmail,
    isMobile = false,
    onClose
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSessions = sessions.filter(session =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSessionSelect = (id: string) => {
        onSessionSelect(id);
        if (isMobile && onClose) {
            onClose();
        }
    };

    return (
        <aside className={`w-64 bg-gray-800 text-white flex flex-col p-2 ${isMobile ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out' : ''}`}>
            <div className="p-2 mb-4 flex items-center justify-between">
                 <h1 className="text-lg font-bold">ArcheForge</h1>
                 {isMobile && onClose && (
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                 )}
            </div>
            <button
                onClick={() => {
                    onNewChat();
                    if (isMobile && onClose) {
                        onClose();
                    }
                }}
                className="w-full text-left px-3 py-2 mb-4 text-sm font-semibold bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
            >
                + New SoulPrint Chat
            </button>
            
            <div className="flex-grow overflow-y-auto flex flex-col">
                <h2 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">History</h2>
                <div className="px-1 mb-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-2 py-1 text-sm bg-gray-700 text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
                <nav className="flex flex-col space-y-1 flex-grow">
                    {filteredSessions.map(session => (
                        <a
                            key={session.id}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleSessionSelect(session.id);
                            }}
                            className={`px-3 py-2 text-sm rounded-md truncate transition-colors ${
                                activeSessionId === session.id
                                ? 'bg-gray-700'
                                : 'hover:bg-gray-700/50'
                            }`}
                        >
                            {session.title}
                        </a>
                    ))}
                </nav>
            </div>
            
            {onLogout && (
                <div className="border-t border-gray-700 mt-2 pt-2">
                    {userEmail && (
                        <div className="px-3 py-2">
                            <p className="text-sm font-medium truncate" title={userEmail}>{userEmail}</p>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            onLogout();
                            if (isMobile && onClose) {
                                onClose();
                            }
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-md transition-colors"
                    >
                        {userEmail ? 'Logout' : 'Reset App'}
                    </button>
                </div>
            )}
        </aside>
    );
}

export default Sidebar;
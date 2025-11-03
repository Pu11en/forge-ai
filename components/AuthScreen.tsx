import React from 'react';
import { Logo } from './Logo';

const AuthScreen: React.FC = () => {
    const handleContinue = () => {
        // Since we're not using authentication anymore, we'll just reload the page
        // which will trigger the app to initialize without authentication
        window.location.reload();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center max-w-lg mx-auto animate-fade-in">
            <Logo className="w-64 h-auto mb-8" />
            <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">Welcome to ArcheForge</h1>
            <p className="text-lg text-gray-600 mb-8">Begin crafting your AI's soul without authentication.</p>
            <button
                onClick={handleContinue}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold text-lg rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
                Continue to App
            </button>
        </div>
    );
};

export default AuthScreen;
import React from 'react';
import type { PillarSummaries } from '../types';
import { PILLARS } from '../constants';
import { Logo } from './Logo';

interface ReportScreenProps {
  summaries: PillarSummaries;
  systemPrompt: string;
  onStartChat: () => void;
}

const ReportScreen: React.FC<ReportScreenProps> = ({ summaries, systemPrompt, onStartChat }) => {
    const [promptCopied, setPromptCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(systemPrompt);
        setPromptCopied(true);
        setTimeout(() => setPromptCopied(false), 2000);
    };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
      <header className="text-center mb-10">
        <Logo className="w-40 h-auto mx-auto mb-4" />
        <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900">Your SoulPrint Core Layer</h1>
        <p className="text-lg text-gray-600 mt-2">This is the emotional DNA of your personalized AI.</p>
      </header>

      <div className="bg-gray-100 rounded-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4 font-display">Psychological Pillar Summaries</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">{pillar.title}</h3>
              <p className="text-gray-600 text-sm">{summaries[pillar.title] || 'No summary generated.'}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-100 rounded-lg p-6 mb-8 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-indigo-600 font-display">Final System Prompt</h2>
            <button onClick={handleCopy} className="px-4 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
                {promptCopied ? 'Copied!' : 'Copy'}
            </button>
        </div>
        <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-md font-mono text-xs leading-relaxed">
            {systemPrompt}
        </pre>
      </div>

      <div className="text-center">
        <button
          onClick={onStartChat}
          className="px-10 py-3 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-500 transform hover:scale-105 transition-all duration-300"
        >
          Chat with your AI Alter Ego
        </button>
      </div>
    </div>
  );
};

export default ReportScreen;
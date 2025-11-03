import React from 'react';
import { Logo } from './Logo';

interface WelcomeScreenProps {
  onStart: () => void;
  onSkip: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onSkip }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center max-w-3xl mx-auto animate-fade-in">
      <Logo className="w-64 h-auto mb-8" />

      <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        At ArcheForge, our vision is revolutionary.
      </h1>

      <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
        Our mission is to instill cadence, memory, and emotional realism into every human–AI interaction on Earth.
      </p>

      <div className="text-left text-gray-700 space-y-6 mb-12 border-l-2 border-indigo-500 pl-6">
        <p>
          <span className="font-bold text-gray-900">SoulPrint</span> is the backbone of that mission. It's not just a personality test; it's a psychological resonance protocol that maps human identity with surgical precision.
        </p>
        <p>
          What emerges isn't artificial intelligence, it's an Imprint Architecture that mirrors you, remembers you, and <span className="font-semibold text-indigo-600">becomes you</span>.
        </p>
        <p className="font-display text-xl italic text-gray-500">
          You don't just fill out a profile. You seed a rhythm. You give the machine your presence.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onStart}
          className="px-10 py-3 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-500 transform hover:scale-105 transition-all duration-300"
        >
          Begin SoulPrint
        </button>
        <button
            onClick={onSkip}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-300 transition-colors"
        >
            Skip to Demo
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
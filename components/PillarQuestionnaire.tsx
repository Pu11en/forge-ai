import React, { useState, useEffect } from 'react';
import type { Pillar } from '../types';
import { Logo } from './Logo';

interface PillarQuestionnaireProps {
  pillar: Pillar;
  answers: string[];
  onAnswerChange: (questionIndex: number, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  onFinish: () => void;
  currentPillarIndex: number;
  totalPillars: number;
}

const PillarQuestionnaire: React.FC<PillarQuestionnaireProps> = ({
  pillar,
  answers,
  onAnswerChange,
  onNext,
  onBack,
  onFinish,
  currentPillarIndex,
  totalPillars,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('animate-fade-in-right');

  // Reset question index and animation when the pillar changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setAnimationClass('animate-fade-in-right');
  }, [pillar]);

  const currentQuestion = pillar.questions[currentQuestionIndex];
  const isLastQuestionOfPillar = currentQuestionIndex === pillar.questions.length - 1;
  const isLastPillar = currentPillarIndex === totalPillars - 1;

  const handleNext = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setAnimationClass('animate-fade-out-left');
    setTimeout(() => {
      if (!isLastQuestionOfPillar) {
        setCurrentQuestionIndex(prev => prev + 1);
        setAnimationClass('animate-fade-in-right');
      } else if (!isLastPillar) {
        onNext(); // This triggers pillar change, and useEffect will handle the rest
      } else {
        onFinish();
      }
    }, 300); // Duration should match animation
  };

  const handleBack = () => {
    setAnimationClass('animate-fade-out-right');
    setTimeout(() => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
        setAnimationClass('animate-fade-in-left');
      } else {
        onBack();
      }
    }, 300);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleNext();
    }
  };

  const getNextButtonText = () => {
    if (isLastQuestionOfPillar) {
      return isLastPillar ? "Finish & Analyze SoulPrint" : "Next Pillar";
    }
    return "Next";
  };
  
  return (
    <div className="w-full max-w-4xl flex flex-col p-4 md:p-8" style={{minHeight: '80vh'}}>
      <header className="w-full text-center mb-8">
        <Logo className="w-40 h-auto mx-auto mb-4" />
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${((currentPillarIndex + 1) / totalPillars) * 100}%` }}></div>
        </div>
        <p className="text-sm text-gray-500">Pillar {currentPillarIndex + 1}: {pillar.title}</p>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center">
        <div key={currentQuestionIndex} className={`w-full text-center ${animationClass}`}>
          <p className="text-indigo-600 mb-4 font-semibold">{`Question ${currentQuestionIndex + 1} of ${pillar.questions.length}`}</p>
          <label htmlFor="current-question" className="font-display text-3xl md:text-4xl text-gray-900 mb-8 block min-h-[100px]">
            {currentQuestion}
          </label>
          <textarea
            id="current-question"
            rows={4}
            value={answers[currentQuestionIndex] || ''}
            onChange={(e) => onAnswerChange(currentQuestionIndex, e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Your thoughts... (press Enter to continue)"
            className="p-4 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-900 w-full max-w-2xl mx-auto text-lg placeholder-gray-500 shadow-lg"
            autoFocus
          />
        </div>
      </main>
      
      <footer className="mt-10 flex justify-between items-center w-full">
        <button
          onClick={handleBack}
          className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className={`px-8 py-3 font-semibold rounded-lg transition-colors text-white ${isLastQuestionOfPillar && isLastPillar ? 'bg-green-600 hover:bg-green-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}
        >
          {getNextButtonText()}
        </button>
      </footer>
    </div>
  );
};

export default PillarQuestionnaire;
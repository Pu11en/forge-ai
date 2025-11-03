import React from 'react';
import { Logo } from './Logo';

const ProcessingScreen: React.FC = () => {
    const messages = [
        "Analyzing psychological pillars...",
        "Mapping emotional DNA...",
        "Calibrating cadence and rhythm...",
        "Constructing Imprint Architecture...",
        "Fusing intent with memory...",
        "Becoming you..."
    ];

    const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex(prev => (prev + 1) % messages.length);
        }, 2500);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-6 animate-fade-in">
            <Logo className="w-48 h-auto mb-8 animate-pulse" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">Generating Your SoulPrint</h2>
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500 mx-auto my-6"></div>
            <div className="h-6">
                <p className="text-lg text-gray-600 transition-opacity duration-500">
                    {messages[currentMessageIndex]}
                </p>
            </div>
        </div>
    );
};

export default ProcessingScreen;
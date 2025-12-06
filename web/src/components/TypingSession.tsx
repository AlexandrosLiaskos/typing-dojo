import { useState, useEffect, useRef, useCallback } from 'react';
import type { TrainingContent } from '../types/content';
import { useStatsStore } from '../stores/statsStore';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';

interface TypingSessionProps {
  content: TrainingContent;
  onComplete: (wpm: number, accuracy: number, points: number) => void;
  onCancel: () => void;
}

export function TypingSession({ content, onComplete, onCancel }: TypingSessionProps) {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { updateStats } = useStatsStore();
  const { user } = useAuthStore();

  const targetText = content.text;

  // Calculate accuracy
  const calculateAccuracy = useCallback(() => {
    if (userInput.length === 0) return 100;
    let correct = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === targetText[i]) correct++;
    }
    return (correct / userInput.length) * 100;
  }, [userInput, targetText]);

  // Calculate WPM
  const calculateWPM = useCallback(() => {
    if (!startTime) return 0;
    const elapsedMinutes = (Date.now() - startTime) / 60000;
    if (elapsedMinutes < 0.01) return 0;
    const wordsTyped = userInput.length / 5;
    return Math.round(wordsTyped / elapsedMinutes);
  }, [startTime, userInput.length]);

  // Calculate points
  const calculatePoints = useCallback((wpm: number, accuracy: number) => {
    const speedScore = wpm * 4;
    const accuracyScore = accuracy * 10;
    return Math.round(speedScore + accuracyScore);
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (!startTime && value.length > 0) {
      setStartTime(Date.now());
    }

    setUserInput(value);

    // Check if complete
    if (value.length >= targetText.length) {
      finishSession();
    }
  };

  // Finish session
  const finishSession = async () => {
    if (isComplete) return;
    setIsComplete(true);

    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    const points = calculatePoints(wpm, accuracy);
    const durationSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

    // Save to database if logged in
    if (user) {
      await updateStats(wpm, accuracy);

      await supabase.from('sessions').insert({
        user_id: user.id,
        content_id: content.id,
        category: content.category,
        language: content.language,
        wpm,
        accuracy,
        points,
        duration_seconds: durationSeconds,
      } as never);
    }

    onComplete(wpm, accuracy, points);
  };

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Render character with color coding
  const renderText = () => {
    return targetText.split('').map((char, index) => {
      let className = 'text-gray-400';
      
      if (index < userInput.length) {
        className = userInput[index] === char 
          ? 'text-green-400' 
          : 'text-red-400 bg-red-900/30';
      } else if (index === userInput.length) {
        className = 'text-white bg-blue-500/50 animate-pulse';
      }

      return (
        <span key={index} className={className}>
          {char === '\n' ? '↵\n' : char}
        </span>
      );
    });
  };

  const wpm = calculateWPM();
  const accuracy = calculateAccuracy();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">{content.title}</h2>
          <p className="text-sm text-gray-400">
            {content.category} • {content.language} • {content.difficulty}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-400 hover:text-white transition"
        >
          Cancel
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex gap-6 mb-6 text-sm">
        <div className="bg-gray-800 px-4 py-2 rounded-lg">
          <span className="text-gray-400">WPM: </span>
          <span className="text-white font-mono text-lg">{wpm}</span>
        </div>
        <div className="bg-gray-800 px-4 py-2 rounded-lg">
          <span className="text-gray-400">Accuracy: </span>
          <span className="text-white font-mono text-lg">{accuracy.toFixed(1)}%</span>
        </div>
        <div className="bg-gray-800 px-4 py-2 rounded-lg">
          <span className="text-gray-400">Progress: </span>
          <span className="text-white font-mono text-lg">
            {Math.round((userInput.length / targetText.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Target text display */}
      <div className="bg-gray-800 rounded-lg p-6 mb-4 font-mono text-lg leading-relaxed whitespace-pre-wrap">
        {renderText()}
      </div>

      {/* Hidden input for typing */}
      <textarea
        ref={inputRef}
        value={userInput}
        onChange={handleInputChange}
        className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg p-4 text-white font-mono resize-none focus:outline-none focus:border-blue-500"
        placeholder="Start typing here..."
        disabled={isComplete}
        autoFocus
      />
    </div>
  );
}


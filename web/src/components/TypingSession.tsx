import { useState, useEffect, useRef, useCallback } from 'react';
import type { TrainingContent } from '@/types/content';
import { useStatsStore } from '@/stores/statsStore';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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

  const calculateAccuracy = useCallback(() => {
    if (userInput.length === 0) return 100;
    let correct = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === targetText[i]) correct++;
    }
    return (correct / userInput.length) * 100;
  }, [userInput, targetText]);

  const calculateWPM = useCallback(() => {
    if (!startTime) return 0;
    const elapsedMinutes = (Date.now() - startTime) / 60000;
    if (elapsedMinutes < 0.01) return 0;
    const wordsTyped = userInput.length / 5;
    return Math.round(wordsTyped / elapsedMinutes);
  }, [startTime, userInput.length]);

  const calculatePoints = useCallback((wpm: number, accuracy: number) => {
    const speedScore = wpm * 4;
    const accuracyScore = accuracy * 10;
    return Math.round(speedScore + accuracyScore);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (!startTime && value.length > 0) {
      setStartTime(Date.now());
    }

    setUserInput(value);

    if (value.length >= targetText.length) {
      finishSession();
    }
  };

  const finishSession = async () => {
    if (isComplete) return;
    setIsComplete(true);

    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    const points = calculatePoints(wpm, accuracy);
    const durationSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const renderText = () => {
    return targetText.split('').map((char, index) => {
      let className = 'text-muted-foreground';

      if (index < userInput.length) {
        className = userInput[index] === char
          ? 'text-green-500'
          : 'text-red-500 bg-red-500/10';
      } else if (index === userInput.length) {
        className = 'text-foreground bg-primary/20 animate-pulse';
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
  const progress = Math.round((userInput.length / targetText.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{content.title}</h2>
          <div className="flex gap-2 mt-1">
            <Badge variant="secondary">{content.category}</Badge>
            <Badge variant="outline">{content.language}</Badge>
          </div>
        </div>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      {/* Stats bar */}
      <div className="flex gap-4">
        <Card className="flex-1">
          <CardContent className="py-3 px-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">WPM</span>
            <span className="text-xl font-mono font-bold">{wpm}</span>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="py-3 px-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Accuracy</span>
            <span className="text-xl font-mono font-bold">{accuracy.toFixed(1)}%</span>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="py-3 px-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-xl font-mono font-bold">{progress}%</span>
          </CardContent>
        </Card>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Target text display */}
      <Card>
        <CardContent className="p-6 font-mono text-lg leading-relaxed whitespace-pre-wrap">
          {renderText()}
        </CardContent>
      </Card>

      {/* Hidden input for typing */}
      <textarea
        ref={inputRef}
        value={userInput}
        onChange={handleInputChange}
        className={cn(
          "w-full h-32 bg-muted border rounded-lg p-4 font-mono resize-none",
          "focus:outline-none focus:ring-2 focus:ring-ring"
        )}
        placeholder="Start typing here..."
        disabled={isComplete}
        autoFocus
      />
    </div>
  );
}


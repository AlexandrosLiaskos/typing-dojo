import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SessionResultProps {
  wpm: number;
  accuracy: number;
  points: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export function SessionResult({ wpm, accuracy, points, onPlayAgain, onGoHome }: SessionResultProps) {
  const getWpmRating = () => {
    if (wpm >= 80) return { label: 'Excellent!', color: 'text-green-500' };
    if (wpm >= 60) return { label: 'Great!', color: 'text-blue-500' };
    if (wpm >= 40) return { label: 'Good', color: 'text-yellow-500' };
    return { label: 'Keep practicing!', color: 'text-muted-foreground' };
  };

  const rating = getWpmRating();

  return (
    <div className="max-w-md mx-auto text-center space-y-8">
      <div>
        <h2 className={cn("text-3xl font-bold mb-1", rating.color)}>
          {rating.label}
        </h2>
        <p className="text-muted-foreground">Session Complete</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{wpm}</div>
            <p className="text-xs text-muted-foreground">WPM</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{accuracy.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary">+{points}</div>
            <p className="text-xs text-muted-foreground">Points</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 justify-center">
        <Button onClick={onPlayAgain}>
          Play Again
        </Button>
        <Button variant="outline" onClick={onGoHome}>
          Home
        </Button>
      </div>
    </div>
  );
}


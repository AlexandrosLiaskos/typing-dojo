interface SessionResultProps {
  wpm: number;
  accuracy: number;
  points: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export function SessionResult({ wpm, accuracy, points, onPlayAgain, onGoHome }: SessionResultProps) {
  const getWpmRating = () => {
    if (wpm >= 80) return { label: 'Excellent!', color: 'text-green-400' };
    if (wpm >= 60) return { label: 'Great!', color: 'text-blue-400' };
    if (wpm >= 40) return { label: 'Good', color: 'text-yellow-400' };
    return { label: 'Keep practicing!', color: 'text-gray-400' };
  };

  const rating = getWpmRating();

  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${rating.color}`}>
          {rating.label}
        </h2>
        <p className="text-gray-400">Session Complete</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-3xl font-bold text-white">{wpm}</div>
          <div className="text-sm text-gray-400">WPM</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-3xl font-bold text-white">{accuracy.toFixed(1)}%</div>
          <div className="text-sm text-gray-400">Accuracy</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-3xl font-bold text-yellow-400">+{points}</div>
          <div className="text-sm text-gray-400">Points</div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={onPlayAgain}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
        >
          Play Again
        </button>
        <button
          onClick={onGoHome}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
        >
          Home
        </button>
      </div>
    </div>
  );
}


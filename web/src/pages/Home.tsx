import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useStatsStore } from '../stores/statsStore';
import { getRandomContent } from '../data/content';
import { TypingSession } from '../components/TypingSession';
import { SessionResult } from '../components/SessionResult';
import type { TrainingContent, ContentCategory, ContentLanguage, ContentLength } from '../types/content';

type View = 'menu' | 'session' | 'result';

interface SessionResultData {
  wpm: number;
  accuracy: number;
  points: number;
}

export function Home() {
  const { user, signInWithGoogle, signOut } = useAuthStore();
  const { stats } = useStatsStore();
  const [view, setView] = useState<View>('menu');
  const [currentContent, setCurrentContent] = useState<TrainingContent | null>(null);
  const [result, setResult] = useState<SessionResultData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory>('general');

  const startSession = (category: ContentCategory, language?: ContentLanguage, length?: ContentLength) => {
    const content = getRandomContent({ category, language, length });
    setCurrentContent(content);
    setSelectedCategory(category);
    setView('session');
  };

  const handleComplete = (wpm: number, accuracy: number, points: number) => {
    setResult({ wpm, accuracy, points });
    setView('result');
  };

  const handlePlayAgain = () => {
    const content = getRandomContent({ category: selectedCategory });
    setCurrentContent(content);
    setResult(null);
    setView('session');
  };

  if (view === 'session' && currentContent) {
    return (
      <TypingSession
        content={currentContent}
        onComplete={handleComplete}
        onCancel={() => setView('menu')}
      />
    );
  }

  if (view === 'result' && result) {
    return (
      <SessionResult
        {...result}
        onPlayAgain={handlePlayAgain}
        onGoHome={() => setView('menu')}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">🥋 Typing Dojo</h1>
          <p className="text-gray-400">Master your typing skills</p>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-white font-medium">{user.user_metadata?.full_name || user.email}</div>
                <div className="text-sm text-gray-400">{stats.totalPoints} points</div>
              </div>
              {user.user_metadata?.avatar_url && (
                <img src={user.user_metadata.avatar_url} alt="" className="w-10 h-10 rounded-full" />
              )}
              <button onClick={signOut} className="text-gray-400 hover:text-white">
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {user && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{stats.sessionsCompleted}</div>
            <div className="text-sm text-gray-400">Sessions</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{stats.averageWpm.toFixed(0)}</div>
            <div className="text-sm text-gray-400">Avg WPM</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{stats.bestWpm.toFixed(0)}</div>
            <div className="text-sm text-gray-400">Best WPM</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">{stats.totalPoints}</div>
            <div className="text-sm text-gray-400">Total Points</div>
          </div>
        </div>
      )}

      {/* Training Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* General Text */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-2">📝 General Text</h3>
          <p className="text-gray-400 mb-4">Practice with prose and productivity tips</p>
          <div className="space-y-2">
            <button onClick={() => startSession('general', 'en', 'short')} 
              className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition">
              Short
            </button>
            <button onClick={() => startSession('general', 'en', 'medium')}
              className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition">
              Medium
            </button>
          </div>
        </div>

        {/* Code */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-2">💻 Code</h3>
          <p className="text-gray-400 mb-4">Type real programming snippets</p>
          <div className="space-y-2">
            <button onClick={() => startSession('code', 'js')}
              className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition">
              JavaScript
            </button>
            <button onClick={() => startSession('code', 'ts')}
              className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition">
              TypeScript
            </button>
            <button onClick={() => startSession('code', 'py')}
              className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition">
              Python
            </button>
            <button onClick={() => startSession('code', 'rs')}
              className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition">
              Rust
            </button>
          </div>
        </div>

        {/* Numbers */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-2">🔢 Numbers</h3>
          <p className="text-gray-400 mb-4">Master the number row</p>
          <div className="space-y-2">
            <button onClick={() => startSession('numbers', 'en', 'short')}
              className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition">
              Short
            </button>
            <button onClick={() => startSession('numbers', 'en', 'medium')}
              className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition">
              Medium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


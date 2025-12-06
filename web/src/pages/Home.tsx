import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useStatsStore } from '@/stores/statsStore';
import { getRandomContent } from '@/data/content';
import { TypingSession } from '@/components/TypingSession';
import { SessionResult } from '@/components/SessionResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { TrainingContent, ContentCategory, ContentLanguage, ContentLength } from '@/types/content';

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to the Dojo</h1>
          <p className="text-muted-foreground mt-1">Choose your training and master the keyboard</p>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              {user.user_metadata?.avatar_url && (
                <img src={user.user_metadata.avatar_url} alt="" className="w-9 h-9 rounded-full" />
              )}
              <div className="text-right">
                <div className="text-sm font-medium">{user.user_metadata?.full_name || user.email}</div>
                <div className="text-xs text-muted-foreground">{stats.totalPoints} pts</div>
              </div>
              <Button variant="ghost" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button onClick={signInWithGoogle} variant="outline">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {user && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.sessionsCompleted}</div>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.averageWpm.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">Avg WPM</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.bestWpm.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">Best WPM</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{stats.totalPoints}</div>
              <p className="text-xs text-muted-foreground">Total Points</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Training Options */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Start Training</h2>

        <div className="grid gap-4 md:grid-cols-3">
          {/* General Text */}
          <Card className="group hover:border-foreground/20 transition-colors cursor-pointer" onClick={() => startSession('general', 'en', 'medium')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">General Text</CardTitle>
                <span className="text-2xl">📝</span>
              </div>
              <CardDescription>Practice with prose and quotes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full group-hover:bg-primary/90">
                Start Typing →
              </Button>
            </CardContent>
          </Card>

          {/* Code */}
          <Card className="group hover:border-foreground/20 transition-colors cursor-pointer" onClick={() => startSession('code', 'js')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Code</CardTitle>
                <span className="text-2xl">💻</span>
              </div>
              <CardDescription>Type real programming snippets</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full group-hover:bg-primary/90">
                Start Typing →
              </Button>
            </CardContent>
          </Card>

          {/* Numbers */}
          <Card className="group hover:border-foreground/20 transition-colors cursor-pointer" onClick={() => startSession('numbers', 'en', 'medium')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Numbers</CardTitle>
                <span className="text-2xl">🔢</span>
              </div>
              <CardDescription>Master the number row</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full group-hover:bg-primary/90">
                Start Typing →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* More Options */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">More Options</CardTitle>
            <CardDescription>Choose a specific language or difficulty</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="code" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="code">Languages</TabsTrigger>
                <TabsTrigger value="length">Difficulty</TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="flex flex-wrap gap-2 mt-0">
                <Button onClick={() => startSession('code', 'js')} variant="outline" size="sm">
                  JavaScript
                </Button>
                <Button onClick={() => startSession('code', 'ts')} variant="outline" size="sm">
                  TypeScript
                </Button>
                <Button onClick={() => startSession('code', 'py')} variant="outline" size="sm">
                  Python
                </Button>
                <Button onClick={() => startSession('code', 'rs')} variant="outline" size="sm">
                  Rust
                </Button>
              </TabsContent>

              <TabsContent value="length" className="flex flex-wrap gap-2 mt-0">
                <Button onClick={() => startSession('general', 'en', 'short')} variant="outline" size="sm">
                  Short (~30s)
                </Button>
                <Button onClick={() => startSession('general', 'en', 'medium')} variant="outline" size="sm">
                  Medium (~1min)
                </Button>
                <Button onClick={() => startSession('general', 'en', 'long')} variant="outline" size="sm">
                  Long (~2min)
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


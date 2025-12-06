import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStatsStore } from '@/stores/statsStore';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Dashboard() {
  const { stats, fetchStats } = useStatsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user, fetchStats]);

  if (!user) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-2">Statistics</h1>
        <p className="text-muted-foreground mb-6">Sign in to view your progress</p>
        <Button asChild variant="outline">
          <Link to="/">Go to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
        <p className="text-muted-foreground">Track your typing journey</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.sessionsCompleted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average WPM</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.averageWpm.toFixed(0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Best WPM</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{stats.bestWpm.toFixed(0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.totalPoints}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Last Session</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.lastWpm.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">WPM</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{stats.lastAccuracy.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Best Performance</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <div>
              <div className="text-2xl font-bold text-green-500">{stats.bestWpm.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">Best WPM</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-500">{stats.bestAccuracy.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Best Accuracy</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button asChild className="flex-1">
          <Link to="/">Start Training</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link to="/leaderboard">View Leaderboard</Link>
        </Button>
      </div>
    </div>
  );
}


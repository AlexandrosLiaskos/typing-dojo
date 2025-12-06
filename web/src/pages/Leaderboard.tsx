import { useEffect } from 'react';
import { useStatsStore } from '@/stores/statsStore';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function Leaderboard() {
  const { leaderboard, fetchLeaderboard } = useStatsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const getRankDisplay = (index: number) => {
    if (index === 0) return <span className="text-lg">🥇</span>;
    if (index === 1) return <span className="text-lg">🥈</span>;
    if (index === 2) return <span className="text-lg">🥉</span>;
    return <span className="text-muted-foreground">{index + 1}</span>;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">Top typists ranked by points</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Rankings</CardTitle>
          <CardDescription>Compete with typists worldwide</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="text-right">Best WPM</TableHead>
                <TableHead className="text-right">Accuracy</TableHead>
                <TableHead className="text-right">Sessions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No entries yet. Complete a session to appear on the leaderboard!
                  </TableCell>
                </TableRow>
              ) : (
                leaderboard.map((entry, index) => {
                  const isCurrentUser = user?.id === entry.userId;

                  return (
                    <TableRow
                      key={entry.userId}
                      className={cn(isCurrentUser && "bg-muted/50")}
                    >
                      <TableCell className="font-medium">{getRankDisplay(index)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {entry.avatarUrl ? (
                            <img src={entry.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                              {entry.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className={cn(isCurrentUser && "font-medium")}>
                            {entry.name}
                            {isCurrentUser && <Badge variant="secondary" className="ml-2">You</Badge>}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-primary">
                        {entry.points.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {entry.wpm.toFixed(0)}
                      </TableCell>
                      <TableCell className="text-right">
                        {entry.accuracy.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {entry.sessions}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


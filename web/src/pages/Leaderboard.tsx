import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStatsStore } from '../stores/statsStore';
import { useAuthStore } from '../stores/authStore';

export function Leaderboard() {
  const { leaderboard, fetchLeaderboard } = useStatsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">🏆 Leaderboard</h1>
          <p className="text-gray-400">Top typists ranked by points</p>
        </div>
        <Link to="/" className="text-gray-400 hover:text-white transition">
          ← Back
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Rank</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">User</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-300">Points</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-300">Best WPM</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-300">Accuracy</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-300">Sessions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {leaderboard.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  No entries yet. Complete a session to appear on the leaderboard!
                </td>
              </tr>
            ) : (
              leaderboard.map((entry, index) => {
                const isCurrentUser = user?.id === entry.userId;
                const rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
                
                return (
                  <tr 
                    key={entry.userId} 
                    className={isCurrentUser ? 'bg-blue-900/30' : 'hover:bg-gray-700/50'}
                  >
                    <td className="px-6 py-4 text-white font-medium">{rankIcon}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {entry.avatarUrl ? (
                          <img src={entry.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                            {entry.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className={isCurrentUser ? 'text-blue-400 font-medium' : 'text-white'}>
                          {entry.name}
                          {isCurrentUser && <span className="text-gray-400 ml-2">(you)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-yellow-400 font-medium">
                      {entry.points.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-white">
                      {entry.wpm.toFixed(0)}
                    </td>
                    <td className="px-6 py-4 text-right text-white">
                      {entry.accuracy.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-right text-gray-400">
                      {entry.sessions}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


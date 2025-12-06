import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStatsStore } from '../stores/statsStore';
import { useAuthStore } from '../stores/authStore';

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
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">📊 Dashboard</h1>
        <p className="text-gray-400 mb-8">Sign in to view your statistics</p>
        <Link to="/" className="text-blue-400 hover:text-blue-300">
          ← Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">📊 Dashboard</h1>
          <p className="text-gray-400">Your typing progress</p>
        </div>
        <Link to="/" className="text-gray-400 hover:text-white transition">
          ← Back
        </Link>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-4xl font-bold text-white">{stats.sessionsCompleted}</div>
          <div className="text-gray-400">Sessions Completed</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-4xl font-bold text-white">{stats.averageWpm.toFixed(0)}</div>
          <div className="text-gray-400">Average WPM</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-4xl font-bold text-green-400">{stats.bestWpm.toFixed(0)}</div>
          <div className="text-gray-400">Best WPM</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-4xl font-bold text-yellow-400">{stats.totalPoints}</div>
          <div className="text-gray-400">Total Points</div>
        </div>
      </div>

      {/* Accuracy Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Last Session</h3>
          <div className="flex justify-between">
            <div>
              <div className="text-2xl font-bold text-white">{stats.lastWpm.toFixed(0)}</div>
              <div className="text-sm text-gray-400">WPM</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.lastAccuracy.toFixed(1)}%</div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Best Performance</h3>
          <div className="flex justify-between">
            <div>
              <div className="text-2xl font-bold text-green-400">{stats.bestWpm.toFixed(0)}</div>
              <div className="text-sm text-gray-400">Best WPM</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{stats.bestAccuracy.toFixed(1)}%</div>
              <div className="text-sm text-gray-400">Best Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link 
          to="/"
          className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-center transition"
        >
          Start Training
        </Link>
        <Link 
          to="/leaderboard"
          className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium text-center transition"
        >
          View Leaderboard
        </Link>
      </div>
    </div>
  );
}


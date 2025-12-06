import { useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useStatsStore } from './stores/statsStore';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Leaderboard } from './pages/Leaderboard';

function Navigation() {
  const { user } = useAuthStore();

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-4xl mx-auto px-6 py-3 flex gap-6">
        <Link to="/" className="text-gray-400 hover:text-white transition">Home</Link>
        {user && (
          <Link to="/dashboard" className="text-gray-400 hover:text-white transition">Dashboard</Link>
        )}
        <Link to="/leaderboard" className="text-gray-400 hover:text-white transition">Leaderboard</Link>
      </div>
    </nav>
  );
}

function App() {
  const { initialize, user } = useAuthStore();
  const { fetchStats } = useStatsStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user, fetchStats]);

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;

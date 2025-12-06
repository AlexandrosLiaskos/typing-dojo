import { useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useStatsStore } from './stores/statsStore';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Leaderboard } from './pages/Leaderboard';
import { cn } from './lib/utils';

function Navigation() {
  const { user } = useAuthStore();
  const location = useLocation();

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={cn(
          "text-sm font-medium transition-colors hover:text-foreground/80",
          isActive ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {children}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-4xl items-center mx-auto px-6">
        <div className="mr-8 flex items-center space-x-2">
          <span className="text-lg">🥋</span>
          <span className="font-semibold">Typing Dojo</span>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/">Train</NavLink>
          {user && <NavLink to="/dashboard">Stats</NavLink>}
          <NavLink to="/leaderboard">Leaderboard</NavLink>
        </nav>
      </div>
    </header>
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
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main className="container max-w-4xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;

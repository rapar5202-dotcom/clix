
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { User, ThemeMode } from './types';
import { db } from './services/db';

// Screens
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
import ThemeSelectionScreen from './screens/ThemeSelectionScreen';
import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

// Layout
import MainLayout from './components/MainLayout';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = db.getUser();
    if (savedUser) {
      setUser(savedUser);
      applyTheme(savedUser.theme);
    }
    // Artificial delay for splash screen branding
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    const root = window.document.documentElement;
    if (mode === ThemeMode.DARK) {
      root.classList.add('dark');
    } else if (mode === ThemeMode.LIGHT) {
      root.classList.remove('dark');
    } else {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      if (systemTheme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    db.saveUser(userData);
    applyTheme(userData.theme);
  };

  const handleLogout = () => {
    setUser(null);
    db.clearAll();
    navigate('/login');
  };

  if (loading) return <SplashScreen />;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginScreen onLogin={handleLogin} />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute user={user}><MainLayout user={user!}><HomeScreen user={user!} /></MainLayout></ProtectedRoute>} />
      <Route path="/explore" element={<ProtectedRoute user={user}><MainLayout user={user!}><ExploreScreen /></MainLayout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute user={user}><MainLayout user={user!}><NotificationsScreen /></MainLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute user={user}><MainLayout user={user!}><ProfileScreen user={user!} /></MainLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute user={user}><MainLayout user={user!}><SettingsScreen user={user!} onUpdateUser={handleLogin} onLogout={handleLogout} /></MainLayout></ProtectedRoute>} />
      
      {/* Onboarding */}
      <Route path="/onboarding/profile" element={<ProtectedRoute user={user} bypassOnboardingCheck><ProfileSetupScreen user={user!} onUpdate={handleLogin} /></ProtectedRoute>} />
      <Route path="/onboarding/theme" element={<ProtectedRoute user={user} bypassOnboardingCheck><ThemeSelectionScreen user={user!} onUpdate={(u) => { handleLogin(u); applyTheme(u.theme); }} /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

interface ProtectedRouteProps {
  user: User | null;
  children: React.ReactNode;
  bypassOnboardingCheck?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, children, bypassOnboardingCheck = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!user.onboardingCompleted && !bypassOnboardingCheck) {
      if (!user.username || !user.dob) {
        if (location.pathname !== '/onboarding/profile') {
          navigate('/onboarding/profile');
        }
      } else if (location.pathname !== '/onboarding/theme') {
        navigate('/onboarding/theme');
      }
    }
  }, [user, navigate, location.pathname, bypassOnboardingCheck]);

  // If there's no user, don't render children to prevent null pointer errors in layout components
  if (!user) return null;

  // If onboarding is required but we're not on an onboarding page, don't render the target page
  if (!user.onboardingCompleted && !bypassOnboardingCheck) {
    return null;
  }

  return <>{children}</>;
};

export default App;

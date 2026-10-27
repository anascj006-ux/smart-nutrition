import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { NutritionProvider } from './context/NutritionContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyzerPage } from './pages/AnalyzerPage';
import { ResultPage } from './pages/ResultPage';
import { MealsPage } from './pages/MealsPage';
import { HistoryPage } from './pages/HistoryPage';
import { FoodsPage } from './pages/FoodsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutProjectPage } from './pages/AboutProjectPage';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    // If route contains anchor hash e.g. /dashboard#insights
    const path = route.split('#')[0] || '/';
    window.history.pushState(null, '', route);
    setCurrentRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case '/':
        return <LandingPage onNavigate={navigate} />;
      case '/login':
        return <LoginPage onNavigate={navigate} />;
      case '/register':
        return <RegisterPage onNavigate={navigate} />;
      case '/dashboard':
        return <DashboardPage onNavigate={navigate} />;
      case '/analyze':
        return <AnalyzerPage onNavigate={navigate} />;
      case '/result':
        return <ResultPage onNavigate={navigate} />;
      case '/meals':
        return <MealsPage onNavigate={navigate} />;
      case '/history':
        return <HistoryPage onNavigate={navigate} />;
      case '/foods':
        return <FoodsPage onNavigate={navigate} />;
      case '/profile':
        return <ProfilePage onNavigate={navigate} />;
      case '/settings':
        return <SettingsPage onNavigate={navigate} />;
      case '/about-project':
        return <AboutProjectPage onNavigate={navigate} />;
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <AuthProvider>
      <NutritionProvider>
        {renderCurrentPage()}
      </NutritionProvider>
    </AuthProvider>
  );
}

export default App;

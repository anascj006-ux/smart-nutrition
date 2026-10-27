import React from 'react';
import { Sparkles, Utensils, Shield, ArrowRight, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentRoute }) => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 font-heading">
                SMART<span className="text-emerald-600">NUTRITION</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md">
                AI
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-500 -mt-1 hidden sm:block">
              Calorie & Macronutrient Estimator
            </p>
          </div>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <button
            onClick={() => onNavigate('/')}
            className={`hover:text-emerald-600 transition-colors ${currentRoute === '/' ? 'text-emerald-600 font-bold' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('/analyze')}
            className={`hover:text-emerald-600 transition-colors ${currentRoute === '/analyze' ? 'text-emerald-600 font-bold' : ''}`}
          >
            AI Scanner
          </button>
          <button
            onClick={() => onNavigate('/dashboard')}
            className={`hover:text-emerald-600 transition-colors ${currentRoute === '/dashboard' ? 'text-emerald-600 font-bold' : ''}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('/foods')}
            className={`hover:text-emerald-600 transition-colors ${currentRoute === '/foods' ? 'text-emerald-600 font-bold' : ''}`}
          >
            Food Database
          </button>
          <button
            onClick={() => onNavigate('/about-project')}
            className={`flex items-center gap-1 text-slate-500 hover:text-emerald-600 transition-colors ${currentRoute === '/about-project' ? 'text-emerald-600 font-bold' : ''}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Project / Viva</span>
          </button>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('/dashboard')}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                <span>Hi, {user?.name.split(' ')[0]}</span>
              </button>
              <button
                onClick={() => onNavigate('/analyze')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Scan Food</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('/login')}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-emerald-600 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('/analyze')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <span>Try Demo Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

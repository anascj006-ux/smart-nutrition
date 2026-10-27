import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Toast } from '../common/Toast';
import { AlertCircle, Sparkles, Plus, BookOpen } from 'lucide-react';
import { useNutrition } from '../../context/NutritionContext';

interface AppLayoutProps {
  children: React.ReactNode;
  currentRoute: string;
  onNavigate: (route: string) => void;
  title?: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentRoute,
  onNavigate,
  title,
  subtitle,
  actionButton,
}) => {
  const { forceDemoMode, setForceDemoMode } = useNutrition();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased">
      {/* Desktop & Tablet Sidebar */}
      <Sidebar currentRoute={currentRoute} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div>
            {title && (
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            {/* Demo AI Mode Pill Toggle */}
            <button
              onClick={() => setForceDemoMode(!forceDemoMode)}
              title="Click to toggle Demo AI mode or Gemini Vision AI"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                forceDemoMode
                  ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{forceDemoMode ? 'Demo AI Mode' : 'Gemini AI Active'}</span>
            </button>

            {/* Quick Action Button */}
            {actionButton ? (
              actionButton
            ) : (
              <button
                onClick={() => onNavigate('/analyze')}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Scan Food</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('/about-project')}
              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Academic Project Architecture & Viva Q&A"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Inner Container */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Global Medical Disclaimer Banner */}
        <footer className="px-4 sm:px-8 py-4 border-t border-slate-200/80 bg-white/50 text-center">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-[11px] text-slate-400 leading-normal">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span>
              <strong>Medical Disclaimer:</strong> Nutritional values, calorie estimates, and macronutrient targets are algorithmic approximations for educational and lifestyle guidance only. They do not constitute certified clinical or medical diagnosis.
            </span>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav currentRoute={currentRoute} onNavigate={onNavigate} />

      {/* Global Toast */}
      <Toast />
    </div>
  );
};

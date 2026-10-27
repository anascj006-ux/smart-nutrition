import React from 'react';
import {
  LayoutDashboard,
  Scan,
  UtensilsCrossed,
  Database,
  History,
  Lightbulb,
  UserCheck,
  Settings,
  LogOut,
  Utensils,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNutrition } from '../../context/NutritionContext';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onNavigate }) => {
  const { user, logout } = useAuth();
  const { forceDemoMode } = useNutrition();

  const menuItems = [
    { id: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: '/analyze', label: 'Analyze Food', icon: Scan, badge: 'AI' },
    { id: '/meals', label: 'Meal Tracker', icon: UtensilsCrossed },
    { id: '/foods', label: 'Food Database', icon: Database },
    { id: '/history', label: 'History', icon: History },
    { id: '/dashboard#insights', label: 'Insights', icon: Lightbulb },
    { id: '/profile', label: 'Profile & BMR', icon: UserCheck },
    { id: '/settings', label: 'Settings', icon: Settings },
    { id: '/about-project', label: 'Project / Viva Guide', icon: BookOpen, badge: 'Academic' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 shrink-0 h-screen sticky top-0">
      {/* Brand */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-base tracking-tight text-slate-900 font-heading">
                SMART<span className="text-emerald-600">NUTRITION</span>
              </span>
            </div>
            <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
              HealthTech Platform
            </p>
          </div>
        </div>
      </div>

      {/* AI Mode Banner Indicator */}
      <div className="px-5 pt-4 pb-2">
        <div className="bg-emerald-50/80 border border-emerald-100/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Recognition</span>
          </div>
          <span className="text-[10px] font-bold bg-white text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
            {forceDemoMode ? 'Demo AI' : 'Active'}
          </span>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.id || (item.id === '/dashboard#insights' && currentRoute === '/dashboard');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    item.badge === 'AI'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User profile card & Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/60">
        <div className="flex items-center justify-between mb-3">
          <div
            onClick={() => onNavigate('/profile')}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'DEMO'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-800 truncate">{user?.name || 'Demo User'}</div>
              <div className="text-[10px] text-slate-400 truncate">{user?.email || 'demo@smartnutrition.ai'}</div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

import React from 'react';
import { Home, Scan, UtensilsCrossed, History, User } from 'lucide-react';

interface MobileNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentRoute, onNavigate }) => {
  const items = [
    { id: '/dashboard', label: 'Home', icon: Home },
    { id: '/meals', label: 'Meals', icon: UtensilsCrossed },
    { id: '/analyze', label: 'Scan', icon: Scan, isSpecial: true },
    { id: '/history', label: 'History', icon: History },
    { id: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentRoute === item.id;

        if (item.isSpecial) {
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center -mt-5 group"
            >
              <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-active:scale-95 transition-transform border-4 border-white">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-emerald-700 mt-0.5">Scan</span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              isActive ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

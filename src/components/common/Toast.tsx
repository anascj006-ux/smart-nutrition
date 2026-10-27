import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useNutrition } from '../../context/NutritionContext';

export const Toast: React.FC = () => {
  const { toast, clearToast } = useNutrition();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl ${bgStyles[toast.type]} max-w-sm`}
      >
        {icons[toast.type]}
        <p className="text-xs font-semibold leading-relaxed">{toast.message}</p>
        <button
          onClick={clearToast}
          className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition-colors ml-auto"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

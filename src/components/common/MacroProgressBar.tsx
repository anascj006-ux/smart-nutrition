import React from 'react';

interface MacroProgressBarProps {
  label: string;
  consumed: number;
  goal: number;
  unit?: string;
  type: 'calories' | 'protein' | 'carbs' | 'fat' | 'fiber';
  icon?: React.ReactNode;
}

const COLOR_MAP = {
  calories: {
    bar: 'bg-gradient-to-r from-orange-500 to-red-500',
    text: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  protein: {
    bar: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    text: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  carbs: {
    bar: 'bg-gradient-to-r from-purple-500 to-fuchsia-600',
    text: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  fat: {
    bar: 'bg-gradient-to-r from-amber-400 to-yellow-500',
    text: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  fiber: {
    bar: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    text: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
};

export const MacroProgressBar: React.FC<MacroProgressBarProps> = ({
  label,
  consumed,
  goal,
  unit = 'g',
  type,
  icon,
}) => {
  const percent = Math.min(100, Math.round((consumed / (goal || 1)) * 100));
  const colors = COLOR_MAP[type];

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && (
            <div className={`p-1.5 rounded-lg ${colors.bg} ${colors.text}`}>
              {icon}
            </div>
          )}
          <span className="text-sm font-semibold text-slate-700">{label}</span>
        </div>
        <div className="text-xs font-semibold text-slate-500">
          <span className={`text-sm font-bold ${colors.text}`}>{consumed}</span>
          <span className="text-slate-400"> / {goal} {unit}</span>
        </div>
      </div>

      <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colors.bar}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-400">
        <span>{percent}% of goal</span>
        <span>{Math.max(0, Math.round((goal - consumed) * 10) / 10)} {unit} left</span>
      </div>
    </div>
  );
};

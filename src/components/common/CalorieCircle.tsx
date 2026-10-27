import React from 'react';
import { Flame } from 'lucide-react';

interface CalorieCircleProps {
  consumed: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
}

export const CalorieCircle: React.FC<CalorieCircleProps> = ({
  consumed,
  goal,
  size = 240,
  strokeWidth = 18,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.round((consumed / (goal || 2000)) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const remaining = Math.max(0, goal - consumed);

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="calorieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
        />
        {/* Animated Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#calorieGrad)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full mb-1">
          <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
          <span>Consumed</span>
        </div>
        <div className="text-4xl font-extrabold tracking-tight text-slate-900">
          {consumed.toLocaleString()}
        </div>
        <div className="text-xs font-medium text-slate-500">kcal</div>
        <div className="mt-2 text-xs font-semibold text-slate-400">
          Goal: <span className="text-slate-700">{goal.toLocaleString()} kcal</span>
        </div>
        <div className="text-xs font-medium text-emerald-600">
          {remaining > 0 ? `${remaining.toLocaleString()} kcal remaining` : 'Goal achieved!'}
        </div>
      </div>
    </div>
  );
};

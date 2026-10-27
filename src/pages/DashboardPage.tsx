import React, { useState, useEffect } from 'react';
import {
  Flame,
  Activity,
  Zap,
  TrendingUp,
  Sparkles,
  Calendar,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  PieChart as PieChartIcon,
  Plus,
  Utensils,
  Sun,
  Coffee,
  Moon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from 'recharts';
import { AppLayout } from '../components/layout/AppLayout';
import { CalorieCircle } from '../components/common/CalorieCircle';
import { MacroProgressBar } from '../components/common/MacroProgressBar';
import { DashboardData } from '../types';

interface DashboardPageProps {
  onNavigate: (route: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [timeframe, setTimeframe] = useState<'today' | '7days' | '30days'>('7days');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading || !data) {
    return (
      <AppLayout currentRoute="/dashboard" onNavigate={onNavigate} title="Daily Dashboard">
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Compiling daily nutrition metrics...</p>
        </div>
      </AppLayout>
    );
  }

  const { today, user, last7Days, last30Days, mealBreakdown, insights } = data;

  return (
    <AppLayout
      currentRoute="/dashboard"
      onNavigate={onNavigate}
      title="Daily Nutrition Dashboard"
      subtitle="Real-time caloric balance, macronutrient targets, and AI dietary recommendations"
    >
      <div className="space-y-8">
        {/* Top "Today's Nutrition" Hero Card with Calorie Circle & Macro Bars */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Today's Intake
                </span>
                <span className="text-xs text-slate-400 font-medium">{today.date}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1 font-heading">
                Welcome back, {user.name.split(' ')[0]}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('/analyze')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Log New Food</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Section 12: Calorie Circle */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 border-b lg:border-b-0 lg:border-r border-slate-100">
              <CalorieCircle
                consumed={today.consumed.calories}
                goal={user.calorieGoal}
                size={230}
              />
            </div>

            {/* Section 11: Today's 4 Macro Progress Bars */}
            <div className="lg:col-span-7 space-y-3.5">
              <MacroProgressBar
                label="Protein Target"
                consumed={today.consumed.protein}
                goal={user.proteinGoal}
                type="protein"
                icon={<Activity className="w-4 h-4" />}
              />
              <MacroProgressBar
                label="Carbohydrates Target"
                consumed={today.consumed.carbs}
                goal={user.carbsGoal}
                type="carbs"
                icon={<Zap className="w-4 h-4" />}
              />
              <MacroProgressBar
                label="Dietary Fats Target"
                consumed={today.consumed.fat}
                goal={user.fatGoal}
                type="fat"
                icon={<Flame className="w-4 h-4" />}
              />
              <MacroProgressBar
                label="Digestive Fiber Target"
                consumed={today.consumed.fiber}
                goal={user.fiberGoal}
                type="fiber"
                icon={<Sparkles className="w-4 h-4" />}
              />
            </div>
          </div>
        </div>

        {/* Section 13: DAILY NUTRITION CHARTS (Today, 7 Days, 30 Days) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Nutrition Trends & Analysis
              </h3>
              <p className="text-xs text-slate-500">Track calorie compliance and macronutrient distributions over time</p>
            </div>

            {/* Switch buttons: Today / 7 Days / 30 Days */}
            <div className="inline-flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setTimeframe('today')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeframe === 'today'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('7days')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeframe === '7days'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('30days')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeframe === '30days'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          {/* Render corresponding chart */}
          <div className="h-72 w-full pt-4">
            {timeframe === '7days' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Bar dataKey="calories" name="Calories (kcal)" fill="#F97316" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="protein" name="Protein (g)" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="carbs" name="Carbs (g)" fill="#A855F7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : timeframe === '30days' ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last30Days}>
                  <defs>
                    <linearGradient id="colorCal" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="label" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="calories"
                    name="Daily Intake"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              /* Today's meal slot distribution bar */
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 h-full items-center">
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 text-center">
                  <Sun className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-500">Breakfast</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">{mealBreakdown.breakfast} kcal</div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
                  <Utensils className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-500">Lunch</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">{mealBreakdown.lunch} kcal</div>
                </div>
                <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 text-center">
                  <Coffee className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-500">Snacks</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">{mealBreakdown.snacks} kcal</div>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center">
                  <Moon className="w-5 h-5 text-indigo-500 mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-500">Dinner</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">{mealBreakdown.dinner} kcal</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 17: PERSONALIZED NUTRITION INSIGHTS */}
        <div id="insights" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Personalized Dietary Insights
              </h3>
              <p className="text-xs text-slate-500">
                Rule-based algorithmic feedback customized to your active logged meals and daily targets
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((ins) => (
              <div
                key={ins.id}
                className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
                  ins.type === 'warning'
                    ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                    : ins.type === 'success'
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                    : 'bg-blue-50/60 border-blue-200 text-blue-900'
                }`}
              >
                {ins.type === 'warning' ? (
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                ) : ins.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Zap className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-sm font-bold">{ins.title}</h4>
                  <p className="text-xs leading-relaxed mt-0.5 opacity-90">{ins.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

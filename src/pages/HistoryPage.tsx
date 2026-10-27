import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  Utensils,
  Eye,
  X,
  Flame,
  Activity,
  Zap,
  Sparkles,
} from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { MealEntry, FoodAnalysisRecord } from '../types';

interface HistoryPageProps {
  onNavigate: (route: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [analyses, setAnalyses] = useState<FoodAnalysisRecord[]>([]);
  const [search, setSearch] = useState<string>('');
  const [mealFilter, setMealFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [loading, setLoading] = useState<boolean>(true);

  // Detail Modal inspection
  const [inspectItem, setInspectItem] = useState<MealEntry | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (mealFilter !== 'all') params.append('mealType', mealFilter);
      params.append('sort', sortOrder);

      const res = await fetch(`/api/history?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setMeals(json.meals || []);
        setAnalyses(json.analyses || []);
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [search, mealFilter, sortOrder]);

  return (
    <AppLayout
      currentRoute="/history"
      onNavigate={onNavigate}
      title="Nutrition & Analysis History"
      subtitle="Audit past meals, inspect AI vision detections, and review intake records"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Filter Controls Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search previous dishes..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Meal Filter */}
            <select
              value={mealFilter}
              onChange={(e) => setMealFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Meal Slots</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="snacks">Snacks</option>
              <option value="dinner">Dinner</option>
            </select>

            {/* Sort Order */}
            <button
              type="button"
              onClick={() => setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'))}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>

        {/* Section 14: History Cards & Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-slate-900 font-heading">
                Meal History Ledger
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {meals.length} records
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Click any row to view breakdown</span>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
            </div>
          ) : meals.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              No historical records found for this query.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Food</th>
                    <th className="px-6 py-3.5">Slot</th>
                    <th className="px-6 py-3.5">Serving</th>
                    <th className="px-6 py-3.5 text-right">Calories</th>
                    <th className="px-6 py-3.5 text-right">Protein</th>
                    <th className="px-6 py-3.5 text-right">Carbs</th>
                    <th className="px-6 py-3.5 text-right">Fat</th>
                    <th className="px-6 py-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {meals.map((meal) => (
                    <tr
                      key={meal.id}
                      onClick={() => setInspectItem(meal)}
                      className="hover:bg-emerald-50/30 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-500">{meal.date}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{meal.foodName}</td>
                      <td className="px-6 py-4">
                        <span className="capitalize px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                          {meal.mealType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {meal.quantity} {meal.servingUnit}
                      </td>
                      <td className="px-6 py-4 text-right font-extrabold text-orange-600">
                        {meal.calories} kcal
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-blue-600">
                        {meal.protein}g
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-purple-600">
                        {meal.carbs}g
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-amber-600">
                        {meal.fat}g
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectItem(meal);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Inspect details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Item Inspection Detail Modal */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Historical Record
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 font-heading mt-1">
                  {inspectItem.foodName}
                </h3>
                <p className="text-xs text-slate-500">
                  Logged on {inspectItem.date} into {inspectItem.mealType}
                </p>
              </div>
              <button
                onClick={() => setInspectItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500">Energy Provided</span>
                <div className="text-2xl font-black text-slate-900 font-heading">
                  {inspectItem.calories} kcal
                </div>
              </div>
              <div className="text-right text-xs font-semibold text-slate-500">
                Portion: {inspectItem.quantity} {inspectItem.servingUnit}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-blue-50/70 p-2 rounded-xl">
                <span className="text-[10px] font-bold text-blue-600 block">Protein</span>
                <span className="text-sm font-extrabold text-slate-800">{inspectItem.protein}g</span>
              </div>
              <div className="bg-purple-50/70 p-2 rounded-xl">
                <span className="text-[10px] font-bold text-purple-600 block">Carbs</span>
                <span className="text-sm font-extrabold text-slate-800">{inspectItem.carbs}g</span>
              </div>
              <div className="bg-amber-50/70 p-2 rounded-xl">
                <span className="text-[10px] font-bold text-amber-600 block">Fat</span>
                <span className="text-sm font-extrabold text-slate-800">{inspectItem.fat}g</span>
              </div>
              <div className="bg-emerald-50/70 p-2 rounded-xl">
                <span className="text-[10px] font-bold text-emerald-600 block">Fiber</span>
                <span className="text-sm font-extrabold text-slate-800">{inspectItem.fiber}g</span>
              </div>
            </div>

            <button
              onClick={() => setInspectItem(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

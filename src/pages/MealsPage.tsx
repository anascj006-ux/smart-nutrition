import React, { useState, useEffect } from 'react';
import {
  Sun,
  Utensils,
  Coffee,
  Moon,
  Plus,
  Trash2,
  Calendar,
  Flame,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { AddToMealModal } from '../components/common/AddToMealModal';
import { MealEntry } from '../types';
import { useNutrition } from '../context/NutritionContext';

interface MealsPageProps {
  onNavigate: (route: string) => void;
}

export const MealsPage: React.FC<MealsPageProps> = ({ onNavigate }) => {
  const { showToast } = useNutrition();

  const [meals, setMeals] = useState<{
    breakfast: MealEntry[];
    lunch: MealEntry[];
    snacks: MealEntry[];
    dinner: MealEntry[];
  }>({
    breakfast: [],
    lunch: [],
    snacks: [],
    dinner: [],
  });

  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  });

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [quickAddSlot, setQuickAddSlot] = useState<'breakfast' | 'lunch' | 'snacks' | 'dinner'>('lunch');

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/meals/today?date=${selectedDate}`);
      if (res.ok) {
        const data = await res.json();
        setMeals(data.meals);
        setTotals(data.totals);
      }
    } catch (e) {
      console.error('Failed to fetch meals:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [selectedDate]);

  const handleUpdateQuantity = async (mealId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleDeleteMeal(mealId);
      return;
    }
    try {
      const res = await fetch(`/api/meals/${mealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (res.ok) {
        fetchMeals();
      }
    } catch (err) {
      console.error(err);
      showToast('Could not update portion quantity', 'error');
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    try {
      const res = await fetch(`/api/meals/${mealId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Meal item removed', 'info');
        fetchMeals();
      }
    } catch (err) {
      console.error(err);
      showToast('Could not remove meal item', 'error');
    }
  };

  const mealSlots = [
    {
      slot: 'breakfast' as const,
      label: 'Breakfast',
      subtitle: 'Morning fuel to kickstart metabolism',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      items: meals.breakfast,
      accentBg: 'bg-amber-500/10 text-amber-800 border-amber-200',
    },
    {
      slot: 'lunch' as const,
      label: 'Lunch',
      subtitle: 'Midday nutrient balance and sustained energy',
      icon: <Utensils className="w-5 h-5 text-emerald-500" />,
      items: meals.lunch,
      accentBg: 'bg-emerald-500/10 text-emerald-800 border-emerald-200',
    },
    {
      slot: 'snacks' as const,
      label: 'Snacks & Beverages',
      subtitle: 'Hydration and quick wholesome pick-me-ups',
      icon: <Coffee className="w-5 h-5 text-orange-500" />,
      items: meals.snacks,
      accentBg: 'bg-orange-500/10 text-orange-800 border-orange-200',
    },
    {
      slot: 'dinner' as const,
      label: 'Dinner',
      subtitle: 'Restorative evening meal for overnight recovery',
      icon: <Moon className="w-5 h-5 text-indigo-500" />,
      items: meals.dinner,
      accentBg: 'bg-indigo-500/10 text-indigo-800 border-indigo-200',
    },
  ];

  return (
    <AppLayout
      currentRoute="/meals"
      onNavigate={onNavigate}
      title="Daily Meal Tracker"
      subtitle="Log, adjust portions, and monitor your nutrition across all 4 daily meal slots"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Date Selector & Total Summary Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Tracking Day
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-base font-bold text-slate-800 border-b border-dashed border-slate-300 focus:outline-hidden focus:border-emerald-600 bg-transparent cursor-pointer"
              />
            </div>
          </div>

          {/* Running Daily Totals Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
            <div className="px-3.5 py-2 rounded-2xl bg-orange-50 border border-orange-200 text-orange-800 font-extrabold flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-600" />
              <span>{totals.calories} kcal</span>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 font-bold">
              Protein: <span className="font-extrabold">{totals.protein}g</span>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-purple-50 border border-purple-200 text-purple-800 font-bold">
              Carbs: <span className="font-extrabold">{totals.carbs}g</span>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-bold">
              Fat: <span className="font-extrabold">{totals.fat}g</span>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
              Fiber: <span className="font-extrabold">{totals.fiber}g</span>
            </div>
          </div>
        </div>

        {/* 4 MEAL SLOTS: Breakfast, Lunch, Snacks, Dinner */}
        <div className="space-y-6">
          {mealSlots.map((section) => {
            const slotCalories = section.items.reduce((s, i) => s + i.calories, 0);
            const slotProtein = Math.round(section.items.reduce((s, i) => s + i.protein, 0) * 10) / 10;

            return (
              <div
                key={section.slot}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                      {section.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900 font-heading">
                          {section.label}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {section.items.length} {section.items.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{section.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <span className="text-base font-extrabold text-orange-600">
                        {slotCalories}
                      </span>
                      <span className="text-xs text-slate-400 font-bold ml-1">kcal</span>
                      <span className="text-xs text-blue-600 font-semibold block -mt-1">
                        {slotProtein}g protein
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setQuickAddSlot(section.slot);
                        setIsQuickAddOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Food</span>
                    </button>
                  </div>
                </div>

                {/* Items List */}
                {section.items.length === 0 ? (
                  <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                    <p className="text-xs text-slate-400 font-medium">No foods logged in this meal slot yet.</p>
                    <button
                      onClick={() => {
                        setQuickAddSlot(section.slot);
                        setIsQuickAddOpen(true);
                      }}
                      className="text-xs font-bold text-emerald-600 hover:underline"
                    >
                      + Add a dish now
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <div>
                            <span className="text-sm font-bold text-slate-800">
                              {item.foodName}
                            </span>
                            <div className="text-xs text-slate-400 font-medium">
                              Serving: {item.quantity} {item.servingUnit}(s)
                            </div>
                          </div>
                        </div>

                        {/* Portion Counter & Nutrients */}
                        <div className="flex items-center justify-between sm:justify-end gap-5">
                          {/* Increment / Decrement Quantity */}
                          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-1 rounded-xl">
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 0.5)}
                              className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 text-xs hover:bg-slate-100 active:scale-95"
                              title="Decrease"
                            >
                              -
                            </button>
                            <span className="text-xs font-extrabold text-slate-700 px-1 min-w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 0.5)}
                              className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 text-xs hover:bg-slate-100 active:scale-95"
                              title="Increase"
                            >
                              +
                            </button>
                          </div>

                          {/* Nutrition Pills */}
                          <div className="text-right">
                            <span className="text-sm font-extrabold text-orange-600">
                              {item.calories} kcal
                            </span>
                            <div className="text-[11px] text-slate-400 font-medium">
                              {item.protein}g P • {item.carbs}g C • {item.fat}g F
                            </div>
                          </div>

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => handleDeleteMeal(item.id)}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete food entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Add Modal */}
      <AddToMealModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        initialMealType={quickAddSlot}
        onSuccess={fetchMeals}
      />
    </AppLayout>
  );
};

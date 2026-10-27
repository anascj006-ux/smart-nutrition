import React, { useState } from 'react';
import { X, Check, Utensils, Coffee, Sun, Sunset, Moon, Plus, Minus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNutrition } from '../../context/NutritionContext';

interface AddToMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  foodName: string;
  foodId?: string;
  baseCalories: number;
  baseProtein: number;
  baseCarbs: number;
  baseFat: number;
  baseFiber: number;
  servingUnit?: string;
  onSuccess?: () => void;
}

export const AddToMealModal: React.FC<AddToMealModalProps> = ({
  isOpen,
  onClose,
  foodName,
  foodId,
  baseCalories,
  baseProtein,
  baseCarbs,
  baseFat,
  baseFiber,
  servingUnit = 'serving',
  onSuccess,
}) => {
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'snacks' | 'dinner'>('lunch');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useNutrition();

  if (!isOpen) return null;

  const currentCalories = Math.round(baseCalories * quantity);
  const currentProtein = Math.round(baseProtein * quantity * 10) / 10;
  const currentCarbs = Math.round(baseCarbs * quantity * 10) / 10;
  const currentFat = Math.round(baseFat * quantity * 10) / 10;
  const currentFiber = Math.round(baseFiber * quantity * 10) / 10;

  const mealOptions = [
    { type: 'breakfast' as const, label: 'Breakfast', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { type: 'lunch' as const, label: 'Lunch', icon: <Utensils className="w-4 h-4 text-emerald-500" /> },
    { type: 'snacks' as const, label: 'Snacks', icon: <Coffee className="w-4 h-4 text-orange-500" /> },
    { type: 'dinner' as const, label: 'Dinner', icon: <Moon className="w-4 h-4 text-indigo-500" /> },
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodId,
          foodName,
          mealType,
          quantity,
          servingUnit,
          calories: currentCalories,
          protein: currentProtein,
          carbs: currentCarbs,
          fat: currentFat,
          fiber: currentFiber,
        }),
      });

      if (res.ok) {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
        });
        showToast(`Successfully added ${foodName} to ${mealType.toUpperCase()}!`, 'success');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        showToast('Failed to add food to meal. Try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while logging food', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Add to Meal Tracker</h3>
            <p className="text-xs text-slate-500">Log this item to your daily intake ledger</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Food Summary Pill */}
          <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800 text-sm">{foodName}</div>
              <div className="text-xs text-slate-500">Unit: {servingUnit}</div>
            </div>
            <div className="text-right">
              <span className="text-base font-extrabold text-orange-600">{currentCalories}</span>
              <span className="text-xs text-orange-500 ml-1">kcal</span>
            </div>
          </div>

          {/* Select Meal Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Meal Slot
            </label>
            <div className="grid grid-cols-2 gap-2">
              {mealOptions.map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setMealType(opt.type)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-semibold transition-all ${
                    mealType === opt.type
                      ? 'border-emerald-500 bg-emerald-50/70 text-emerald-800 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Serving Quantity Counter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Serving Quantity
            </label>
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(0.5, Math.round((q - 0.5) * 10) / 10))}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all shadow-xs"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="text-center">
                <span className="text-xl font-extrabold text-slate-800">{quantity}</span>
                <span className="text-xs text-slate-500 block font-medium">{servingUnit}(s)</span>
              </div>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.round((q + 0.5) * 10) / 10)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Macros Preview */}
          <div className="grid grid-cols-4 gap-2 text-center pt-1 border-t border-slate-100">
            <div className="bg-blue-50/60 p-2 rounded-xl">
              <div className="text-[10px] uppercase font-bold text-blue-600">Protein</div>
              <div className="text-sm font-extrabold text-slate-800">{currentProtein}g</div>
            </div>
            <div className="bg-purple-50/60 p-2 rounded-xl">
              <div className="text-[10px] uppercase font-bold text-purple-600">Carbs</div>
              <div className="text-sm font-extrabold text-slate-800">{currentCarbs}g</div>
            </div>
            <div className="bg-amber-50/60 p-2 rounded-xl">
              <div className="text-[10px] uppercase font-bold text-amber-600">Fat</div>
              <div className="text-sm font-extrabold text-slate-800">{currentFat}g</div>
            </div>
            <div className="bg-emerald-50/60 p-2 rounded-xl">
              <div className="text-[10px] uppercase font-bold text-emerald-600">Fiber</div>
              <div className="text-sm font-extrabold text-slate-800">{currentFiber}g</div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{loading ? 'Adding...' : 'Log Food'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

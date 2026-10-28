import React, { useState, useEffect } from 'react';
import { X, Check, Utensils, Coffee, Sun, Moon, Plus, Minus, Search, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNutrition } from '../../context/NutritionContext';

export interface MealFoodPreset {
  id?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  servingUnit: string;
}

const SLOT_PRESETS: Record<'breakfast' | 'lunch' | 'snacks' | 'dinner', MealFoodPreset[]> = {
  breakfast: [
    { id: 'food-masala-dosa', name: 'Masala Dosa', calories: 285, protein: 5.5, carbs: 42, fat: 10.5, fiber: 3.5, servingUnit: 'piece' },
    { id: 'food-idli', name: 'Idli & Sambar', calories: 180, protein: 6.0, carbs: 36, fat: 1.5, fiber: 4.0, servingUnit: 'plate' },
    { id: 'food-egg', name: 'Boiled Egg', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0.0, servingUnit: 'piece' },
    { id: 'food-omelette', name: 'Masala Omelette', calories: 154, protein: 11.2, carbs: 2.1, fat: 11.5, fiber: 0.4, servingUnit: 'piece' },
    { id: 'food-upma', name: 'Upma', calories: 195, protein: 4.8, carbs: 31, fat: 5.8, fiber: 2.4, servingUnit: 'bowl' },
    { id: 'food-pongal', name: 'Pongal', calories: 220, protein: 6.5, carbs: 34, fat: 6.8, fiber: 2.8, servingUnit: 'bowl' },
    { id: 'food-poori', name: 'Poori Bhaji', calories: 250, protein: 4.6, carbs: 29, fat: 13.6, fiber: 2.2, servingUnit: 'plate' },
    { id: 'food-apple', name: 'Fresh Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, servingUnit: 'piece' },
  ],
  lunch: [
    { id: 'food-chicken-biryani', name: 'Chicken Biryani', calories: 520, protein: 28.0, carbs: 62, fat: 18, fiber: 4.0, servingUnit: 'plate' },
    { id: 'food-paneer-butter-masala', name: 'Paneer Butter Masala', calories: 380, protein: 14.5, carbs: 16, fat: 29, fiber: 2.8, servingUnit: 'bowl' },
    { id: 'food-veg-meals', name: 'Veg Meals (Thali)', calories: 640, protein: 18.5, carbs: 110, fat: 14, fiber: 12.0, servingUnit: 'plate' },
    { id: 'food-chicken-curry', name: 'Chicken Curry & Rice', calories: 480, protein: 30.3, carbs: 52.5, fat: 16, fiber: 2.4, servingUnit: 'plate' },
    { id: 'food-dal', name: 'Dal Tadka & Rice', calories: 365, protein: 13.5, carbs: 67.5, fat: 4.3, fiber: 6.1, servingUnit: 'bowl' },
    { id: 'food-curd-rice', name: 'Curd Rice', calories: 210, protein: 6.8, carbs: 32, fat: 6.2, fiber: 1.1, servingUnit: 'bowl' },
    { id: 'food-lemon-rice', name: 'Lemon Rice', calories: 245, protein: 4.5, carbs: 44, fat: 6.0, fiber: 1.8, servingUnit: 'bowl' },
    { id: 'food-curd', name: 'Curd / Dahi', calories: 98, protein: 4.5, carbs: 5.2, fat: 4.8, fiber: 0.0, servingUnit: 'cup' },
  ],
  snacks: [
    { id: 'food-tea', name: 'Masala Chai', calories: 60, protein: 2.2, carbs: 8.5, fat: 1.8, fiber: 0.0, servingUnit: 'cup' },
    { id: 'food-coffee', name: 'Filter Coffee', calories: 75, protein: 2.8, carbs: 9.0, fat: 2.4, fiber: 0.0, servingUnit: 'cup' },
    { id: 'food-apple', name: 'Fresh Apple', calories: 95, protein: 0.5, carbs: 25.0, fat: 0.3, fiber: 4.4, servingUnit: 'piece' },
    { id: 'food-banana', name: 'Banana', calories: 105, protein: 1.3, carbs: 27.0, fat: 0.4, fiber: 3.1, servingUnit: 'piece' },
    { id: 'food-vada', name: 'Meduvada', calories: 145, protein: 4.2, carbs: 15.0, fat: 7.8, fiber: 2.1, servingUnit: 'piece' },
    { id: 'food-sandwich', name: 'Veg Sandwich', calories: 310, protein: 14.0, carbs: 36.0, fat: 12.0, fiber: 3.2, servingUnit: 'piece' },
    { id: 'food-orange', name: 'Fresh Orange', calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, fiber: 3.1, servingUnit: 'piece' },
    { id: 'food-fruit-juice', name: 'Fresh Fruit Juice', calories: 110, protein: 0.8, carbs: 26.0, fat: 0.2, fiber: 0.5, servingUnit: 'cup' },
  ],
  dinner: [
    { id: 'food-chapati', name: 'Chapati with Dal', calories: 264, protein: 12.6, carbs: 42.7, fat: 5.0, fiber: 8.3, servingUnit: 'serving' },
    { id: 'food-paneer-chapati', name: 'Paneer Butter Masala & Roti', calories: 484, protein: 17.9, carbs: 36.2, fat: 30.2, fiber: 5.6, servingUnit: 'plate' },
    { id: 'food-chicken-chapati', name: 'Chicken Curry & Chapati', calories: 379, protein: 29.4, carbs: 27.7, fat: 16.7, fiber: 4.6, servingUnit: 'plate' },
    { id: 'food-curd-rice', name: 'Curd Rice', calories: 210, protein: 6.8, carbs: 32.0, fat: 6.2, fiber: 1.1, servingUnit: 'bowl' },
    { id: 'food-rasam-rice', name: 'Rasam with Steamed Rice', calories: 270, protein: 6.1, carbs: 54.5, fat: 2.7, fiber: 1.8, servingUnit: 'bowl' },
    { id: 'food-egg-salad', name: 'Boiled Eggs & Salad', calories: 143, protein: 7.8, carbs: 12.6, fat: 5.8, fiber: 3.2, servingUnit: 'plate' },
  ],
};

interface AddToMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMealType?: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  foodName?: string;
  foodId?: string;
  baseCalories?: number;
  baseProtein?: number;
  baseCarbs?: number;
  baseFat?: number;
  baseFiber?: number;
  servingUnit?: string;
  onSuccess?: () => void;
}

export const AddToMealModal: React.FC<AddToMealModalProps> = ({
  isOpen,
  onClose,
  initialMealType = 'lunch',
  foodName: initialFoodName,
  foodId: initialFoodId,
  baseCalories: initialBaseCalories,
  baseProtein: initialBaseProtein,
  baseCarbs: initialBaseCarbs,
  baseFat: initialBaseFat,
  baseFiber: initialBaseFiber,
  servingUnit: initialServingUnit,
  onSuccess,
}) => {
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'snacks' | 'dinner'>(initialMealType);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { showToast } = useNutrition();

  // Active food item state
  const [selectedFood, setSelectedFood] = useState<MealFoodPreset>(() => {
    if (initialFoodName && typeof initialBaseCalories === 'number') {
      return {
        id: initialFoodId,
        name: initialFoodName,
        calories: initialBaseCalories,
        protein: initialBaseProtein || 0,
        carbs: initialBaseCarbs || 0,
        fat: initialBaseFat || 0,
        fiber: initialBaseFiber || 0,
        servingUnit: initialServingUnit || 'serving',
      };
    }
    const defaultPreset = SLOT_PRESETS[initialMealType]?.[0] || SLOT_PRESETS.lunch[0];
    return defaultPreset;
  });

  // Keep state updated when modal opens or initialMealType changes
  useEffect(() => {
    if (isOpen) {
      setMealType(initialMealType);
      setQuantity(1);
      setIsSearching(false);
      setSearchQuery('');

      if (initialFoodName && typeof initialBaseCalories === 'number') {
        setSelectedFood({
          id: initialFoodId,
          name: initialFoodName,
          calories: initialBaseCalories,
          protein: initialBaseProtein || 0,
          carbs: initialBaseCarbs || 0,
          fat: initialBaseFat || 0,
          fiber: initialBaseFiber || 0,
          servingUnit: initialServingUnit || 'serving',
        });
      } else {
        const defaultForSlot = SLOT_PRESETS[initialMealType]?.[0] || SLOT_PRESETS.lunch[0];
        setSelectedFood(defaultForSlot);
      }
    }
  }, [isOpen, initialMealType, initialFoodName, initialBaseCalories]);

  if (!isOpen) return null;

  // Handle switching meal slot in modal
  const handleSlotChange = (slot: 'breakfast' | 'lunch' | 'snacks' | 'dinner') => {
    setMealType(slot);
    const topFood = SLOT_PRESETS[slot]?.[0] || SLOT_PRESETS.lunch[0];
    setSelectedFood(topFood);
  };

  const currentCalories = Math.round(selectedFood.calories * quantity);
  const currentProtein = Math.round(selectedFood.protein * quantity * 10) / 10;
  const currentCarbs = Math.round(selectedFood.carbs * quantity * 10) / 10;
  const currentFat = Math.round(selectedFood.fat * quantity * 10) / 10;
  const currentFiber = Math.round(selectedFood.fiber * quantity * 10) / 10;

  const mealOptions = [
    { type: 'breakfast' as const, label: 'Breakfast', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { type: 'lunch' as const, label: 'Lunch', icon: <Utensils className="w-4 h-4 text-emerald-500" /> },
    { type: 'snacks' as const, label: 'Snacks', icon: <Coffee className="w-4 h-4 text-orange-500" /> },
    { type: 'dinner' as const, label: 'Dinner', icon: <Moon className="w-4 h-4 text-indigo-500" /> },
  ];

  const presetsForSlot = SLOT_PRESETS[mealType] || [];
  const filteredPresets = searchQuery.trim()
    ? presetsForSlot.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : presetsForSlot;

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodId: selectedFood.id,
          foodName: selectedFood.name,
          mealType,
          quantity,
          servingUnit: selectedFood.servingUnit,
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
        showToast(`Successfully added ${selectedFood.name} to ${mealType.toUpperCase()}!`, 'success');
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
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Add to Meal Tracker</h3>
            <p className="text-xs text-slate-500">Log tailored food items to your daily intake ledger</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Active Food Summary Pill */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Selected for {mealType.toUpperCase()}
              </span>
              <div className="font-extrabold text-slate-900 text-base mt-1">{selectedFood.name}</div>
              <div className="text-xs text-slate-500">
                Portion: {quantity} {selectedFood.servingUnit}(s)
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-orange-600 font-heading">{currentCalories}</span>
              <span className="text-xs font-bold text-orange-500 ml-1">kcal</span>
            </div>
          </div>

          {/* Select Meal Slot */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Meal Slot
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {mealOptions.map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => handleSlotChange(opt.type)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    mealType === opt.type
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Curated Recommendations For This Meal Slot */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Recommended for {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</span>
              </label>
              <button
                type="button"
                onClick={() => setIsSearching(!isSearching)}
                className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <Search className="w-3 h-3" />
                <span>{isSearching ? 'Hide search' : 'Filter dishes'}</span>
              </button>
            </div>

            {isSearching && (
              <div className="mb-2.5">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${mealType} dishes (e.g. Dosa, Biryani, Chai)...`}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                />
              </div>
            )}

            {/* Quick Clickable Preset Food Pills */}
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredPresets.map((item) => {
                const isSelected = selectedFood.name === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setSelectedFood(item);
                    }}
                    className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/90 text-emerald-900 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold truncate text-slate-900">{item.name}</div>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px]">
                      <span className="font-extrabold text-orange-600">{item.calories} kcal</span>
                      <span className="text-slate-400 font-medium text-[10px]">per {item.servingUnit}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500 font-medium">
                      <span className="text-blue-600">P:{item.protein}g</span>
                      <span className="text-purple-600">C:{item.carbs}g</span>
                      <span className="text-amber-600">F:{item.fat}g</span>
                      <span className="text-emerald-600">Fib:{item.fiber}g</span>
                    </div>
                  </button>
                );
              })}
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
                <span className="text-xs text-slate-500 block font-medium">{selectedFood.servingUnit}(s)</span>
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

          {/* Macronutrients Live Preview Grid */}
          <div className="grid grid-cols-4 gap-2 text-center pt-1 border-t border-slate-100">
            <div className="bg-blue-50/70 p-2 rounded-xl border border-blue-100">
              <div className="text-[10px] uppercase font-bold text-blue-600">Protein</div>
              <div className="text-sm font-extrabold text-slate-800">{currentProtein}g</div>
            </div>
            <div className="bg-purple-50/70 p-2 rounded-xl border border-purple-100">
              <div className="text-[10px] uppercase font-bold text-purple-600">Carbs</div>
              <div className="text-sm font-extrabold text-slate-800">{currentCarbs}g</div>
            </div>
            <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-100">
              <div className="text-[10px] uppercase font-bold text-amber-600">Fat</div>
              <div className="text-sm font-extrabold text-slate-800">{currentFat}g</div>
            </div>
            <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
              <div className="text-[10px] uppercase font-bold text-emerald-600">Fiber</div>
              <div className="text-sm font-extrabold text-slate-800">{currentFiber}g</div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50/90 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{loading ? 'Adding...' : `Log ${selectedFood.name}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

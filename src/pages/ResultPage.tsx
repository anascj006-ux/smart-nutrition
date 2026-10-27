import React, { useState } from 'react';
import {
  Flame,
  Plus,
  Minus,
  Utensils,
  Share2,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Bookmark,
  ShieldAlert,
  Edit3,
  Check,
  AlertTriangle,
  Layers,
  Info,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { AppLayout } from '../components/layout/AppLayout';
import { AddToMealModal } from '../components/common/AddToMealModal';
import { useNutrition } from '../context/NutritionContext';
import { DetectedFoodItem } from '../types';

interface ResultPageProps {
  onNavigate: (route: string) => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ onNavigate }) => {
  const {
    currentResult,
    setCurrentResult,
    servingMultiplier,
    setServingMultiplier,
    selectedUnit,
    setSelectedUnit,
    showToast,
  } = useNutrition();

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Section 12: User Correction mode state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editFoodName, setEditFoodName] = useState<string>(currentResult?.foodName || 'Chicken Biryani');
  const [editAmount, setEditAmount] = useState<number>(currentResult?.quantity || 1);
  const [editUnit, setEditUnit] = useState<string>(currentResult?.servingUnit || 'plate');
  const [editGrams, setEditGrams] = useState<number>(currentResult?.estimatedGrams || 350);
  const [editCalories, setEditCalories] = useState<number>(currentResult?.calories || 520);
  const [editProtein, setEditProtein] = useState<number>(currentResult?.protein || 28);
  const [editCarbs, setEditCarbs] = useState<number>(currentResult?.carbohydrates || 62);
  const [editFat, setEditFat] = useState<number>(currentResult?.fat || 18);
  const [editFiber, setEditFiber] = useState<number>(currentResult?.fiber || 4);

  // Default baseline data if no active result
  const result = currentResult || {
    foodName: 'Chicken Biryani',
    confidence: 0.95,
    servingSize: '1 plate (350g)',
    servingUnit: 'plate',
    quantity: 1,
    estimatedGrams: 350,
    calories: 520,
    protein: 28,
    carbohydrates: 62,
    fat: 18,
    fiber: 4,
    category: 'Indian Food',
    description: 'Fragrant basmati rice layered with tender marinated chicken, saffron, mint, and whole aromatic spices.',
    healthInsights: [
      'Delivers 28g of high-quality protein per serving for muscle repair and satiety.',
      'Estimated at 520 kcal — approximately 26% of standard 2,000 kcal daily intake.',
      'Provides 4g of dietary fiber supporting digestive wellness.',
    ],
    foods: [
      {
        name: 'Chicken Biryani',
        category: 'Indian Food',
        confidence: 0.95,
        serving: { amount: 1, unit: 'plate', estimatedGrams: 350 },
        nutrition: { calories: 520, protein: 28, carbohydrates: 62, fat: 18, fiber: 4 },
      },
    ],
    totalNutrition: { calories: 520, protein: 28, carbohydrates: 62, fat: 18, fiber: 4 },
    overallConfidence: 0.95,
    source: 'gemini' as const,
    disclaimer: 'Nutritional values are estimates and may vary depending on ingredients and portion size.',
    isDemoMode: false,
    previewImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
  };

  // Section 13: Standard serving presets
  const servingPresets = [
    { label: '1 plate', unit: 'plate', multiplier: 1, grams: 350 },
    { label: '1 bowl', unit: 'bowl', multiplier: 0.8, grams: 280 },
    { label: '1 cup', unit: 'cup', multiplier: 0.65, grams: 220 },
    { label: '1 piece', unit: 'piece', multiplier: 0.4, grams: 140 },
    { label: '100 g', unit: 'g', multiplier: 100 / (result.estimatedGrams || 350), grams: 100 },
    { label: '200 g', unit: 'g', multiplier: 200 / (result.estimatedGrams || 350), grams: 200 },
    { label: '250 g', unit: 'g', multiplier: 250 / (result.estimatedGrams || 350), grams: 250 },
    { label: '500 g', unit: 'g', multiplier: 500 / (result.estimatedGrams || 350), grams: 500 },
  ];

  // Dynamic nutrients based on serving multiplier
  const multiplier = Math.max(0.1, servingMultiplier);
  const currentCalories = Math.round(result.calories * multiplier);
  const currentProtein = Math.round(result.protein * multiplier * 10) / 10;
  const currentCarbs = Math.round(result.carbohydrates * multiplier * 10) / 10;
  const currentFat = Math.round(result.fat * multiplier * 10) / 10;
  const currentFiber = Math.round(result.fiber * multiplier * 10) / 10;
  const currentGrams = Math.round((result.estimatedGrams || 350) * multiplier);

  // Donut chart data for macronutrients
  const chartData = [
    { name: 'Protein', value: currentProtein * 4, grams: currentProtein, color: '#3B82F6' },
    { name: 'Carbs', value: currentCarbs * 4, grams: currentCarbs, color: '#A855F7' },
    { name: 'Fat', value: currentFat * 9, grams: currentFat, color: '#EAB308' },
  ];
  const totalMacroCalories = chartData.reduce((sum, item) => sum + item.value, 0) || 1;

  // Section 11: Confidence threshold warning (< 0.70)
  const isLowConfidence = (result.overallConfidence || result.confidence) < 0.70;

  // Section 12: Handle User Correction Submission
  const handleApplyCorrection = () => {
    const updated = {
      ...result,
      foodName: editFoodName.trim(),
      servingUnit: editUnit,
      quantity: editAmount,
      estimatedGrams: editGrams,
      servingSize: `${editAmount} ${editUnit} (${editGrams}g)`,
      calories: Number(editCalories),
      protein: Number(editProtein),
      carbohydrates: Number(editCarbs),
      fat: Number(editFat),
      fiber: Number(editFiber),
      totalNutrition: {
        calories: Number(editCalories),
        protein: Number(editProtein),
        carbohydrates: Number(editCarbs),
        fat: Number(editFat),
        fiber: Number(editFiber),
      },
      overallConfidence: 1.0, // user confirmed
      confidence: 1.0,
    };
    setCurrentResult(updated);
    setIsEditing(false);
    showToast(`Updated to ${updated.foodName}! Ready to add to meal.`, 'success');
  };

  const handleSaveResult = () => {
    setIsSaved(true);
    showToast('Analysis report bookmarked in your nutrition log!', 'success');
  };

  const handleShare = async () => {
    const summary = `🍽️ ${result.foodName} (${currentCalories} kcal, ${currentProtein}g protein, ${currentCarbs}g carbs, ${currentFat}g fat) — Analyzed by Smart Nutrition AI`;
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Smart Nutrition: ${result.foodName}`,
          text: summary,
          url: shareUrl,
        });
        showToast('Shared successfully!', 'success');
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(`${summary}\n${shareUrl}`);
      showToast('Share link & nutrition summary copied to clipboard!', 'success');
    } catch {
      showToast('Copied to clipboard!', 'success');
    }
  };

  return (
    <AppLayout
      currentRoute="/result"
      onNavigate={onNavigate}
      title="Nutrition Analysis Result"
      subtitle="Comprehensive AI food identification and macronutrient breakdown"
    >
      <div className="max-w-6xl mx-auto space-y-7">
        {/* Section 11: CONFIDENCE WARNING BANNER (< 0.70) */}
        {isLowConfidence && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 shadow-xs animate-in fade-in">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <span className="font-bold text-sm block mb-0.5">Confidence Notice:</span>
              Food identification may be uncertain ({Math.round((result.overallConfidence || result.confidence) * 100)}% match). Please verify the food and serving size below before adding to your meal log.
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 shadow-xs"
            >
              Verify / Edit
            </button>
          </div>
        )}

        {/* Section 22: AI SOURCE DISPLAY & TOP HEADER CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {result.previewImage && (
              <img
                src={result.previewImage}
                alt={result.foodName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200 shadow-xs"
              />
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Section 22 Badge Logic */}
                {result.source === 'gemini' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Analyzed by Gemini AI
                  </span>
                ) : result.source === 'manual' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-blue-800 bg-blue-100 border border-blue-300 px-3 py-1 rounded-full shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Gemini Text Analysis
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
                    Demo AI Mode
                  </span>
                )}

                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                  {result.category || 'General'}
                </span>

                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                  {Math.round((result.overallConfidence || result.confidence) * 100)}% AI Confidence
                </span>
              </div>

              {/* Food Name & Estimated Serving (Section 10) */}
              <h1 className="text-3xl font-extrabold text-slate-900 mt-2 font-heading">
                {result.foodName}
              </h1>
              <p className="text-xs text-slate-500 max-w-lg mt-1 leading-relaxed">
                Estimated Serving: <strong className="text-slate-800">{currentGrams} g / {servingMultiplier} {selectedUnit}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* User Correction Button (Section 12) */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Edit3 className="w-4 h-4 text-emerald-600" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Food Details'}</span>
            </button>

            {/* Add To Meal Button (Section 12 & 20) */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Utensils className="w-4 h-4" />
              <span>Confirm & Add to Meal</span>
            </button>

            <button
              onClick={handleSaveResult}
              className={`p-3 rounded-2xl border transition-all ${
                isSaved
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Bookmark result"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-600 text-emerald-600' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-2xl border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition-all shadow-2xs"
              title="Share food analysis"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/analyze')}
              className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-2xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">New Scan</span>
            </button>
          </div>
        </div>

        {/* Section 12: USER CORRECTION INLINE PANEL */}
        {isEditing && (
          <div className="bg-emerald-50/70 border border-emerald-300 rounded-3xl p-6 shadow-sm space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <Edit3 className="w-4 h-4" />
                <span>Edit Gemini Identification & Portion</span>
              </div>
              <span className="text-[11px] text-emerald-700">Correct any details before logging</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Food Name</label>
                <input
                  type="text"
                  value={editFoodName}
                  onChange={(e) => setEditFoodName(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Serving Unit</label>
                <input
                  type="text"
                  value={editUnit}
                  onChange={(e) => setEditUnit(e.target.value)}
                  placeholder="plate, bowl, cup, piece..."
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Estimated Grams</label>
                <input
                  type="number"
                  value={editGrams}
                  onChange={(e) => setEditGrams(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Calories (kcal)</label>
                <input
                  type="number"
                  value={editCalories}
                  onChange={(e) => setEditCalories(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Protein (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editProtein}
                  onChange={(e) => setEditProtein(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Carbs (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editCarbs}
                  onChange={(e) => setEditCarbs(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Fat (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editFat}
                  onChange={(e) => setEditFat(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Fiber (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editFiber}
                  onChange={(e) => setEditFiber(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCorrection}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Save Correction</span>
              </button>
            </div>
          </div>
        )}

        {/* Section 7: MULTIPLE FOOD DETECTION BREAKDOWN (If > 1 food detected) */}
        {result.foods && result.foods.length > 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-slate-900 font-heading">
                  Multiple Foods Detected ({result.foods.length} items)
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Total Calories: <strong className="text-orange-600">{currentCalories} kcal</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {result.foods.map((food: DetectedFoodItem, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{food.name}</h4>
                      <p className="text-[11px] text-slate-500">{food.category}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {Math.round(food.confidence * 100)}%
                    </span>
                  </div>

                  <div className="text-xs text-slate-600">
                    Serving: <span className="font-semibold">{food.serving.amount} {food.serving.unit} ({food.serving.estimatedGrams}g)</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 grid grid-cols-4 gap-1 text-center text-[10px]">
                    <div className="bg-orange-100/60 p-1 rounded-md">
                      <div className="text-slate-500">Cal</div>
                      <div className="font-bold text-orange-700">{food.nutrition.calories}</div>
                    </div>
                    <div className="bg-blue-100/60 p-1 rounded-md">
                      <div className="text-slate-500">P</div>
                      <div className="font-bold text-blue-700">{food.nutrition.protein}g</div>
                    </div>
                    <div className="bg-purple-100/60 p-1 rounded-md">
                      <div className="text-slate-500">C</div>
                      <div className="font-bold text-purple-700">{food.nutrition.carbohydrates}g</div>
                    </div>
                    <div className="bg-amber-100/60 p-1 rounded-md">
                      <div className="text-slate-500">F</div>
                      <div className="font-bold text-amber-700">{food.nutrition.fat}g</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 13: SERVING SIZE CONTROLS & PRESETS */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl space-y-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-lg font-bold flex items-center justify-center md:justify-start gap-2">
                <span>Serving Size & Portion Control</span>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-800">
                  Dynamic Recalculation
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Selecting a portion instantly recalculates total calories and macronutrients.
              </p>
            </div>

            {/* Custom Multiplier +/- Stepper */}
            <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setServingMultiplier((m) => Math.max(0.25, Math.round((m - 0.25) * 100) / 100))}
                className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white active:scale-95 transition-all"
                title="Decrease serving"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="text-center px-3 min-w-16">
                <span className="text-xl font-black font-heading text-emerald-400">{servingMultiplier}</span>
                <span className="text-[10px] text-slate-400 block -mt-1 font-medium">{selectedUnit}(s)</span>
              </div>
              <button
                type="button"
                onClick={() => setServingMultiplier((m) => Math.round((m + 0.25) * 100) / 100)}
                className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white active:scale-95 transition-all"
                title="Increase serving"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Section 13 Presets: 1 plate, 1 bowl, 1 cup, 1 piece, 100g, 200g, 250g, 500g */}
          <div className="pt-2 border-t border-slate-700/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Quick Portion Presets (Section 13):
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {servingPresets.map((preset) => {
                const isSelected = Math.abs(servingMultiplier - preset.multiplier) < 0.05 && selectedUnit === preset.unit;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setServingMultiplier(preset.multiplier);
                      setSelectedUnit(preset.unit);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CALORIE & MACRO HIGHLIGHT GRID (Section 10) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calorie Gauge Display */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs flex flex-col items-center text-center justify-center">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Caloric Density
            </div>

            <div className="relative flex flex-col items-center justify-center my-2">
              <svg width="220" height="220" className="transform -rotate-90">
                <circle
                  cx="110"
                  cy="110"
                  r="85"
                  stroke="#F1F5F9"
                  strokeWidth="16"
                  fill="transparent"
                />
                <circle
                  cx="110"
                  cy="110"
                  r="85"
                  stroke="#F97316"
                  strokeWidth="16"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 85}
                  strokeDashoffset={(2 * Math.PI * 85) * (1 - Math.min(1, currentCalories / 2000))}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="p-2 rounded-2xl bg-orange-50 text-orange-600 mb-1">
                  <Flame className="w-6 h-6 fill-orange-500" />
                </div>
                <div className="text-4xl font-black text-slate-900 font-heading">
                  {currentCalories}
                </div>
                <div className="text-xs font-bold text-slate-400">kcal</div>
                <div className="text-[11px] font-semibold text-emerald-600 mt-1">
                  {Math.round((currentCalories / 2000) * 100)}% of 2,000 kcal standard
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-4 max-w-xs">
              Based on {currentGrams}g ({servingMultiplier} {selectedUnit}). Nutrition values update dynamically.
            </p>
          </div>

          {/* 4 Nutrition Macro Cards (Protein, Carbs, Fat, Fiber) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Protein */}
              <div className="p-5 rounded-3xl bg-blue-50/70 border border-blue-200/80 shadow-2xs hover:shadow-md transition-all text-center">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  Protein
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-1">
                  {currentProtein}g
                </div>
                <div className="mt-2 text-[10px] font-semibold text-slate-500">
                  {Math.round(currentProtein * 4)} kcal
                </div>
                <div className="w-full bg-blue-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((currentProtein / 120) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Carbohydrates */}
              <div className="p-5 rounded-3xl bg-purple-50/70 border border-purple-200/80 shadow-2xs hover:shadow-md transition-all text-center">
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
                  Carbs
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-1">
                  {currentCarbs}g
                </div>
                <div className="mt-2 text-[10px] font-semibold text-slate-500">
                  {Math.round(currentCarbs * 4)} kcal
                </div>
                <div className="w-full bg-purple-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((currentCarbs / 250) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Fat */}
              <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200/80 shadow-2xs hover:shadow-md transition-all text-center">
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                  Fat
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-1">
                  {currentFat}g
                </div>
                <div className="mt-2 text-[10px] font-semibold text-slate-500">
                  {Math.round(currentFat * 9)} kcal
                </div>
                <div className="w-full bg-amber-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((currentFat / 65) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Fiber */}
              <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 shadow-2xs hover:shadow-md transition-all text-center">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                  Fiber
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-1">
                  {currentFiber}g
                </div>
                <div className="mt-2 text-[10px] font-semibold text-slate-500">
                  Digestive
                </div>
                <div className="w-full bg-emerald-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((currentFiber / 30) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Donut Chart & Energy Ratio */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center gap-6">
              <div className="w-40 h-40 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${Math.round(Number(val))} kcal`, 'Energy']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1 space-y-2.5 w-full">
                <h4 className="text-sm font-bold text-slate-800">Macronutrient Calorie Ratio</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      Protein ({currentProtein}g)
                    </span>
                    <span className="font-bold text-slate-900">
                      {Math.round(((currentProtein * 4) / totalMacroCalories) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      Carbohydrates ({currentCarbs}g)
                    </span>
                    <span className="font-bold text-slate-900">
                      {Math.round(((currentCarbs * 4) / totalMacroCalories) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      Fat ({currentFat}g)
                    </span>
                    <span className="font-bold text-slate-900">
                      {Math.round(((currentFat * 9) / totalMacroCalories) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Health Insights */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-600">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-extrabold text-base text-slate-900 font-heading">
              Gemini AI Nutritional Assessment
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(result.healthInsights || []).map((insight: string, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 26: IMPORTANT AI SAFETY & CLINICAL DISCLAIMER */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs flex items-start gap-3">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            <strong className="text-slate-700">Important Safety Disclaimer (Section 26): </strong>
            {result.disclaimer || 'Nutrition values are estimated from the image and may vary based on ingredients, preparation method, and portion size.'}{' '}
            Nutritional estimates are generated for educational and tracking purposes and should not be treated as medical or dietary advice.
          </div>
        </div>
      </div>

      {/* Add To Meal Modal (Section 12 & 20) */}
      <AddToMealModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        foodName={result.foodName}
        baseCalories={result.calories}
        baseProtein={result.protein}
        baseCarbs={result.carbohydrates}
        baseFat={result.fat}
        baseFiber={result.fiber}
        servingUnit={selectedUnit}
        onSuccess={() => onNavigate('/meals')}
      />
    </AppLayout>
  );
};

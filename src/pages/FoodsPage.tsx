import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Flame,
  Activity,
  Zap,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { AddToMealModal } from '../components/common/AddToMealModal';
import { FoodItem } from '../types';

interface FoodsPageProps {
  onNavigate: (route: string) => void;
}

export const FoodsPage: React.FC<FoodsPageProps> = ({ onNavigate }) => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  // Selected food for AddToMealModal
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const categories = ['All', 'Indian Foods', 'Fruits', 'Fast Food', 'Drinks'];

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        if (search.trim()) params.append('search', search.trim());

        const res = await fetch(`/api/foods?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          setFoods(json.foods || []);
        }
      } catch (e) {
        console.error('Failed to fetch food library:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, [selectedCategory, search]);

  return (
    <AppLayout
      currentRoute="/foods"
      onNavigate={onNavigate}
      title="Nutritional Food Database"
      subtitle="Search certified nutritional profiles across Indian dishes, fruits, fast food, and beverages"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Search & Filter Header Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search food (e.g. Idli, Biryani, Apple, Burger)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
          <span>Found {foods.length} items in database</span>
          <span>Showing verified caloric & macro records</span>
        </div>

        {/* Food Cards Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
          </div>
        ) : foods.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
            <p className="text-sm font-semibold text-slate-600">No foods matched your search.</p>
            <p className="text-xs text-slate-400">Try searching for generic terms like "rice", "curry", or "fruit".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <div
                key={food.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all overflow-hidden flex flex-col group"
              >
                {/* Food Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold">
                    {food.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-orange-600 text-xs font-extrabold shadow-sm">
                    {food.calories} kcal
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      {food.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {food.description}
                    </p>
                    <span className="text-[11px] font-medium text-slate-400 block mt-2">
                      Default portion: {food.defaultServing} {food.servingUnit} ({food.unitWeightGrams}g)
                    </span>
                  </div>

                  {/* 4 Macros Chips */}
                  <div className="grid grid-cols-4 gap-1.5 text-center pt-2 border-t border-slate-100">
                    <div className="bg-blue-50/70 p-1.5 rounded-xl">
                      <span className="text-[9px] font-bold text-blue-600 block">P</span>
                      <span className="text-xs font-extrabold text-slate-800">{food.protein}g</span>
                    </div>
                    <div className="bg-purple-50/70 p-1.5 rounded-xl">
                      <span className="text-[9px] font-bold text-purple-600 block">C</span>
                      <span className="text-xs font-extrabold text-slate-800">{food.carbohydrates}g</span>
                    </div>
                    <div className="bg-amber-50/70 p-1.5 rounded-xl">
                      <span className="text-[9px] font-bold text-amber-600 block">F</span>
                      <span className="text-xs font-extrabold text-slate-800">{food.fat}g</span>
                    </div>
                    <div className="bg-emerald-50/70 p-1.5 rounded-xl">
                      <span className="text-[9px] font-bold text-emerald-600 block">Fib</span>
                      <span className="text-xs font-extrabold text-slate-800">{food.fiber}g</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedFood(food)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Meal</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add To Meal Modal */}
      {selectedFood && (
        <AddToMealModal
          isOpen={Boolean(selectedFood)}
          onClose={() => setSelectedFood(null)}
          foodName={selectedFood.name}
          foodId={selectedFood.id}
          baseCalories={selectedFood.calories}
          baseProtein={selectedFood.protein}
          baseCarbs={selectedFood.carbohydrates}
          baseFat={selectedFood.fat}
          baseFiber={selectedFood.fiber}
          servingUnit={selectedFood.servingUnit}
          onSuccess={() => onNavigate('/meals')}
        />
      )}
    </AppLayout>
  );
};

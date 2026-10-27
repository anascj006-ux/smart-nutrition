import React, { createContext, useContext, useState, useEffect } from 'react';
import { AnalysisResult } from '../types';

interface NutritionContextType {
  currentResult: AnalysisResult | null;
  setCurrentResult: (result: AnalysisResult | null) => void;
  servingMultiplier: number;
  setServingMultiplier: (val: number | ((prev: number) => number)) => void;
  selectedUnit: string;
  setSelectedUnit: (unit: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  forceDemoMode: boolean;
  setForceDemoMode: (val: boolean) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
  getAdjustedNutrients: () => {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
  };
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentResult, setCurrentResultState] = useState<AnalysisResult | null>(() => {
    // Default initial demonstration result matching Section 33
    return {
      foodName: 'Chicken Biryani',
      confidence: 0.92,
      servingSize: '1 plate',
      servingUnit: 'plate',
      quantity: 1,
      calories: 520,
      protein: 28,
      carbohydrates: 62,
      fat: 18,
      fiber: 4,
      category: 'Indian Foods',
      description: 'Royal aromatic long-grain basmati rice layered with tender marinated chicken, saffron, mint, and spices.',
      healthInsights: [
        'Delivers 28g of high-quality protein per serving for muscle repair and satiety.',
        'Estimated at 520 kcal — approximately 26% of standard 2,000 kcal daily intake.',
        'Provides 4g of dietary fiber supporting digestive wellness.'
      ],
      micronutrients: {
        sodium_mg: 740,
        potassium_mg: 380,
        calcium_mg: 45,
        iron_mg: 2.8,
        vitamin_c_mg: 6,
      },
      isDemoMode: true,
      matchedFoodId: 'food-chicken-biryani',
      previewImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
    };
  });

  const [servingMultiplier, setServingMultiplier] = useState<number>(1);
  const [selectedUnit, setSelectedUnit] = useState<string>('plate');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('smart_nutrition_api_key') || '');
  const [forceDemoMode, setForceDemoMode] = useState<boolean>(() => localStorage.getItem('smart_nutrition_force_demo') === 'true');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    localStorage.setItem('smart_nutrition_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('smart_nutrition_force_demo', String(forceDemoMode));
  }, [forceDemoMode]);

  const setCurrentResult = (result: AnalysisResult | null) => {
    setCurrentResultState(result);
    setServingMultiplier(1);
    if (result) {
      setSelectedUnit(result.servingUnit || 'serving');
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const clearToast = () => setToast(null);

  const getAdjustedNutrients = () => {
    if (!currentResult) {
      return { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0 };
    }
    const mult = Math.max(0.1, servingMultiplier);
    return {
      calories: Math.round(currentResult.calories * mult),
      protein: Math.round(currentResult.protein * mult * 10) / 10,
      carbohydrates: Math.round(currentResult.carbohydrates * mult * 10) / 10,
      fat: Math.round(currentResult.fat * mult * 10) / 10,
      fiber: Math.round(currentResult.fiber * mult * 10) / 10,
    };
  };

  return (
    <NutritionContext.Provider
      value={{
        currentResult,
        setCurrentResult,
        servingMultiplier,
        setServingMultiplier,
        selectedUnit,
        setSelectedUnit,
        apiKey,
        setApiKey,
        forceDemoMode,
        setForceDemoMode,
        toast,
        showToast,
        clearToast,
        getAdjustedNutrients,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) throw new Error('useNutrition must be used within a NutritionProvider');
  return context;
};

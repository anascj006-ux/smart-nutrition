export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  activityLevel: 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active';
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  fiberGoal: number;
  createdAt?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'Indian Foods' | 'Fruits' | 'Fast Food' | 'Drinks' | 'Healthy Staples';
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  defaultServing: number;
  servingUnit: string;
  unitWeightGrams: number;
  image: string;
  description: string;
  micronutrients?: {
    sodium_mg: number;
    potassium_mg: number;
    calcium_mg: number;
    iron_mg: number;
    vitamin_c_mg: number;
  };
}

export interface MealEntry {
  id: string;
  userId: string;
  foodId?: string;
  foodName: string;
  mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  quantity: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  date: string;
  createdAt: string;
}

export interface DetectedFoodItem {
  name: string;
  category: string;
  confidence: number;
  serving: {
    amount: number;
    unit: string;
    estimatedGrams: number;
  };
  nutrition: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
  };
}

export interface AnalysisResult {
  foodName: string;
  confidence: number;
  servingSize: string;
  servingUnit: string;
  quantity: number;
  estimatedGrams?: number;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  category: string;
  description: string;
  healthInsights: string[];
  foods?: DetectedFoodItem[];
  totalNutrition?: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
  };
  overallConfidence?: number;
  disclaimer?: string;
  source?: 'gemini' | 'manual' | 'demo';
  micronutrients?: {
    sodium_mg: number;
    potassium_mg: number;
    calcium_mg: number;
    iron_mg: number;
    vitamin_c_mg: number;
  };
  isDemoMode: boolean;
  matchedFoodId?: string;
  analysisId?: string;
  timestamp?: string;
  previewImage?: string;
}

export interface FoodAnalysisRecord {
  id: string;
  userId: string;
  foodName: string;
  confidence: number;
  imageUrl?: string;
  servingSize: string;
  servingUnit: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  healthInsights: string[];
  createdAt: string;
}

export interface DashboardData {
  user: {
    name: string;
    calorieGoal: number;
    proteinGoal: number;
    carbsGoal: number;
    fatGoal: number;
    fiberGoal: number;
  };
  today: {
    date: string;
    consumed: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
    remainingCalories: number;
    progressPercent: number;
  };
  mealBreakdown: {
    breakfast: number;
    lunch: number;
    snacks: number;
    dinner: number;
  };
  last7Days: Array<{
    date: string;
    day: string;
    calories: number;
    target: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  last30Days: Array<{
    date: string;
    label: string;
    calories: number;
    target: number;
  }>;
  insights: Array<{
    id: string;
    type: 'success' | 'warning' | 'info';
    title: string;
    message: string;
    icon: string;
  }>;
  recentMeals: MealEntry[];
}

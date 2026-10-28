import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { FoodItem, INITIAL_FOODS } from '../data/foods';


export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Plain/hashed for demo
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active';
  calorieGoal: number;
  proteinGoal: number; // g
  carbsGoal: number; // g
  fatGoal: number; // g
  fiberGoal: number; // g
  createdAt: string;
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
  date: string; // YYYY-MM-DD
  createdAt: string;
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
  category?: string;
  estimatedGrams?: number;
  source?: 'gemini' | 'manual' | 'demo';
  foods?: any[];
  disclaimer?: string;
  createdAt: string;
}

interface DatabaseSchema {
  users: User[];
  foods: FoodItem[];
  mealEntries: MealEntry[];
  analyses: FoodAnalysisRecord[];
}

const require = createRequire(import.meta.url);
let seedStoreData: DatabaseSchema | null = null;
try {
  seedStoreData = require('../data/store.json');
} catch {
  // If require fails or in non-Node environment, fallback will use getInitialData()
}

const IS_VERCEL = Boolean(process.env.VERCEL);
const ORIGINAL_DB_PATH = path.join(process.cwd(), 'server', 'data', 'store.json');
const DB_PATH = IS_VERCEL ? path.join('/tmp', 'store.json') : ORIGINAL_DB_PATH;

// Calculate BMR using Mifflin-St Jeor
export function calculateBMR(weight: number, height: number, age: number, gender: string): number {
  if (gender === 'female') {
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  }
  return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
}

// Calculate TDEE based on activity level
export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers: Record<string, number> = {
    'Sedentary': 1.2,
    'Lightly Active': 1.375,
    'Moderately Active': 1.55,
    'Very Active': 1.725,
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.375));
}

// Helper for date formatting YYYY-MM-DD
export function getFormattedDate(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

class Store {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private getInitialData(): DatabaseSchema {
    const today = getFormattedDate(0);
    const day1 = getFormattedDate(-1);
    const day2 = getFormattedDate(-2);
    const day3 = getFormattedDate(-3);
    const day4 = getFormattedDate(-4);
    const day5 = getFormattedDate(-5);
    const day6 = getFormattedDate(-6);

    const demoUser: User = {
      id: 'usr-demo-01',
      name: 'Aditya Verma',
      email: 'demo@smartnutrition.ai',
      password: 'password123',
      age: 22,
      gender: 'male',
      height: 175,
      weight: 68,
      activityLevel: 'Moderately Active',
      calorieGoal: 2000,
      proteinGoal: 120,
      carbsGoal: 250,
      fatGoal: 65,
      fiberGoal: 30,
      createdAt: new Date().toISOString(),
    };

    const sampleMeals: MealEntry[] = [
      // Today: Breakfast
      {
        id: 'meal-td-1',
        userId: demoUser.id,
        foodId: 'food-idli',
        foodName: 'Idli',
        mealType: 'breakfast',
        quantity: 2,
        servingUnit: 'piece',
        calories: 116,
        protein: 4.2,
        carbs: 24.0,
        fat: 0.8,
        fiber: 2.4,
        date: today,
        createdAt: `${today}T08:30:00Z`,
      },
      {
        id: 'meal-td-2',
        userId: demoUser.id,
        foodId: 'food-sambar',
        foodName: 'Sambar',
        mealType: 'breakfast',
        quantity: 1,
        servingUnit: 'bowl',
        calories: 130,
        protein: 5.2,
        carbs: 19.5,
        fat: 3.5,
        fiber: 4.2,
        date: today,
        createdAt: `${today}T08:32:00Z`,
      },
      // Today: Lunch
      {
        id: 'meal-td-3',
        userId: demoUser.id,
        foodId: 'food-chicken-biryani',
        foodName: 'Chicken Biryani',
        mealType: 'lunch',
        quantity: 1,
        servingUnit: 'plate',
        calories: 520,
        protein: 28.0,
        carbs: 62.0,
        fat: 18.0,
        fiber: 4.0,
        date: today,
        createdAt: `${today}T13:15:00Z`,
      },
      {
        id: 'meal-td-4',
        userId: demoUser.id,
        foodId: 'food-curd',
        foodName: 'Curd',
        mealType: 'lunch',
        quantity: 1,
        servingUnit: 'cup',
        calories: 98,
        protein: 4.5,
        carbs: 5.2,
        fat: 4.8,
        fiber: 0.0,
        date: today,
        createdAt: `${today}T13:20:00Z`,
      },
      // Today: Snacks
      {
        id: 'meal-td-5',
        userId: demoUser.id,
        foodId: 'food-apple',
        foodName: 'Apple',
        mealType: 'snacks',
        quantity: 1,
        servingUnit: 'piece',
        calories: 95,
        protein: 0.5,
        carbs: 25.0,
        fat: 0.3,
        fiber: 4.4,
        date: today,
        createdAt: `${today}T16:45:00Z`,
      },
      {
        id: 'meal-td-6',
        userId: demoUser.id,
        foodId: 'food-tea',
        foodName: 'Tea',
        mealType: 'snacks',
        quantity: 1,
        servingUnit: 'cup',
        calories: 60,
        protein: 2.2,
        carbs: 8.5,
        fat: 1.8,
        fiber: 0.0,
        date: today,
        createdAt: `${today}T16:50:00Z`,
      },
      // Today: Dinner
      {
        id: 'meal-td-7',
        userId: demoUser.id,
        foodId: 'food-chapati',
        foodName: 'Chapati',
        mealType: 'dinner',
        quantity: 2,
        servingUnit: 'piece',
        calories: 208,
        protein: 6.8,
        carbs: 40.4,
        fat: 2.4,
        fiber: 5.6,
        date: today,
        createdAt: `${today}T20:10:00Z`,
      },
      {
        id: 'meal-td-8',
        userId: demoUser.id,
        foodId: 'food-paneer-butter-masala',
        foodName: 'Paneer Butter Masala',
        mealType: 'dinner',
        quantity: 1,
        servingUnit: 'bowl',
        calories: 380,
        protein: 14.5,
        carbs: 16.0,
        fat: 29.0,
        fiber: 2.8,
        date: today,
        createdAt: `${today}T20:15:00Z`,
      },

      // Previous days for charts
      { id: 'm-p1', userId: demoUser.id, foodName: 'Veg Meals', mealType: 'lunch', quantity: 1, servingUnit: 'plate', calories: 640, protein: 18.5, carbs: 110, fat: 14, fiber: 12, date: day1, createdAt: `${day1}T13:00:00Z` },
      { id: 'm-p2', userId: demoUser.id, foodName: 'Omelette & Bread', mealType: 'breakfast', quantity: 1, servingUnit: 'plate', calories: 350, protein: 18, carbs: 28, fat: 16, fiber: 2, date: day1, createdAt: `${day1}T08:30:00Z` },
      { id: 'm-p3', userId: demoUser.id, foodName: 'Chicken Curry & Rice', mealType: 'dinner', quantity: 1, servingUnit: 'plate', calories: 580, protein: 32, carbs: 65, fat: 18, fiber: 3, date: day1, createdAt: `${day1}T20:00:00Z` },
      { id: 'm-p4', userId: demoUser.id, foodName: 'Fruits & Nuts', mealType: 'snacks', quantity: 1, servingUnit: 'bowl', calories: 220, protein: 5, carbs: 32, fat: 8, fiber: 5, date: day1, createdAt: `${day1}T16:30:00Z` },

      { id: 'm-p5', userId: demoUser.id, foodName: 'Masala Dosa', mealType: 'breakfast', quantity: 1, servingUnit: 'piece', calories: 285, protein: 5.5, carbs: 42, fat: 10.5, fiber: 3.5, date: day2, createdAt: `${day2}T08:45:00Z` },
      { id: 'm-p6', userId: demoUser.id, foodName: 'Mutton Biryani', mealType: 'lunch', quantity: 1, servingUnit: 'plate', calories: 610, protein: 32, carbs: 60, fat: 26, fiber: 3.8, date: day2, createdAt: `${day2}T13:30:00Z` },
      { id: 'm-p7', userId: demoUser.id, foodName: 'Salad & Soup', mealType: 'dinner', quantity: 1, servingUnit: 'bowl', calories: 290, protein: 8, carbs: 38, fat: 9, fiber: 6, date: day2, createdAt: `${day2}T19:45:00Z` },
      { id: 'm-p8', userId: demoUser.id, foodName: 'Banana & Milk', mealType: 'snacks', quantity: 1, servingUnit: 'serving', calories: 227, protein: 7.5, carbs: 36.6, fat: 6.9, fiber: 3.1, date: day2, createdAt: `${day2}T17:00:00Z` },

      { id: 'm-p9', userId: demoUser.id, foodName: 'Idli & Sambar', mealType: 'breakfast', quantity: 2, servingUnit: 'portion', calories: 246, protein: 9.4, carbs: 43.5, fat: 4.3, fiber: 6.6, date: day3, createdAt: `${day3}T08:30:00Z` },
      { id: 'm-p10', userId: demoUser.id, foodName: 'Chicken Biryani', mealType: 'lunch', quantity: 1, servingUnit: 'plate', calories: 520, protein: 28, carbs: 62, fat: 18, fiber: 4, date: day3, createdAt: `${day3}T13:00:00Z` },
      { id: 'm-p11', userId: demoUser.id, foodName: 'Chapati & Dal', mealType: 'dinner', quantity: 1, servingUnit: 'plate', calories: 420, protein: 16, carbs: 62, fat: 8, fiber: 8, date: day3, createdAt: `${day3}T20:30:00Z` },

      { id: 'm-p12', userId: demoUser.id, foodName: 'Pongal & Vada', mealType: 'breakfast', quantity: 1, servingUnit: 'plate', calories: 365, protein: 10.7, carbs: 49, fat: 14.6, fiber: 4.9, date: day4, createdAt: `${day4}T09:00:00Z` },
      { id: 'm-p13', userId: demoUser.id, foodName: 'Burger & French Fries', mealType: 'lunch', quantity: 1, servingUnit: 'combo', calories: 805, protein: 25, carbs: 90, fat: 39, fiber: 6.8, date: day4, createdAt: `${day4}T13:30:00Z` },
      { id: 'm-p14', userId: demoUser.id, foodName: 'Upma', mealType: 'dinner', quantity: 1, servingUnit: 'bowl', calories: 260, protein: 6, carbs: 40, fat: 8, fiber: 3.2, date: day4, createdAt: `${day4}T20:00:00Z` },

      { id: 'm-p15', userId: demoUser.id, foodName: 'Boiled Eggs & Toast', mealType: 'breakfast', quantity: 2, servingUnit: 'plate', calories: 320, protein: 18, carbs: 26, fat: 14, fiber: 2.2, date: day5, createdAt: `${day5}T08:15:00Z` },
      { id: 'm-p16', userId: demoUser.id, foodName: 'Lemon Rice & Curd', mealType: 'lunch', quantity: 1, servingUnit: 'bowl', calories: 343, protein: 9, carbs: 49.2, fat: 10.8, fiber: 1.8, date: day5, createdAt: `${day5}T13:15:00Z` },
      { id: 'm-p17', userId: demoUser.id, foodName: 'Chicken Curry & Chapati', mealType: 'dinner', quantity: 1, servingUnit: 'plate', calories: 483, protein: 32.8, carbs: 47.9, fat: 16.7, fiber: 4.6, date: day5, createdAt: `${day5}T20:15:00Z` },

      { id: 'm-p18', userId: demoUser.id, foodName: 'Oats & Banana', mealType: 'breakfast', quantity: 1, servingUnit: 'bowl', calories: 280, protein: 8, carbs: 54, fat: 4.5, fiber: 6.2, date: day6, createdAt: `${day6}T08:30:00Z` },
      { id: 'm-p19', userId: demoUser.id, foodName: 'Veg Meals', mealType: 'lunch', quantity: 1, servingUnit: 'plate', calories: 640, protein: 18.5, carbs: 110, fat: 14, fiber: 12, date: day6, createdAt: `${day6}T13:00:00Z` },
      { id: 'm-p20', userId: demoUser.id, foodName: 'Paneer Wrap', mealType: 'dinner', quantity: 1, servingUnit: 'piece', calories: 410, protein: 19, carbs: 38, fat: 20, fiber: 4, date: day6, createdAt: `${day6}T20:00:00Z` },
    ];

    const sampleAnalyses: FoodAnalysisRecord[] = [
      {
        id: 'an-demo-1',
        userId: demoUser.id,
        foodName: 'Chicken Biryani',
        confidence: 0.92,
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
        servingSize: '1 plate',
        servingUnit: 'plate',
        quantity: 1,
        calories: 520,
        protein: 28,
        carbs: 62,
        fat: 18,
        fiber: 4,
        healthInsights: [
          'Rich in high-quality lean protein from chicken.',
          'Basmati rice provides sustained complex carbohydrates.',
          'Contains turmeric and ginger with natural antioxidant properties.'
        ],
        createdAt: `${today}T13:10:00Z`,
      },
      {
        id: 'an-demo-2',
        userId: demoUser.id,
        foodName: 'Masala Dosa',
        confidence: 0.95,
        imageUrl: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&auto=format&fit=crop&q=80',
        servingSize: '1 piece',
        servingUnit: 'piece',
        quantity: 1,
        calories: 285,
        protein: 5.5,
        carbs: 42,
        fat: 10.5,
        fiber: 3.5,
        healthInsights: [
          'Naturally fermented batter aids beneficial gut microbiota.',
          'Potato filling contains bioavailable vitamin C and potassium.',
          'Pair with high-protein sambar to boost amino acid profile.'
        ],
        createdAt: `${day1}T08:40:00Z`,
      },
      {
        id: 'an-demo-3',
        userId: demoUser.id,
        foodName: 'Apple',
        confidence: 0.98,
        imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80',
        servingSize: '1 piece',
        servingUnit: 'piece',
        quantity: 1,
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3,
        fiber: 4.4,
        healthInsights: [
          'High in soluble pectin fiber to assist cardiovascular balance.',
          'Low glycemic load prevents acute blood sugar spikes.',
          'Great clean snack before physical or cognitive activity.'
        ],
        createdAt: `${day2}T16:20:00Z`,
      }
    ];

    return {
      users: [demoUser],
      foods: INITIAL_FOODS,
      mealEntries: sampleMeals,
      analyses: sampleAnalyses,
    };
  }

  private load(): DatabaseSchema {
    try {
      if (IS_VERCEL && !fs.existsSync(DB_PATH)) {
        if (seedStoreData) {
          try {
            const dir = path.dirname(DB_PATH);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(DB_PATH, JSON.stringify(seedStoreData, null, 2), 'utf-8');
            return seedStoreData;
          } catch (writeErr) {
            console.warn('Could not write seed data to /tmp:', writeErr);
            return seedStoreData;
          }
        } else if (fs.existsSync(ORIGINAL_DB_PATH)) {
          try {
            fs.copyFileSync(ORIGINAL_DB_PATH, DB_PATH);
          } catch (copyErr) {
            console.warn('Could not copy store to /tmp:', copyErr);
          }
        }
      }

      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(raw);
      }

      if (fs.existsSync(ORIGINAL_DB_PATH)) {
        const raw = fs.readFileSync(ORIGINAL_DB_PATH, 'utf-8');
        return JSON.parse(raw);
      }

      if (seedStoreData) {
        return seedStoreData;
      }
    } catch (e) {
      console.warn('Failed to load store from disk, initializing fresh:', e);
    }
    const initial = this.getInitialData();
    this.save(initial);
    return initial;
  }

  private save(data: DatabaseSchema): void {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Error persisting database (in-memory state preserved):', e);
    }
  }

  public resetDemoData(): DatabaseSchema {
    this.data = this.getInitialData();
    this.save(this.data);
    return this.data;
  }

  // User operations
  public getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: User): User {
    this.data.users.push(user);
    this.save(this.data);
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save(this.data);
    return this.data.users[idx];
  }

  // Food operations
  public getFoods(category?: string, search?: string): FoodItem[] {
    let list = this.data.foods;
    if (category && category !== 'All') {
      list = list.filter((f) => f.category === category);
    }
    if (search && search.trim().length > 0) {
      const q = search.trim().toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q));
    }
    return list;
  }

  public getFoodById(id: string): FoodItem | undefined {
    return this.data.foods.find((f) => f.id === id);
  }

  // Meal operations
  public getMealsByUserAndDate(userId: string, date: string): MealEntry[] {
    return this.data.mealEntries.filter((m) => m.userId === userId && m.date === date);
  }

  public getAllMealsByUser(userId: string): MealEntry[] {
    return this.data.mealEntries.filter((m) => m.userId === userId);
  }

  public addMealEntry(entry: MealEntry): MealEntry {
    this.data.mealEntries.unshift(entry);
    this.save(this.data);
    return entry;
  }

  public updateMealQuantity(id: string, quantity: number): MealEntry | undefined {
    const meal = this.data.mealEntries.find((m) => m.id === id);
    if (!meal || quantity <= 0) return undefined;
    const ratio = quantity / meal.quantity;
    meal.quantity = quantity;
    meal.calories = Math.round(meal.calories * ratio);
    meal.protein = Math.round(meal.protein * ratio * 10) / 10;
    meal.carbs = Math.round(meal.carbs * ratio * 10) / 10;
    meal.fat = Math.round(meal.fat * ratio * 10) / 10;
    meal.fiber = Math.round(meal.fiber * ratio * 10) / 10;
    this.save(this.data);
    return meal;
  }

  public deleteMealEntry(id: string): boolean {
    const initLen = this.data.mealEntries.length;
    this.data.mealEntries = this.data.mealEntries.filter((m) => m.id !== id);
    if (this.data.mealEntries.length !== initLen) {
      this.save(this.data);
      return true;
    }
    return false;
  }

  // Analysis history
  public getAnalysesByUser(userId: string): FoodAnalysisRecord[] {
    return this.data.analyses.filter((a) => a.userId === userId);
  }

  public addAnalysis(analysis: FoodAnalysisRecord): FoodAnalysisRecord {
    this.data.analyses.unshift(analysis);
    this.save(this.data);
    return analysis;
  }
}

export const db = new Store();

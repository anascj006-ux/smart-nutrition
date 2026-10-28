import path from 'path';
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, calculateBMR, calculateTDEE, getFormattedDate, User, MealEntry, FoodAnalysisRecord } from './services/db';
import { analyzeFoodWithGemini, analyzeFoodNameWithGemini } from './services/geminiService';
import nutritionRouter from './routes/nutrition';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and generous JSON body size for base64 food images
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve static food images
app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));

// Normalize /api prefix if Vercel serverless function strips it
app.use((req, _res, next) => {
  if (!req.url.startsWith('/api') && !req.url.startsWith('/images')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  next();
});

// Root API status endpoint
app.get(['/api', '/api/'], (req: Request, res: Response) => {
  res.json({
    name: 'Smart Nutrition & Calorie Estimator API',
    status: 'online',
    version: '1.0.0',
    primaryEngine: 'Google Gemini API',
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    endpoints: [
      '/api/health',
      '/api/foods',
      '/api/meals/today',
      '/api/gemini/status',
      '/api/dashboard',
      '/api/profile',
      '/api/history'
    ],
  });
});

// Mount Gemini Nutrition Router
app.use('/api/gemini', nutritionRouter);

// Helper to extract user ID from header or fallback to demo user
function getActiveUserId(req: Request): string {
  const headerUserId = req.headers['x-user-id'] as string;
  if (headerUserId) return headerUserId;
  const demo = db.getUserByEmail('demo@smartnutrition.ai');
  return demo ? demo.id : 'usr-demo-01';
}

// --- HEALTH & STATUS ---
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    primaryEngine: 'Google Gemini API',
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    demoModeFallback: process.env.DEMO_MODE === 'true',
    totalFoodsInDatabase: db.getFoods().length,
  });
});

// --- AUTHENTICATION ---
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    const demo = db.getUserByEmail('demo@smartnutrition.ai');
    return res.json({ user: demo, token: 'demo-jwt-token-xyz' });
  }

  const user = db.getUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password. You can try the demo account!' });
  }

  res.json({ user, token: `auth-token-${user.id}` });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, age = 22, gender = 'male', height = 175, weight = 70, activityLevel = 'Moderately Active' } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'User with this email already exists.' });
  }

  const bmr = calculateBMR(Number(weight), Number(height), Number(age), gender);
  const tdee = calculateTDEE(bmr, activityLevel);

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name,
    email,
    password,
    age: Number(age),
    gender,
    height: Number(height),
    weight: Number(weight),
    activityLevel,
    calorieGoal: tdee,
    proteinGoal: Math.round(Number(weight) * 1.6), // ~1.6g per kg
    carbsGoal: Math.round((tdee * 0.5) / 4), // 50% calories from carbs
    fatGoal: Math.round((tdee * 0.25) / 9), // 25% calories from fat
    fiberGoal: 30,
    createdAt: new Date().toISOString(),
  };

  db.createUser(newUser);
  res.status(201).json({ user: newUser, token: `auth-token-${newUser.id}` });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const user = db.getUserById(userId) || db.getUserByEmail('demo@smartnutrition.ai');
  res.json({ user });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// --- FOOD ANALYSIS & AI RECOGNITION (PRIMARY GEMINI ENGINE) ---
app.post('/api/analyze-food', async (req: Request, res: Response) => {
  try {
    const { image, foodName, forceDemo } = req.body;

    if (!image && (!foodName || foodName.trim().length === 0)) {
      return res.status(400).json({ error: 'Please provide either a food image or food name to analyze.' });
    }

    let analysis;
    if (image) {
      analysis = await analyzeFoodWithGemini(image, { forceDemo, hintFoodName: foodName });
    } else {
      analysis = await analyzeFoodNameWithGemini(foodName, { forceDemo });
    }

    const userId = getActiveUserId(req);
    const primaryFood = analysis.foods[0];

    const savedRecord: FoodAnalysisRecord = {
      id: `an-${Date.now()}`,
      userId,
      foodName: primaryFood.name,
      category: primaryFood.category,
      confidence: analysis.overallConfidence,
      imageUrl: image && image.length < 500000 ? image : undefined,
      servingSize: `${primaryFood.serving.amount} ${primaryFood.serving.unit}`,
      servingUnit: primaryFood.serving.unit,
      quantity: primaryFood.serving.amount,
      estimatedGrams: primaryFood.serving.estimatedGrams,
      calories: analysis.totalNutrition.calories,
      protein: analysis.totalNutrition.protein,
      carbs: analysis.totalNutrition.carbohydrates,
      fat: analysis.totalNutrition.fat,
      fiber: analysis.totalNutrition.fiber,
      healthInsights: analysis.healthInsights || [],
      source: analysis.source,
      foods: analysis.foods,
      disclaimer: analysis.disclaimer,
      createdAt: new Date().toISOString(),
    };

    db.addAnalysis(savedRecord);

    res.json({
      success: true,
      foodName: primaryFood.name,
      confidence: analysis.overallConfidence,
      servingSize: `${primaryFood.serving.amount} ${primaryFood.serving.unit}`,
      servingUnit: primaryFood.serving.unit,
      quantity: primaryFood.serving.amount,
      estimatedGrams: primaryFood.serving.estimatedGrams,
      calories: analysis.totalNutrition.calories,
      protein: analysis.totalNutrition.protein,
      carbohydrates: analysis.totalNutrition.carbohydrates,
      fat: analysis.totalNutrition.fat,
      fiber: analysis.totalNutrition.fiber,
      category: primaryFood.category,
      description: `Analyzed via ${analysis.source === 'gemini' ? 'Google Gemini Vision AI' : analysis.source === 'manual' ? 'Gemini Text Analysis' : 'Demo AI Engine'}`,
      healthInsights: analysis.healthInsights,
      foods: analysis.foods,
      totalNutrition: analysis.totalNutrition,
      disclaimer: analysis.disclaimer,
      source: analysis.source,
      isDemoMode: analysis.source === 'demo',
      analysisId: savedRecord.id,
      timestamp: savedRecord.createdAt,
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error?.message || 'Failed to analyze food.' });
  }
});

// --- FOOD DATABASE ---
app.get('/api/foods', (req: Request, res: Response) => {
  const category = req.query.category as string;
  const search = req.query.search as string;
  const foods = db.getFoods(category, search);
  res.json({ foods, count: foods.length });
});

app.get('/api/foods/:id', (req: Request, res: Response) => {
  const food = db.getFoodById(req.params.id);
  if (!food) {
    return res.status(404).json({ error: 'Food item not found' });
  }
  res.json({ food });
});

// --- MEALS & TRACKING ---
app.get('/api/meals/today', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const targetDate = (req.query.date as string) || getFormattedDate(0);
  const meals = db.getMealsByUserAndDate(userId, targetDate);

  const grouped = {
    breakfast: meals.filter((m) => m.mealType === 'breakfast'),
    lunch: meals.filter((m) => m.mealType === 'lunch'),
    snacks: meals.filter((m) => m.mealType === 'snacks'),
    dinner: meals.filter((m) => m.mealType === 'dinner'),
  };

  const totals = meals.reduce(
    (acc, m) => {
      acc.calories += m.calories;
      acc.protein += m.protein;
      acc.carbs += m.carbs;
      acc.fat += m.fat;
      acc.fiber += m.fiber;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  totals.protein = Math.round(totals.protein * 10) / 10;
  totals.carbs = Math.round(totals.carbs * 10) / 10;
  totals.fat = Math.round(totals.fat * 10) / 10;
  totals.fiber = Math.round(totals.fiber * 10) / 10;

  res.json({
    date: targetDate,
    meals: grouped,
    totals,
    itemCount: meals.length,
  });
});

app.post('/api/meals', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const {
    foodId,
    foodName,
    mealType = 'lunch',
    quantity = 1,
    servingUnit = 'serving',
    calories,
    protein,
    carbs,
    fat,
    fiber = 0,
    date = getFormattedDate(0),
  } = req.body;

  if (!foodName || calories === undefined) {
    return res.status(400).json({ error: 'foodName and calories are required.' });
  }

  const newEntry: MealEntry = {
    id: `meal-${Date.now()}`,
    userId,
    foodId,
    foodName,
    mealType,
    quantity: Number(quantity),
    servingUnit,
    calories: Math.round(Number(calories)),
    protein: Math.round(Number(protein || 0) * 10) / 10,
    carbs: Math.round(Number(carbs || 0) * 10) / 10,
    fat: Math.round(Number(fat || 0) * 10) / 10,
    fiber: Math.round(Number(fiber || 0) * 10) / 10,
    date,
    createdAt: new Date().toISOString(),
  };

  db.addMealEntry(newEntry);
  res.status(201).json({ meal: newEntry });
});

app.patch('/api/meals/:id', (req: Request, res: Response) => {
  const { quantity } = req.body;
  if (!quantity || Number(quantity) <= 0) {
    return res.status(400).json({ error: 'Valid quantity is required' });
  }

  const updated = db.updateMealQuantity(req.params.id, Number(quantity));
  if (!updated) {
    return res.status(404).json({ error: 'Meal entry not found' });
  }
  res.json({ meal: updated });
});

app.delete('/api/meals/:id', (req: Request, res: Response) => {
  const success = db.deleteMealEntry(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Meal entry not found' });
  }
  res.json({ success: true, message: 'Meal entry deleted' });
});

// --- DASHBOARD & INSIGHTS ---
app.get('/api/dashboard', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const user = db.getUserById(userId) || db.getUserByEmail('demo@smartnutrition.ai')!;
  const today = getFormattedDate(0);
  const todayMeals = db.getMealsByUserAndDate(userId, today);

  const consumed = todayMeals.reduce(
    (acc, m) => {
      acc.calories += m.calories;
      acc.protein += m.protein;
      acc.carbs += m.carbs;
      acc.fat += m.fat;
      acc.fiber += m.fiber;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  consumed.protein = Math.round(consumed.protein * 10) / 10;
  consumed.carbs = Math.round(consumed.carbs * 10) / 10;
  consumed.fat = Math.round(consumed.fat * 10) / 10;
  consumed.fiber = Math.round(consumed.fiber * 10) / 10;

  const remainingCalories = Math.max(0, user.calorieGoal - consumed.calories);

  // Generate 7-day trend
  const allMeals = db.getAllMealsByUser(userId);
  const last7DaysData = [];
  for (let i = 6; i >= 0; i--) {
    const d = getFormattedDate(-i);
    const dayMeals = allMeals.filter((m) => m.date === d);
    const dayTotals = dayMeals.reduce(
      (acc, m) => {
        acc.calories += m.calories;
        acc.protein += m.protein;
        acc.carbs += m.carbs;
        acc.fat += m.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const dayName = new Date(d).toLocaleDateString('en-US', { weekday: 'short' });
    last7DaysData.push({
      date: d,
      day: dayName,
      calories: dayTotals.calories,
      target: user.calorieGoal,
      protein: Math.round(dayTotals.protein),
      carbs: Math.round(dayTotals.carbs),
      fat: Math.round(dayTotals.fat),
    });
  }

  // Generate 30-day overview trend
  const last30DaysData = [];
  for (let i = 29; i >= 0; i -= 2) {
    const d = getFormattedDate(-i);
    const dayMeals = allMeals.filter((m) => m.date === d);
    const dayCalories = dayMeals.reduce((sum, m) => sum + m.calories, 0);
    last30DaysData.push({
      date: d,
      label: d.substring(5), // MM-DD
      calories: dayCalories > 0 ? dayCalories : Math.round(user.calorieGoal * (0.85 + Math.sin(i) * 0.15)),
      target: user.calorieGoal,
    });
  }

  // Meal breakdown for today
  const mealBreakdown = {
    breakfast: todayMeals.filter((m) => m.mealType === 'breakfast').reduce((s, m) => s + m.calories, 0),
    lunch: todayMeals.filter((m) => m.mealType === 'lunch').reduce((s, m) => s + m.calories, 0),
    snacks: todayMeals.filter((m) => m.mealType === 'snacks').reduce((s, m) => s + m.calories, 0),
    dinner: todayMeals.filter((m) => m.mealType === 'dinner').reduce((s, m) => s + m.calories, 0),
  };

  // Rule-based friendly intelligent recommendations
  const insights = [];
  if (consumed.protein < user.proteinGoal * 0.7) {
    insights.push({
      id: 'ins-protein',
      type: 'warning',
      title: 'Protein Intake Below Target',
      message: `You've consumed ${consumed.protein}g of your ${user.proteinGoal}g goal. Consider adding boiled eggs, paneer, chicken, or lentils to your next meal.`,
      icon: 'protein',
    });
  } else {
    insights.push({
      id: 'ins-protein-good',
      type: 'success',
      title: 'Strong Protein Intake',
      message: `You've hit ${Math.round((consumed.protein / user.proteinGoal) * 100)}% of your daily protein target! Great for muscle recovery and metabolic rate.`,
      icon: 'check',
    });
  }

  if (consumed.calories > user.calorieGoal * 0.95 && consumed.calories <= user.calorieGoal * 1.05) {
    insights.push({
      id: 'ins-cal-target',
      type: 'success',
      title: 'Calorie Goal On Track',
      message: `You are right at your daily energy balance target (${consumed.calories} / ${user.calorieGoal} kcal).`,
      icon: 'target',
    });
  } else if (remainingCalories < 300 && remainingCalories > 0) {
    insights.push({
      id: 'ins-cal-close',
      type: 'info',
      title: 'Close to Daily Goal',
      message: `You have ${remainingCalories} kcal remaining today. A light snack or fresh fruit will keep you perfectly balanced.`,
      icon: 'flame',
    });
  } else if (consumed.calories > user.calorieGoal) {
    insights.push({
      id: 'ins-cal-over',
      type: 'warning',
      title: 'Calorie Limit Reached',
      message: `You have exceeded your target by ${consumed.calories - user.calorieGoal} kcal. Staying hydrated and taking an evening walk helps balance surplus days.`,
      icon: 'alert',
    });
  }

  if (consumed.fiber < user.fiberGoal * 0.6) {
    insights.push({
      id: 'ins-fiber',
      type: 'info',
      title: 'Boost Your Dietary Fiber',
      message: `Your fiber intake is currently ${consumed.fiber}g (target: ${user.fiberGoal}g). Whole fruits like apples or leafy salads will support healthy digestion.`,
      icon: 'leaf',
    });
  }

  res.json({
    user: {
      name: user.name,
      calorieGoal: user.calorieGoal,
      proteinGoal: user.proteinGoal,
      carbsGoal: user.carbsGoal,
      fatGoal: user.fatGoal,
      fiberGoal: user.fiberGoal,
    },
    today: {
      date: today,
      consumed,
      remainingCalories,
      progressPercent: Math.min(100, Math.round((consumed.calories / user.calorieGoal) * 100)),
    },
    mealBreakdown,
    last7Days: last7DaysData,
    last30Days: last30DaysData,
    insights,
    recentMeals: todayMeals.slice(0, 5),
  });
});

// --- NUTRITION HISTORY ---
app.get('/api/history', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const search = (req.query.search as string || '').toLowerCase();
  const mealType = req.query.mealType as string;
  const sort = (req.query.sort as string) || 'desc';

  let meals = db.getAllMealsByUser(userId);

  if (search) {
    meals = meals.filter((m) => m.foodName.toLowerCase().includes(search));
  }
  if (mealType && mealType !== 'all') {
    meals = meals.filter((m) => m.mealType === mealType);
  }

  meals.sort((a, b) => {
    return sort === 'asc' 
      ? new Date(a.date).getTime() - new Date(b.date).getTime() 
      : new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const analyses = db.getAnalysesByUser(userId);

  res.json({
    meals,
    analyses,
    totalLogged: meals.length,
  });
});

// --- USER PROFILE & BMR/TDEE ---
app.get('/api/profile', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const user = db.getUserById(userId) || db.getUserByEmail('demo@smartnutrition.ai')!;
  
  const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
  const tdee = calculateTDEE(bmr, user.activityLevel);

  res.json({
    user,
    calculations: {
      bmr,
      tdee,
      recommendedCalories: tdee,
      formula: 'Mifflin-St Jeor Equation',
      disclaimer: 'This estimation is provided strictly for educational and informational purposes and does not constitute clinical or medical advice.',
    },
  });
});

app.post('/api/profile', (req: Request, res: Response) => {
  const userId = getActiveUserId(req);
  const { name, age, gender, height, weight, activityLevel, calorieGoal } = req.body;

  const updates: Partial<User> = {};
  if (name) updates.name = name;
  if (age) updates.age = Number(age);
  if (gender) updates.gender = gender;
  if (height) updates.height = Number(height);
  if (weight) updates.weight = Number(weight);
  if (activityLevel) updates.activityLevel = activityLevel;

  const currentUser = db.getUserById(userId) || db.getUserByEmail('demo@smartnutrition.ai')!;
  const effWeight = updates.weight || currentUser.weight;
  const effHeight = updates.height || currentUser.height;
  const effAge = updates.age || currentUser.age;
  const effGender = updates.gender || currentUser.gender;
  const effActivity = updates.activityLevel || currentUser.activityLevel;

  const bmr = calculateBMR(effWeight, effHeight, effAge, effGender);
  const tdee = calculateTDEE(bmr, effActivity);

  updates.calorieGoal = calorieGoal ? Number(calorieGoal) : tdee;
  updates.proteinGoal = Math.round(effWeight * 1.6);
  updates.carbsGoal = Math.round((updates.calorieGoal * 0.5) / 4);
  updates.fatGoal = Math.round((updates.calorieGoal * 0.25) / 9);

  const updated = db.updateUser(userId, updates);
  res.json({ user: updated, calculations: { bmr, tdee } });
});

// --- SETTINGS / RESET DEMO ---
app.post('/api/settings/reset-demo', (req: Request, res: Response) => {
  db.resetDemoData();
  res.json({ success: true, message: 'Sample demo database restored to default fresh state.' });
});

// Global error handling middleware
app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error('API Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err?.message || String(err),
  });
});

if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Smart Nutrition & Calorie Estimator API server running on http://localhost:${PORT}`);
  });
}

export default app;
export { app };

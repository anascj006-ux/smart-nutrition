import { Router, Request, Response } from 'express';
import { analyzeFoodWithGemini, analyzeFoodNameWithGemini, GeminiNutritionResponse } from '../services/geminiService';
import { db, FoodAnalysisRecord } from '../services/db';

const router = Router();

function getActiveUserId(req: Request): string {
  const headerUserId = req.headers['x-user-id'] as string;
  if (headerUserId) return headerUserId;
  const demo = db.getUserByEmail('demo@smartnutrition.ai');
  return demo ? demo.id : 'usr-demo-01';
}

/**
 * GET /api/gemini/status
 * Health check & configuration status for Gemini AI
 */
router.get('/status', (req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  const currentModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const isDemo = process.env.DEMO_MODE === 'true';

  res.json({
    success: true,
    configured: hasKey,
    model: currentModel,
    demoMode: isDemo,
    supportedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxUploadSizeMB: 15,
  });
});

/**
 * POST /api/gemini/analyze-food
 * Primary multimodal image recognition via Google Gemini API
 */
router.post('/analyze-food', async (req: Request, res: Response) => {
  try {
    const { image, model, forceDemo, foodName } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a food image or choose a sample to analyze.',
      });
    }

    // Call Gemini Service
    const analysis: GeminiNutritionResponse = await analyzeFoodWithGemini(image, {
      model,
      forceDemo: forceDemo === true,
      hintFoodName: foodName,
    });

    // Save record to database for historical audit logging
    const userId = getActiveUserId(req);
    const primaryFood = analysis.foods[0] || {
      name: 'Chicken Biryani',
      category: 'Indian Food',
      confidence: 0.92,
      serving: { amount: 1, unit: 'plate', estimatedGrams: 350 },
      nutrition: { calories: 520, protein: 28, carbohydrates: 62, fat: 18, fiber: 4 },
    };

    const savedRecord: FoodAnalysisRecord = {
      id: `an-${Date.now()}`,
      userId,
      foodName: primaryFood.name,
      category: primaryFood.category,
      confidence: analysis.overallConfidence,
      imageUrl: image.length < 500000 ? image : undefined,
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
      ...analysis,
      analysisId: savedRecord.id,
      timestamp: savedRecord.createdAt,
    });
  } catch (error: any) {
    console.error('Gemini image analysis error:', error?.message || error);
    res.status(400).json({
      success: false,
      error: error?.message || 'Failed to analyze food image with Gemini AI.',
    });
  }
});

/**
 * POST /api/gemini/analyze-food-name
 * Text-based food name analysis via Google Gemini API
 */
router.post('/analyze-food-name', async (req: Request, res: Response) => {
  try {
    const { foodName, model, forceDemo } = req.body;

    if (!foodName || foodName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a food dish or item name.',
      });
    }

    const analysis: GeminiNutritionResponse = await analyzeFoodNameWithGemini(foodName, {
      model,
      forceDemo: forceDemo === true,
    });

    const userId = getActiveUserId(req);
    const primaryFood = analysis.foods[0];

    const savedRecord: FoodAnalysisRecord = {
      id: `an-${Date.now()}`,
      userId,
      foodName: primaryFood.name,
      category: primaryFood.category,
      confidence: analysis.overallConfidence,
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
      ...analysis,
      analysisId: savedRecord.id,
      timestamp: savedRecord.createdAt,
    });
  } catch (error: any) {
    console.error('Gemini text analysis error:', error?.message || error);
    res.status(400).json({
      success: false,
      error: error?.message || 'Failed to estimate nutrition for food name.',
    });
  }
});

export default router;

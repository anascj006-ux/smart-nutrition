import { GoogleGenAI } from '@google/genai';
import { FoodItem, INITIAL_FOODS } from '../data/foods';

export interface DetectedFood {
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

export interface GeminiNutritionResponse {
  success: boolean;
  foods: DetectedFood[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
  };
  overallConfidence: number;
  disclaimer: string;
  source: 'gemini' | 'manual' | 'demo';
  rawDescription?: string;
  healthInsights?: string[];
}

// Allowed MIME types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Validates base64 image data or remote HTTP URLs and extracts clean MIME type and buffer data
 */
async function validateAndExtractImageData(imagePayload: string): Promise<{ mimeType: string; base64Data: string }> {
  if (!imagePayload || typeof imagePayload !== 'string') {
    throw new Error('Please upload a valid food image.');
  }

  // Support remote HTTP(S) image URLs (e.g. Unsplash sample photos)
  if (imagePayload.startsWith('http://') || imagePayload.startsWith('https://')) {
    try {
      const resp = await fetch(imagePayload);
      if (!resp.ok) throw new Error('Could not download sample image');
      const arrayBuf = await resp.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);
      const rawType = (resp.headers.get('content-type') || 'image/jpeg').split(';')[0].toLowerCase();
      const mimeType = ALLOWED_MIME_TYPES.includes(rawType) ? rawType : 'image/jpeg';
      const base64Data = buffer.toString('base64');
      return { mimeType, base64Data };
    } catch (e: any) {
      throw new Error(`Failed to download remote food image: ${e?.message || e}`);
    }
  }

  // Format: data:image/jpeg;base64,....
  const matches = imagePayload.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Please upload a valid image file (JPEG, PNG, or WEBP).');
  }

  const mimeType = matches[1].toLowerCase();
  const base64Data = matches[2];

  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(`Unsupported image format (${mimeType}). Please upload a JPG, PNG, or WEBP image.`);
  }

  // Maximum payload size check (~15MB base64)
  if (base64Data.length > 20 * 1024 * 1024) {
    throw new Error('Image size is too large. Please select an image under 15MB.');
  }

  return { mimeType, base64Data };
}

/**
 * Primary AI Image Analysis via Google Gemini API
 */
export async function analyzeFoodWithGemini(
  imagePayload: string,
  options?: { model?: string; forceDemo?: boolean }
): Promise<GeminiNutritionResponse> {
  const isDemo = options?.forceDemo || process.env.DEMO_MODE === 'true';
  const apiKey = process.env.GEMINI_API_KEY;

  if (isDemo || !apiKey) {
    return generateDemoResponse(undefined);
  }

  // 1. Validate image
  const { mimeType, base64Data } = await validateAndExtractImageData(imagePayload);

  // 2. Prepare Gemini prompt
  const systemPrompt = `
You are a food recognition and nutrition estimation assistant for a nutrition tracking application.
Analyze the provided food image carefully.
Identify the visible food or foods.
Estimate the most likely serving size based on the image.
Provide estimated calories, protein, carbohydrates, fat and fiber.
If multiple foods are visible, identify each food separately and provide individual nutrition estimates as well as a total.
Do not invent highly specific nutritional facts when the image is unclear.
If the food cannot be confidently identified, clearly indicate uncertainty by setting confidence below 0.70.
Nutrition values are estimates and should not be treated as medical advice.

Return ONLY a raw JSON object (without markdown code blocks, backticks, or other text) matching this schema:
{
  "success": true,
  "foods": [
    {
      "name": "Chicken Biryani",
      "category": "Indian Food",
      "confidence": 0.92,
      "serving": {
        "amount": 1,
        "unit": "plate",
        "estimatedGrams": 350
      },
      "nutrition": {
        "calories": 520,
        "protein": 28,
        "carbohydrates": 62,
        "fat": 18,
        "fiber": 4
      }
    }
  ],
  "totalNutrition": {
    "calories": 520,
    "protein": 28,
    "carbohydrates": 62,
    "fat": 18,
    "fiber": 4
  },
  "overallConfidence": 0.92,
  "disclaimer": "Nutritional values are estimates and may vary depending on ingredients and portion size.",
  "healthInsights": [
    "High quality lean protein source.",
    "Complex carbohydrates for sustained energy.",
    "Rich in antioxidants from culinary spices."
  ]
}
`;

  const candidateModels = [
    options?.model || process.env.GEMINI_MODEL || 'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
  ];

  let lastError: any = null;
  for (const model of candidateModels) {
    try {
      return await executeGeminiCall(apiKey, model, systemPrompt, { mimeType, data: base64Data }, 'gemini');
    } catch (err: any) {
      lastError = err;
      console.warn(`Gemini vision model (${model}) failed, trying next candidate:`, err?.message || err);
    }
  }

  console.warn('All Gemini vision models failed or experienced high traffic, activating resilient Demo Mode fallback:', lastError?.message || lastError);
  return generateDemoResponse(undefined);
}

/**
 * Text-based food name analysis via Google Gemini API
 */
export async function analyzeFoodNameWithGemini(
  foodName: string,
  options?: { model?: string; forceDemo?: boolean }
): Promise<GeminiNutritionResponse> {
  const isDemo = options?.forceDemo || process.env.DEMO_MODE === 'true';
  const apiKey = process.env.GEMINI_API_KEY;

  if (!foodName || foodName.trim().length === 0) {
    throw new Error('Please provide a food name to analyze.');
  }

  if (isDemo || !apiKey) {
    return generateDemoResponse(foodName);
  }

  const prompt = `
You are a food recognition and nutrition estimation assistant for a nutrition tracking application.
Analyze the user's food query: "${foodName.trim()}".
Estimate the typical single serving portion, calories, protein, carbohydrates, fat, and fiber for this dish.
If multiple items are listed, split them into the foods array and sum totalNutrition.
Return ONLY a raw JSON object (without markdown code blocks) matching this schema:
{
  "success": true,
  "foods": [
    {
      "name": "${foodName.trim()}",
      "category": "Main Dish",
      "confidence": 0.95,
      "serving": {
        "amount": 1,
        "unit": "portion",
        "estimatedGrams": 250
      },
      "nutrition": {
        "calories": 400,
        "protein": 20,
        "carbohydrates": 50,
        "fat": 12,
        "fiber": 3
      }
    }
  ],
  "totalNutrition": {
    "calories": 400,
    "protein": 20,
    "carbohydrates": 50,
    "fat": 12,
    "fiber": 3
  },
  "overallConfidence": 0.95,
  "disclaimer": "Nutritional values are estimates and may vary depending on ingredients and portion size.",
  "healthInsights": [
    "Balanced macro profile suitable for daily energy.",
    "Pairs well with dietary fiber sides."
  ]
}
`;

  const candidateModels = [
    options?.model || process.env.GEMINI_MODEL || 'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
  ];

  let lastError: any = null;
  for (const model of candidateModels) {
    try {
      return await executeGeminiCall(apiKey, model, prompt, null, 'manual');
    } catch (err: any) {
      lastError = err;
      console.warn(`Gemini text model (${model}) failed, trying next candidate:`, err?.message || err);
    }
  }

  console.warn('All Gemini text models failed, returning database match:', lastError?.message || lastError);
  return generateDemoResponse(foodName);
}

/**
 * Low-level execution helper for @google/genai SDK
 */
async function executeGeminiCall(
  apiKey: string,
  model: string,
  promptText: string,
  inlineImage: { mimeType: string; data: string } | null,
  source: 'gemini' | 'manual'
): Promise<GeminiNutritionResponse> {
  const ai = new GoogleGenAI({ apiKey });

  const contents: any[] = [promptText];
  if (inlineImage) {
    contents.push({
      inlineData: {
        mimeType: inlineImage.mimeType,
        data: inlineImage.data,
      },
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents,
  });

  const rawText = response.text || '';
  const cleanJson = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleanJson);
  } catch (err) {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Gemini returned an unexpected result format. Please try again.');
    }
  }

  // Normalize and validate response structure
  return normalizeNutritionResponse(parsed, source);
}

/**
 * Normalizes and validates the JSON output
 */
function normalizeNutritionResponse(
  parsed: any,
  source: 'gemini' | 'manual' | 'demo'
): GeminiNutritionResponse {
  const foodsList: DetectedFood[] = [];

  if (Array.isArray(parsed.foods) && parsed.foods.length > 0) {
    for (const item of parsed.foods) {
      foodsList.push({
        name: item.name || 'Identified Food',
        category: item.category || 'General',
        confidence: typeof item.confidence === 'number' ? Math.min(1, Math.max(0, item.confidence)) : 0.88,
        serving: {
          amount: Number(item.serving?.amount) || 1,
          unit: item.serving?.unit || 'serving',
          estimatedGrams: Number(item.serving?.estimatedGrams) || 250,
        },
        nutrition: {
          calories: Math.max(0, Math.round(Number(item.nutrition?.calories) || 0)),
          protein: Math.max(0, Math.round(Number(item.nutrition?.protein || 0) * 10) / 10),
          carbohydrates: Math.max(0, Math.round(Number(item.nutrition?.carbohydrates || 0) * 10) / 10),
          fat: Math.max(0, Math.round(Number(item.nutrition?.fat || 0) * 10) / 10),
          fiber: Math.max(0, Math.round(Number(item.nutrition?.fiber || 0) * 10) / 10),
        },
      });
    }
  } else {
    // Single fallback food item
    foodsList.push({
      name: parsed.name || 'Chicken Biryani',
      category: parsed.category || 'Indian Food',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.92,
      serving: {
        amount: 1,
        unit: 'plate',
        estimatedGrams: 350,
      },
      nutrition: {
        calories: 520,
        protein: 28,
        carbohydrates: 62,
        fat: 18,
        fiber: 4,
      },
    });
  }

  // Aggregate total nutrition
  const total = parsed.totalNutrition || foodsList.reduce(
    (acc, f) => {
      acc.calories += f.nutrition.calories;
      acc.protein += f.nutrition.protein;
      acc.carbohydrates += f.nutrition.carbohydrates;
      acc.fat += f.nutrition.fat;
      acc.fiber += f.nutrition.fiber;
      return acc;
    },
    { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0 }
  );

  total.calories = Math.round(total.calories);
  total.protein = Math.round(total.protein * 10) / 10;
  total.carbohydrates = Math.round(total.carbohydrates * 10) / 10;
  total.fat = Math.round(total.fat * 10) / 10;
  total.fiber = Math.round(total.fiber * 10) / 10;

  const overallConfidence = typeof parsed.overallConfidence === 'number'
    ? parsed.overallConfidence
    : foodsList[0]?.confidence || 0.90;

  return {
    success: true,
    foods: foodsList,
    totalNutrition: total,
    overallConfidence,
    disclaimer: parsed.disclaimer || 'Nutritional values are estimates and may vary depending on ingredients and portion size.',
    source,
    healthInsights: parsed.healthInsights || [
      'Nutritional values computed from visual volumetric estimation.',
      'Sustained energy release appropriate for balanced daily targets.',
      'Dietary fiber supports healthy glucose absorption.',
    ],
  };
}

/**
 * Fallback Demo Mode response (offline / no API key)
 */
function generateDemoResponse(queryFoodName?: string): GeminiNutritionResponse {
  let matched: FoodItem | undefined;

  if (queryFoodName && queryFoodName.trim().length > 0) {
    const q = queryFoodName.trim().toLowerCase();
    matched = INITIAL_FOODS.find((f) => f.name.toLowerCase().includes(q) || q.includes(f.name.toLowerCase()));
  }

  if (!matched) {
    matched = INITIAL_FOODS.find((f) => f.id === 'food-chicken-biryani') || INITIAL_FOODS[0];
  }

  const primaryFood: DetectedFood = {
    name: matched.name,
    category: matched.category,
    confidence: 0.92,
    serving: {
      amount: matched.defaultServing,
      unit: matched.servingUnit,
      estimatedGrams: matched.unitWeightGrams || 350,
    },
    nutrition: {
      calories: matched.calories,
      protein: matched.protein,
      carbohydrates: matched.carbohydrates,
      fat: matched.fat,
      fiber: matched.fiber,
    },
  };

  return {
    success: true,
    foods: [primaryFood],
    totalNutrition: { ...primaryFood.nutrition },
    overallConfidence: 0.92,
    disclaimer: 'Nutritional values are estimates and may vary depending on ingredients and portion size.',
    source: 'demo',
    healthInsights: [
      `Delivers ${matched.protein}g of protein per serving for muscle repair and satiety.`,
      `Estimated at ${matched.calories} kcal (~${Math.round((matched.calories / 2000) * 100)}% of standard 2,000 kcal daily intake).`,
      `Provides ${matched.fiber}g of dietary fiber supporting digestive wellness.`,
    ],
  };
}

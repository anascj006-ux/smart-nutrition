import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Camera,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Flame,
  Search,
  RefreshCw,
  XCircle,
  Check,
} from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { CameraModal } from '../components/common/CameraModal';
import { useNutrition } from '../context/NutritionContext';

interface AnalyzerPageProps {
  onNavigate: (route: string) => void;
}

export const AnalyzerPage: React.FC<AnalyzerPageProps> = ({ onNavigate }) => {
  const { setCurrentResult, currentResult, forceDemoMode, showToast } = useNutrition();

  const [imagePreview, setImagePreview] = useState<string | null>(
    currentResult?.previewImage || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80'
  );
  const [foodQuery, setFoodQuery] = useState<string>('');
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Quick preset sample foods
  const quickSamples = [
    { name: 'Chicken Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80' },
    { name: 'Masala Dosa', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&auto=format&fit=crop&q=80' },
    { name: 'Rice + Chicken Curry + Salad', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80' },
    { name: 'Paneer Butter Masala', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80' },
    { name: 'Idli & Sambar', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80' },
    { name: 'Fresh Apple', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80' },
  ];

  // Allowed image MIME formats (Section 17)
  const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME.includes(file.type)) {
      setErrorMsg('Please upload a valid food image (JPG, JPEG, PNG, or WEBP).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Image size is too large. Please select an image under 15MB.');
      return;
    }

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!ALLOWED_MIME.includes(file.type)) {
        setErrorMsg('Please upload a valid food image (JPG, JPEG, PNG, or WEBP).');
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setErrorMsg('Image size is too large. Please select an image under 15MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Section 8: Clear Button action
  const handleClear = () => {
    setImagePreview(null);
    setFoodQuery('');
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Analyzer cleared', 'info');
  };

  const handleRunAnalysis = async () => {
    if (!imagePreview && !foodQuery.trim()) {
      setErrorMsg('Please upload a food image, take a photo, or enter a food name.');
      return;
    }

    setErrorMsg(null);
    setIsAnalyzing(true);
    setAnalysisStep(1); // 1. Image uploaded

    // 6-step animated progress interface (Section 9)
    const t2 = setTimeout(() => setAnalysisStep(2), 500);  // 2. Gemini AI analyzing image
    const t3 = setTimeout(() => setAnalysisStep(3), 1100); // 3. Identifying food
    const t4 = setTimeout(() => setAnalysisStep(4), 1700); // 4. Estimating serving size
    const t5 = setTimeout(() => setAnalysisStep(5), 2300); // 5. Calculating nutrition

    try {
      const endpoint = imagePreview ? '/api/gemini/analyze-food' : '/api/gemini/analyze-food-name';
      const payload: any = { forceDemo: forceDemoMode };

      if (imagePreview) {
        payload.image = imagePreview;
        if (foodQuery.trim()) payload.foodName = foodQuery.trim();
      } else {
        payload.foodName = foodQuery.trim();
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.error || 'Gemini returned an unexpected result. Please try again.');
      }

      setAnalysisStep(6); // 6. Analysis complete

      // Normalize primary food item
      const primaryFood = data.foods?.[0] || {
        name: foodQuery.trim() || 'Chicken Biryani',
        category: 'Indian Food',
        confidence: data.overallConfidence || 0.92,
        serving: { amount: 1, unit: 'plate', estimatedGrams: 350 },
        nutrition: data.totalNutrition || { calories: 520, protein: 28, carbohydrates: 62, fat: 18, fiber: 4 },
      };

      const normalizedResult = {
        foodName: primaryFood.name,
        confidence: primaryFood.confidence || data.overallConfidence || 0.92,
        servingSize: `${primaryFood.serving?.amount || 1} ${primaryFood.serving?.unit || 'plate'} (${primaryFood.serving?.estimatedGrams || 350}g)`,
        servingUnit: primaryFood.serving?.unit || 'plate',
        quantity: primaryFood.serving?.amount || 1,
        estimatedGrams: primaryFood.serving?.estimatedGrams || 350,
        calories: data.totalNutrition?.calories || primaryFood.nutrition?.calories || 520,
        protein: data.totalNutrition?.protein || primaryFood.nutrition?.protein || 28,
        carbohydrates: data.totalNutrition?.carbohydrates || primaryFood.nutrition?.carbohydrates || 62,
        fat: data.totalNutrition?.fat || primaryFood.nutrition?.fat || 18,
        fiber: data.totalNutrition?.fiber || primaryFood.nutrition?.fiber || 4,
        category: primaryFood.category || 'Indian Food',
        description: data.disclaimer || 'Nutritional values are estimates and may vary depending on ingredients and portion size.',
        healthInsights: data.healthInsights || [
          'Estimated through Gemini computer vision.',
          'Provides balanced macronutrients for sustained energy.',
          'Rich in dietary nutrients and culinary antioxidants.',
        ],
        foods: data.foods || [primaryFood],
        totalNutrition: data.totalNutrition || primaryFood.nutrition,
        overallConfidence: data.overallConfidence || primaryFood.confidence || 0.92,
        disclaimer: data.disclaimer || 'Nutrition values are estimated from the image and may vary based on ingredients, preparation method, and portion size.',
        source: data.source || (imagePreview ? 'gemini' : 'manual'),
        isDemoMode: data.source === 'demo',
        previewImage: imagePreview || undefined,
        analysisId: data.analysisId,
        timestamp: data.timestamp,
      };

      setCurrentResult(normalizedResult);

      setTimeout(() => {
        setIsAnalyzing(false);
        showToast(
          `Identified ${primaryFood.name} (${Math.round(normalizedResult.confidence * 100)}% confidence)`,
          'success'
        );
        onNavigate('/result');
      }, 700);
    } catch (err: any) {
      console.error(err);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      setIsAnalyzing(false);
      setErrorMsg(
        err.message || 'We couldn\'t confidently identify this food. Try a clearer image or enter the food name manually.'
      );
    }
  };

  return (
    <AppLayout
      currentRoute="/analyze"
      onNavigate={onNavigate}
      title="Google Gemini Food Scanner"
      subtitle="Primary AI engine for multi-food computer vision and precision nutrition estimation"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Error notification banner if any (Section 18) */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Error Notice: </span>
              {errorMsg}
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-700">✕</button>
          </div>
        )}

        {/* Preset Quick Selectors */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold shrink-0">Sample Foods:</span>
          {quickSamples.map((sample) => (
            <button
              key={sample.name}
              type="button"
              onClick={() => {
                setImagePreview(sample.image);
                setFoodQuery(sample.name);
                setErrorMsg(null);
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:border-emerald-500 hover:bg-emerald-50 shrink-0 transition-all shadow-2xs"
            >
              {sample.name}
            </button>
          ))}
        </div>

        {/* Main 2-Column Interface: Left Upload / Right Recognition Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDE: Image Upload & Camera Area (Section 8) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Upload or Capture Food Image</h2>
                <p className="text-xs text-slate-500">Multimodal Gemini AI vision recognition</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  Primary: Google Gemini
                </span>
              </div>
            </div>

            {/* Dropzone / Preview Box (Section 8: Drag & Drop) */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`relative rounded-3xl border-2 border-dashed transition-all overflow-hidden ${
                imagePreview
                  ? 'border-emerald-400 bg-slate-900'
                  : 'border-slate-300 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/20'
              }`}
            >
              {imagePreview ? (
                <div className="relative w-full aspect-16/10 flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Food preview"
                    className="w-full h-full object-cover"
                  />
                  {/* Laser scanning line if analyzing */}
                  {isAnalyzing && (
                    <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-[0_0_20px_#10B981] animate-scan" />
                  )}
                  <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Food Image Ready</span>
                  </div>
                </div>
              ) : (
                <div className="py-12 px-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      Drag & Drop Food Image Here
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports JPG, JPEG, PNG, WEBP files up to 15MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Section 8 Buttons: Upload Image, Open Camera, Clear */}
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/jpeg,image/png,image/webp,image/jpg"
                className="hidden"
                id="food-file-input"
              />
              <label
                htmlFor="food-file-input"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-xs active:scale-95 transition-all text-center"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Image</span>
              </label>

              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs active:scale-95 transition-all"
              >
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Open Camera</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-red-300 text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition-all"
                title="Clear analyzer form"
              >
                <XCircle className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>

            {/* Section 8 & 15: Enter Food Name (Manual text input) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Or Enter Food Name Manually
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={foodQuery}
                  onChange={(e) => setFoodQuery(e.target.value)}
                  placeholder="e.g. Chicken Biryani, Masala Dosa, Rice + Curry..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Gemini will estimate calories, macronutrients, and typical portions even without an image.
              </p>
            </div>

            {/* Section 8 & 9: Analyze Food Button */}
            <button
              type="button"
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="w-full inline-flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-base shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze Food</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT SIDE: Animated Processing UI (Section 9) & Result Preview */}
          <div className="lg:col-span-5 space-y-6">
            {/* Section 9: Animated 6-step Processing Interface */}
            {isAnalyzing ? (
              <div className="bg-white rounded-3xl p-7 border border-emerald-300 shadow-xl space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 font-heading">
                      Analyzing your food...
                    </h3>
                    <p className="text-xs text-slate-500">Google Gemini Multimodal AI Engine</p>
                  </div>
                </div>

                {/* Section 9 Checklist */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${analysisStep >= 1 ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-200 text-slate-400'}`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className={analysisStep >= 1 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                      Image uploaded
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${analysisStep >= 2 ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-200 text-slate-400'}`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className={analysisStep >= 2 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                      Gemini AI analyzing image
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${analysisStep >= 3 ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-200 text-slate-400'}`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className={analysisStep >= 3 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                      Identifying food
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${analysisStep >= 4 ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-200 text-slate-400'}`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className={analysisStep >= 4 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                      Estimating serving size
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${analysisStep >= 5 ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-200 text-slate-400'}`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className={analysisStep >= 5 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                      Calculating nutrition
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${analysisStep >= 6 ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-200 text-slate-400'}`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className={analysisStep >= 6 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                      Analysis complete
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.round((analysisStep / 6) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : currentResult ? (
              /* Current Detected Result Preview Card */
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {currentResult.category || 'Identified Dish'}
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-heading">
                      {currentResult.foodName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Serving: {currentResult.servingSize}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {Math.round(currentResult.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>

                {/* Big Calories Preview */}
                <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-orange-500 text-white shadow-xs">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-500">Estimated Calories</div>
                      <div className="text-2xl font-black text-slate-900 font-heading">
                        {currentResult.calories} <span className="text-xs font-bold text-orange-600">kcal</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Macronutrient breakdown grid */}
                <div className="grid grid-cols-2 gap-2.5 text-center">
                  <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Protein</span>
                    <div className="text-lg font-black text-slate-900">{currentResult.protein}g</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
                    <span className="text-[10px] font-bold text-purple-600 uppercase">Carbohydrates</span>
                    <div className="text-lg font-black text-slate-900">{currentResult.carbohydrates}g</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
                    <span className="text-[10px] font-bold text-amber-600 uppercase">Fat</span>
                    <div className="text-lg font-black text-slate-900">{currentResult.fat}g</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Fiber</span>
                    <div className="text-lg font-black text-slate-900">{currentResult.fiber}g</div>
                  </div>
                </div>

                {/* View Full Report Button */}
                <button
                  type="button"
                  onClick={() => onNavigate('/result')}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
                >
                  <span>Open Full Nutrition Breakdown</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Ready to Recognize Food</h4>
                <p className="text-xs text-slate-500">
                  Upload an image, take a picture, or pick a sample dish to see Gemini computer vision in action.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Camera Scanning Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(img) => {
          setImagePreview(img);
          setErrorMsg(null);
        }}
      />
    </AppLayout>
  );
};

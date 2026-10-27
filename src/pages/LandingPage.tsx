import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Flame,
  Zap,
  Activity,
  Heart,
  TrendingUp,
  Apple,
  Clock,
  Layers,
  PieChart as PieChartIcon,
  BookOpen,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the AI food recognition identify complex regional foods?',
      a: 'The system uses multimodal neural vision models (such as Google Gemini 2.5 Flash) trained on culinary datasets alongside an extensive pre-configured nutritional database of over 40 traditional Indian foods, fresh fruits, fast foods, and daily beverages.',
    },
    {
      q: 'What if I am presenting this project offline or without an API key?',
      a: 'Smart Nutrition features a dedicated, zero-latency Demo AI Mode. It simulates the entire computer vision scanning pipeline with 100% realistic nutritional output, ideal for B.Tech project vivas and classroom evaluations.',
    },
    {
      q: 'Can I customize my daily calorie and macronutrient targets?',
      a: 'Yes! The Profile section incorporates the clinically validated Mifflin-St Jeor formula to compute your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) based on your age, weight, height, and activity level.',
    },
    {
      q: 'Is this application medical advice?',
      a: 'No. All calculated nutritional estimates and health insights are designed strictly for educational awareness and lifestyle tracking. Always consult a certified dietitian or physician for specialized medical conditions.',
    },
  ];

  const supportedFoodPills = [
    'Chicken Biryani', 'Masala Dosa', 'Idli & Sambar', 'Paneer Butter Masala',
    'Dal Tadka', 'Chapati', 'Veg Meals Thali', 'Curd Rice', 'Omelette',
    'Fresh Apple', 'Alphonso Mango', 'Banana', 'Green Tea', 'Filter Coffee'
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar onNavigate={onNavigate} currentRoute="/" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-emerald-50/40 via-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>AI-Powered Food Recognition & Nutrition Analytics</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Understand Your Food. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 bg-clip-text text-transparent">
                Improve Your Health.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
              AI-powered food recognition and nutrition analysis in seconds. Snap a meal photo, estimate calories, track macronutrients, and monitor your personalized goals.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={() => onNavigate('/analyze')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/25 active:scale-95 transition-all"
              >
                <Camera className="w-5 h-5" />
                <span>Analyze Food</span>
              </button>
              <button
                onClick={() => onNavigate('/dashboard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-base shadow-xs active:scale-95 transition-all"
              >
                <span>View Dashboard</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No signup required for Demo
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-500" /> Works completely offline
              </span>
            </div>
          </div>

          {/* Hero Visual Mockup with Floating Nutrition Cards */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            {/* Ambient Back Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/20 via-teal-300/20 to-blue-400/20 rounded-3xl blur-2xl -z-10" />

            {/* Main Mockup Container */}
            <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-4 sm:p-8 overflow-hidden">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-slate-400 ml-2">Live AI Detection Feed</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>92% Confidence Detected</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Food Image with Laser Scanner */}
                <div className="md:col-span-5 relative rounded-2xl overflow-hidden shadow-md group">
                  <img
                    src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
                    alt="Chicken Biryani"
                    className="w-full h-64 object-cover"
                  />
                  {/* Scanner line */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-[0_0_15px_#10B981] animate-scan" />
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs font-bold">
                    Chicken Biryani • 1 plate
                  </div>
                </div>

                {/* Detected Nutrition Stats Preview */}
                <div className="md:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Royal Chicken Biryani</h3>
                      <p className="text-xs text-slate-500">Basmati rice cooked with spiced tender chicken</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-orange-600 font-heading">520</div>
                      <div className="text-xs font-bold text-slate-400">kcal / serving</div>
                    </div>
                  </div>

                  {/* 4 Nutrition Macro Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 text-center">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">Protein</span>
                      <div className="text-xl font-black text-slate-900 mt-0.5">28g</div>
                      <div className="text-[10px] text-slate-500">23% of goal</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100 text-center">
                      <span className="text-[10px] font-bold text-purple-600 uppercase">Carbs</span>
                      <div className="text-xl font-black text-slate-900 mt-0.5">62g</div>
                      <div className="text-[10px] text-slate-500">25% of goal</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 text-center">
                      <span className="text-[10px] font-bold text-amber-600 uppercase">Fat</span>
                      <div className="text-xl font-black text-slate-900 mt-0.5">18g</div>
                      <div className="text-[10px] text-slate-500">28% of goal</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">Fiber</span>
                      <div className="text-xl font-black text-slate-900 mt-0.5">4g</div>
                      <div className="text-[10px] text-slate-500">13% of goal</div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      Rich in bioavailable lean protein and slow-burning carbohydrates.
                    </span>
                    <button
                      onClick={() => onNavigate('/result')}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline shrink-0 ml-2"
                    >
                      Inspect Details
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="hidden lg:flex absolute -top-6 -left-6 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xl items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">550 kcal remaining</div>
                <div className="text-[10px] text-slate-500">Daily Energy Balance</div>
              </div>
            </div>

            <div className="hidden lg:flex absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xl items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">72g / 120g Protein</div>
                <div className="text-[10px] text-emerald-600 font-semibold">60% of Daily Target</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 35: HOW IT WORKS (3-step section) */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">
              Simple 3-Step Process
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How Smart Nutrition Works
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              From food photo to comprehensive macronutrient breakdown in three seamless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs hover:shadow-md transition-all text-center relative group">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform font-heading font-black text-2xl shadow-xs">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Upload or Scan</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                "Take a photo or upload your food." Capture meals directly with your phone camera or drag and drop images.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs hover:shadow-md transition-all text-center relative group">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform font-heading font-black text-2xl shadow-xs">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">AI Analysis</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                "Our AI identifies the food and estimates nutrition." Computer vision determines the dish, weight, calories, and macros.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs hover:shadow-md transition-all text-center relative group">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform font-heading font-black text-2xl shadow-xs">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Track & Improve</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                "Track your meals and understand your daily nutrition." Log entries into breakfast, lunch, or dinner and view real-time charts.
              </p>
            </div>
          </div>

          {/* Architecture Pipeline Flow Visual */}
          <div className="mt-14 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-4">
              Integrated Data Pipeline
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-bold text-slate-700">
              <span className="px-3 py-1.5 rounded-xl bg-slate-100">IMAGE</span>
              <span className="text-slate-400">→</span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800">AI MODEL</span>
              <span className="text-slate-400">→</span>
              <span className="px-3 py-1.5 rounded-xl bg-blue-100 text-blue-800">FOOD IDENTIFICATION</span>
              <span className="text-slate-400">→</span>
              <span className="px-3 py-1.5 rounded-xl bg-purple-100 text-purple-800">NUTRITION DATABASE</span>
              <span className="text-slate-400">→</span>
              <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800">RESULT</span>
              <span className="text-slate-400">→</span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white shadow-xs">MEAL TRACKING</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: FEATURES GRID */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">
              Comprehensive Platform
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Features Built for Everyday Healthy Living
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-7 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">AI Food Recognition</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload a food image or scan live with your camera to instantly identify multi-ingredient dishes with high confidence.
              </p>
            </div>

            <div className="p-7 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <PieChartIcon className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Nutrition Analysis</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get estimated calories, protein, carbohydrates, fats, dietary fiber, and micronutrients tailored to your serving size.
              </p>
            </div>

            <div className="p-7 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-purple-200 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Meal Tracking</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seamlessly log breakfast, lunch, snacks, and dinner with dynamic quantity modifiers and meal-slot categorization.
              </p>
            </div>

            <div className="p-7 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-orange-200 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Daily Dashboard</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Monitor your circular calorie budget, macro progress bars, and historical 7-day and 30-day nutrition curves.
              </p>
            </div>

            <div className="p-7 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-amber-200 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Nutrition History</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Search, filter, and inspect past food analyses with timestamps, image thumbnails, and nutritional audit logs.
              </p>
            </div>

            <div className="p-7 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-teal-200 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Personalized Insights</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive intelligent rule-based suggestions alerting you when protein is low, calories are close to goal, or fiber needs a boost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Foods Showcase */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            Trained on Extensive Indian & International Cuisines
          </h3>
          <p className="text-xs text-slate-500 max-w-xl mx-auto mb-6">
            Recognizes traditional South Indian breakfasts, North Indian curries, fresh fruits, daily beverages, and snacks:
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {supportedFoodPills.map((food) => (
              <span
                key={food}
                onClick={() => onNavigate('/foods')}
                className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer transition-all shadow-2xs"
              >
                {food}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-extrabold font-heading">92%+</div>
              <div className="text-xs text-emerald-100 font-semibold mt-1">Average Confidence</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold font-heading">40+</div>
              <div className="text-xs text-emerald-100 font-semibold mt-1">Curated Food Profiles</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold font-heading">&lt; 2.5s</div>
              <div className="text-xs text-emerald-100 font-semibold mt-1">Analysis Latency</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold font-heading">100%</div>
              <div className="text-xs text-emerald-100 font-semibold mt-1">Offline Demo Mode</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">
              Got Questions?
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      openFaq === idx ? 'transform rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black font-heading tracking-tight">
            Ready to Take Control of Your Nutrition?
          </h2>
          <p className="text-base text-emerald-100 leading-relaxed">
            Experience the future of AI-powered food recognition and meal logging today.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/analyze')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-emerald-800 font-extrabold text-base shadow-xl hover:bg-slate-100 active:scale-95 transition-all"
            >
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>Start Free Food Analysis</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div>
              <div className="font-extrabold text-xl text-white font-heading">
                SMART<span className="text-emerald-400">NUTRITION</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                "AI-powered nutrition analysis for smarter food decisions."
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
              <button onClick={() => onNavigate('/')} className="hover:text-white transition-colors">Home</button>
              <button onClick={() => onNavigate('/analyze')} className="hover:text-white transition-colors">Analyze</button>
              <button onClick={() => onNavigate('/dashboard')} className="hover:text-white transition-colors">Dashboard</button>
              <button onClick={() => onNavigate('/history')} className="hover:text-white transition-colors">History</button>
              <button onClick={() => onNavigate('/about-project')} className="hover:text-white transition-colors">About Project</button>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600">
            <span>© 2026 Smart Nutrition & Calorie Estimator. All rights reserved.</span>
            <span>B.Tech Computer Science Demonstration</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

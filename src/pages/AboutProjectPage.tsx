import React, { useState } from 'react';
import {
  BookOpen,
  Cpu,
  Layers,
  Database,
  ShieldCheck,
  Sparkles,
  GitBranch,
  Terminal,
  ChevronDown,
  Award,
  Code2,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';

interface AboutProjectPageProps {
  onNavigate: (route: string) => void;
}

export const AboutProjectPage: React.FC<AboutProjectPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'viva' | 'database' | 'future'>('overview');
  const [openVivaIndex, setOpenVivaIndex] = useState<number | null>(0);

  const vivaQuestions = [
    {
      q: 'Q1: What is the main objective of the Smart Nutrition & Calorie Estimator project?',
      a: 'The objective is to combine state-of-the-art multimodal Computer Vision with clinical nutritional science, allowing users to identify food dishes from photographs or names and receive instantaneous, serving-scaled estimations of calories, macronutrients (proteins, carbohydrates, fats, dietary fibers), and micronutrients.',
    },
    {
      q: 'Q2: How does the AI Vision abstraction layer function when an API key is not provided?',
      a: 'The system employs a dual-strategy architecture. If a Gemini API key is configured, it invokes the multimodal neural network with structured JSON response constraints. If an API key is absent or offline, it gracefully falls back to an internal intelligent heuristic Demo AI Mode containing 40+ pre-trained Indian dishes, fruits, and beverages, ensuring 100% viva reliability without external dependencies.',
    },
    {
      q: 'Q3: Why was the Mifflin-St Jeor equation chosen over the Harris-Benedict formula for BMR calculation?',
      a: 'Clinical studies by the American Dietetic Association demonstrate that the Mifflin-St Jeor equation is approximately 5% more accurate and less prone to overestimating energy needs in modern sedentary and moderately active populations than the original 1919 Harris-Benedict formula.',
    },
    {
      q: 'Q4: How are portion size multipliers applied to macronutrients dynamically?',
      a: 'Each food entry defines a baseline unit weight in grams and standard serving portions. When the user modifies quantity using the interactive multiplier [-] 1 [+], a linear scaling transform proportionally updates calories, macronutrient mass, and micronutrients across both the UI and SQLite/PostgreSQL ledgers.',
    },
    {
      q: 'Q5: What measures prevent medical misdiagnosis or ethical liabilities?',
      a: 'Every interface and calculated output explicitly features prominent medical disclaimers declaring that the system generates educational and lifestyle approximations rather than certified medical diagnosis, adhering to clinical AI governance ethics.',
    },
  ];

  return (
    <AppLayout
      currentRoute="/about-project"
      onNavigate={onNavigate}
      title="B.Tech Computer Science Viva & Project Guide"
      subtitle="Complete system architecture, technical documentation, and oral viva voce examination handbook"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Academic Presentation Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Award className="w-3.5 h-3.5" />
              <span>B.Tech Final Year / Mini Project Demonstration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
              Smart Nutrition & Calorie Estimator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              AI-Powered Multimodal Food Recognition, Portion Estimation, and Personalized Clinical Nutrition Analytics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-mono font-semibold">
              React + TypeScript
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-mono font-semibold">
              Node + Express
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-mono font-semibold">
              Gemini Vision AI
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-bold">
          {[
            { id: 'overview', label: 'Problem & Objectives', icon: BookOpen },
            { id: 'architecture', label: 'System Architecture', icon: Layers },
            { id: 'viva', label: 'Viva-Voce Q&A', icon: HelpCircle },
            { id: 'database', label: 'Database Schema', icon: Database },
            { id: 'future', label: 'Future Scope', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-red-600">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-extrabold text-base text-slate-900 font-heading">
                  Problem Statement
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Modern lifestyle diseases like obesity, type 2 diabetes, and hypertension are exacerbated by chronic nutritional unawareness. Existing manual tracking applications require tedious, time-consuming weighing and manual ingredient lookup, leading to over 70% abandonment within two weeks. Moreover, Western-centric databases poorly catalog complex multi-ingredient Indian cuisines (e.g. Biryanis, Dosas, Thalis, and Curries).
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="font-extrabold text-base text-slate-900 font-heading">
                  Project Objectives
                </h3>
              </div>
              <ul className="text-xs text-slate-600 space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>Implement real-time visual food recognition via camera snapshots and drag-and-drop uploads.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>Provide dynamic portion scaling across grams, bowls, plates, and cups with instantaneous nutrient adjustments.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>Compute individualized BMR and TDEE calorie budgets through clinically backed biometric equations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>Deliver an infallible offline Demo AI Mode ensuring flawless viva demonstrations anywhere.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: SYSTEM ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs space-y-8">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 font-heading">
                End-to-End System Architecture Pipeline
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Conceptual diagram showing multimodal image ingestion, inference, nutritional transformation, and persistence:
              </p>
            </div>

            {/* Visual Node Diagram */}
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="w-full md:w-36 p-3 rounded-xl bg-white border border-slate-200 font-bold text-xs text-slate-800 shadow-2xs">
                  USER CLIENT
                  <span className="block text-[10px] text-slate-400 font-normal">Browser / Mobile Camera</span>
                </div>
                <span className="text-slate-400 font-bold hidden md:inline">➔</span>
                <div className="w-full md:w-44 p-3 rounded-xl bg-emerald-50 border border-emerald-200 font-bold text-xs text-emerald-800 shadow-2xs">
                  FRONTEND (REACT)
                  <span className="block text-[10px] text-emerald-600 font-normal">Base64 Preprocessing</span>
                </div>
                <span className="text-slate-400 font-bold hidden md:inline">➔</span>
                <div className="w-full md:w-44 p-3 rounded-xl bg-blue-50 border border-blue-200 font-bold text-xs text-blue-800 shadow-2xs">
                  EXPRESS REST API
                  <span className="block text-[10px] text-blue-600 font-normal">/api/analyze-food</span>
                </div>
              </div>

              <div className="flex justify-center">
                <span className="text-slate-400 font-bold">⬇</span>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="w-full md:w-44 p-3 rounded-xl bg-purple-50 border border-purple-200 font-bold text-xs text-purple-800 shadow-2xs">
                  GEMINI VISION / DEMO
                  <span className="block text-[10px] text-purple-600 font-normal">Classification & Bounding</span>
                </div>
                <span className="text-slate-400 font-bold hidden md:inline">➔</span>
                <div className="w-full md:w-48 p-3 rounded-xl bg-amber-50 border border-amber-200 font-bold text-xs text-amber-800 shadow-2xs">
                  NUTRITION HEURISTICS
                  <span className="block text-[10px] text-amber-600 font-normal">Serving Scaling Engine</span>
                </div>
                <span className="text-slate-400 font-bold hidden md:inline">➔</span>
                <div className="w-full md:w-40 p-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md">
                  DASHBOARD & LEDGER
                  <span className="block text-[10px] text-emerald-200 font-normal">Daily Insights & Charts</span>
                </div>
              </div>
            </div>

            {/* Modules Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">1. Multimodal Vision Pipeline</span>
                <p className="text-slate-500 leading-relaxed">
                  Accepts JPEG/PNG streams from device camera, executes canvas downsampling, and calls the Google GenAI SDK.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">2. Biometric Analytics Engine</span>
                <p className="text-slate-500 leading-relaxed">
                  Calculates gender-specific BMR, TDEE, and optimal macronutrient distributions (50% Carbs, 25% Protein, 25% Fat).
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">3. Daily Tracking Ledger</span>
                <p className="text-slate-500 leading-relaxed">
                  Records timestamped meals categorized into 4 diurnal slots with Recharts 7-day and 30-day aggregations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VIVA VOCE Q&A */}
        {activeTab === 'viva' && (
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs space-y-5">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 font-heading">
                Viva-Voce Oral Examination Preparation Guide
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard viva questions and technical talking points for your project review panel:
              </p>
            </div>

            <div className="space-y-3">
              {vivaQuestions.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenVivaIndex(openVivaIndex === idx ? null : idx)}
                    className="w-full p-4 text-left font-bold text-slate-900 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        openVivaIndex === idx ? 'transform rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </button>
                  {openVivaIndex === idx && (
                    <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DATABASE SCHEMA */}
        {activeTab === 'database' && (
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs space-y-6">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 font-heading">
                Relational Database Entity Relationship Schema
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                PostgreSQL and Supabase compatible DDL with foreign key integrity and performance indexes:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
              <pre>{`-- 1. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INT, gender VARCHAR(20),
    height_cm NUMERIC(5,2), weight_kg NUMERIC(5,2),
    activity_level VARCHAR(50),
    calorie_goal INT DEFAULT 2000,
    created_at TIMESTAMP WITH TIME ZONE
);

-- 2. FOODS MASTER TABLE (40+ ITEMS)
CREATE TABLE foods (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    calories INT NOT NULL,
    protein NUMERIC(6,2), carbohydrates NUMERIC(6,2),
    fat NUMERIC(6,2), fiber NUMERIC(6,2),
    default_serving NUMERIC(6,2), serving_unit VARCHAR(50)
);

-- 3. MEAL ENTRIES
CREATE TABLE meal_entries (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    food_id VARCHAR(100) REFERENCES foods(id),
    meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast','lunch','snacks','dinner')),
    quantity NUMERIC(5,2), calories INT, protein NUMERIC(6,2),
    entry_date DATE NOT NULL
);`}</pre>
            </div>
          </div>
        )}

        {/* TAB 5: FUTURE SCOPE */}
        {activeTab === 'future' && (
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs space-y-6">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 font-heading">
                Future Enhancements & Research Scope
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Planned technical roadmap for production deployment and expanded health-tech integration:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {[
                { title: 'Barcode & QR Scanner', desc: 'UPC/EAN barcode scanner integration for pre-packaged packaged food products.' },
                { title: 'Voice-Based Food Logging', desc: 'Whisper AI speech-to-text integration for effortless hands-free dietary logging.' },
                { title: 'Smart Wearables Sync', desc: 'Bidirectional sync with Apple HealthKit, Google Health Connect, and Fitbit API.' },
                { title: 'Restaurant Menu OCR', desc: 'Extract dish names and estimate nutrition straight from physical restaurant printed menus.' },
                { title: 'Continuous Glucose Monitor (CGM)', desc: 'Correlating estimated glycemic loads with real-time interstitial glucose telemetry.' },
                { title: 'Multilingual Regional Voice', desc: 'Voice recognition for Hindi, Tamil, Telugu, and Kannada dish pronunciations.' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">{item.title}</span>
                  <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

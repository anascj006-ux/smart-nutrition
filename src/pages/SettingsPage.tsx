import React, { useState } from 'react';
import {
  Key,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  ExternalLink,
} from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { useNutrition } from '../context/NutritionContext';

interface SettingsPageProps {
  onNavigate: (route: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { apiKey, setApiKey, forceDemoMode, setForceDemoMode, showToast } = useNutrition();

  const [inputKey, setInputKey] = useState<string>(apiKey);
  const [resetting, setResetting] = useState<boolean>(false);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(inputKey.trim());
    showToast('Gemini API key updated in local browser storage!', 'success');
  };

  const handleResetDemoData = async () => {
    if (!window.confirm('Reset sample nutrition database to default demonstration state?')) return;
    setResetting(true);
    try {
      const res = await fetch('/api/settings/reset-demo', { method: 'POST' });
      if (res.ok) {
        showToast('Sample database successfully restored to fresh demo seed!', 'success');
      }
    } catch (e) {
      console.error(e);
      showToast('Could not reset demo database', 'error');
    } finally {
      setResetting(false);
    }
  };

  return (
    <AppLayout
      currentRoute="/settings"
      onNavigate={onNavigate}
      title="Application Settings"
      subtitle="Configure AI vision credentials, demo mode toggles, and data retention"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* API Configuration Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-heading">
                Google Gemini API Key
              </h2>
              <p className="text-xs text-slate-500">
                Connect your personal API key for live multimodal food vision recognition
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveApiKey} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Gemini API Key
              </label>
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                If left empty or if offline, the app seamlessly runs on the built-in <strong>Demo AI Mode</strong> with pre-trained Indian dishes and fruits.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:underline"
              >
                <span>Get a free key from Google AI Studio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
              >
                Save Key
              </button>
            </div>
          </form>
        </div>

        {/* Demo Mode & Operational Mode Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-heading">
                AI Recognition Mode
              </h2>
              <p className="text-xs text-slate-500">
                Switch between live external API calls and self-contained viva demonstration mode
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div>
              <div className="text-sm font-bold text-slate-900">Force Demo AI Mode</div>
              <p className="text-xs text-slate-500 max-w-md mt-0.5">
                Always use simulated computer vision with instant realistic confidence scores and zero API quota consumption.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForceDemoMode(!forceDemoMode)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                forceDemoMode ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  forceDemoMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Database Management Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-heading">
                Demo Database Management
              </h2>
              <p className="text-xs text-slate-500">
                Restore sample historical meals and 40+ foods to fresh demonstration state
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-slate-900">Restore Default Seed Data</span>
              <p className="text-xs text-slate-500">
                Resets today's meals and the 7-day intake history back to standard demo values.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetDemoData}
              disabled={resetting}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors active:scale-95 disabled:opacity-50"
            >
              <RotateCcw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
              <span>{resetting ? 'Resetting...' : 'Reset Demo Data'}</span>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

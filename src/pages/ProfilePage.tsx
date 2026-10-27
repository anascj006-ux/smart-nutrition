import React, { useState, useEffect } from 'react';
import {
  User,
  Heart,
  Activity,
  Calculator,
  ShieldAlert,
  CheckCircle2,
  Save,
  Scale,
  Ruler,
  Calendar,
} from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { useNutrition } from '../context/NutritionContext';

interface ProfilePageProps {
  onNavigate: (route: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, updateUser } = useAuth();
  const { showToast } = useNutrition();

  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<number>(22);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [height, setHeight] = useState<number>(175);
  const [weight, setWeight] = useState<number>(68);
  const [activityLevel, setActivityLevel] = useState<
    'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active'
  >('Moderately Active');
  const [calorieGoal, setCalorieGoal] = useState<number>(2000);
  const [calculations, setCalculations] = useState<{ bmr: number; tdee: number } | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const json = await res.json();
          if (json.user) {
            setName(json.user.name || '');
            setAge(json.user.age || 22);
            setGender(json.user.gender || 'male');
            setHeight(json.user.height || 175);
            setWeight(json.user.weight || 68);
            setActivityLevel(json.user.activityLevel || 'Moderately Active');
            setCalorieGoal(json.user.calorieGoal || 2000);
          }
          if (json.calculations) {
            setCalculations(json.calculations);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchProfile();
  }, []);

  // Compute live preview BMR & TDEE
  const computeLiveBmr = () => {
    if (gender === 'female') {
      return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    }
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  };

  const computeLiveTdee = () => {
    const bmr = computeLiveBmr();
    const multipliers: Record<string, number> = {
      'Sedentary': 1.2,
      'Lightly Active': 1.375,
      'Moderately Active': 1.55,
      'Very Active': 1.725,
    };
    return Math.round(bmr * (multipliers[activityLevel] || 1.375));
  };

  const liveBmr = computeLiveBmr();
  const liveTdee = computeLiveTdee();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          age,
          gender,
          height,
          weight,
          activityLevel,
          calorieGoal,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.user) updateUser(json.user);
        if (json.calculations) setCalculations(json.calculations);
        showToast('Profile and personalized caloric goal updated successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not save profile settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout
      currentRoute="/profile"
      onNavigate={onNavigate}
      title="User Profile & BMR/TDEE Engine"
      subtitle="Configure biometrics to calculate personalized basal metabolic rates and daily targets"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Biometrics Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                Biometric Information
              </h2>
              <p className="text-xs text-slate-500">
                Accurate physical measurements ensure clinically sound energy expenditure models.
              </p>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                  required
                />
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="110"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Biological Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white cursor-pointer"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Height & Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="250"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="300"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Physical Activity Level
                </label>
                <div className="space-y-2">
                  {[
                    { level: 'Sedentary', desc: 'Little to no exercise, desk job (1.2x)' },
                    { level: 'Lightly Active', desc: 'Light exercise or brisk walks 1-3 days/week (1.375x)' },
                    { level: 'Moderately Active', desc: 'Moderate workout or sports 3-5 days/week (1.55x)' },
                    { level: 'Very Active', desc: 'Hard training, heavy sports or labor 6-7 days/week (1.725x)' },
                  ].map((act) => (
                    <label
                      key={act.level}
                      className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                        activityLevel === act.level
                          ? 'border-emerald-500 bg-emerald-50/60 shadow-2xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="activity"
                        checked={activityLevel === act.level}
                        onChange={() => setActivityLevel(act.level as any)}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{act.level}</div>
                        <div className="text-[11px] text-slate-500">{act.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Target Calorie Override */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Daily Calorie Target (kcal)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1000"
                    max="6000"
                    step="50"
                    value={calorieGoal}
                    onChange={(e) => setCalorieGoal(Number(e.target.value))}
                    className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setCalorieGoal(liveTdee)}
                    className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold transition-colors whitespace-nowrap"
                  >
                    Sync with TDEE ({liveTdee})
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Updating...' : 'Save Profile & Targets'}</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Section 16 — BMR / TDEE Calculation Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
              <div className="flex items-center gap-2 text-emerald-400">
                <Calculator className="w-5 h-5" />
                <h3 className="font-extrabold text-base font-heading">
                  Scientific Energy Estimation
                </h3>
              </div>

              {/* BMR Card */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Estimated BMR (Basal Metabolic Rate)
                </div>
                <div className="text-3xl font-black text-emerald-400 font-heading">
                  {liveBmr} <span className="text-xs text-slate-400 font-medium">kcal/day</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Calories burned at absolute rest to maintain vital involuntary cellular and organ functions.
                </p>
              </div>

              {/* TDEE Card */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Estimated TDEE (Daily Energy Expenditure)
                </div>
                <div className="text-3xl font-black text-orange-400 font-heading">
                  {liveTdee} <span className="text-xs text-slate-400 font-medium">kcal/day</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Total daily burn including daily physical movement and {activityLevel.toLowerCase()} factor.
                </p>
              </div>

              {/* Formula explanation */}
              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700 text-[11px] text-slate-300 leading-relaxed space-y-1">
                <span className="font-bold text-white block">Mifflin-St Jeor Methodology:</span>
                <p>
                  BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age {gender === 'female' ? '- 161' : '+ 5'}
                </p>
              </div>

              {/* Mandatory Medical Disclaimer Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5 leading-relaxed">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Important Notice:</strong> "This is an estimate for general informational purposes and is not medical advice."
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

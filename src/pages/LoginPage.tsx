import React, { useState } from 'react';
import { Utensils, Lock, Mail, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onNavigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('demo@smartnutrition.ai');
  const [password, setPassword] = useState<string>('password123');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      onNavigate('/dashboard');
    } else {
      setError('Invalid credentials. You can use the Quick Demo Login below!');
    }
  };

  const handleQuickDemo = async () => {
    setEmail('demo@smartnutrition.ai');
    setPassword('password123');
    setLoading(true);
    await login('demo@smartnutrition.ai', 'password123');
    setLoading(false);
    onNavigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2.5 cursor-pointer mb-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Utensils className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 font-heading">
            SMART<span className="text-emerald-600">NUTRITION</span>
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-heading">
          Sign In to Your Health Dashboard
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Track meals, view macro charts, and personalize your calorie targets
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs">
              {error}
            </div>
          )}

          {/* Quick Demo One-Click Access Button */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Viva & Demo Quick Access</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Pre-filled with demo user profile, 7-day intake data, and meals.
            </p>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
            >
              Sign In with 1-Click Demo Account
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] uppercase font-bold text-slate-400 absolute">
              or enter credentials
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('/register')}
                className="font-bold text-emerald-600 hover:underline"
              >
                Register now
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

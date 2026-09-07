import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Bug, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, register, setCurrentPage, isBugMode, openQADrawerToTab } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  
  // BUG-09 state
  const [showConfirmPasswordVisual, setShowConfirmPasswordVisual] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const res = login(loginEmail, loginPassword);
    if (res.success) {
      setCurrentPage('home');
    } else {
      setLoginError(res.error || 'Login failed.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    const res = register(regName, regEmail, regPassword, regConfirmPassword);
    if (res.success) {
      setCurrentPage('home');
    } else {
      setRegError(res.error || 'Registration failed.');
    }
  };

  const handleQuickDemoFill = (role: 'tester' | 'admin') => {
    if (role === 'tester') {
      setLoginEmail('tester@testcraft.io');
      setLoginPassword('password123');
    }
    setLoginError(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* QA Target Bug Badge */}
      <div className="flex justify-center">
        <button
          onClick={() => openQADrawerToTab('bugs')}
          className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 flex items-center gap-1.5 hover:bg-rose-100 transition-colors"
        >
          <Bug className="w-3.5 h-3.5 text-rose-600" />
          <span>Target Bugs: BUG-09 (Eye Icon Desync), BUG-14 (Trailing Space)</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top Tab Selector */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 text-center">
          <button
            onClick={() => {
              setAuthMode('login');
              setLoginError(null);
            }}
            className={`py-3.5 text-xs sm:text-sm font-bold transition-all ${
              authMode === 'login'
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            id="tab-auth-login-btn"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode('register');
              setRegError(null);
            }}
            className={`py-3.5 text-xs sm:text-sm font-bold transition-all ${
              authMode === 'register'
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            id="tab-auth-register-btn"
          >
            Create Account
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* LOGIN FORM */}
          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-1 text-left">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Welcome back
                </h2>
                <p className="text-slate-500">
                  Sign in to manage orders, saved carts, and QA testing reports.
                </p>
              </div>

              {/* Quick Fill Button */}
              <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-indigo-950 block">Demo Tester Account</span>
                  <span className="text-[11px] text-indigo-700">tester@testcraft.io / password123</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('tester')}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
                >
                  <Zap className="w-3 h-3" />
                  Auto-Fill
                </button>
              </div>

              {/* Email Input (BUG-14) */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="tester@testcraft.io"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    id="login-email-input"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Tip: Try pasting "tester@testcraft.io " with a space at the end (BUG-14).
                </span>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    id="login-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                id="login-submit-btn"
              >
                <span>Sign In to QA Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* REGISTER FORM (BUG-09 & BUG-14) */
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="space-y-1 text-left">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Create Tester Account
                </h2>
                <p className="text-slate-500">
                  Join the platform to test order tracking and profile workflows.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Alex Morgan"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    id="register-name-input"
                  />
                </div>
              </div>

              {/* Email (BUG-14) */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="alex@testcraft.io"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    id="register-email-input"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    id="register-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (BUG-09: In Bug Mode, input type stays "password" despite visual icon toggle!) */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    // BUG-09: If isBugMode is active, input type is hardcoded to "password" regardless of showConfirmPasswordVisual!
                    type={isBugMode ? 'password' : (showConfirmPasswordVisual ? 'text' : 'password')}
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    id="register-confirm-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPasswordVisual(!showConfirmPasswordVisual)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                    title="Toggle password visibility (Notice BUG-09!)"
                    id="toggle-confirm-password-eye-btn"
                  >
                    {showConfirmPasswordVisual ? <EyeOff className="w-4 h-4 text-indigo-600" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Tip: Click the eye icon on Confirm Password to see if text unmasks (BUG-09).
                </span>
              </div>

              {regError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                id="register-submit-btn"
              >
                <span>Register Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

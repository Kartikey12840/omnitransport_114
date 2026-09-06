import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Zap, Lock, Mail, User, Building, ArrowRight, Sparkles, X, CheckCircle2 } from 'lucide-react';
import Modal from '../Common/Modal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import Badge from '../Common/Badge.jsx';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const { login, register, quickLogin } = useAuth();
  const [tab, setTab] = useState('demo'); // 'demo' | 'signin' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickLogin = (selectedRole) => {
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      try {
        quickLogin(selectedRole);
        setIsLoading(false);
        onClose();
        if (onSuccess) onSuccess();
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }, 250);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      try {
        login(email, password);
        setIsLoading(false);
        onClose();
        if (onSuccess) onSuccess();
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }, 300);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      try {
        register({ name, email, role, organization: organization || 'Urban Planning Agency' });
        setIsLoading(false);
        onClose();
        if (onSuccess) onSuccess();
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ChargeOpt Authentication & Workspaces"
      subtitle="Sign in to save personal scenarios or access the Administrator Console"
      maxWidth="max-w-md"
    >
      {/* Tab Switcher */}
      <div className="flex items-center gap-1 bg-dark-950 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => { setTab('demo'); setError(''); }}
          className={`flex-1 py-1.5 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            tab === 'demo' ? 'bg-emerald-500 text-dark-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Demo</span>
        </button>
        <button
          type="button"
          onClick={() => { setTab('signin'); setError(''); }}
          className={`flex-1 py-1.5 font-bold rounded-lg transition-all ${
            tab === 'signin' ? 'bg-emerald-500 text-dark-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setTab('register'); setError(''); }}
          className={`flex-1 py-1.5 font-bold rounded-lg transition-all ${
            tab === 'register' ? 'bg-emerald-500 text-dark-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Register
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2">
          <span className="font-bold">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* 1. QUICK DEMO TAB (Ideal for Hackathon Judges) */}
      {tab === 'demo' && (
        <div className="space-y-3 pt-1">
          <div className="bg-dark-850 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
            <span className="text-[10px] font-bold uppercase text-emerald-400">1-Click Judge Access</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Instantly test authenticated features without entering credentials.
            </p>
          </div>

          {/* Quick Admin Login */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleQuickLogin('admin')}
            className="w-full p-3.5 rounded-xl bg-gradient-to-r from-purple-950/60 to-dark-850 border border-purple-500/50 hover:border-purple-400 text-left transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-100">Administrator Access</span>
                  <Badge variant="purple" size="xs">Super Admin</Badge>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Full access: User Directory, System Audit Logs & Role Management
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Quick City Planner Login */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleQuickLogin('user')}
            className="w-full p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-dark-850 border border-emerald-500/50 hover:border-emerald-400 text-left transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold">
                🧭
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-100">City Planner Workspace</span>
                  <Badge variant="emerald" size="xs">Planner</Badge>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Personal Dashboard: Save custom scenarios & project roadmaps
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* 2. SIGN IN TAB */}
      {tab === 'signin' && (
        <form onSubmit={handleSignIn} className="space-y-3 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@chargeopt.ai"
                className="w-full bg-dark-850 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-dark-850 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-dark-950 font-extrabold text-xs shadow-glow-emerald transition-all mt-2"
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Workspace'}
          </button>
        </form>
      )}

      {/* 3. REGISTER TAB */}
      {tab === 'register' && (
        <form onSubmit={handleRegister} className="space-y-3 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Dr. Rajesh Varma"
                className="w-full bg-dark-850 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="rajesh@transport.gov.in"
                className="w-full bg-dark-850 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Organization / Agency</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={organization}
                onChange={e => setOrganization(e.target.value)}
                placeholder="Karnataka State EV Directorate"
                className="w-full bg-dark-850 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-dark-850 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Requested Account Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full bg-dark-850 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="user">City Planner / Operator (Standard User)</option>
              <option value="admin">Infrastructure Administrator (Full Access)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-dark-950 font-extrabold text-xs shadow-glow-emerald transition-all mt-2"
          >
            {isLoading ? 'Registering...' : 'Create Planning Account'}
          </button>
        </form>
      )}
    </Modal>
  );
}

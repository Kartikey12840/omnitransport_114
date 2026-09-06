import React, { useState } from 'react';
import { 
  Zap, 
  MapPin, 
  Sliders, 
  BarChart3, 
  BookmarkCheck, 
  BookOpen, 
  Sparkles, 
  Download,
  User,
  ShieldCheck,
  LogOut,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import { CITIES_LIST } from '../../data/cities.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Badge from './Badge.jsx';

export default function Navbar({
  activeView,
  setActiveView,
  currentCityId,
  onCityChange,
  activeScenarioName,
  optimizationResult,
  onOpenExport,
  onOpenMethodology,
  onToggleAI,
  onOpenAuth
}) {
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="h-16 bg-dark-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 flex items-center justify-between z-30 select-none">
      {/* 1. Brand & City Selector */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 p-0.5 shadow-glow-emerald flex items-center justify-center group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white font-mono">CHARGEOPT</span>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 rounded">AI</span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">Intelligent EV Placement</p>
          </div>
        </button>

        <div className="h-6 w-px bg-slate-800 hidden md:block" />

        {/* City Dropdown */}
        <div className="relative flex items-center gap-2 bg-dark-850 border border-slate-700/60 rounded-xl px-2.5 sm:px-3 py-1.5">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <select
            value={currentCityId}
            onChange={(e) => onCityChange(e.target.value)}
            className="bg-transparent text-xs sm:text-sm font-semibold text-slate-100 focus:outline-none cursor-pointer pr-1"
          >
            {CITIES_LIST.map(city => (
              <option key={city.id} value={city.id} className="bg-dark-900 text-slate-200">
                {city.name} {city.isDemoPrimary ? '★' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Active Scenario Pill */}
        {activeScenarioName && (
          <div className="hidden xl:flex items-center gap-2 bg-dark-850/60 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Plan:</span>
            <span className="font-medium text-emerald-300 truncate max-w-[140px]">{activeScenarioName}</span>
          </div>
        )}
      </div>

      {/* 2. Center Navigation Links */}
      <nav className="hidden lg:flex items-center gap-1 bg-dark-950/60 p-1 rounded-xl border border-slate-800/80">
        <button
          onClick={() => setActiveView('planning')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeView === 'planning'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Planning</span>
        </button>

        <button
          onClick={() => setActiveView('analytics')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeView === 'analytics'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => setActiveView('scenarios')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeView === 'scenarios'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <BookmarkCheck className="w-3.5 h-3.5" />
          <span>Scenarios</span>
        </button>

        {/* User Dashboard Nav Link if logged in */}
        {isAuthenticated && (
          <button
            onClick={() => setActiveView('user_dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'user_dashboard'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>My Workspace</span>
          </button>
        )}

        {/* Admin Console Nav Link if admin */}
        {isAdmin && (
          <button
            onClick={() => setActiveView('admin_console')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'admin_console'
                ? 'bg-purple-950/60 text-purple-300 border border-purple-500/50 shadow-sm'
                : 'text-purple-400 hover:text-purple-300 hover:bg-purple-950/40'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Console</span>
          </button>
        )}
      </nav>

      {/* 3. Right Quick Actions & Authentication */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleAI}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold shadow-glow-emerald transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>

        <button
          onClick={onOpenMethodology}
          title="View Methodology & Formula"
          className="p-2 rounded-xl bg-dark-850 hover:bg-slate-800 text-slate-300 border border-slate-700/60 text-xs transition-colors hidden xl:flex items-center gap-1.5"
        >
          <BookOpen className="w-4 h-4 text-slate-400" />
          <span>Methodology</span>
        </button>

        <button
          onClick={onOpenExport}
          title="Export Planning Report"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-dark-950 font-semibold text-xs transition-all shadow-md hidden sm:flex"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        {/* Auth Section: User Avatar or Sign In Button */}
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(prev => !prev)}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-dark-850 hover:bg-slate-800 border border-slate-700/70 transition-all text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-dark-800 border border-slate-700 flex items-center justify-center font-bold text-xs">
                {currentUser?.avatar || '👤'}
              </div>
              <div className="hidden md:block">
                <span className="text-xs font-bold text-slate-200 block truncate max-w-[100px] leading-tight">
                  {currentUser?.name?.split(' ')[0]}
                </span>
                <span className="text-[9px] text-emerald-400 uppercase font-mono font-bold leading-none">
                  {currentUser?.role === 'admin' ? 'Admin' : 'Planner'}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden md:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-dark-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in text-xs space-y-1">
                <div className="px-2.5 py-2 border-b border-slate-800">
                  <strong className="text-slate-100 font-bold block truncate">{currentUser?.name}</strong>
                  <span className="text-[10px] text-slate-400 truncate block">{currentUser?.email}</span>
                </div>

                <button
                  onClick={() => { setActiveView('user_dashboard'); setIsProfileOpen(false); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>My Workspace</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => { setActiveView('admin_console'); setIsProfileOpen(false); }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-purple-950/60 text-purple-300 flex items-center gap-2 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Admin Console</span>
                  </button>
                )}

                <button
                  onClick={() => { logout(); setIsProfileOpen(false); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-950/40 text-rose-300 flex items-center gap-2 transition-colors pt-1 border-t border-slate-800/80"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-850 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold transition-all shadow-sm"
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Sign In / Demo</span>
          </button>
        )}
      </div>
    </header>
  );
}

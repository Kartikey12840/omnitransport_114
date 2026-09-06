import React, { useState } from 'react';
import { 
  User, 
  Building, 
  MapPin, 
  Calendar, 
  BookmarkCheck, 
  Zap, 
  TrendingUp, 
  Sliders, 
  Play, 
  Trash2, 
  Plus, 
  FileText, 
  ShieldCheck, 
  Clock, 
  Settings,
  Bell,
  Cpu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import Badge from '../Common/Badge.jsx';

export default function PersonalDashboard({
  onOpenPlanning,
  onLoadScenario
}) {
  const { currentUser, activityLogs } = useAuth();
  const [activeTab, setActiveTab] = useState('scenarios'); // 'scenarios' | 'projects' | 'settings'

  // User's personal saved scenarios from localStorage
  const [myScenarios, setMyScenarios] = useState(() => {
    try {
      const saved = localStorage.getItem('chargeopt_saved_scenarios');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [utilityAlerts, setUtilityAlerts] = useState(true);
  const [minHeadroomMw, setMinHeadroomMw] = useState(1.5);

  const userLogs = activityLogs.filter(log => log.userId === currentUser?.id || log.userName === currentUser?.name);

  const handleDeleteScenario = (id) => {
    const updated = myScenarios.filter(s => s.id !== id);
    setMyScenarios(updated);
    try {
      localStorage.setItem('chargeopt_saved_scenarios', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 animate-fade-in text-slate-100">
      {/* 1. Header Profile Banner */}
      <div className="bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-glow-emerald flex-shrink-0">
            <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center text-2xl font-bold">
              {currentUser?.avatar || '🧭'}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">{currentUser?.name || 'Urban Mobility Planner'}</h1>
              <Badge variant={currentUser?.role === 'admin' ? 'purple' : 'emerald'}>
                {currentUser?.role === 'admin' ? 'Super Administrator' : 'City Planner'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-slate-500" /> {currentUser?.organization || 'BBMP / BESCOM Planning'}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-500" /> {currentUser?.email || 'planner@chargeopt.ai'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPlanning}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-dark-950 font-extrabold text-xs shadow-glow-emerald transition-all"
          >
            <Sliders className="w-4 h-4" />
            <span>Open Map Planning Engine</span>
          </button>
        </div>
      </div>

      {/* 2. Personal KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>My Deployment Plans</span>
            <BookmarkCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-slate-100">{myScenarios.length}</div>
          <p className="text-[10px] text-slate-500 mt-1">Saved optimization plans</p>
        </div>

        <div className="bg-dark-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Target Fast Plugs</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-cyan-400">
            {myScenarios.reduce((acc, s) => acc + (s.stationCount * 4 || 12), 0)}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">120kW+ DC charging guns</p>
        </div>

        <div className="bg-dark-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Avg Coverage Lift</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-amber-400">+12.8%</div>
          <p className="text-[10px] text-slate-500 mt-1">Marginal network expansion</p>
        </div>

        <div className="bg-dark-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Grid Reliability Status</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-purple-400">OPTIMAL</div>
          <p className="text-[10px] text-slate-500 mt-1">Substation headroom compliant</p>
        </div>
      </div>

      {/* 3. Main Workspace Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('scenarios')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'scenarios'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          My Deployment Scenarios ({myScenarios.length})
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'projects'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Capital Project Workspaces
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'settings'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Utility Preferences
        </button>
      </div>

      {/* Tab 1: Scenarios List */}
      {activeTab === 'scenarios' && (
        <div className="space-y-4">
          {myScenarios.length === 0 ? (
            <div className="bg-dark-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <BookmarkCheck className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-200">No Personal Scenarios Saved Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Run an optimization scenario on the planning map and click "Save Scenario" to track it in your private workspace.
              </p>
              <button
                onClick={onOpenPlanning}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-dark-950 font-bold text-xs shadow-glow-emerald"
              >
                Run First Scenario
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myScenarios.map((scen) => (
                <div
                  key={scen.id}
                  className="bg-dark-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
                          {scen.cityName || scen.cityId} • {scen.objectiveName || scen.objective}
                        </span>
                        <h3 className="text-base font-bold text-slate-100 mt-0.5">{scen.name}</h3>
                      </div>
                      <span className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        +{scen.coverageLift}% Lift
                      </span>
                    </div>

                    <div className="my-3 space-y-1 bg-dark-850 p-2.5 rounded-xl border border-slate-800 text-xs">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Shortlisted Hubs:</span>
                      <div className="text-slate-300 font-medium line-clamp-2">
                        {scen.stationsList ? scen.stationsList.join(', ') : `${scen.stationCount} Stations`}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Saved: {scen.createdAt}</span>
                      <span>Coverage: <strong className="text-slate-200">{scen.projectedCoverage}%</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-800 text-xs">
                    <button
                      onClick={() => handleDeleteScenario(scen.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete Scenario"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onLoadScenario(scen)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold transition-all"
                    >
                      <Play className="w-3 h-3 fill-emerald-300" />
                      <span>Load into Map</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Project Workspaces */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-dark-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-100">Bengaluru Outer Ring Road Hubs (Phase 1)</h4>
              <Badge variant="emerald">ACTIVE PROJECT</Badge>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prioritized corridor addressing Marathahalli Junction and Bellandur tech parks with 120kW+ fast chargers.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800 text-slate-300">
              <div>Budget Estimate: <strong className="text-slate-100">₹2.8 Cr</strong></div>
              <div>Timeline: <strong className="text-slate-100">Q4 2026</strong></div>
            </div>
          </div>

          <div className="bg-dark-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-100">Mumbai Western Express Spine (Phase 2)</h4>
              <Badge variant="cyan">UNDER REVIEW</Badge>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              High-density deployment along Goregaon Link Road and Andheri-Kurla arterial routes.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800 text-slate-300">
              <div>Budget Estimate: <strong className="text-slate-100">₹3.4 Cr</strong></div>
              <div>Timeline: <strong className="text-slate-100">Q1 2027</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Utility Settings */}
      {activeTab === 'settings' && (
        <div className="bg-dark-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-w-2xl">
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-400" />
            DISCOM & Grid Constraint Preferences
          </h4>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-dark-850 border border-slate-800 cursor-pointer">
              <div>
                <span className="font-bold text-slate-200 block">Substation Headroom Warnings</span>
                <span className="text-slate-400 text-[11px]">Flag sites located within 1km of substations below headroom threshold</span>
              </div>
              <input
                type="checkbox"
                checked={utilityAlerts}
                onChange={e => setUtilityAlerts(e.target.checked)}
                className="accent-emerald-500 rounded cursor-pointer"
              />
            </label>

            <div className="p-3 rounded-xl bg-dark-850 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-slate-200">Minimum Transformer Headroom:</span>
                <span className="font-mono text-emerald-400 font-bold">{minHeadroomMw} MW</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.0"
                step="0.5"
                value={minHeadroomMw}
                onChange={e => setMinHeadroomMw(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Personal Activity Trail */}
      <div className="bg-dark-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          Personal Audit Trail & Optimization History
        </h4>
        <div className="space-y-2 text-xs">
          {userLogs.length === 0 ? (
            <p className="text-slate-500 text-xs">No recent activity recorded.</p>
          ) : (
            userLogs.slice(0, 5).map(log => (
              <div key={log.id} className="flex items-center justify-between p-2.5 rounded-xl bg-dark-850/60 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-dark-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
                    {log.action}
                  </span>
                  <span className="text-slate-300">{log.details}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

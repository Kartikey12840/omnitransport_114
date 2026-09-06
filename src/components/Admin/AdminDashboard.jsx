import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Activity, 
  Download, 
  Trash2, 
  CheckCircle2, 
  ArrowUpRight, 
  Sliders, 
  Sparkles, 
  Building, 
  Clock,
  Search,
  UserPlus,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import Badge from '../Common/Badge.jsx';

export default function AdminDashboard({ onOpenPlanning }) {
  const { users, currentUser, updateUserRole, deleteUser, activityLogs } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                          u.email.toLowerCase().includes(search.toLowerCase()) ||
                          (u.organization && u.organization.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Filter logs
  const filteredLogs = activityLogs.filter(log => {
    if (actionFilter === 'ALL') return true;
    return log.action.includes(actionFilter);
  });

  const handleToggleRole = (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    updateUserRole(userId, newRole);
  };

  const handleExportUsersCSV = () => {
    const headers = ['User ID', 'Name', 'Email', 'Role', 'Organization', 'Title', 'Joined Date', 'Last Active', 'Scenarios'];
    const rows = users.map(u => [
      u.id,
      `"${u.name}"`,
      `"${u.email}"`,
      u.role,
      `"${u.organization || ''}"`,
      `"${u.title || ''}"`,
      u.joinedDate,
      `"${u.lastActive || ''}"`,
      u.scenariosCount || 0
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ChargeOpt_User_Directory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 animate-fade-in text-slate-100">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="purple">ADMINISTRATOR CONTROL CONSOLE</Badge>
            <span className="text-xs text-slate-400">Authenticated: <strong className="text-purple-300">{currentUser?.name}</strong></span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-1">Platform Infrastructure & User Monitoring</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor registered planners, manage system roles, inspect optimization activity, and audit platform security
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportUsersCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-dark-850 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Users CSV</span>
          </button>

          <button
            onClick={onOpenPlanning}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-dark-950 font-extrabold text-xs shadow-glow-emerald transition-all"
          >
            <Sliders className="w-4 h-4" />
            <span>Map Command Center</span>
          </button>
        </div>
      </div>

      {/* 2. Platform KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Total Registered Planners</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-purple-400">{users.length}</div>
          <p className="text-[10px] text-slate-500 mt-1">{users.filter(u => u.role === 'admin').length} Admins • {users.filter(u => u.role === 'user').length} Planners</p>
        </div>

        <div className="bg-dark-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Audit Actions Logged</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-cyan-400">{activityLogs.length}</div>
          <p className="text-[10px] text-slate-500 mt-1">Real-time telemetry tracked</p>
        </div>

        <div className="bg-dark-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Operational Chargers Mapped</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-emerald-400">50</div>
          <p className="text-[10px] text-slate-500 mt-1">Across BLR, MUM, & DEL</p>
        </div>

        <div className="bg-dark-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Optimization Engine Health</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-amber-400">99.9%</div>
          <p className="text-[10px] text-slate-500 mt-1">MCLP Solver Status: Active</p>
        </div>
      </div>

      {/* 3. User Directory Table */}
      <div className="bg-dark-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Registered User Directory & Access Management
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect user metadata, organizations, scenario creation, and toggle administrative privileges
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, email, or org..."
                className="bg-dark-850 border border-slate-700 text-xs text-slate-200 rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-purple-500 w-56"
              />
            </div>

            <div className="flex bg-dark-850 p-1 rounded-xl border border-slate-800 text-xs">
              {['ALL', 'admin', 'user'].map(r => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                    roleFilter === r ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r === 'ALL' ? 'All Roles' : r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-dark-850 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <th className="p-3">User</th>
                <th className="p-3">Organization & Title</th>
                <th className="p-3">Role</th>
                <th className="p-3">Joined Date</th>
                <th className="p-3">Last Active</th>
                <th className="p-3">Scenarios</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-dark-850/40 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-dark-800 border border-slate-700 flex items-center justify-center font-bold text-sm">
                        {u.avatar || '👤'}
                      </div>
                      <div>
                        <strong className="text-slate-100 font-bold block">{u.name}</strong>
                        <span className="text-[11px] text-slate-400">{u.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <span className="text-slate-200 block font-medium">{u.organization || 'Independent'}</span>
                    <span className="text-[10px] text-slate-400">{u.title || 'Planner'}</span>
                  </td>

                  <td className="p-3">
                    <Badge variant={u.role === 'admin' ? 'purple' : 'cyan'}>
                      {u.role.toUpperCase()}
                    </Badge>
                  </td>

                  <td className="p-3 font-mono text-slate-400 text-[11px]">{u.joinedDate}</td>
                  <td className="p-3 font-mono text-slate-400 text-[11px]">{u.lastActive || 'Today'}</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">{u.scenariosCount || 0}</td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleRole(u.id, u.role)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                          u.role === 'admin'
                            ? 'bg-purple-950/60 text-purple-300 border-purple-700 hover:bg-purple-900/60'
                            : 'bg-dark-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                        title="Toggle User / Admin Role"
                      >
                        {u.role === 'admin' ? 'Demote to User' : 'Make Admin'}
                      </button>

                      {u.id !== currentUser?.id && (
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Real-Time Platform Activity Audit Stream */}
      <div className="bg-dark-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Live Security & Activity Audit Log
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological log of optimizations computed, reports exported, and authorization events
            </p>
          </div>

          <div className="flex bg-dark-850 p-1 rounded-xl border border-slate-800 text-xs">
            {['ALL', 'LOGIN', 'OPTIMIZATION', 'REPORT'].map(act => (
              <button
                key={act}
                onClick={() => setActionFilter(act)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                  actionFilter === act ? 'bg-cyan-600 text-dark-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {act}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
          {filteredLogs.map(log => (
            <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-850/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-bold bg-dark-800 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/60">
                  {log.action}
                </span>
                <div>
                  <span className="text-slate-200 font-medium block">{log.details}</span>
                  <span className="text-[10px] text-slate-500">Initiator: <strong className="text-slate-400">{log.userName}</strong></span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

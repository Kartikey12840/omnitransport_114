import React, { useState } from 'react';
import { Zap, MapPin, Search, Filter, ShieldCheck, ArrowUpRight, Gauge, CheckCircle2 } from 'lucide-react';
import Badge from '../Common/Badge.jsx';

export default function ExistingStationsList({
  stations = [],
  selectedStation,
  onSelectStation,
  cityName
}) {
  const [search, setSearch] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('ALL');

  // Extract unique operators
  const operators = ['ALL', ...Array.from(new Set(stations.map(s => s.operator))).filter(Boolean)];

  const filtered = stations.filter(stn => {
    const matchesSearch = stn.name.toLowerCase().includes(search.toLowerCase()) ||
                          stn.address.toLowerCase().includes(search.toLowerCase()) ||
                          stn.operator.toLowerCase().includes(search.toLowerCase());
    const matchesOp = operatorFilter === 'ALL' || stn.operator === operatorFilter;
    return matchesSearch && matchesOp;
  });

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
              Existing Charging Stations
            </h3>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 font-mono font-bold px-2 py-0.5 rounded border border-cyan-800">
              {filtered.length} Mapped
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Operational EV charging infrastructure in {cityName}
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by station, operator, or locality..."
          className="w-full bg-dark-850 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Operator Filter Chips */}
      <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
        {operators.slice(0, 5).map(op => (
          <button
            key={op}
            onClick={() => setOperatorFilter(op)}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors ${
              operatorFilter === op
                ? 'bg-cyan-500 text-dark-950'
                : 'bg-dark-850 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {op === 'ALL' ? 'All Operators' : op.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Stations Scrollable List */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500">
            No charging stations match your search.
          </div>
        ) : (
          filtered.map((stn) => {
            const isSelected = selectedStation?.id === stn.id;
            return (
              <div
                key={stn.id}
                onClick={() => onSelectStation(stn)}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-glow-cyan ring-1 ring-cyan-400/50'
                    : 'bg-dark-850/60 border-slate-800 hover:border-slate-700 hover:bg-dark-800/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-700 text-cyan-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      ⚡
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {stn.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {stn.address}
                      </p>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800 flex-shrink-0">
                    {stn.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/60 text-[10px]">
                  <div>
                    <span className="text-slate-500 block">Operator</span>
                    <strong className="text-slate-300 truncate block">{stn.operator}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Power</span>
                    <strong className="text-cyan-400 font-mono">{stn.power_kw} kW</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Ports</span>
                    <strong className="text-slate-200 font-mono">{stn.ports} Plugs</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/40 text-[10px] text-slate-400">
                  <span className="truncate">{stn.charger_type}</span>
                  <button
                    type="button"
                    className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-0.5 flex-shrink-0"
                  >
                    <span>View on Map</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

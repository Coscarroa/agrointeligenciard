/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const MapLegend: React.FC = () => {
  return (
    <div className="hidden sm:block absolute bottom-8 md:bottom-9 left-4 z-10 p-3 bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-xl shadow-xl text-xs space-y-2 max-w-xs">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
          Macro-Regiones (Ley 345-22)
        </span>
        <span className="text-[9px] text-sky-400 font-mono">IGN 2023</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-sky-500/40 border border-sky-400 shrink-0"></span>
          <div>
            <div className="text-slate-200 font-medium">Cibao / Norte (14 provincias)</div>
            <div className="text-[10px] text-slate-400">Regiones I, II, III, IV</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-emerald-500/40 border border-emerald-400 shrink-0"></span>
          <div>
            <div className="text-slate-200 font-medium">Suroeste (10 provincias)</div>
            <div className="text-[10px] text-slate-400">Regiones V, VI, VII</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-amber-500/40 border border-amber-400 shrink-0"></span>
          <div>
            <div className="text-slate-200 font-medium">Sureste (8 provincias)</div>
            <div className="text-[10px] text-slate-400">Regiones VIII, IX, X</div>
          </div>
        </div>
      </div>
    </div>
  );
};

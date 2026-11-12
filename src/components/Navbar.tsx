/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Sprout, Filter } from 'lucide-react';

export const CROP_FILTER_OPTIONS = [
  { id: 'all', label: 'Todos los cultivos' },
  { id: 'Arroz', label: 'Arroz (Bajo Riego)' },
  { id: 'Cacao', label: 'Cacao (Orgánico & Fino)' },
  { id: 'Banano', label: 'Banano (Orgánico)' },
  { id: 'Plátano', label: 'Plátano' },
  { id: 'Café', label: 'Café (Especial & Altura)' },
  { id: 'Aguacate', label: 'Aguacate (Hass & Semil)' },
  { id: 'Caña de Azúcar', label: 'Caña de Azúcar' },
  { id: 'Mango', label: 'Mango (Banilejo & Keitt)' },
  { id: 'Cebolla', label: 'Cebolla' },
  { id: 'Tabaco', label: 'Tabaco (Cigarro Premium)' },
  { id: 'Piña', label: 'Piña (MD2)' },
];

interface NavbarProps {
  activeRegion: 'all' | 'cibao' | 'suroeste' | 'sureste';
  onSelectRegion: (region: 'all' | 'cibao' | 'suroeste' | 'sureste') => void;
  selectedCrop: string;
  onSelectCrop: (crop: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRegion,
  onSelectRegion,
  selectedCrop,
  onSelectCrop,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="absolute top-3 left-3 right-3 md:top-4 md:left-4 md:right-4 max-w-7xl mx-auto z-20 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 px-4 py-2 bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl">
      {/* Zone 1: Marca y Wordmark */}
      <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
        <svg className="w-6 h-4.5 rounded shadow-sm flex-shrink-0" viewBox="0 0 640 480" aria-label="Bandera Dominicana">
          <path fill="#002f6c" d="M0 0h640v480H0z"/>
          <path fill="#ce1126" d="M360 0h280v200H360zM0 280h280v200H0z"/>
          <path fill="#fff" d="M280 0h80v480h-80zM0 200h640v80H0z"/>
        </svg>
        <h1 className="font-outfit font-bold text-sm md:text-base text-white tracking-tight flex items-center gap-1.5">
          <span>República Dominicana</span>
          <span className="text-slate-500 font-normal">|</span>
          <span className="text-emerald-400 font-medium">Dashboard Agro-Tech</span>
        </h1>
      </div>

      {/* Zone 2: Filtros de Regiones Macroeconómicas */}
      <div className="flex items-center gap-2 overflow-x-auto py-0.5">
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onSelectRegion('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeRegion === 'all'
                ? 'bg-slate-700/80 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas (32)
          </button>
          <button
            onClick={() => onSelectRegion('cibao')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeRegion === 'cibao'
                ? 'bg-sky-950/90 text-sky-300 border border-sky-600/40'
                : 'text-slate-400 hover:text-sky-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            Cibao / Norte (14)
          </button>
          <button
            onClick={() => onSelectRegion('suroeste')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeRegion === 'suroeste'
                ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-600/40'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Suroeste (10)
          </button>
          <button
            onClick={() => onSelectRegion('sureste')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeRegion === 'sureste'
                ? 'bg-amber-950/90 text-amber-300 border border-amber-600/40'
                : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Sureste (8)
          </button>
        </div>
      </div>

      {/* Zone 3: 6. Filtro de Búsqueda Rápida por Tipo de Cultivo & Buscador */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Selector Desplegable Elegante de Cultivo */}
        <div className="relative flex items-center">
          <div className="absolute left-2.5 pointer-events-none text-emerald-400">
            <Sprout className="w-3.5 h-3.5" />
          </div>
          <select
            value={selectedCrop}
            onChange={(e) => onSelectCrop(e.target.value)}
            className="pl-8 pr-7 py-1 text-xs font-medium rounded-xl bg-slate-950/90 border border-emerald-800/60 text-emerald-300 hover:border-emerald-600 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer shadow-sm appearance-none"
            title="Filtrar provincias por cultivo predominante"
          >
            {CROP_FILTER_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id} className="bg-slate-900 text-slate-100 py-1">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-2 pointer-events-none text-slate-400 text-[10px]">
            ▼
          </div>
        </div>

        {/* Buscador de Provincias */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar provincia..."
            className="w-36 md:w-44 pl-8 pr-3 py-1 text-xs rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>
      </div>
    </header>
  );
};

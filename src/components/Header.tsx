/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * HEADER DEL DASHBOARD AGROTECNOLÓGICO DE LA REPÚBLICA DOMINICANA
 * Estructura visual de dos niveles:
 * 1. Nivel Superior: Banner panorámico con la imagen oficial 'Header img.jpeg' ("AGROINTELIGENCIA RD - Tecnología para el Campo")
 * 2. Nivel Inferior: Barra de herramientas oscura integrada (bg-[#0B1120] / slate-950), compacta y con alineación a la izquierda.
 */

import React from 'react';
import { Search, Sprout, Heart, BookOpen } from 'lucide-react';

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

export interface HeaderProps {
  activeRegion: 'all' | 'cibao' | 'suroeste' | 'sureste';
  onSelectRegion: (region: 'all' | 'cibao' | 'suroeste' | 'sureste') => void;
  selectedCrop: string;
  onSelectCrop: (crop: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSupport?: () => void;
  onOpenGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeRegion,
  onSelectRegion,
  selectedCrop,
  onSelectCrop,
  searchQuery,
  onSearchChange,
  onOpenSupport,
  onOpenGuide,
}) => {
  return (
    <header className="absolute top-2 left-2 right-2 md:top-3 md:left-3 md:right-3 max-w-7xl mx-auto z-20 flex flex-col shadow-2xl transition-all duration-300">
      {/* =========================================================================
          NIVEL SUPERIOR — BANNER PANORÁMICO (Header img.jpeg)
          Altura ergonómica: 110px en escritorio (md:h-[110px]) y 85px en móvil (h-[85px])
          Encuadre: object-cover object-left para priorizar el logotipo y branding izquierdo
          ========================================================================= */}
      <div className="w-full h-[85px] md:h-[110px] overflow-hidden rounded-t-xl relative bg-slate-950 border-x border-t border-slate-700/60 shadow-inner">
        <img
          src="/assets/aistudio/Header_img_8e283bb9.jpeg"
          alt="AGROINTELIGENCIA RD - Tecnología para el Campo"
          className="w-full h-full object-cover object-left block select-none pointer-events-none"
          loading="eager"
          decoding="async"
          onError={(e) => {
            // Fallback elegante si la imagen se mueve a /Header img.jpeg o /header-img.jpeg
            const target = e.currentTarget;
            if (target.src.includes('Header_img_8e283bb9.jpeg')) {
              target.src = '/header-img.jpeg';
            } else if (target.src.includes('header-img.jpeg')) {
              target.src = '/Header img.jpeg';
            }
          }}
        />
        {/* Sutil overlay de degradado en el borde inferior para integrar con la barra de herramientas */}
        <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-b from-transparent to-[#0B1120]/80 pointer-events-none" />
      </div>

      {/* =========================================================================
          NIVEL INFERIOR — BARRA DE HERRAMIENTAS OSCURA INTEGRADA
          bg-[#0B1120] sin margen de separación, min-h-[52px], px-4 py-2, rounded-b-xl
          Alineación ESTRICTAMENTE a la izquierda (flex flex-wrap items-center justify-start gap-3)
          ========================================================================= */}
      <div className="w-full min-h-[52px] px-3.5 md:px-4 py-2 bg-[#0B1120] border-x border-b border-t border-slate-800/90 rounded-b-xl shadow-lg flex flex-wrap items-center justify-start gap-2.5 md:gap-3">
        {/* a) Filtros Regionales (Todas, Cibao, Suroeste, Sureste) */}
        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800/80 shrink-0">
          <button
            onClick={() => onSelectRegion('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeRegion === 'all'
                ? 'bg-slate-700/90 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas (32)
          </button>
          <button
            onClick={() => onSelectRegion('cibao')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeRegion === 'cibao'
                ? 'bg-sky-950/90 text-sky-300 border border-sky-600/50 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-sky-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            Cibao / Norte (14)
          </button>
          <button
            onClick={() => onSelectRegion('suroeste')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeRegion === 'suroeste'
                ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-600/50 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Suroeste (10)
          </button>
          <button
            onClick={() => onSelectRegion('sureste')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeRegion === 'sureste'
                ? 'bg-amber-950/90 text-amber-300 border border-amber-600/50 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Sureste (8)
          </button>
        </div>

        {/* b) Selector de Cultivos */}
        <div className="relative flex items-center shrink-0">
          <div className="absolute left-2.5 pointer-events-none text-emerald-400">
            <Sprout className="w-3.5 h-3.5" />
          </div>
          <select
            value={selectedCrop}
            onChange={(e) => onSelectCrop(e.target.value)}
            className="pl-8 pr-7 py-1 text-xs font-medium rounded-lg bg-slate-950/90 border border-emerald-800/70 text-emerald-300 hover:border-emerald-600 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer shadow-sm appearance-none"
            title="Filtrar cuencas por cultivo predominante"
          >
            {CROP_FILTER_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id} className="bg-slate-900 text-slate-100 py-1">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-2 pointer-events-none text-slate-400 text-[9px]">
            ▼
          </div>
        </div>

        {/* c) Buscador de Provincias */}
        <div className="relative shrink-0">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar provincia..."
            className="w-40 sm:w-48 pl-8 pr-3 py-1 text-xs rounded-lg bg-slate-950/80 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        {/* d) Botón de Apoyo Comunitario y Donación */}
        {onOpenSupport && (
          <button
            type="button"
            onClick={onOpenSupport}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg border border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 shadow-sm transition-all shrink-0 cursor-pointer group"
            title="Apoya el sostenimiento gratuito de los servidores de Agrointeligencia RD"
          >
            <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 group-hover:scale-110 transition-transform" />
            <span>Apoyar Proyecto</span>
          </button>
        )}

        {/* e) Botón Permanente de Manual Interactivo de Uso */}
        {onOpenGuide && (
          <button
            type="button"
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 shadow-sm transition-all shrink-0 cursor-pointer group"
            title="Abrir el Manual Interactivo de Uso de Agrointeligencia RD"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
            <span>¿Cómo usar?</span>
          </button>
        )}
      </div>
    </header>
  );
};

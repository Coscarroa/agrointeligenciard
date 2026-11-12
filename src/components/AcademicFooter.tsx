/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * FOOTER EDUCATIVO Y GREMIAL (FASE 1: AUTORIDAD ACADÉMICA)
 * Pie de página minimalista y elegante que refuerza el respaldo académico y el uso abierto
 * para facultades de agronomía (UASD, ISA, UNPHU) y asociaciones de productores.
 */

import React from 'react';
import { GraduationCap, Database, Heart, ShieldCheck } from 'lucide-react';

interface AcademicFooterProps {
  onOpenAdminMetrics?: () => void;
  isAdminVisible?: boolean;
}

export const AcademicFooter: React.FC<AcademicFooterProps> = ({
  onOpenAdminMetrics,
  isAdminVisible = false,
}) => {
  return (
    <footer className="absolute bottom-1 left-2 right-2 md:left-4 md:right-4 z-20 pointer-events-none flex flex-col sm:flex-row items-center justify-between gap-1.5 px-3 py-1.5 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 rounded-xl text-[10px] text-slate-400 select-none shadow-lg">
      {/* Texto de respaldo académico y de acceso abierto */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start pointer-events-auto">
        <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>
          Herramienta de acceso abierto para productores, asociaciones agrícolas y estudiantes de agronomía de la República Dominicana.
        </span>
      </div>

      {/* Fuente y crédito técnico */}
      <div className="flex items-center gap-3 shrink-0 pointer-events-auto">
        <span className="flex items-center gap-1 text-slate-400">
          <Database className="w-3 h-3 text-sky-400" />
          <span>Datos vía <strong>Open-Meteo</strong> & IGN</span>
        </span>

        {/* Acceso discreto para administrador de patrocinios (?admin=true) */}
        {isAdminVisible && (
          <button
            onClick={onOpenAdminMetrics}
            className="px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-600/60 hover:bg-emerald-800 transition-colors font-mono font-semibold"
            title="Ver métricas de tracción B2B acumuladas"
          >
            📊 Modo Admin B2B
          </button>
        )}
      </div>
    </footer>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PANEL ADMINISTRADOR DE MÉTRICAS (FASE 3: MONETIZACIÓN B2B)
 * Se activa agregando '?admin=true' en la URL.
 * Muestra el conteo de leads de productores registrados, distribución por provincias
 * y total de tareas agrícolas sumadas (medida clave para comercializar patrocinios B2B).
 */

import React, { useEffect, useState } from 'react';
import { X, Users, BarChart3, MapPin, Sprout, Download, ShieldCheck } from 'lucide-react';
import { FarmLeadData } from './AlertSubscriptionModal.tsx';

interface AdminMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminMetricsModal: React.FC<AdminMetricsModalProps> = ({ isOpen, onClose }) => {
  const [leads, setLeads] = useState<FarmLeadData[]>([]);

  useEffect(() => {
    if (isOpen) {
      try {
        const raw = localStorage.getItem('agromap_leads_rd');
        if (raw) {
          setLeads(JSON.parse(raw));
        } else {
          setLeads([]);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Cálculos agregados
  const totalLeads = leads.length;

  // Conteo por provincia
  const provinceCounts: Record<string, number> = {};
  leads.forEach((l) => {
    provinceCounts[l.provinceName] = (provinceCounts[l.provinceName] || 0) + 1;
  });

  const sortedProvinces = Object.entries(provinceCounts).sort((a, b) => b[1] - a[1]);

  // Conteo por cultivo
  const cropCounts: Record<string, number> = {};
  leads.forEach((l) => {
    cropCounts[l.crop] = (cropCounts[l.crop] || 0) + 1;
  });

  // Exportar a CSV para presentaciones a patrocinadores
  const exportToCsv = () => {
    if (leads.length === 0) return;
    const headers = ['Fecha', 'Productor', 'Canal', 'Teléfono', 'Email', 'Provincia', 'Cultivo', 'Tareas'];
    const rows = leads.map((l) => [
      l.createdAt,
      `"${l.producerName.replace(/"/g, '""')}"`,
      l.channel,
      l.phone,
      l.email,
      `"${l.provinceName}"`,
      `"${l.crop}"`,
      `"${l.farmSizeTareas}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agromap_leads_rd_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-600/40 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-outfit font-bold text-lg text-white">
                Métricas B2B · Red Agrointeligencia RD
              </h3>
              <p className="text-xs text-slate-400">
                Panel privado de tracción para patrocinadores y casas comerciales
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tarjetas de Métricas Resumen */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Productores</span>
            <div className="font-outfit font-bold text-2xl text-white mt-0.5">
              {totalLeads}
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Fincas verificadas</div>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Provincias Activas</span>
            <div className="font-outfit font-bold text-2xl text-sky-400 mt-0.5">
              {Object.keys(provinceCounts).length}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Con cobertura real</div>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Cultivo Líder</span>
            <div className="font-outfit font-bold text-lg text-amber-400 mt-0.5 truncate">
              {Object.entries(cropCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Arroz'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Mayor demanda</div>
          </div>
        </div>

        {/* Tablas de Desglose */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Top Provincias */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Demanda por Provincia</span>
            </span>
            {sortedProvinces.length === 0 ? (
              <div className="text-slate-500 py-3 text-center">No hay registros aún en este navegador.</div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {sortedProvinces.map(([prov, count]) => (
                  <div key={prov} className="flex items-center justify-between p-1.5 rounded bg-slate-900/80 text-[11px]">
                    <span className="text-slate-200">{prov}</span>
                    <span className="font-bold text-sky-400 font-mono">{count} fincas</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Cultivos */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>Distribución por Rubro</span>
            </span>
            {Object.keys(cropCounts).length === 0 ? (
              <div className="text-slate-500 py-3 text-center">No hay registros aún en este navegador.</div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {Object.entries(cropCounts).map(([c, count]) => (
                  <div key={c} className="flex items-center justify-between p-1.5 rounded bg-slate-900/80 text-[11px]">
                    <span className="text-slate-200">{c}</span>
                    <span className="font-bold text-emerald-400 font-mono">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-500">
            Almacenamiento: localStorage (`agromap_leads_rd`)
          </span>
          <button
            onClick={exportToCsv}
            disabled={leads.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold disabled:opacity-40 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar CSV para Patrocinadores</span>
          </button>
        </div>
      </div>
    </div>
  );
};

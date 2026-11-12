/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PROVINCE CROP REGIONAL COMPARISON (RECHARTS)
 * Comparación del volumen de producción (Toneladas anuales) de los cultivos principales
 * de la provincia seleccionada frente al promedio de su región macroeconómica.
 */

import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
} from 'recharts';
import { ProvinceData, DOMINICAN_PROVINCES } from '../data/dominicanProvinces.ts';
import { PROVINCIAL_AGRICULTURE, CropInfo } from '../data/provinciasData.ts';
import { TrendingUp, Scale, Sprout } from 'lucide-react';

interface ProvinceCropRegionalComparisonProps {
  province: ProvinceData;
}

export const ProvinceCropRegionalComparison: React.FC<ProvinceCropRegionalComparisonProps> = ({
  province,
}) => {
  // Obtener provincias de la misma región macroeconómica
  const regionalProvinces = useMemo(() => {
    return DOMINICAN_PROVINCES.filter(
      (p) => p.macroRegionCode === province.macroRegionCode
    );
  }, [province.macroRegionCode]);

  // Cultivos de la provincia seleccionada
  const currentAgro = PROVINCIAL_AGRICULTURE[province.id];
  const currentCrops: CropInfo[] = currentAgro ? currentAgro.predominantCrops : [];

  // Calcular el promedio regional por cada categoría de cultivo o cultivo homólogo
  const comparisonData = useMemo(() => {
    return currentCrops.map((crop) => {
      const cropName = crop.name;
      const cropCategory = crop.category;
      const provinceProdTon = crop.annualProductionTon || 30000;

      // Buscar producciones de cultivos de la misma categoría o mismo cultivo en la región
      let regionalTotal = 0;
      let matchCount = 0;

      regionalProvinces.forEach((p) => {
        const pAgro = PROVINCIAL_AGRICULTURE[p.id];
        if (!pAgro) return;

        // Buscar primero coincidencia exacta de nombre o categoría
        const exactMatch = pAgro.predominantCrops.find(
          (c) => c.name.toLowerCase() === cropName.toLowerCase()
        );

        if (exactMatch && exactMatch.annualProductionTon) {
          regionalTotal += exactMatch.annualProductionTon;
          matchCount++;
        } else {
          // Coincidencia por categoría
          const catMatch = pAgro.predominantCrops.find((c) => c.category === cropCategory);
          if (catMatch && catMatch.annualProductionTon) {
            regionalTotal += catMatch.annualProductionTon;
            matchCount++;
          }
        }
      });

      // Promedio regional
      const regionalAvgTon = matchCount > 0 ? Math.round(regionalTotal / matchCount) : Math.round(provinceProdTon * 0.85);
      const ratio = regionalAvgTon > 0 ? ((provinceProdTon - regionalAvgTon) / regionalAvgTon) * 100 : 0;

      // Abreviar nombre para el eje X
      const shortName = cropName.length > 14 ? cropName.slice(0, 12) + '…' : cropName;

      return {
        fullName: cropName,
        shortName,
        category: cropCategory,
        provinceProdTon,
        regionalAvgTon,
        diffPct: Number(ratio.toFixed(1)),
        isAboveAvg: provinceProdTon >= regionalAvgTon,
      };
    });
  }, [currentCrops, regionalProvinces]);

  const activeColor = {
    cibao: '#0ea5e9',
    suroeste: '#10b981',
    sureste: '#f59e0b',
  }[province.macroRegionCode] || '#10b981';

  if (comparisonData.length === 0) {
    return null;
  }

  return (
    <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-3 shadow-lg">
      {/* Encabezado */}
      <div className="flex items-center justify-between border-b border-slate-800/70 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
          <Scale className="w-3.5 h-3.5 text-emerald-400" />
          <span>Producción Agrícola vs. Promedio Regional</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          Región {province.region}
        </span>
      </div>

      {/* Resumen comparativo de liderazgo */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800/70">
          <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Cultivo Destacado</span>
          <div className="font-outfit font-bold text-xs text-white truncate mt-0.5">
            {comparisonData[0]?.fullName}
          </div>
          <div className="text-[9px] text-emerald-400 mt-0.5 font-mono">
            {comparisonData[0]?.provinceProdTon.toLocaleString('es-DO')} Ton/año
          </div>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800/70">
          <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Rendimiento Relativo</span>
          <div className="font-outfit font-bold text-xs mt-0.5 flex items-center gap-1 text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>
              {comparisonData[0]?.diffPct >= 0 ? `+${comparisonData[0]?.diffPct}%` : `${comparisonData[0]?.diffPct}%`}
            </span>
          </div>
          <div className="text-[9px] text-slate-400 mt-0.5">Frente a la media regional</div>
        </div>
      </div>

      {/* Gráfico de Barras Agrupadas con Recharts */}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={comparisonData}
            margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="shortName"
              stroke="#64748b"
              fontSize={9.5}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => {
                if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                if (val >= 1000) return `${Math.round(val / 1000)}k`;
                return val;
              }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900/95 border border-slate-700/80 px-3 py-2 rounded-xl shadow-2xl text-left text-xs z-50">
                      <div className="font-outfit font-bold text-white mb-1 flex items-center justify-between gap-3">
                        <span>{data.fullName}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {data.category}
                        </span>
                      </div>
                      <div className="space-y-0.5 font-mono text-[11px]">
                        <div className="text-emerald-400 flex items-center justify-between gap-3">
                          <span>{province.name}:</span>
                          <span className="font-bold">{data.provinceProdTon.toLocaleString('es-DO')} Ton</span>
                        </div>
                        <div className="text-slate-400 flex items-center justify-between gap-3">
                          <span>Promedio Regional:</span>
                          <span className="font-bold">{data.regionalAvgTon.toLocaleString('es-DO')} Ton</span>
                        </div>
                        <div className={`text-[10px] font-semibold mt-1 pt-1 border-t border-slate-800 flex items-center justify-between ${
                          data.diffPct >= 0 ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          <span>Diferencial:</span>
                          <span>{data.diffPct >= 0 ? `+${data.diffPct}% superior` : `${data.diffPct}% respecto a la media`}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }}
              iconSize={8}
            />
            {/* Barra 1: Producción de la Provincia Seleccionada */}
            <Bar
              dataKey="provinceProdTon"
              name={`${province.name} (Ton)`}
              fill={activeColor}
              radius={[3, 3, 0, 0]}
              barSize={12}
            />
            {/* Barra 2: Promedio de la Región Macroeconómica */}
            <Bar
              dataKey="regionalAvgTon"
              name={`Promedio ${province.region}`}
              fill="#64748b"
              radius={[3, 3, 0, 0]}
              barSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie descriptivo */}
      <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-900">
        <span>Fuente: Ministerio de Agricultura / Banco Central RD</span>
        <span className="text-emerald-400 font-medium">Volumen Anual (Ton)</span>
      </div>
    </div>
  );
};

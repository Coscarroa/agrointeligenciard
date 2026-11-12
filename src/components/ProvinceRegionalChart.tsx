/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ProvinceData, DOMINICAN_PROVINCES } from '../data/dominicanProvinces.ts';
import { Users, TrendingUp, Maximize2 } from 'lucide-react';

interface ProvinceRegionalChartProps {
  province: ProvinceData;
  onSelectProvince?: (province: ProvinceData) => void;
}

type MetricType = 'population' | 'economic' | 'surface';

export const ProvinceRegionalChart: React.FC<ProvinceRegionalChartProps> = ({
  province,
  onSelectProvince,
}) => {
  const [metric, setMetric] = useState<MetricType>('population');

  // Filtrar todas las provincias de la misma macro-región
  const regionalProvinces = useMemo(() => {
    return DOMINICAN_PROVINCES.filter(
      (p) => p.macroRegionCode === province.macroRegionCode
    );
  }, [province.macroRegionCode]);

  // Total acumulado regional para calcular porcentajes de contribución
  const regionalTotals = useMemo(() => {
    const totalPop = regionalProvinces.reduce((acc, p) => acc + (p.population || 0), 0);
    const totalSurface = regionalProvinces.reduce((acc, p) => acc + (p.surfaceKm2 || 0), 0);
    const totalEcon = regionalProvinces.reduce((acc, p) => acc + (p.economicShare || 0), 0);
    return { totalPop, totalSurface, totalEcon };
  }, [regionalProvinces]);

  // Formatear datos para el gráfico de barras ordenados de mayor a menor
  const chartData = useMemo(() => {
    const mapped = regionalProvinces.map((p) => {
      let rawVal = 0;
      let displayVal = '';
      let percentage = 0;

      if (metric === 'population') {
        rawVal = p.population || 0;
        percentage = regionalTotals.totalPop > 0 ? (rawVal / regionalTotals.totalPop) * 100 : 0;
        displayVal = `${(rawVal / 1000).toFixed(0)}k hab.`;
      } else if (metric === 'economic') {
        rawVal = p.economicShare || 0;
        percentage = rawVal;
        displayVal = `${rawVal.toFixed(1)}%`;
      } else {
        rawVal = p.surfaceKm2 || 0;
        percentage = regionalTotals.totalSurface > 0 ? (rawVal / regionalTotals.totalSurface) * 100 : 0;
        displayVal = `${rawVal.toLocaleString('es-DO', { maximumFractionDigits: 0 })} km²`;
      }

      return {
        id: p.id,
        name: p.name,
        shortName: p.name.length > 11 ? p.name.slice(0, 9) + '…' : p.name,
        value: rawVal,
        percentage: +percentage.toFixed(1),
        displayVal,
        isSelected: p.id === province.id,
        provinceData: p,
      };
    });

    // Ordenar de mayor a menor según el valor métrico
    return mapped.sort((a, b) => b.value - a.value);
  }, [regionalProvinces, metric, province.id, regionalTotals]);

  // Métrica seleccionada de la provincia actual
  const currentMetricStats = useMemo(() => {
    const current = chartData.find((d) => d.id === province.id);
    return current || { percentage: 0, displayVal: '' };
  }, [chartData, province.id]);

  const activeColor = {
    cibao: '#0ea5e9',
    suroeste: '#10b981',
    sureste: '#f59e0b',
  }[province.macroRegionCode] || '#0ea5e9';

  return (
    <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-2.5">
      {/* Encabezado y Pestañas de Métrica */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs">
          <span>Comparativa Regional</span>
          <span className="text-[10px] text-slate-400 font-normal">
            ({regionalProvinces.length} prov.)
          </span>
        </div>

        {/* Selector de métricas */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setMetric('population')}
            className={`px-1.5 py-0.5 text-[10px] font-medium rounded transition-colors ${
              metric === 'population'
                ? 'bg-sky-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Población (X Censo ONE)"
          >
            Población
          </button>
          <button
            onClick={() => setMetric('economic')}
            className={`px-1.5 py-0.5 text-[10px] font-medium rounded transition-colors ${
              metric === 'economic'
                ? 'bg-sky-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Aporte Económico Regional (%)"
          >
            Economía
          </button>
          <button
            onClick={() => setMetric('surface')}
            className={`px-1.5 py-0.5 text-[10px] font-medium rounded transition-colors ${
              metric === 'surface'
                ? 'bg-sky-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Superficie Territorial (km²)"
          >
            Territorio
          </button>
        </div>
      </div>

      {/* Indicador de peso relativo de la provincia actual */}
      <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-900/90 rounded-lg border border-slate-800/60 text-[11px]">
        <div className="text-slate-400">
          Contribución de <strong className="text-white font-semibold">{province.name}</strong>:
        </div>
        <div className="font-outfit font-bold text-xs" style={{ color: activeColor }}>
          {currentMetricStats.percentage}% del total regional
        </div>
      </div>

      {/* Contenedor del Gráfico Recharts */}
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 2, right: 12, left: 0, bottom: 2 }}
          >
            <XAxis
              type="number"
              hide={true}
              domain={[0, 'dataMax']}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={78}
              tick={({ x, y, payload }) => {
                const isCurrent = payload.value === province.name;
                const truncated = payload.value.length > 10 ? payload.value.slice(0, 9) + '…' : payload.value;
                const yCoord = typeof y === 'number' ? y : parseFloat(String(y)) || 0;
                return (
                  <text
                    x={x}
                    y={yCoord + 3}
                    textAnchor="end"
                    fill={isCurrent ? '#ffffff' : '#94a3b8'}
                    fontSize={9.5}
                    fontWeight={isCurrent ? 700 : 400}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {truncated}
                  </text>
                );
              }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900/95 border border-slate-700/80 px-2.5 py-1.5 rounded-lg shadow-xl text-left text-xs z-50">
                      <div className="font-outfit font-bold text-white flex items-center justify-between gap-3">
                        <span>{data.name}</span>
                        {data.isSelected && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-sky-950 text-sky-400 border border-sky-800">
                            Activa
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1 font-mono">
                        {metric === 'population' && `Población: ${data.value.toLocaleString('es-DO')} hab.`}
                        {metric === 'economic' && `Aporte Regional: ${data.value}%`}
                        {metric === 'surface' && `Superficie: ${data.value.toLocaleString('es-DO', { maximumFractionDigits: 1 })} km²`}
                      </div>
                      <div className="text-[10px] text-sky-400 font-semibold mt-0.5">
                        {data.percentage}% de la Región {province.region}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]}
              onClick={(entry: unknown) => {
                const item = entry as { provinceData?: ProvinceData };
                if (item && item.provinceData && onSelectProvince) {
                  onSelectProvince(item.provinceData);
                }
              }}
              cursor="pointer"
            >
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.id}`}
                  fill={
                    entry.isSelected
                      ? activeColor
                      : 'rgba(148, 163, 184, 0.22)'
                  }
                  stroke={entry.isSelected ? '#ffffff' : 'transparent'}
                  strokeWidth={entry.isSelected ? 1.5 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-900">
        <span>Fuente: ONE (X Censo) / IGN (Ley 345-22)</span>
        <span className="text-slate-400 italic">Haz clic en una barra para enfocar</span>
      </div>
    </div>
  );
};

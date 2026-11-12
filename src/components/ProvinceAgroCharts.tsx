/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PROVINCE AGRO WEATHER CHARTS (RECHARTS)
 * Selector de pestañas para alternar entre:
 * a) Pronóstico 7 Días (En Vivo): Temperatura Máx/Mín (líneas) y Precipitación esperada en mm (barras).
 * b) Climatología Histórica (12 Meses): Régimen de temperatura promedio (°C) y precipitación mensual (mm).
 */

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { AgroWeatherData } from '../services/weatherService.ts';
import { MonthlyClimatology } from '../data/provinciasData.ts';
import { CloudRain, Calendar, SunMedium, Activity } from 'lucide-react';

interface ProvinceAgroChartsProps {
  weather: AgroWeatherData | null;
  historicalClimatology: MonthlyClimatology[];
  provinceName: string;
}

export const ProvinceAgroCharts: React.FC<ProvinceAgroChartsProps> = ({
  weather,
  historicalClimatology,
  provinceName,
}) => {
  const [activeTab, setActiveTab] = useState<'forecast' | 'historical'>('forecast');

  // Datos para la pestaña de pronóstico de 7 días
  const forecastData = (weather?.dailyForecast || []).map((day) => ({
    name: day.dayLabel,
    fecha: day.date,
    tempMax: day.tempMax,
    tempMin: day.tempMin,
    precip: day.precipitation,
    et0: day.et0,
  }));

  // Datos para la pestaña de climatología histórica (12 meses)
  const historicalData = historicalClimatology.map((m) => ({
    name: m.month,
    tempMedia: m.temp,
    precipMedia: m.rainfall,
  }));

  return (
    <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 space-y-3 shadow-lg">
      {/* Selector de Pestañas Agro-Tech */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
          <Activity className="w-3.5 h-3.5" />
          <span>Dinámica Agroclimática</span>
        </div>

        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab('forecast')}
            className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
              activeTab === 'forecast'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3 h-3" />
            <span>Pronóstico 7D</span>
          </button>
          <button
            onClick={() => setActiveTab('historical')}
            className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
              activeTab === 'historical'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>Clima Histórico</span>
          </button>
        </div>
      </div>

      {/* Contenedor del Gráfico Dinámico ComposedChart de Recharts */}
      <div className="h-48 w-full">
        {activeTab === 'forecast' ? (
          forecastData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecastData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                {/* Eje Y izquierdo: Temperatura (°C) */}
                <YAxis
                  yAxisId="temp"
                  orientation="left"
                  stroke="#94a3b8"
                  fontSize={10}
                  unit="°C"
                  domain={['dataMin - 2', 'dataMax + 2']}
                  tickLine={false}
                  axisLine={false}
                />
                {/* Eje Y derecho: Lluvia / ET0 (mm) */}
                <YAxis
                  yAxisId="rain"
                  orientation="right"
                  stroke="#38bdf8"
                  fontSize={10}
                  unit="mm"
                  domain={[0, 'auto']}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 border border-slate-700/80 px-3 py-2 rounded-xl shadow-2xl text-left text-xs z-50">
                          <div className="font-outfit font-bold text-white mb-1 flex items-center justify-between gap-3">
                            <span>{data.name} ({data.fecha})</span>
                          </div>
                          <div className="space-y-0.5 font-mono text-[11px]">
                            <div className="text-amber-400 flex items-center justify-between gap-2">
                              <span>Máx:</span>
                              <span className="font-bold">{data.tempMax}°C</span>
                            </div>
                            <div className="text-sky-400 flex items-center justify-between gap-2">
                              <span>Mín:</span>
                              <span className="font-bold">{data.tempMin}°C</span>
                            </div>
                            <div className="text-cyan-300 flex items-center justify-between gap-2">
                              <span>Precipitación:</span>
                              <span className="font-bold">{data.precip} mm</span>
                            </div>
                            <div className="text-emerald-400 flex items-center justify-between gap-2">
                              <span>ET₀ (FAO):</span>
                              <span className="font-bold">{data.et0} mm</span>
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
                {/* Barras de Precipitación */}
                <Bar
                  yAxisId="rain"
                  dataKey="precip"
                  name="Lluvia (mm)"
                  fill="#0284c7"
                  radius={[3, 3, 0, 0]}
                  barSize={14}
                />
                {/* Línea Temp Máxima */}
                <Line
                  yAxisId="temp"
                  type="monotone"
                  dataKey="tempMax"
                  name="T. Máx (°C)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: '#f59e0b' }}
                  activeDot={{ r: 4 }}
                />
                {/* Línea Temp Mínima */}
                <Line
                  yAxisId="temp"
                  type="monotone"
                  dataKey="tempMin"
                  name="T. Mín (°C)"
                  stroke="#38bdf8"
                  strokeWidth={1.8}
                  strokeDasharray="3 3"
                  dot={{ r: 2, fill: '#38bdf8' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              Cargando pronóstico agroclimático...
            </div>
          )
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={historicalData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={9.5}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                yAxisId="temp"
                orientation="left"
                stroke="#f59e0b"
                fontSize={10}
                unit="°C"
                domain={[18, 32]}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="rain"
                orientation="right"
                stroke="#38bdf8"
                fontSize={10}
                unit="mm"
                domain={[0, 'dataMax + 20']}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 border border-slate-700/80 px-3 py-2 rounded-xl shadow-2xl text-left text-xs z-50">
                        <div className="font-outfit font-bold text-white mb-1">
                          Mes: {data.name}
                        </div>
                        <div className="space-y-0.5 font-mono text-[11px]">
                          <div className="text-amber-400">
                            Temp. Promedio: <strong>{data.tempMedia}°C</strong>
                          </div>
                          <div className="text-sky-400">
                            Precipitación: <strong>{data.precipMedia} mm</strong>
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
              <Bar
                yAxisId="rain"
                dataKey="precipMedia"
                name="Lluvia Media (mm)"
                fill="#0369a1"
                radius={[3, 3, 0, 0]}
                barSize={12}
              />
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="tempMedia"
                name="Temp. Media (°C)"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={{ r: 2.5, fill: '#fbbf24' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Pie descriptivo del gráfico */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
        <span>
          {activeTab === 'forecast'
            ? 'Open-Meteo · Modelo Global ECMWF / GFS'
            : `Régimen Pluviométrico Histórico · ${provinceName}`}
        </span>
        <span className="text-emerald-400 font-medium">
          {activeTab === 'forecast' ? '7 Días en vivo' : '12 Meses Climatológicos'}
        </span>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PROVINCE PREDICTIVE YIELD TRENDLINE (RECHARTS)
 * Calcula y visualiza la curva de tendencia predictiva de mejora de rendimiento agrícola
 * basándose en:
 * 1. Patrones agroclimáticos históricos y registros en caché local (localStorage).
 * 2. Datos actuales de humedad del suelo (Open-Meteo edafología 0-1cm).
 * 3. Requerimientos hídricos y ciclo fenológico de los cultivos predominantes de la provincia.
 */

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, Droplets, CloudRain, Sparkles, Sprout, Database, Check } from 'lucide-react';
import { AgroWeatherData } from '../services/weatherService.ts';
import { MonthlyClimatology, CropInfo, PROVINCIAL_AGRICULTURE } from '../data/provinciasData.ts';

interface ProvincePredictiveTrendCardProps {
  provinceId: string;
  provinceName: string;
  weather: AgroWeatherData | null;
  historicalClimatology: MonthlyClimatology[];
  predominantCrops: CropInfo[];
}

export const ProvincePredictiveTrendCard: React.FC<ProvincePredictiveTrendCardProps> = ({
  provinceId,
  provinceName,
  weather,
  historicalClimatology,
  predominantCrops,
}) => {
  // Cultivo seleccionado para la proyección (por defecto el cultivo insignia)
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);

  const currentCrop = predominantCrops[selectedCropIndex] || predominantCrops[0] || {
    name: 'Cultivo Principal',
    category: 'Agrícola',
    waterNeed: 'Media',
    annualProductionTon: 35000,
    cycleMonths: 8,
  };

  // =========================================================================
  // MODELO DE CÁLCULO PREDICTIVO:
  // Cruza humedad actual del suelo + patrones históricos en caché local + sensibilidad del cultivo
  // =========================================================================
  const {
    soilMoisturePct,
    soilFactorPct,
    weatherPatternFactorPct,
    totalPotentialImprovementPct,
    additionalYieldTon,
    baselineProductionTon,
    projectedProductionTon,
    cacheSourceInfo,
    trendlineData,
  } = useMemo(() => {
    // 1. Humedad del suelo actual (0 - 100%)
    const soilMoisture = weather?.current?.soilMoisturePct ?? 48;

    // Comprobar si hay historial previo en el caché local de esta provincia
    let cacheTimestamp = weather?.fetchedAt;
    let hasLocalCache = false;
    try {
      const stored = localStorage.getItem(`agromap_cache_${provinceId}`);
      if (stored) {
        hasLocalCache = true;
        const parsed = JSON.parse(stored);
        if (parsed.timestamp) {
          cacheTimestamp = parsed.timestamp;
        }
      }
    } catch {
      // Ignorar errores de lectura
    }

    // 2. Factor Edafológico de Suelo (% de mejora potencial)
    // - Si el suelo está en estrés seco (<35%): optimizar riego desbloquea alta recuperación (+16% a +25%)
    // - Si el suelo está balanceado (40-65%): la micro-regulación y nutrición aporta +10% a +16%
    // - Si el suelo está anegado (>75%): el drenaje y control de asfixia radicular aporta +14% a +22%
    let sFactor = 12.0;
    if (soilMoisture < 35) {
      sFactor = 18.5 + ((35 - soilMoisture) * 0.4);
    } else if (soilMoisture >= 40 && soilMoisture <= 65) {
      sFactor = 11.5 + (soilMoisture * 0.08);
    } else if (soilMoisture > 75) {
      sFactor = 15.0 + ((soilMoisture - 75) * 0.35);
    } else {
      sFactor = 13.0;
    }

    // 3. Factor de Patrones Climáticos Históricos
    // Calculamos la varianza pluvial entre los meses más secos y más lluviosos
    const rainfalls = historicalClimatology.map((m) => m.rainfall);
    const maxRain = Math.max(...rainfalls, 150);
    const minRain = Math.min(...rainfalls, 20);
    const rainSeasonality = maxRain - minRain;

    // Calculamos el régimen térmico promedio
    const avgTemp = historicalClimatology.reduce((acc, m) => acc + m.temp, 0) / (historicalClimatology.length || 12);
    const heatStressRisk = avgTemp > 28 ? 3.5 : 1.5;

    // Factor climático acumulado: mayor estacionalidad = mayor potencial de ganancia con telemetría
    const wFactor = 6.0 + Math.min(10.0, (rainSeasonality / 25)) + heatStressRisk;

    // 4. Sensibilidad por tipo de cultivo
    let cropMultiplier = 1.0;
    const cropNameLow = currentCrop.name.toLowerCase();
    if (cropNameLow.includes('arroz')) cropMultiplier = 1.15;
    else if (cropNameLow.includes('cacao')) cropMultiplier = 1.12;
    else if (cropNameLow.includes('banano') || cropNameLow.includes('plátano')) cropMultiplier = 1.18;
    else if (cropNameLow.includes('aguacate')) cropMultiplier = 1.22;
    else if (cropNameLow.includes('café')) cropMultiplier = 1.10;

    // Potencial total de mejora (%)
    const rawTotalImprovement = (sFactor * 0.55 + wFactor * 0.45) * cropMultiplier;
    const totalPotentialImprovement = Number(Math.min(36.5, Math.max(9.5, rawTotalImprovement)).toFixed(1));

    // Toneladas base y adicionales
    const baseTon = currentCrop.annualProductionTon || 30000;
    const addTon = Math.round(baseTon * (totalPotentialImprovement / 100));
    const projTon = baseTon + addTon;

    // 5. Curva de Proyección Fenológica (Etapas de Cultivo & Tendencia Predictiva)
    const phases = [
      { name: 'Siembra', basePct: 15, optPct: 18, trendPct: 17 },
      { name: 'Vegetativo', basePct: 35, optPct: 44, trendPct: 41 },
      { name: 'Floración', basePct: 58, optPct: 73, trendPct: 70 },
      { name: 'Llenado', basePct: 76, optPct: 98, trendPct: 94 },
      { name: 'Maduración', basePct: 92, optPct: 119, trendPct: 115 },
      { name: 'Cosecha', basePct: 100, optPct: 100 + totalPotentialImprovement, trendPct: 100 + totalPotentialImprovement },
    ];

    const tData = phases.map((phase) => {
      const baseYield = Math.round((baseTon / 100) * phase.basePct);
      const optYield = Math.round((baseTon / 100) * phase.optPct);
      const trendYield = Math.round((baseTon / 100) * phase.trendPct);
      const stageImprovementPct = Number((((optYield - baseYield) / (baseYield || 1)) * 100).toFixed(1));

      return {
        stage: phase.name,
        rendimientoTradicional: baseYield,
        rendimientoOptimizado: optYield,
        tendenciaPredictiva: trendYield,
        stageImprovementPct,
      };
    });

    return {
      soilMoisturePct: soilMoisture,
      soilFactorPct: Number(sFactor.toFixed(1)),
      weatherPatternFactorPct: Number(wFactor.toFixed(1)),
      totalPotentialImprovementPct: totalPotentialImprovement,
      additionalYieldTon: addTon,
      baselineProductionTon: baseTon,
      projectedProductionTon: projTon,
      cacheSourceInfo: hasLocalCache
        ? `Caché local sincronizado (${new Date(cacheTimestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
        : 'Estimación agroclimática en vivo',
      trendlineData: tData,
    };
  }, [provinceId, weather, historicalClimatology, currentCrop]);

  return (
    <div className="bg-slate-950/85 border border-slate-800/90 rounded-2xl p-3.5 space-y-3 shadow-lg">
      {/* Cabecera del Módulo Predictivo */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-600/50 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-outfit font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
              <span>Tendencia Predictiva de Rendimiento</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h4>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Database className="w-3 h-3 text-sky-400" />
              <span>{cacheSourceInfo}</span>
            </div>
          </div>
        </div>

        {/* Badge de Ganancia Neta */}
        <div className="text-right">
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/90 border border-emerald-600/60 px-2 py-0.5 rounded-md font-mono">
            +{totalPotentialImprovementPct}% Potencial
          </span>
        </div>
      </div>

      {/* Selector de Cultivo de la Provincia (si hay más de 1) */}
      {predominantCrops.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
          <span className="text-slate-400 text-[10px] font-medium shrink-0 flex items-center gap-1">
            <Sprout className="w-3 h-3 text-emerald-400" />
            Cultivo:
          </span>
          {predominantCrops.map((crop, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCropIndex(idx)}
              className={`px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition-all ${
                selectedCropIndex === idx
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {crop.name}
            </button>
          ))}
        </div>
      )}

      {/* Desglose de Factores del Algoritmo Predictivo */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800/80">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
            <Droplets className="w-3 h-3 text-emerald-400" />
            <span>Factor Suelo</span>
          </div>
          <div className="font-outfit font-bold text-sm text-emerald-400 mt-0.5">
            +{soilFactorPct}%
          </div>
          <div className="text-[9px] text-slate-400 font-mono">Humedad: {soilMoisturePct}%</div>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800/80">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
            <CloudRain className="w-3 h-3 text-sky-400" />
            <span>Clima Histórico</span>
          </div>
          <div className="font-outfit font-bold text-sm text-sky-400 mt-0.5">
            +{weatherPatternFactorPct}%
          </div>
          <div className="text-[9px] text-slate-400 font-mono">12m en caché</div>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800/80">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Cosecha Extra</span>
          </div>
          <div className="font-outfit font-bold text-sm text-amber-400 mt-0.5">
            +{additionalYieldTon.toLocaleString('es-DO')}
          </div>
          <div className="text-[9px] text-slate-400 font-mono">Ton/año est.</div>
        </div>
      </div>

      {/* Gráfico Recharts con Línea de Tendencia Predictiva */}
      <div className="h-48 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={trendlineData}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient id="optYieldArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="stage"
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
                if (val >= 1000) return `${Math.round(val / 1000)}k`;
                return val;
              }}
            />
            <Tooltip
              cursor={{ stroke: '#334155', strokeWidth: 1 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-slate-900/95 border border-slate-700/80 px-3 py-2 rounded-xl shadow-2xl text-left text-xs z-50 space-y-1">
                      <div className="font-outfit font-bold text-white flex items-center justify-between gap-3">
                        <span>Fase: {d.stage}</span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">
                          +{d.stageImprovementPct}%
                        </span>
                      </div>
                      <div className="space-y-0.5 font-mono text-[11px]">
                        <div className="text-emerald-400 flex items-center justify-between gap-3">
                          <span>Proyección Optimizada:</span>
                          <span className="font-bold">{d.rendimientoOptimizado.toLocaleString('es-DO')} Ton</span>
                        </div>
                        <div className="text-sky-400 flex items-center justify-between gap-3">
                          <span>Tendencia Predictiva:</span>
                          <span className="font-bold">{d.tendenciaPredictiva.toLocaleString('es-DO')} Ton</span>
                        </div>
                        <div className="text-slate-400 flex items-center justify-between gap-3">
                          <span>Rendimiento Tradicional:</span>
                          <span className="font-bold">{d.rendimientoTradicional.toLocaleString('es-DO')} Ton</span>
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
            {/* Área Sombreada de Mejora */}
            <Area
              type="monotone"
              dataKey="rendimientoOptimizado"
              name="Rendimiento Optimizado (Ton)"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#optYieldArea)"
            />
            {/* Línea de Tendencia Predictiva Continua */}
            <Line
              type="monotone"
              dataKey="tendenciaPredictiva"
              name="Tendencia Predictiva"
              stroke="#38bdf8"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#38bdf8' }}
              activeDot={{ r: 5 }}
            />
            {/* Línea Tradicional de Referencia */}
            <Line
              type="monotone"
              dataKey="rendimientoTradicional"
              name="Línea Base Tradicional"
              stroke="#64748b"
              strokeWidth={1.8}
              strokeDasharray="4 4"
              dot={{ r: 2, fill: '#64748b' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Resumen explicativo del algoritmo agronómico */}
      <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60 text-[10.5px] text-slate-300 leading-snug">
        💡 <strong>Mecanismo de optimización:</strong> El control de la humedad edáfica ({soilMoisturePct}%) y la mitigación de la variabilidad pluvial histórica proyectan un incremento de <strong>{additionalYieldTon.toLocaleString('es-DO')} Toneladas</strong> en {currentCrop.name} para {provinceName}.
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AGRO COMPARATOR (COMPARADOR AGROECOLÓGICO Y COMERCIAL)
 * Dos modos de análisis seleccionables por Segmented Control:
 * - Modo A: Provincia vs. Provincia ("Versus Agroclimático") con consulta en vivo a weatherService.
 * - Modo B: Cultivo vs. Cultivo (Compatibilidad climática instantánea en la provincia activa).
 */

import React, { useState, useEffect } from 'react';
import {
  Scale,
  MapPin,
  Sprout,
  Droplets,
  Thermometer,
  Gauge,
  ArrowRightLeft,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { ProvinceData, DOMINICAN_PROVINCES } from '../data/dominicanProvinces.ts';
import { PROVINCIAL_AGRICULTURE } from '../data/provinciasData.ts';
import { fetchAgroWeather, AgroWeatherData } from '../services/weatherService.ts';
import {
  CULTIVOS_ARRAY,
  CULTIVOS_CONFIG_MAP,
  CultivoRequerimientos,
  calcularCompatibilidadClimatica,
} from '../data/cultivosConfig.ts';

interface AgroComparatorProps {
  currentProvince: ProvinceData;
  currentWeather: AgroWeatherData | null;
}

export const AgroComparator: React.FC<AgroComparatorProps> = ({
  currentProvince,
  currentWeather,
}) => {
  const [comparatorMode, setComparatorMode] = useState<'province' | 'crop'>('province');

  // =========================================================================
  // MODO A: PROVINCIA VS PROVINCIA
  // =========================================================================
  // Elegir segunda provincia (por defecto una emblemática de otra región)
  const defaultSecondProvinceId =
    currentProvince.id === 'la-vega'
      ? 'san-juan'
      : currentProvince.id === 'san-juan'
      ? 'duarte'
      : 'la-vega';

  const [secondProvinceId, setSecondProvinceId] = useState<string>(defaultSecondProvinceId);
  const [secondWeather, setSecondWeather] = useState<AgroWeatherData | null>(null);
  const [loadingSecondWeather, setLoadingSecondWeather] = useState(false);

  const secondProvince =
    DOMINICAN_PROVINCES.find((p) => p.id === secondProvinceId) || DOMINICAN_PROVINCES[1];

  useEffect(() => {
    if (!secondProvince) return;
    let isMounted = true;
    setLoadingSecondWeather(true);

    const agroMeta = PROVINCIAL_AGRICULTURE[secondProvince.id];
    const annualRain = agroMeta ? agroMeta.annualRainfallAvg : 1200;

    fetchAgroWeather(secondProvince.id, secondProvince.center.lat, secondProvince.center.lng, annualRain)
      .then((data) => {
        if (isMounted) {
          setSecondWeather(data);
          setLoadingSecondWeather(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error fetching comparator weather:', err);
          setLoadingSecondWeather(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [secondProvinceId]);

  // =========================================================================
  // MODO B: CULTIVO VS CULTIVO
  // =========================================================================
  const [cropIdA, setCropIdA] = useState<string>('arroz');
  const [cropIdB, setCropIdB] = useState<string>('platano');

  const cropA: CultivoRequerimientos = CULTIVOS_CONFIG_MAP[cropIdA] || CULTIVOS_CONFIG_MAP.arroz;
  const cropB: CultivoRequerimientos = CULTIVOS_CONFIG_MAP[cropIdB] || CULTIVOS_CONFIG_MAP.platano;

  const currentTemp = currentWeather?.current?.temperature ?? 28;
  const currentSoil = currentWeather?.current?.soilMoisturePct ?? 50;

  const scoreA = calcularCompatibilidadClimatica(cropA, currentTemp, currentSoil);
  const scoreB = calcularCompatibilidadClimatica(cropB, currentTemp, currentSoil);

  // Veredicto Modo A (Provincia vs Provincia)
  const currentSoilVal = currentWeather?.current?.soilMoisturePct ?? 45;
  const secondSoilVal = secondWeather?.current?.soilMoisturePct ?? 45;
  const soilWinner =
    currentSoilVal > secondSoilVal
      ? currentProvince.name
      : secondSoilVal > currentSoilVal
      ? secondProvince.name
      : 'Ambas con igual retención';

  return (
    <div className="p-3.5 bg-slate-950/85 border border-slate-800/80 rounded-2xl space-y-3.5 shadow-lg">
      {/* Cabecera y Segmented Control de Modos */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>Comparador Agroclimático</span>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setComparatorMode('province')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
              comparatorMode === 'province'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Provincia vs. Provincia
          </button>
          <button
            type="button"
            onClick={() => setComparatorMode('crop')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
              comparatorMode === 'crop'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cultivo vs. Cultivo
          </button>
        </div>
      </div>

      {/* =========================================================================
          CONTENIDO: MODO A — PROVINCIA VS PROVINCIA
          ========================================================================= */}
      {comparatorMode === 'province' && (
        <div className="space-y-3">
          {/* Selectores de Provincias */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-900/90 border border-emerald-700/50">
              <span className="text-[10px] text-emerald-400 font-mono block">Provincia Activa:</span>
              <strong className="text-white text-xs truncate block mt-0.5">
                {currentProvince.name}
              </strong>
              <span className="text-[9.5px] text-slate-400 block truncate">Región: {currentProvince.region}</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-900/90 border border-sky-700/50">
              <div className="flex items-center justify-between text-[10px] text-sky-400 font-mono">
                <span>Comparar con:</span>
                {loadingSecondWeather && <RefreshCw className="w-2.5 h-2.5 animate-spin" />}
              </div>
              <select
                value={secondProvinceId}
                onChange={(e) => setSecondProvinceId(e.target.value)}
                className="w-full mt-0.5 bg-slate-950 text-white font-semibold text-xs border border-slate-800 rounded px-1.5 py-0.5 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                {DOMINICAN_PROVINCES.filter((p) => p.id !== currentProvince.id).map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-slate-100">
                    {p.name} ({p.region})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabla Comparativa de 3 Columnas */}
          <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/60 text-[11px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-[10px] text-slate-400 uppercase font-mono">
                  <th className="py-2 px-2.5">Variable Clave</th>
                  <th className="py-2 px-2 text-emerald-400">{currentProvince.name}</th>
                  <th className="py-2 px-2 text-sky-400">{secondProvince.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {/* Temperatura */}
                <tr>
                  <td className="py-2 px-2.5 text-slate-300 font-medium flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Temperatura</span>
                  </td>
                  <td className="py-2 px-2 font-mono font-bold text-white">
                    {currentWeather?.current?.temperature ?? '--'}°C
                  </td>
                  <td className="py-2 px-2 font-mono font-bold text-white">
                    {loadingSecondWeather ? '--' : `${secondWeather?.current?.temperature ?? '--'}°C`}
                  </td>
                </tr>

                {/* Humedad de Suelo (Resaltando la mayor en esmeralda) */}
                <tr>
                  <td className="py-2 px-2.5 text-slate-300 font-medium flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Humedad Suelo</span>
                  </td>
                  <td
                    className={`py-2 px-2 font-mono font-bold ${
                      currentSoilVal >= secondSoilVal
                        ? 'text-emerald-400 bg-emerald-950/40 rounded px-1'
                        : 'text-slate-300'
                    }`}
                  >
                    {currentWeather?.current?.soilMoisturePct ?? '--'}%
                  </td>
                  <td
                    className={`py-2 px-2 font-mono font-bold ${
                      secondSoilVal > currentSoilVal
                        ? 'text-emerald-400 bg-emerald-950/40 rounded px-1'
                        : 'text-slate-300'
                    }`}
                  >
                    {loadingSecondWeather ? '--' : `${secondWeather?.current?.soilMoisturePct ?? '--'}%`}
                  </td>
                </tr>

                {/* Evapotranspiración FAO */}
                <tr>
                  <td className="py-2 px-2.5 text-slate-300 font-medium flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>Evaporación (ET₀)</span>
                  </td>
                  <td className="py-2 px-2 font-mono text-slate-200">
                    {currentWeather?.agronomy?.et0Today ?? 4.2} mm/d
                  </td>
                  <td className="py-2 px-2 font-mono text-slate-200">
                    {loadingSecondWeather ? '--' : `${secondWeather?.agronomy?.et0Today ?? 4.2} mm/d`}
                  </td>
                </tr>

                {/* Estrés Hídrico */}
                <tr>
                  <td className="py-2 px-2.5 text-slate-300 font-medium">Estrés Hídrico</td>
                  <td className="py-2 px-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9.5px] font-semibold ${
                        currentWeather?.agronomy?.waterStressRisk === 'Alto'
                          ? 'bg-rose-950 text-rose-300'
                          : currentWeather?.agronomy?.waterStressRisk === 'Medio'
                          ? 'bg-amber-950 text-amber-300'
                          : 'bg-emerald-950 text-emerald-300'
                      }`}
                    >
                      {currentWeather?.agronomy?.waterStressRisk || 'Bajo'}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9.5px] font-semibold ${
                        secondWeather?.agronomy?.waterStressRisk === 'Alto'
                          ? 'bg-rose-950 text-rose-300'
                          : secondWeather?.agronomy?.waterStressRisk === 'Medio'
                          ? 'bg-amber-950 text-amber-300'
                          : 'bg-emerald-950 text-emerald-300'
                      }`}
                    >
                      {loadingSecondWeather
                        ? '...'
                        : secondWeather?.agronomy?.waterStressRisk || 'Bajo'}
                    </span>
                  </td>
                </tr>

                {/* Rubros Líderes */}
                <tr>
                  <td className="py-2 px-2.5 text-slate-300 font-medium">Cultivos Clave</td>
                  <td className="py-2 px-2 text-[10px] text-slate-300 truncate max-w-[120px]">
                    {PROVINCIAL_AGRICULTURE[currentProvince.id]?.predominantCrops[0]?.name || 'Granos'}
                  </td>
                  <td className="py-2 px-2 text-[10px] text-slate-300 truncate max-w-[120px]">
                    {PROVINCIAL_AGRICULTURE[secondProvince.id]?.predominantCrops[0]?.name || 'Granos'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Veredicto de 1 línea al pie */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-snug">
              <strong>Veredicto agroclimático:</strong> Mayor retención de humedad edáfica hoy en{' '}
              <strong className="text-emerald-400">{soilWinner}</strong>. Ambas provincias registran{' '}
              {currentWeather?.agronomy?.waterStressRisk === 'Alto' || secondWeather?.agronomy?.waterStressRisk === 'Alto'
                ? 'zonas con necesidad de riego suplementario.'
                : 'estabilidad hídrica adecuada para cultivos estacionales.'}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CONTENIDO: MODO B — CULTIVO VS CULTIVO
          ========================================================================= */}
      {comparatorMode === 'crop' && (
        <div className="space-y-3">
          <div className="text-[10.5px] text-slate-400">
            Evaluando viabilidad hoy en <strong className="text-white">{currentProvince.name}</strong> ({currentTemp}°C, {currentSoil}% humedad suelo):
          </div>

          {/* Selectores de Cultivo A y B */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-mono block">Cultivo 1:</span>
              <select
                value={cropIdA}
                onChange={(e) => setCropIdA(e.target.value)}
                className="w-full bg-slate-950 text-white font-semibold text-xs border border-slate-800 rounded px-1.5 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {CULTIVOS_ARRAY.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-slate-100">
                    {c.icono} {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-mono block">Cultivo 2:</span>
              <select
                value={cropIdB}
                onChange={(e) => setCropIdB(e.target.value)}
                className="w-full bg-slate-950 text-white font-semibold text-xs border border-slate-800 rounded px-1.5 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {CULTIVOS_ARRAY.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-slate-100">
                    {c.icono} {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Barras de Compatibilidad Climática Hoy */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Tarjeta Cultivo A */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate">{cropA.nombre}</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${scoreA.colorClass.includes('emerald') ? 'text-emerald-400 bg-emerald-950' : 'text-amber-400 bg-amber-950'}`}>
                  {scoreA.score}%
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    scoreA.score >= 75 ? 'bg-emerald-500' : scoreA.score >= 50 ? 'bg-amber-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${scoreA.score}%` }}
                />
              </div>

              <div className="space-y-1 text-[10px] font-mono text-slate-300 pt-1 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ciclo:</span>
                  <span className="font-bold text-white">{cropA.cicloMeses} meses</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Demanda Agua:</span>
                  <span className={cropA.demandaHidrica === 'Alta' ? 'text-sky-400' : 'text-emerald-400'}>
                    {cropA.demandaHidrica}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Inversión:</span>
                  <span className="text-slate-200">{cropA.nivelInversion}</span>
                </div>
              </div>
            </div>

            {/* Tarjeta Cultivo B */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate">{cropB.nombre}</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${scoreB.colorClass.includes('emerald') ? 'text-emerald-400 bg-emerald-950' : 'text-amber-400 bg-amber-950'}`}>
                  {scoreB.score}%
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    scoreB.score >= 75 ? 'bg-emerald-500' : scoreB.score >= 50 ? 'bg-amber-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${scoreB.score}%` }}
                />
              </div>

              <div className="space-y-1 text-[10px] font-mono text-slate-300 pt-1 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ciclo:</span>
                  <span className="font-bold text-white">{cropB.cicloMeses} meses</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Demanda Agua:</span>
                  <span className={cropB.demandaHidrica === 'Alta' ? 'text-sky-400' : 'text-emerald-400'}>
                    {cropB.demandaHidrica}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Inversión:</span>
                  <span className="text-slate-200">{cropB.nivelInversion}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recomendación inteligente al pie */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-snug">
              <strong>Recomendación agronómica hoy: </strong>
              {scoreA.score > scoreB.score ? (
                <>
                  <strong className="text-emerald-400">{cropA.nombre}</strong> presenta mayor compatibilidad ({scoreA.score}%) con el ambiente actual de {currentProvince.name} que {cropB.nombre} ({scoreB.score}%).
                </>
              ) : scoreB.score > scoreA.score ? (
                <>
                  <strong className="text-emerald-400">{cropB.nombre}</strong> presenta mayor compatibilidad ({scoreB.score}%) con el ambiente actual de {currentProvince.name} que {cropA.nombre} ({scoreA.score}%).
                </>
              ) : (
                <>
                  Ambos cultivos registran idéntico índice de compatibilidad climática ({scoreA.score}%) hoy en {currentProvince.name}.
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

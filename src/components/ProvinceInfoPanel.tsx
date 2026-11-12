/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PROVINCE INFO PANEL - DASHBOARD AGROTECNOLÓGICO
 * Panel lateral interactivo con arquitectura de monetización y crecimiento:
 * - FASE 1: Botón contextual de WhatsApp ("Enviar Reporte por WhatsApp")
 * - FASE 2: Tarjeta de Captura de Leads ("Suscribir mi Finca Gratis")
 * - FASE 3: Banner de Aliado Comercial Recomendado segmentado por cultivo (SponsorBanner)
 * - Telemetría meteorológica y edafológica en tiempo real (Open-Meteo) con persistencia LocalStorage
 * - Asistente de Riego y Semáforo Agroclimático
 * - Gráficos Recharts con carga perezosa (React.lazy + Suspense)
 */

import React, { useEffect, useState, Suspense, lazy } from 'react';
import {
  X,
  MapPin,
  Compass,
  Sprout,
  Droplets,
  Thermometer,
  Wind,
  Gauge,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
  ChevronDown,
  ChevronUp,
  Flame,
  Scale,
  ShieldAlert,
  Clock,
  Check,
  Share2,
  BellRing,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ProvinceData } from '../data/dominicanProvinces.ts';
import { PROVINCIAL_AGRICULTURE, AgricultureData } from '../data/provinciasData.ts';
import { fetchAgroWeather, AgroWeatherData } from '../services/weatherService.ts';
import { SponsorBanner } from './SponsorBanner.tsx';

// 1. LAZY LOADING DE RECHARTS: Los componentes que importan Recharts se cargan bajo demanda
const ProvinceAgroCharts = lazy(() =>
  import('./ProvinceAgroCharts.tsx').then((mod) => ({ default: mod.ProvinceAgroCharts }))
);

const ProvinceCropRegionalComparison = lazy(() =>
  import('./ProvinceCropRegionalComparison.tsx').then((mod) => ({
    default: mod.ProvinceCropRegionalComparison,
  }))
);

const ProvinceRegionalChart = lazy(() =>
  import('./ProvinceRegionalChart.tsx').then((mod) => ({ default: mod.ProvinceRegionalChart }))
);

// Skeleton loader elegante para la carga perezosa de los gráficos Recharts
const ChartSkeletonLoader: React.FC<{ height?: string; title?: string }> = ({
  height = 'h-48',
  title = 'Cargando visualización gráfica...',
}) => (
  <div className={`w-full ${height} bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between animate-pulse shadow-inner`}>
    <div className="flex items-center justify-between">
      <div className="h-3.5 w-32 bg-slate-800 rounded-md"></div>
      <div className="h-3 w-16 bg-slate-800 rounded-md"></div>
    </div>
    <div className="flex items-end justify-between gap-2 h-28 pt-2">
      <div className="w-6 bg-slate-800/80 rounded-t h-40%"></div>
      <div className="w-6 bg-slate-800/80 rounded-t h-70%"></div>
      <div className="w-6 bg-slate-800/80 rounded-t h-90%"></div>
      <div className="w-6 bg-slate-800/80 rounded-t h-60%"></div>
      <div className="w-6 bg-slate-800/80 rounded-t h-45%"></div>
      <div className="w-6 bg-slate-800/80 rounded-t h-80%"></div>
      <div className="w-6 bg-slate-800/80 rounded-t h-55%"></div>
    </div>
    <div className="text-[10px] text-slate-500 text-center font-medium mt-1">
      {title}
    </div>
  </div>
);

interface ProvinceInfoPanelProps {
  province: ProvinceData | null;
  onClose: () => void;
  onCenterProvince: (province: ProvinceData) => void;
  onOpenSubscribeModal?: () => void;
}

export const ProvinceInfoPanel: React.FC<ProvinceInfoPanelProps> = ({
  province,
  onClose,
  onCenterProvince,
  onOpenSubscribeModal,
}) => {
  const [weatherData, setWeatherData] = useState<AgroWeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [showMacroSocioCompare, setShowMacroSocioCompare] = useState(false);

  // Cargar telemetría en tiempo real de Open-Meteo para la provincia seleccionada
  useEffect(() => {
    if (!province) {
      setWeatherData(null);
      return;
    }

    let isMounted = true;
    setLoadingWeather(true);
    setWeatherError(null);

    const agroMeta = PROVINCIAL_AGRICULTURE[province.id];
    const annualRain = agroMeta ? agroMeta.annualRainfallAvg : 1200;

    fetchAgroWeather(province.id, province.center.lat, province.center.lng, annualRain)
      .then((data) => {
        if (isMounted) {
          setWeatherData(data);
          setLoadingWeather(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error al obtener clima agro:', err);
          setWeatherError('No se pudo conectar a Open-Meteo. Usando datos climatológicos de respaldo.');
          setLoadingWeather(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [province]);

  if (!province) return null;

  const agroData: AgricultureData = PROVINCIAL_AGRICULTURE[province.id] || {
    annualRainfallAvg: 1200,
    soilType: 'Suelo aluvial fértil con drenaje moderado',
    irrigationInfrastructure: 'Cuencas hidrográficas y canales locales',
    predominantCrops: [
      { name: 'Plátano y Guineo', category: 'Musáceas', cycleMonths: 10, economicImpact: 'Consumo interno y exportación', waterNeed: 'Alta', annualProductionTon: 80000 },
      { name: 'Frutas Tropicales', category: 'Frutales', cycleMonths: 12, economicImpact: 'Mercado local', waterNeed: 'Media', annualProductionTon: 25000 },
    ],
    plantingCalendar: [
      { crop: 'Musáceas', plantingMonths: ['May', 'Jun'], harvestMonths: ['Feb', 'Mar'], optimalRegime: 'Riego complementario' }
    ],
    historicalClimatology: [
      { month: 'Ene', temp: 25, rainfall: 40 },
      { month: 'Feb', temp: 25, rainfall: 35 },
      { month: 'Mar', temp: 26, rainfall: 45 },
      { month: 'Abr', temp: 27, rainfall: 75 },
      { month: 'May', temp: 28, rainfall: 160 },
      { month: 'Jun', temp: 28, rainfall: 120 },
      { month: 'Jul', temp: 29, rainfall: 110 },
      { month: 'Ago', temp: 29, rainfall: 130 },
      { month: 'Sep', temp: 28, rainfall: 145 },
      { month: 'Oct', temp: 27, rainfall: 135 },
      { month: 'Nov', temp: 26, rainfall: 80 },
      { month: 'Dic', temp: 25, rainfall: 50 },
    ],
  };

  const regionStyleMap = {
    cibao: {
      text: 'text-sky-400',
      badgeBg: 'bg-sky-950/70 text-sky-300 border-sky-800/60',
      dot: 'bg-sky-400',
      accent: 'border-sky-500/40',
    },
    suroeste: {
      text: 'text-emerald-400',
      badgeBg: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60',
      dot: 'bg-emerald-400',
      accent: 'border-emerald-500/40',
    },
    sureste: {
      text: 'text-amber-400',
      badgeBg: 'bg-amber-950/70 text-amber-300 border-amber-800/60',
      dot: 'bg-amber-400',
      accent: 'border-amber-500/40',
    },
  };

  const styleCfg = regionStyleMap[province.macroRegionCode] || regionStyleMap.cibao;

  // 3. SEMÁFORO DE ALERTAS AGROCLIMÁTICAS
  const trafficLight = weatherData?.trafficLight;
  const trafficLightConfig = {
    VERDE: {
      dot: 'bg-emerald-400 shadow-emerald-500/50',
      badge: 'bg-emerald-950/90 text-emerald-300 border-emerald-600/70',
      pill: 'bg-emerald-500 text-slate-950 font-bold',
      border: 'border-emerald-700/60',
      bg: 'bg-emerald-950/40',
    },
    AMARILLO: {
      dot: 'bg-amber-400 shadow-amber-500/50',
      badge: 'bg-amber-950/90 text-amber-300 border-amber-600/70',
      pill: 'bg-amber-400 text-slate-950 font-bold',
      border: 'border-amber-700/60',
      bg: 'bg-amber-950/40',
    },
    ROJO: {
      dot: 'bg-rose-500 shadow-rose-500/50 animate-pulse',
      badge: 'bg-rose-950/90 text-rose-300 border-rose-600/70',
      pill: 'bg-rose-500 text-white font-bold',
      border: 'border-rose-700/60',
      bg: 'bg-rose-950/40',
    },
  }[trafficLight?.color || 'VERDE'];

  // 4. CALCULADORA DE VENTANA ÓPTIMA DE RIEGO (ASISTENTE DE RIEGO)
  const irrigation = weatherData?.irrigationAssistant;
  const irrigationConfig = {
    NO_RIEGO: {
      badge: 'bg-sky-950/70 text-sky-300 border-sky-800/70',
      icon: <Check className="w-3.5 h-3.5 text-sky-400" />,
      colorText: 'text-sky-400',
    },
    RIEGO_LIGERO: {
      badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/70',
      icon: <Droplets className="w-3.5 h-3.5 text-emerald-400" />,
      colorText: 'text-emerald-400',
    },
    RIEGO_RECOMENDADO: {
      badge: 'bg-amber-950/70 text-amber-300 border-amber-800/70',
      icon: <Clock className="w-3.5 h-3.5 text-amber-400" />,
      colorText: 'text-amber-400',
    },
    RIEGO_URGENTE: {
      badge: 'bg-rose-950/70 text-rose-300 border-rose-800/70',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
      colorText: 'text-rose-400',
    },
  }[irrigation?.status || 'NO_RIEGO'];

  // Alerta de Estrés Térmico
  const thermalAlert = weatherData?.thermalAlert;

  // FASE 1: Botón contextual de Compartir por WhatsApp
  const handleShareWhatsApp = () => {
    const temp = weatherData ? `${weatherData.current.temperature}°C` : '';
    const soil = weatherData ? `${weatherData.current.soilMoisturePct}%` : '';
    const currentUrl = window.location.href;

    const message = encodeURIComponent(
      `🌱 Mira el pronóstico agroclimático y humedad del suelo en vivo para ${province.name}${
        temp ? ` (${temp}, Humedad del Suelo: ${soil})` : ''
      } en Agrointeligencia RD:\n${currentUrl}`
    );

    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <aside className="absolute top-[152px] md:top-[180px] right-2 left-2 md:left-auto md:right-3 w-auto md:w-[425px] max-h-[calc(100vh-12rem)] md:max-h-[calc(100vh-12.5rem)] z-20 flex flex-col bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-right-4">
      {/* 1. Encabezado del Dashboard Agro-Tech */}
      <div className="p-4 border-b border-slate-800/90 relative bg-gradient-to-b from-slate-900/90 to-slate-950/80">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Cerrar panel"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Estado de Telemetría Open-Meteo & Cache Indicator */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Datos en Vivo (Open-Meteo)</span>
          </div>

          {weatherData?.source === 'localStorage' && (
            <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-slate-800/90 text-sky-300 border border-slate-700 font-mono" title="Cargado de caché local inteligente (<15 min)">
              ⚡ Caché Local
            </span>
          )}

          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-md border ${styleCfg.badgeBg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${styleCfg.dot}`}></span>
            {province.region}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-outfit font-bold text-2xl text-white tracking-tight flex items-center gap-2">
              <span>{province.name}</span>
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Capital:</span>
              <strong className="text-white font-semibold">{province.capital}</strong>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* FASE 1: Botón de WhatsApp para Compartir Reporte a Grupos */}
            <button
              onClick={handleShareWhatsApp}
              className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 hover:text-white hover:bg-emerald-600 border border-emerald-700/60 transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm group"
              title="Enviar Reporte por WhatsApp a grupos de productores o agrónomos"
            >
              {/* Ícono de WhatsApp SVG nativo para compatibilidad perfecta */}
              <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.025 3.312l-.728 2.659 2.738-.718c.995.543 1.942.844 2.733.844h.001c3.181 0 5.768-2.586 5.768-5.766 0-3.18-2.587-5.767-5.768-5.767zm3.364 8.213c-.14.394-.716.732-1.024.779-.283.044-.653.076-2.105-.526-1.859-.771-3.044-2.673-3.136-2.796-.092-.123-.746-.992-.746-1.892s.471-1.341.639-1.526c.168-.184.368-.23.491-.23.123 0 .245.002.353.007.113.006.265-.043.414.316.154.369.524 1.277.57 1.369.046.092.077.2.015.323-.062.123-.092.2-.185.308-.092.108-.194.24-.277.323-.092.092-.188.193-.081.378.107.184.477.787 1.025 1.275.706.629 1.302.824 1.487.916.184.092.292.077.4-.046.108-.123.461-.538.584-.723.123-.184.246-.154.415-.092.169.062 1.077.508 1.261.6.184.092.307.138.353.215.046.077.046.446-.094.84zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.436 5.176L2 22l4.981-1.307C8.423 21.524 10.158 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.25c-1.639 0-3.155-.494-4.428-1.343l-.317-.212-2.969.779.792-2.894-.216-.344C3.96 14.945 3.5 13.518 3.5 12c0-4.687 3.813-8.5 8.5-8.5 4.687 0 8.5 3.813 8.5 8.5 0 4.687-3.813 8.5-8.5 8.5z"/>
              </svg>
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={() => onCenterProvince(province)}
              className="p-2 rounded-xl bg-slate-800/80 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-1 text-xs"
              title="Centrar y encuadrar provincia"
            >
              <Compass className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Cuerpo Desplazable del Panel */}
      <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
        {/* Error sutil si Open-Meteo falló */}
        {weatherError && (
          <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-300 text-[11px] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{weatherError}</span>
          </div>
        )}

        {/* 3. SISTEMA DE SEMÁFORO DE ALERTAS AGROCLIMÁTICAS (WIDGET COMPACTO) */}
        {trafficLight && (
          <div className={`p-3 rounded-2xl border ${trafficLightConfig.border} ${trafficLightConfig.bg} space-y-1.5 transition-all`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full shadow-lg ${trafficLightConfig.dot}`}></span>
                <span className="font-outfit font-bold text-xs uppercase tracking-wider text-white">
                  Semáforo Agroclimático:
                </span>
                <span className={`px-2 py-0.5 text-[10px] rounded-md ${trafficLightConfig.pill}`}>
                  {trafficLight.label}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-200 leading-snug font-medium">
              {trafficLight.primaryWarning}
            </p>

            {trafficLight.reasons.length > 1 && (
              <div className="pt-1 border-t border-white/10 text-[10px] text-slate-300 space-y-0.5">
                {trafficLight.reasons.slice(1).map((r, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="text-slate-400">•</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. CALCULADORA DE VENTANA ÓPTIMA DE RIEGO (ASISTENTE DE RIEGO) */}
        {irrigation && (
          <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>Asistente de Riego Inteligente</span>
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${irrigationConfig.badge}`}>
                {irrigation.status === 'NO_RIEGO'
                  ? 'No Regar'
                  : irrigation.status === 'RIEGO_LIGERO'
                  ? 'Riego Ligero'
                  : irrigation.status === 'RIEGO_URGENTE'
                  ? 'Riego Urgente'
                  : 'Riego Sugerido'}
              </span>
            </div>

            <div>
              <div className={`font-semibold text-xs ${irrigationConfig.colorText}`}>
                {irrigation.verdictTitle}
              </div>
              <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                {irrigation.verdictDescription}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900 text-[10.5px]">
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800/60">
                <span className="text-slate-400 text-[9.5px] block">Lámina Sugerida:</span>
                <strong className="text-white font-mono text-xs">
                  {irrigation.recommendedAmountMm > 0 ? `${irrigation.recommendedAmountMm} mm de lámina` : '0 mm (Suelo húmedo)'}
                </strong>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800/60">
                <span className="text-slate-400 text-[9.5px] block">Ventana Horaria Óptima:</span>
                <span className="text-emerald-400 font-medium text-[10px] leading-tight block mt-0.5">
                  {irrigation.bestWindowHour}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ALERTA DE ESTRÉS TÉRMICO */}
        {thermalAlert && thermalAlert.active && (
          <div
            className={`p-3 rounded-2xl border transition-all ${
              thermalAlert.severity === 'Crítico'
                ? 'bg-rose-950/80 border-rose-600/80 text-rose-200'
                : 'bg-amber-950/80 border-amber-500/80 text-amber-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Flame className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-outfit uppercase tracking-wider text-[11px]">
                  {thermalAlert.title}
                </span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40">
                THI: <strong>{thermalAlert.thiIndex}</strong>
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-snug">
              {thermalAlert.message}
            </p>
          </div>
        )}

        {/* TELEMETRÍA METEOROLÓGICA EN VIVO */}
        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Thermometer className="w-3 h-3 text-sky-400" />
              <span>Condiciones Agroclimáticas Actuales</span>
            </span>

            {loadingWeather ? (
              <span className="flex items-center gap-1 text-[10px] text-sky-400">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Consultando...
              </span>
            ) : (
              <span className="text-[11px] text-slate-300 font-medium">
                {weatherData?.current.weatherIcon} {weatherData?.current.weatherDescription}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800/70 text-center">
              <span className="text-[10px] text-slate-400 font-medium">Temperatura</span>
              <div className="font-outfit font-bold text-lg text-white mt-0.5">
                {loadingWeather ? '--' : `${weatherData?.current.temperature ?? '--'}°C`}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800/70 text-center">
              <span className="text-[10px] text-slate-400 font-medium">Humedad Rel.</span>
              <div className="font-outfit font-bold text-lg text-sky-400 mt-0.5">
                {loadingWeather ? '--' : `${weatherData?.current.relativeHumidity ?? '--'}%`}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800/70 text-center">
              <span className="text-[10px] text-slate-400 font-medium">Viento</span>
              <div className="font-outfit font-bold text-lg text-cyan-300 mt-0.5">
                {loadingWeather ? '--' : `${weatherData?.current.windSpeed ?? '--'} km/h`}
              </div>
            </div>
          </div>
        </div>

        {/* TELEMETRÍA EDAFOLÓGICA (SUELO) & EVAPOTRANSPIRACIÓN */}
        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Gauge className="w-3 h-3 text-emerald-400" />
              <span>Suelo Edafológico (0-1cm) & Evapotranspiración</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/70">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>Humedad Suelo</span>
                <Droplets className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="font-outfit font-bold text-base text-emerald-400 mt-0.5">
                {loadingWeather ? '--' : `${weatherData?.current.soilMoisturePct ?? 45}%`}
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, weatherData?.current.soilMoisturePct || 45)}%` }}
                ></div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/70">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>Evapotranspiración FAO</span>
                <Thermometer className="w-3 h-3 text-amber-400" />
              </div>
              <div className="font-outfit font-bold text-base text-amber-400 mt-0.5">
                {loadingWeather ? '--' : `${weatherData?.agronomy.et0Today ?? 4.2} mm`}
              </div>
              <div className="text-[9px] text-slate-400 mt-1">ET₀ demanda diaria de referencia</div>
            </div>
          </div>
        </div>

        {/* 1. GRÁFICOS AGROCLIMÁTICOS DINÁMICOS CON LAZY LOADING */}
        <Suspense fallback={<ChartSkeletonLoader title="Cargando pronóstico y climatología histórica (Recharts)..." />}>
          <ProvinceAgroCharts
            weather={weatherData}
            historicalClimatology={agroData.historicalClimatology}
            provinceName={province.name}
          />
        </Suspense>

        {/* 2. COMPARACIÓN REGIONAL DE PRODUCCIÓN DE CULTIVOS CON LAZY LOADING */}
        <Suspense fallback={<ChartSkeletonLoader height="h-44" title="Cargando comparativa regional de cosechas..." />}>
          <ProvinceCropRegionalComparison
            province={province}
          />
        </Suspense>

        {/* =========================================================================
            FASE 2: TARJETA DE CONVERSIÓN Y CAPTURA DE LEADS (SAAS AGTECH)
            Ubicada justo debajo de los gráficos climáticos de Recharts
            ========================================================================= */}
        <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-2 relative overflow-hidden shadow-lg shadow-emerald-950/40">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-900/70 text-emerald-400 border border-emerald-700/50">
              <BellRing className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Servicio de Alerta Temprana
            </span>
          </div>

          <h4 className="font-outfit font-bold text-white text-xs sm:text-sm leading-snug">
            📩 Recibe el pronóstico agrícola de {province.name} cada lunes gratis en tu WhatsApp/Correo
          </h4>

          <p className="text-[11px] text-slate-300 leading-snug">
            Recomendaciones personalizadas según el ciclo de tus cultivos y régimen de riego del Valle.
          </p>

          <button
            onClick={onOpenSubscribeModal}
            className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 group cursor-pointer"
          >
            <span>Suscribir mi Finca Gratis</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* MÓDULO DE CULTIVOS PREDOMINANTES Y CALENDARIO */}
        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Sprout className="w-3 h-3 text-emerald-400" />
              <span>Cultivos Predominantes Reales</span>
            </span>
            <span className="text-[10px] text-slate-400">Min. Agricultura RD</span>
          </div>

          <div className="space-y-1.5">
            {agroData.predominantCrops.map((crop, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/70 flex items-start justify-between gap-2"
              >
                <div>
                  <div className="font-semibold text-white text-xs flex items-center gap-1.5">
                    <span>{crop.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {crop.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {crop.economicImpact}
                  </div>
                  {crop.annualProductionTon && (
                    <div className="text-[10px] text-emerald-400 font-mono mt-1 font-medium">
                      Producción: {crop.annualProductionTon.toLocaleString('es-DO')} Ton/año
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                    crop.waterNeed === 'Alta'
                      ? 'bg-sky-950 text-sky-400 border border-sky-800'
                      : crop.waterNeed === 'Media'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    Demanda: {crop.waterNeed}
                  </span>
                  <div className="text-[9px] text-slate-400 mt-1">
                    Ciclo: {crop.cycleMonths} m
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Calendario de Siembra y Cosecha */}
          <div className="pt-2 border-t border-slate-900 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              <Calendar className="w-3 h-3 text-emerald-400" />
              <span>Calendario Óptimo de Siembra & Cosecha</span>
            </div>

            <div className="space-y-1.5">
              {agroData.plantingCalendar.map((cal, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/50 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-medium text-slate-200">
                    <span className="text-emerald-400 font-semibold">{cal.crop}</span>
                    <span className="text-[10px] text-slate-400">Régimen pluvial</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800/60">
                      <span className="text-slate-400 text-[9px] block">Siembra:</span>
                      <strong className="text-white font-mono">{cal.plantingMonths.join(', ')}</strong>
                    </div>
                    <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800/60">
                      <span className="text-slate-400 text-[9px] block">Cosecha:</span>
                      <strong className="text-amber-400 font-mono">{cal.harvestMonths.join(', ')}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COMPARATIVA MACRO-REGIONAL ACORDEÓN CON LAZY LOADING */}
        <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/50">
          <button
            onClick={() => setShowMacroSocioCompare((v) => !v)}
            className="w-full p-2.5 flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Demografía & Territorio ({province.region})</span>
            </div>
            {showMacroSocioCompare ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showMacroSocioCompare && (
            <div className="p-3 border-t border-slate-800">
              <Suspense fallback={<ChartSkeletonLoader height="h-40" title="Cargando comparativa demográfica..." />}>
                <ProvinceRegionalChart
                  province={province}
                  onSelectProvince={onCenterProvince}
                />
              </Suspense>
            </div>
          )}
        </div>

        {/* =========================================================================
            FASE 3: ESPACIO RESERVADO PARA PATROCINADOR SEGMENTADO B2B
            Ubicado al final del panel lateral, segmentado por cultivo
            ========================================================================= */}
        <SponsorBanner province={province} />
      </div>

      {/* 3. Pie del Panel con Fuente y Acciones */}
      <div className="p-3 bg-slate-950 border-t border-slate-800/90 flex items-center justify-between">
        <span className="text-[10px] text-slate-400">
          Open-Meteo API · Min. Agricultura RD
        </span>
        <button
          onClick={() => onCenterProvince(province)}
          className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Encuadrar en Mapa</span>
        </button>
      </div>
    </aside>
  );
};

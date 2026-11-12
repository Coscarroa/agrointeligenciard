/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * WIDGET DE VENTANA DE FUMIGACIÓN Y ASPERSIÓN AGRÍCOLA DE PRECISIÓN
 * Analiza viento, lluvia y temperatura en las próximas 6 horas críticas:
 * - Semáforo de seguridad (Verde, Amarillo, Rojo).
 * - Mini línea de tiempo horaria de 6 bloques compactos.
 * - Botón rápido para compartir la recomendación de fumigación por WhatsApp al encargado de finca.
 */

import React from 'react';
import {
  Wind,
  CloudRain,
  Thermometer,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Share2,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { SprayingWindowAssessment, SprayingHour } from '../services/weatherService.ts';

interface SprayingWindowWidgetProps {
  sprayingWindow?: SprayingWindowAssessment | null;
  provinceName: string;
}

export const SprayingWindowWidget: React.FC<SprayingWindowWidgetProps> = ({
  sprayingWindow,
  provinceName,
}) => {
  if (!sprayingWindow) return null;

  const { currentStatus, statusTitle, verdictMessage, hours, bestWindowLabel } = sprayingWindow;

  const statusConfig = {
    VERDE: {
      dot: 'bg-emerald-400 shadow-emerald-500/50',
      pill: 'bg-emerald-500 text-slate-950 font-bold',
      badge: 'bg-emerald-950/90 text-emerald-300 border-emerald-600/70',
      border: 'border-emerald-700/60',
      bg: 'bg-emerald-950/30',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    },
    AMARILLO: {
      dot: 'bg-amber-400 shadow-amber-500/50',
      pill: 'bg-amber-400 text-slate-950 font-bold',
      badge: 'bg-amber-950/90 text-amber-300 border-amber-600/70',
      border: 'border-amber-700/60',
      bg: 'bg-amber-950/30',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
    },
    ROJO: {
      dot: 'bg-rose-500 shadow-rose-500/50 animate-pulse',
      pill: 'bg-rose-500 text-white font-bold',
      badge: 'bg-rose-950/90 text-rose-300 border-rose-600/70',
      border: 'border-rose-700/60',
      bg: 'bg-rose-950/30',
      icon: <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />,
    },
  }[currentStatus || 'AMARILLO'];

  const handleShareSprayingAlert = () => {
    const currentUrl = window.location.href;
    const msg = encodeURIComponent(
      `🚨 *Reporte de Fumigación / Aspersión - ${provinceName}*\n` +
      `Estado: *${statusTitle}*\n` +
      `Recomendación: ${verdictMessage}\n` +
      `Ventana sugerida: ${bestWindowLabel}\n\n` +
      `Consulta el pronóstico horario completo en Agrointeligencia RD:\n${currentUrl}`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  return (
    <div className={`p-3.5 rounded-2xl border ${statusConfig.border} ${statusConfig.bg} space-y-3 transition-all shadow-lg`}>
      {/* Cabecera del Semáforo de Fumigación */}
      <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full shadow-lg ${statusConfig.dot}`}></span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 font-mono">
              Ventana de Fumigación (Próximas 4h)
            </span>
          </div>
          <h4 className="font-outfit font-bold text-sm text-white flex items-center gap-1.5">
            {statusConfig.icon}
            <span>{statusTitle}</span>
          </h4>
        </div>

        <span className={`px-2 py-0.5 text-[10px] rounded-md ${statusConfig.pill} shrink-0`}>
          {currentStatus}
        </span>
      </div>

      {/* Mensaje de Veredicto Operativo */}
      <p className="text-[11.5px] text-slate-200 leading-snug font-medium">
        {verdictMessage}
      </p>

      {/* Mini Línea de Tiempo Horaria (6 Bloques) */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-sky-400" />
            <span>Condición Horaria (Próximas 6h):</span>
          </span>
          <span className="text-emerald-400 font-medium font-mono text-[9.5px]">
            {bestWindowLabel}
          </span>
        </div>

        <div className="grid grid-cols-6 gap-1.5">
          {hours.map((h, i) => {
            const hDot =
              h.status === 'VERDE'
                ? 'bg-emerald-400'
                : h.status === 'AMARILLO'
                ? 'bg-amber-400'
                : 'bg-rose-500';

            const hBorder =
              h.status === 'VERDE'
                ? 'border-emerald-600/40 bg-slate-900/90'
                : h.status === 'AMARILLO'
                ? 'border-amber-600/40 bg-slate-900/90'
                : 'border-rose-600/40 bg-rose-950/30';

            return (
              <div
                key={i}
                className={`p-1.5 rounded-xl border ${hBorder} text-center space-y-1 transition-all`}
                title={`${h.hourLabel}: ${h.statusLabel} (${h.reason}). Viento: ${h.windSpeed} km/h, Prob. lluvia: ${h.precipitationProbability}%, Temp: ${h.temperature}°C`}
              >
                <div className="text-[10px] font-mono text-slate-300 font-semibold truncate">
                  {h.hourLabel}
                </div>

                <div className="flex items-center justify-center">
                  <span className={`w-2 h-2 rounded-full ${hDot}`} />
                </div>

                <div className="space-y-0.5 text-[9px] font-mono leading-tight">
                  <div className="text-cyan-300 font-medium flex items-center justify-center gap-0.5" title="Viento">
                    <span>{h.windSpeed}k</span>
                  </div>
                  <div
                    className={h.precipitationProbability > 40 ? 'text-rose-400 font-bold' : 'text-slate-400'}
                    title="Probabilidad de lluvia"
                  >
                    {h.precipitationProbability}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Acción Rápida: Compartir con el Encargado de Finca */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-mono">
          Regla: Viento &lt; 15 km/h · Lluvia &lt; 25% · T &lt; 31°C
        </span>

        <button
          type="button"
          onClick={handleShareSprayingAlert}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-700/60 text-[10.5px] font-semibold transition-all cursor-pointer shadow-sm group"
          title="Reenviar recomendación de fumigación a WhatsApp"
        >
          <Share2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
          <span>Avisar a Encargado</span>
        </button>
      </div>
    </div>
  );
};

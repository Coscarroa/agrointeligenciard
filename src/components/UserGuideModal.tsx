/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MANUAL INTERACTIVO DE USO - AGROINTELIGENCIA RD
 * Guía interactiva navegable paso a paso para agricultores, agrónomos y visitantes:
 * - 5 pasos prácticos en lenguaje claro y accesible.
 * - Navegación con botones Anterior / Siguiente, teclado (ArrowLeft, ArrowRight, Escape).
 * - Indicadores visuales de progreso y tips ilustrados.
 * - Enlace directo para compartir por WhatsApp con otros productores.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Filter,
  Droplets,
  CloudRain,
  BellRing,
  Share2,
  CheckCircle2,
  Sparkles,
  Compass,
  Layers,
  Sprout,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: number;
}

interface GuideStep {
  stepNumber: number;
  badge: string;
  badgeColor: string;
  title: string;
  icon: React.ReactNode;
  explanation: string;
  tip?: string;
  visualPreview: React.ReactNode;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  initialStep = 1,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  // Reiniciar siempre al paso 1 cuando se abre manualmente
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(initialStep || 1);
    }
  }, [isOpen, initialStep]);

  // Navegación por teclado: ArrowRight, ArrowLeft, Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        if (currentStep < 5) {
          setCurrentStep((s) => s + 1);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStep > 1) {
          setCurrentStep((s) => s - 1);
        }
      }
    },
    [isOpen, currentStep, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  // Pasos estructurados según especificación
  const steps: GuideStep[] = [
    {
      stepNumber: 1,
      badge: 'Paso 1: Exploración Geoespacial',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
      title: '1. Explora las 32 Provincias en el Mapa',
      icon: <Compass className="w-5 h-5 text-emerald-400" />,
      explanation:
        'Haz clic directamente sobre cualquier provincia de la República Dominicana en el mapa. La cámara hará un acercamiento automático y abrirá el panel lateral con toda su información agroclimática en tiempo real.',
      tip: 'Tip: Usa el botón en la esquina superior derecha del mapa para alternar entre Vista Mapa (política) y Vista Satélite para observar parcelas de cultivo y cursos de ríos reales.',
      visualPreview: (
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Interacción directa con el mapa</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              31 Provincias + D.N.
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-400 text-[10px]">Al hacer clic:</div>
              <div className="font-medium text-slate-200 mt-0.5">Encuadre de cámara automático</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-400 text-[10px]">Alternar capas:</div>
              <div className="font-medium text-sky-400 mt-0.5 flex items-center gap-1">
                <Layers className="w-3 h-3" />
                <span>Mapa ↔ Satélite</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      stepNumber: 2,
      badge: 'Paso 2: Filtrado Inteligente',
      badgeColor: 'bg-sky-950/80 text-sky-300 border-sky-700/60',
      title: '2. Filtra por Región, Cultivo o Nombre',
      icon: <Filter className="w-5 h-5 text-sky-400" />,
      explanation:
        'Usa la barra superior para filtrar por macroregión (Cibao/Norte, Suroeste, Sureste), buscar una provincia por nombre o seleccionar un cultivo específico (Arroz, Cacao, Plátano, etc.) para iluminar en el mapa las principales zonas productoras del país.',
      tip: 'Tip: Al elegir un cultivo en el selector, el mapa resalta automáticamente las provincias donde ese cultivo es prioritario.',
      visualPreview: (
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex flex-wrap items-center gap-1.5 text-[10.5px]">
            <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-medium">
              Cibao / Norte (14)
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium">
              Suroeste (10)
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-medium">
              Sureste (8)
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>Filtro de Cultivos:</span>
            </span>
            <span className="font-mono text-emerald-400 text-[11px] font-semibold">
              Arroz, Cacao, Café, Banano, Mango...
            </span>
          </div>
        </div>
      ),
    },
    {
      stepNumber: 3,
      badge: 'Paso 3: Decisiones de Riego en Vivo',
      badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-700/60',
      title: '3. Entiende el Semáforo Climático y el Riego',
      icon: <Droplets className="w-5 h-5 text-amber-400" />,
      explanation:
        'Al abrir una provincia, verás un indicador de color (Verde: Óptimo, Amarillo: Precaución, Rojo: Alerta) y nuestro Asistente de Riego. Este sistema analiza la humedad real del suelo y la evaporación del día para decirte si tu cultivo necesita agua hoy o si el suelo tiene suficiente humedad.',
      tip: 'Tip: El asistente te indica los milímetros de agua recomendados y la ventana horaria de menor evaporación (temprano en la mañana o al atardecer).',
      visualPreview: (
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="p-1.5 rounded-lg bg-emerald-950/70 border border-emerald-700/60 text-emerald-300">
              <span className="block font-bold">VERDE</span>
              <span className="text-[9px] text-slate-300">Condición Óptima</span>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-950/70 border border-amber-700/60 text-amber-300">
              <span className="block font-bold">AMARILLO</span>
              <span className="text-[9px] text-slate-300">Precaución</span>
            </div>
            <div className="p-1.5 rounded-lg bg-rose-950/70 border border-rose-700/60 text-rose-300">
              <span className="block font-bold">ROJO</span>
              <span className="text-[9px] text-slate-300">Alerta Severa</span>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Humedad Radicular del Suelo:</span>
            <span className="text-emerald-400 font-mono font-bold">Telemetría 0-1cm (Open-Meteo)</span>
          </div>
        </div>
      ),
    },
    {
      stepNumber: 4,
      badge: 'Paso 4: Pronóstico & Climatología',
      badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60',
      title: '4. Revisa el Pronóstico a 7 Días y el Histórico',
      icon: <CloudRain className="w-5 h-5 text-indigo-400" />,
      explanation:
        'En la sección de gráficos del panel lateral puedes alternar entre el pronóstico de lluvias y temperaturas de los próximos 7 días (ideal para planificar siembras o fumigaciones) y el comportamiento climático promedio de los 12 meses del año.',
      tip: 'Tip: También puedes consultar la pestaña de "Tendencia Predictiva" para conocer la ganancia de cosecha proyectada combinando el clima histórico y la humedad actual.',
      visualPreview: (
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Gráficos interactivos Recharts:</span>
            <span className="text-[10px] text-indigo-300 font-mono">Lluvia (mm) + Temp (°C)</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center text-[10.5px]">
            <div className="p-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-200">
              Pronóstico 7D
            </div>
            <div className="p-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-200">
              Clima 12 Meses
            </div>
            <div className="p-1.5 rounded-md bg-sky-950/80 border border-sky-800 text-sky-300 font-semibold">
              Tendencia Predictiva
            </div>
          </div>
        </div>
      ),
    },
    {
      stepNumber: 5,
      badge: 'Paso 5: Alertas Gratuitas Rurales',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
      title: '5. Recibe Reportes Gratis en tu Celular',
      icon: <BellRing className="w-5 h-5 text-emerald-400" />,
      explanation:
        "En la parte inferior del panel de tu provincia, haz clic en 'Suscribir mi Finca Gratis'. Registra tu número de WhatsApp o correo para recibir cada lunes el boletín climático de tu zona sin costo alguno.",
      tip: 'Tip: El servicio de alertas es de acceso libre y está respaldado para apoyar a productores y estudiantes de agronomía de todo el país.',
      visualPreview: (
        <div className="p-3 bg-emerald-950/30 border border-emerald-600/40 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs text-white font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Servicio de Alerta Temprana en WhatsApp</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            Recibe avisos de olas de calor, ventanas óptimas de siembra y pronósticos semanales directo en tu teléfono.
          </p>
        </div>
      ),
    },
  ];

  const current = steps[currentStep - 1];

  // Compartir por WhatsApp con mensaje pre-redactado
  const handleShareWithProducer = () => {
    const currentUrl = window.location.origin || 'https://agrointeligenciard.com';
    const message = encodeURIComponent(
      `🌾 ¡Hola! Te comparto *Agrointeligencia RD*, una herramienta gratuita de mapas y telemetría agroclimática en vivo para productores y agrónomos dominicanos:\n${currentUrl}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-6 space-y-4 flex flex-col max-h-[92vh]">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10 cursor-pointer"
          title="Cerrar guía (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado con Indicador de Progreso */}
        <div className="space-y-2 pt-1 border-b border-slate-800/80 pb-3">
          <div className="flex items-center justify-between pr-8">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border font-mono ${current.badgeColor}`}
            >
              <Sparkles className="w-3 h-3" />
              {current.badge}
            </span>

            <span className="text-xs font-mono font-bold text-slate-400">
              Paso {currentStep} de 5
            </span>
          </div>

          {/* Barra de Progreso */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`flex-1 h-full rounded-full transition-all duration-300 ${
                  s <= currentStep ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Contenido del Paso Actual */}
        <div className="space-y-3.5 overflow-y-auto pr-1">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5 shadow-inner">
              {current.icon}
            </div>
            <div>
              <h3 className="font-outfit font-bold text-lg sm:text-xl text-white leading-snug">
                {current.title}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-1">
                {current.explanation}
              </p>
            </div>
          </div>

          {/* Tarjeta de previsualización visual */}
          {current.visualPreview}

          {/* Tip práctico */}
          {current.tip && (
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[11px] text-amber-300/90 leading-snug flex items-start gap-2">
              <span className="text-amber-400 shrink-0">💡</span>
              <span>{current.tip}</span>
            </div>
          )}
        </div>

        {/* Botones de Navegación */}
        <div className="pt-2 border-t border-slate-800/90 flex items-center justify-between gap-3">
          {/* Botón Anterior */}
          <button
            type="button"
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed text-slate-500 bg-slate-950 border border-slate-800'
                : 'text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          {/* Indicadores de bolitas clicables */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setCurrentStep(s)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  s === currentStep
                    ? 'w-6 bg-emerald-400 shadow-sm shadow-emerald-500/50'
                    : 'bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Ir al Paso ${s}`}
              />
            ))}
          </div>

          {/* Botón Siguiente o Final */}
          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => Math.min(5, s + 1))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer animate-pulse"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>¡Entendido, explorar mapa!</span>
            </button>
          )}
        </div>

        {/* Enlace discreto de compartir al pie del modal */}
        <div className="pt-1 flex items-center justify-center">
          <button
            type="button"
            onClick={handleShareWithProducer}
            className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer group"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
            <span>Compartir Agrointeligencia RD con otro productor</span>
          </button>
        </div>
      </div>
    </div>
  );
};

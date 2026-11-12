/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BASE DE DATOS AGRONÓMICA DE CULTIVOS DE LA REPÚBLICA DOMINICANA (CULTIVOSCONFIG)
 * Parámetros técnicos, requerimientos edafoclimáticos y fenología de los 10 rubros agrícolas principales:
 * - Arroz, Plátano, Guineo/Banano, Cacao, Café, Aguacate, Habichuela, Yuca, Tomate, Caña de Azúcar.
 * - Algoritmo de cálculo de compatibilidad climática instantánea.
 * - Estacionalidad de mercado dominicano.
 */

export interface CultivoRequerimientos {
  id: string;
  nombre: string;
  icono: string;
  categoria: string;
  tempOptimaMin: number; // °C
  tempOptimaMax: number; // °C
  humedadSueloMin: number; // %
  cicloMeses: number;
  diasCicloPromedio: number;
  demandaHidrica: 'Baja' | 'Media' | 'Alta';
  nivelInversion: 'Bajo' | 'Medio' | 'Alto';
  variedadesPrincipales: string[];
  mesesSiembra: number[]; // 0-indexed (0 = Ene, 11 = Dic)
  mesesCosecha: number[]; // 0-indexed
  fasesFenologicas: Array<{
    nombre: string;
    porcentajeCiclo: number; // Porcentaje del ciclo completado al final de la fase
    descripcion: string;
  }>;
}

export const CULTIVOS_CONFIG_MAP: Record<string, CultivoRequerimientos> = {
  arroz: {
    id: 'arroz',
    nombre: 'Arroz (Bajo Riego)',
    icono: '🌾',
    categoria: 'Cereales',
    tempOptimaMin: 22,
    tempOptimaMax: 31,
    humedadSueloMin: 60,
    cicloMeses: 4.5,
    diasCicloPromedio: 135,
    demandaHidrica: 'Alta',
    nivelInversion: 'Alto',
    variedadesPrincipales: ['Juma 57', 'Prosequisa 4', 'Jaragua', 'Puita'],
    mesesSiembra: [10, 11, 0, 4, 5], // Nov-Ene, May-Jun
    mesesCosecha: [3, 4, 5, 9, 10], // Abr-Jun, Oct-Nov
    fasesFenologicas: [
      { nombre: 'Germinación y Trasplante', porcentajeCiclo: 15, descripcion: 'Enraizamiento y anclaje en fango' },
      { nombre: 'Macollamiento Activo', porcentajeCiclo: 40, descripcion: 'Emisión de hijos y absorción de nitrógeno' },
      { nombre: 'Diferenciación y Embuche', porcentajeCiclo: 65, descripcion: 'Sensibilidad crítica a estrés hídrico' },
      { nombre: 'Espigado y Floración', porcentajeCiclo: 80, descripcion: 'Riesgo de vaneo por calor extremo' },
      { nombre: 'Llenado y Cosecha', porcentajeCiclo: 100, descripcion: 'Grano lechoso, pastoso y corte final' },
    ],
  },
  platano: {
    id: 'platano',
    nombre: 'Plátano',
    icono: '🍌',
    categoria: 'Musáceas',
    tempOptimaMin: 24,
    tempOptimaMax: 30,
    humedadSueloMin: 50,
    cicloMeses: 11,
    diasCicloPromedio: 330,
    demandaHidrica: 'Alta',
    nivelInversion: 'Medio',
    variedadesPrincipales: ['Macho x Hembra', 'FHIA-20', 'Barahonero'],
    mesesSiembra: [4, 5, 8, 9], // May-Jun, Sep-Oct
    mesesCosecha: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // Todo el año
    fasesFenologicas: [
      { nombre: 'Establecimiento de Cepa', porcentajeCiclo: 20, descripcion: 'Desarrollo de raíces primarias' },
      { nombre: 'Diferenciación Foliar', porcentajeCiclo: 50, descripcion: 'Formación de hojas vigorosas sin estrés' },
      { nombre: 'Emisión de Bellota', porcentajeCiclo: 70, descripcion: 'Aparición de la inflorescencia' },
      { nombre: 'Llenado del Racimo', porcentajeCiclo: 90, descripcion: 'Calibración y desmane' },
      { nombre: 'Corte y Cosecha', porcentajeCiclo: 100, descripcion: 'Punto óptimo de grado exportación' },
    ],
  },
  guineo: {
    id: 'guineo',
    nombre: 'Guineo / Banano Orgánico',
    icono: '🍌',
    categoria: 'Musáceas',
    tempOptimaMin: 25,
    tempOptimaMax: 30,
    humedadSueloMin: 55,
    cicloMeses: 9.5,
    diasCicloPromedio: 285,
    demandaHidrica: 'Alta',
    nivelInversion: 'Alto',
    variedadesPrincipales: ['Gran Enano (Cavendish)', 'Williams', 'Valery'],
    mesesSiembra: [3, 4, 5, 8, 9],
    mesesCosecha: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    fasesFenologicas: [
      { nombre: 'Brote y Arraigo', porcentajeCiclo: 20, descripcion: 'Aclimatación y protección contra nematodos' },
      { nombre: 'Crecimiento Vegetativo', porcentajeCiclo: 55, descripcion: 'Demanda de potasio y riego constante' },
      { nombre: 'Parición de Bellota', porcentajeCiclo: 75, descripcion: 'Embolsado y encintado semanal' },
      { nombre: 'Engrose de Manos', porcentajeCiclo: 92, descripcion: 'Control estricto de sigatoka' },
      { nombre: 'Corte y Empaque', porcentajeCiclo: 100, descripcion: 'Calibre internacional certificado' },
    ],
  },
  cacao: {
    id: 'cacao',
    nombre: 'Cacao (Fino & Orgánico)',
    icono: '🍫',
    categoria: 'Agroforestería',
    tempOptimaMin: 23,
    tempOptimaMax: 29,
    humedadSueloMin: 45,
    cicloMeses: 5.5,
    diasCicloPromedio: 165,
    demandaHidrica: 'Media',
    nivelInversion: 'Medio',
    variedadesPrincipales: ['Hispaniola (Fermentado)', 'Sánchez', 'Clones ICS-95', 'UF-667'],
    mesesSiembra: [4, 5, 8, 9],
    mesesCosecha: [3, 4, 5, 6, 10, 11, 0], // Zafra Principal (Abr-Jul) y Otoño (Nov-Ene)
    fasesFenologicas: [
      { nombre: 'Brotación y Floración', porcentajeCiclo: 20, descripcion: 'Aparición de cojines florales en tronco' },
      { nombre: 'Cuajado de Cherelles', porcentajeCiclo: 40, descripcion: 'Frutos pequeños susceptibles a monilia' },
      { nombre: 'Crecimiento de Mazorca', porcentajeCiclo: 75, descripcion: 'Formación y desarrollo de almendras' },
      { nombre: 'Maduración y Cambio de Color', porcentajeCiclo: 90, descripcion: 'Viraje de verde/morado a amarillo/rojo' },
      { nombre: 'Quiebra y Fermentación', porcentajeCiclo: 100, descripcion: 'Cosecha selectiva de mazorcas sanas' },
    ],
  },
  cafe: {
    id: 'cafe',
    nombre: 'Café (Especial & Altura)',
    icono: '☕',
    categoria: 'Cultivos de Altura',
    tempOptimaMin: 18,
    tempOptimaMax: 25,
    humedadSueloMin: 40,
    cicloMeses: 8,
    diasCicloPromedio: 240,
    demandaHidrica: 'Media',
    nivelInversion: 'Medio',
    variedadesPrincipales: ['Típica', 'Caturra', 'Geisha de Altura', 'Obatá'],
    mesesSiembra: [4, 5, 8],
    mesesCosecha: [10, 11, 0, 1, 2], // Noviembre a Marzo
    fasesFenologicas: [
      { nombre: 'Floración Blanca', porcentajeCiclo: 15, descripcion: 'Apertura tras primeras lluvias' },
      { nombre: 'Cuajado y Grano Verde', porcentajeCiclo: 45, descripcion: 'Control preventivo de broca' },
      { nombre: 'Llenado y Consistencia', porcentajeCiclo: 75, descripcion: 'Fijación de azúcares y densidad' },
      { nombre: 'Maduración de la Cereza', porcentajeCiclo: 90, descripcion: 'Viraje a rojo carmesí' },
      { nombre: 'Recolección Selectiva', porcentajeCiclo: 100, descripcion: 'Corte a mano grano a grano' },
    ],
  },
  aguacate: {
    id: 'aguacate',
    nombre: 'Aguacate (Hass & Semil)',
    icono: '🥑',
    categoria: 'Frutales de Exportación',
    tempOptimaMin: 20,
    tempOptimaMax: 28,
    humedadSueloMin: 40,
    cicloMeses: 7,
    diasCicloPromedio: 210,
    demandaHidrica: 'Media',
    nivelInversion: 'Alto',
    variedadesPrincipales: ['Semil 34', 'Hass de Altura', 'Carla', 'Choquette'],
    mesesSiembra: [4, 5, 8, 9],
    mesesCosecha: [9, 10, 11, 0, 1], // Octubre a Febrero
    fasesFenologicas: [
      { nombre: 'Floración en Panícula', porcentajeCiclo: 20, descripcion: 'Polinización cruzada clave' },
      { nombre: 'Cuajado de Frutitos', porcentajeCiclo: 40, descripcion: 'Purga natural y selección de fruto' },
      { nombre: 'Crecimiento Rápido', porcentajeCiclo: 70, descripcion: 'Riego balanceado sin encharcar raíces' },
      { nombre: 'Acumulación de Aceite', porcentajeCiclo: 90, descripcion: 'Materia seca óptima > 23%' },
      { nombre: 'Cosecha con Tijera', porcentajeCiclo: 100, descripcion: 'Corte con pedúnculo intacto' },
    ],
  },
  habichuela: {
    id: 'habichuela',
    nombre: 'Habichuela (Grano Rojo/Negro)',
    icono: '🫘',
    categoria: 'Leguminosas',
    tempOptimaMin: 20,
    tempOptimaMax: 27,
    humedadSueloMin: 35,
    cicloMeses: 2.8,
    diasCicloPromedio: 85,
    demandaHidrica: 'Baja',
    nivelInversion: 'Bajo',
    variedadesPrincipales: ['Roja Moteada San Juan', 'Arroyo Loro', 'Negra DPC', 'Yacambú'],
    mesesSiembra: [10, 11], // 5 Noviembre al 15 Diciembre (Siembra de San Juan)
    mesesCosecha: [1, 2], // Febrero a Marzo
    fasesFenologicas: [
      { nombre: 'Emergencia y Primer Trifolio', porcentajeCiclo: 20, descripcion: 'Sensibilidad a gusano picador' },
      { nombre: 'Desarrollo Vegetativo', porcentajeCiclo: 45, descripcion: 'Nodulación y fijación de N' },
      { nombre: 'Floración y Vainas', porcentajeCiclo: 70, descripcion: 'Vigilar mosca blanca y calor excesivo' },
      { nombre: 'Llenado de Granos', porcentajeCiclo: 88, descripcion: 'Secado gradual del follaje' },
      { nombre: 'Arranque y Trilla', porcentajeCiclo: 100, descripcion: 'Cosecha en vaina seca' },
    ],
  },
  yuca: {
    id: 'yuca',
    nombre: 'Yuca (Mandioca)',
    icono: '🥔',
    categoria: 'Raíces y Tubérculos',
    tempOptimaMin: 24,
    tempOptimaMax: 32,
    humedadSueloMin: 30,
    cicloMeses: 9,
    diasCicloPromedio: 270,
    demandaHidrica: 'Baja',
    nivelInversion: 'Bajo',
    variedadesPrincipales: ['Valencia', 'Lima', 'Mocana', 'Señorita'],
    mesesSiembra: [3, 4, 8, 9],
    mesesCosecha: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    fasesFenologicas: [
      { nombre: 'Brote de Estaca', porcentajeCiclo: 15, descripcion: 'Emergencia de brotes en caballón' },
      { nombre: 'Desarrollo de Follaje', porcentajeCiclo: 40, descripcion: 'Cobertura del suelo y control de malezas' },
      { nombre: 'Diferenciación de Raíces', porcentajeCiclo: 65, descripcion: 'Comienzo de acumulación de almidón' },
      { nombre: 'Engrose del Tubérculo', porcentajeCiclo: 90, descripcion: 'Resistencia a sequía transitoria' },
      { nombre: 'Arrancado y Venta', porcentajeCiclo: 100, descripcion: 'Raíz turgente sin fibras duras' },
    ],
  },
  tomate: {
    id: 'tomate',
    nombre: 'Tomate (Industrial & Ensalada)',
    icono: '🍅',
    categoria: 'Hortalizas',
    tempOptimaMin: 20,
    tempOptimaMax: 28,
    humedadSueloMin: 45,
    cicloMeses: 3.5,
    diasCicloPromedio: 105,
    demandaHidrica: 'Alta',
    nivelInversion: 'Alto',
    variedadesPrincipales: ['Barceló (Industrial)', 'Tycoon', 'Pera', 'Torrano'],
    mesesSiembra: [9, 10, 11], // Zafra de Tomate en Azua y Montecristi
    mesesCosecha: [0, 1, 2, 3], // Enero a Abril
    fasesFenologicas: [
      { nombre: 'Trasplante en Bandeja', porcentajeCiclo: 20, descripcion: 'Aclimatación y riego por goteo' },
      { nombre: 'Crecimiento y Ramificación', porcentajeCiclo: 45, descripcion: 'Tutorado y poda axilar' },
      { nombre: 'Floración y Cuajado', porcentajeCiclo: 70, descripcion: 'Sensible a aborto floral si T > 32°C' },
      { nombre: 'Viraje y Llenado', porcentajeCiclo: 90, descripcion: 'Acumulación de licopeno y grados Brix' },
      { nombre: 'Cosecha Escalonada', porcentajeCiclo: 100, descripcion: 'Recolección en madurez firme' },
    ],
  },
  cana: {
    id: 'cana',
    nombre: 'Caña de Azúcar',
    icono: '🎋',
    categoria: 'Agroindustria',
    tempOptimaMin: 25,
    tempOptimaMax: 33,
    humedadSueloMin: 40,
    cicloMeses: 12,
    diasCicloPromedio: 365,
    demandaHidrica: 'Media',
    nivelInversion: 'Medio',
    variedadesPrincipales: ['Canal Point (CP-72)', 'RD-7511', 'PR-1013'],
    mesesSiembra: [4, 5, 8, 9],
    mesesCosecha: [11, 0, 1, 2, 3, 4, 5], // Zafra azucarera Diciembre a Junio
    fasesFenologicas: [
      { nombre: 'Brotación y Arraigo', porcentajeCiclo: 15, descripcion: 'Nacimiento de tallos primarios' },
      { nombre: 'Macollamiento Denso', porcentajeCiclo: 40, descripcion: 'Cierre de calles e intercepción de luz' },
      { nombre: 'Gran Crecimiento', porcentajeCiclo: 75, descripcion: 'Elongación activa de entrenudos' },
      { nombre: 'Maduración y Sacarosa', porcentajeCiclo: 92, descripcion: 'Déficit hídrico programado para secado' },
      { nombre: 'Zafra y Corte', porcentajeCiclo: 100, descripcion: 'Transporte expedito a ingenio' },
    ],
  },
};

export const CULTIVOS_ARRAY: CultivoRequerimientos[] = Object.values(CULTIVOS_CONFIG_MAP);

/**
 * Calcula el Índice de Compatibilidad Climática Hoy (0% a 100%)
 * cruzando temperatura y humedad de suelo reales frente a los requerimientos óptimos del cultivo.
 */
export function calcularCompatibilidadClimatica(
  cultivo: CultivoRequerimientos,
  temperaturaActual: number,
  humedadSueloActual: number
): {
  score: number;
  colorClass: string;
  badgeLabel: string;
  tempImpact: string;
  soilImpact: string;
} {
  // 1. Evaluación de temperatura (peso 55%)
  let tempScore = 100;
  if (temperaturaActual < cultivo.tempOptimaMin) {
    const diff = cultivo.tempOptimaMin - temperaturaActual;
    tempScore = Math.max(20, 100 - diff * 12);
  } else if (temperaturaActual > cultivo.tempOptimaMax) {
    const diff = temperaturaActual - cultivo.tempOptimaMax;
    tempScore = Math.max(15, 100 - diff * 15);
  }

  // 2. Evaluación de humedad de suelo (peso 45%)
  let soilScore = 100;
  if (humedadSueloActual < cultivo.humedadSueloMin) {
    const diff = cultivo.humedadSueloMin - humedadSueloActual;
    soilScore = Math.max(20, 100 - diff * 2.2);
  } else if (humedadSueloActual > 85 && cultivo.demandaHidrica !== 'Alta') {
    // Exceso de agua para cultivos sensibles a asfixia radicular
    soilScore = Math.max(30, 100 - (humedadSueloActual - 85) * 3);
  }

  const scoreTotal = Math.round(tempScore * 0.55 + soilScore * 0.45);
  const clampedScore = Math.min(100, Math.max(15, scoreTotal));

  let colorClass = 'text-emerald-400 bg-emerald-500';
  let badgeLabel = 'Excelente Adaptación';
  if (clampedScore < 50) {
    colorClass = 'text-rose-400 bg-rose-500';
    badgeLabel = 'Condición Desfavorable';
  } else if (clampedScore < 75) {
    colorClass = 'text-amber-400 bg-amber-500';
    badgeLabel = 'Adaptación Moderada';
  }

  const tempImpact =
    temperaturaActual >= cultivo.tempOptimaMin && temperaturaActual <= cultivo.tempOptimaMax
      ? `Temperatura (${temperaturaActual}°C) dentro del rango óptimo (${cultivo.tempOptimaMin}-${cultivo.tempOptimaMax}°C).`
      : temperaturaActual > cultivo.tempOptimaMax
      ? `Temperatura (${temperaturaActual}°C) supera el rango óptimo (${cultivo.tempOptimaMax}°C máx).`
      : `Temperatura (${temperaturaActual}°C) por debajo del rango óptimo (${cultivo.tempOptimaMin}°C mín).`;

  const soilImpact =
    humedadSueloActual >= cultivo.humedadSueloMin
      ? `Humedad de suelo (${humedadSueloActual}%) satisface el mínimo requerido (${cultivo.humedadSueloMin}%).`
      : `Humedad (${humedadSueloActual}%) por debajo del mínimo sugerido (${cultivo.humedadSueloMin}%).`;

  return {
    score: clampedScore,
    colorClass,
    badgeLabel,
    tempImpact,
    soilImpact,
  };
}

/**
 * Determina el estado de estacionalidad de mercado en República Dominicana para un cultivo dado
 */
export function getEstacionalidadMercadoRD(
  cultivoId: string,
  mesActualIndex: number = new Date().getMonth()
): {
  estado: 'COSECHA_ALTA' | 'SIEMBRA' | 'TEMPORADA_BAJA';
  label: string;
  colorBadge: string;
  descripcion: string;
} {
  const c = CULTIVOS_CONFIG_MAP[cultivoId.toLowerCase()] || CULTIVOS_CONFIG_MAP.arroz;

  if (c.mesesCosecha.includes(mesActualIndex)) {
    return {
      estado: 'COSECHA_ALTA',
      label: 'Plena Cosecha (Oferta Alta)',
      colorBadge: 'bg-emerald-950 text-emerald-300 border-emerald-700/60',
      descripcion: 'Alta disponibilidad de grano o fruto en centros de acopio y mercados.',
    };
  }

  if (c.mesesSiembra.includes(mesActualIndex)) {
    return {
      estado: 'SIEMBRA',
      label: 'Época de Siembra (Demanda de Insumos)',
      colorBadge: 'bg-sky-950 text-sky-300 border-sky-700/60',
      descripcion: 'Ventana activa de siembra y trasplante; alta demanda de fertilizantes y semillas.',
    };
  }

  return {
    estado: 'TEMPORADA_BAJA',
    label: 'Temporada Baja (Precios al Alza)',
    colorBadge: 'bg-amber-950 text-amber-300 border-amber-700/60',
    descripcion: 'Menor entrada de producto local a mercados; precios al productor suelen repuntar.',
  };
}

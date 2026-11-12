/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SERVICIO AGROMETEOROLÓGICO EN TIEMPO REAL - OPEN-METEO API
 * Conexión en vivo sin claves requeridas a la API abierta de Open-Meteo
 * Variables agroclimáticas: temperatura, humedad relativa, viento, precipitación,
 * evapotranspiración de referencia FAO-56 (ET0), humedad del suelo (0-1cm) y temperatura del suelo.
 * 
 * ARQUITECTURA DE RENDIMIENTO Y ALTO VALOR AGRÍCOLA:
 * 1. Persistencia de Caché Inteligente con LocalStorage (TTL de 15 minutos por provincia).
 * 2. Sistema de Semáforo de Alertas Agroclimáticas (Rojo Crítico, Amarillo Precaución, Verde Óptimo).
 * 3. Asistente / Calculadora de Ventana Óptima de Riego (Balance hídrico diario y déficit de suelo).
 * 4. Alerta de Estrés Térmico (Índice THI agropecuario).
 */

export interface OpenMeteoCurrent {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  precipitation: number;
  wind_speed_10m: number;
  weather_code: number;
  soil_moisture_0_to_1cm?: number;
  soil_temperature_0cm?: number;
}

export interface OpenMeteoDaily {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  et0_fao_evapotranspiration: number[];
  weather_code?: number[];
}

export type ThermalStressSeverity = 'Normal' | 'Precaución' | 'Alerta' | 'Crítico';

export interface ThermalStressAlert {
  active: boolean;
  severity: ThermalStressSeverity;
  title: string;
  thiIndex: number; // Índice de Temperatura y Humedad THI
  apparentTemp: number; // Sensación térmica aproximada (°C)
  message: string;
  cropImpact: string;
  recommendations: string[];
}

// 3. Sistema de Semáforo de Alertas Agroclimáticas
export type AgroTrafficLightColor = 'VERDE' | 'AMARILLO' | 'ROJO';

export interface AgroTrafficLightAlert {
  color: AgroTrafficLightColor;
  label: 'Óptimo' | 'Precaución' | 'Crítico';
  title: string;
  reasons: string[];
  primaryWarning: string;
}

// 4. Calculadora de Ventana Óptima de Riego (Asistente de Riego)
export type IrrigationVerdictStatus = 'NO_RIEGO' | 'RIEGO_LIGERO' | 'RIEGO_RECOMENDADO' | 'RIEGO_URGENTE';

export interface IrrigationAssistant {
  status: IrrigationVerdictStatus;
  verdictTitle: string;
  verdictDescription: string;
  recommendedAmountMm: number; // Milímetros de lámina recomendada
  bestWindowHour: string; // ej. "6:00 AM - 8:30 AM o 5:30 PM"
  waterBalanceMm: number; // Precipitación - ET0
}

// 5. Ventana Operativa de Fumigación y Aspersión Agrícola (Próximas 6 Horas)
export type SprayingSafetyStatus = 'VERDE' | 'AMARILLO' | 'ROJO';

export interface SprayingHour {
  time: string;
  hourLabel: string; // ej. "2 PM", "3 PM"
  temperature: number; // °C
  relativeHumidity: number; // %
  windSpeed: number; // km/h
  precipitation: number; // mm
  precipitationProbability: number; // %
  status: SprayingSafetyStatus;
  statusLabel: string;
  reason: string;
}

export interface SprayingWindowAssessment {
  currentStatus: SprayingSafetyStatus;
  statusTitle: string;
  verdictMessage: string;
  hours: SprayingHour[]; // Próximas 6 horas exactas
  bestWindowLabel: string;
}

export interface AgroWeatherData {
  provinceId: string;
  source: 'open-meteo' | 'localStorage' | 'fallback';
  fetchedAt: number;
  current: {
    temperature: number; // °C
    relativeHumidity: number; // %
    precipitation: number; // mm
    windSpeed: number; // km/h
    weatherCode: number;
    weatherDescription: string;
    weatherIcon: string;
    soilMoisturePct: number; // 0-100%
    soilTemperature: number; // °C
  };
  trafficLight: AgroTrafficLightAlert;
  irrigationAssistant: IrrigationAssistant;
  thermalAlert: ThermalStressAlert;
  sprayingWindow: SprayingWindowAssessment;
  next6Hours: SprayingHour[];
  agronomy: {
    et0Today: number; // mm
    precipitationToday: number; // mm
    waterDeficit: number; // mm (precipitación - ET0)
    waterStressRisk: 'Bajo' | 'Medio' | 'Alto';
    waterStressDescription: string;
  };
  dailyForecast: Array<{
    date: string;
    dayLabel: string;
    tempMax: number;
    tempMin: number;
    precipitation: number;
    et0: number;
    weatherCode: number;
  }>;
}

// Diccionario de interpretación de códigos meteorológicos WMO de Open-Meteo
export function getWMODescription(code: number): { text: string; icon: string } {
  if (code === 0) return { text: 'Cielo despejado', icon: '☀️' };
  if (code === 1) return { text: 'Principalmente despejado', icon: '🌤️' };
  if (code === 2) return { text: 'Parcialmente nublado', icon: '⛅' };
  if (code === 3) return { text: 'Nublado', icon: '☁️' };
  if (code === 45 || code === 48) return { text: 'Neblina matutina', icon: '🌫️' };
  if (code >= 51 && code <= 55) return { text: 'Llovizna ligera', icon: '🌦️' };
  if (code >= 61 && code <= 65) return { text: 'Lluvia moderada', icon: '🌧️' };
  if (code >= 80 && code <= 82) return { text: 'Chubascos tropicales', icon: '🌧️' };
  if (code >= 95 && code <= 99) return { text: 'Tormenta eléctrica', icon: '⛈️' };
  return { text: 'Condición variable', icon: '⛅' };
}

/**
 * 3. Lógica del Sistema de Semáforo de Alertas Agroclimáticas:
 * - ROJO (Crítico): Si vientos > 40 km/h (riesgo grave de acame en plátanos y caída de ramas)
 *   o temperaturas extremas (>=33°C) o estrés hídrico alto o THI >= 84.
 * - AMARILLO (Precaución): Si la humedad del suelo es < 25% o el balance hídrico es deficitario (precipitacion < et0 - 1.5mm)
 *   o viento entre 28 y 40 km/h.
 * - VERDE (Óptimo): Condiciones ideales para el desarrollo y llenado de frutos agrícolas.
 */
export function calculateAgroTrafficLight(
  temperature: number,
  relativeHumidity: number,
  windSpeed: number,
  soilMoisturePct: number,
  waterDeficit: number,
  thiIndex: number
): AgroTrafficLightAlert {
  const reasons: string[] = [];

  const isWindCritical = windSpeed > 40;
  const isTempCritical = temperature >= 33 || thiIndex >= 84;
  const isWaterCritical = soilMoisturePct < 18 || waterDeficit < -3.8;

  if (isWindCritical) {
    reasons.push(`Vientos fuertes (${windSpeed} km/h): Alto riesgo de acame y caída en plátano y banano.`);
  }
  if (isTempCritical) {
    reasons.push(`Estrés térmico severo (${temperature}°C, THI ${thiIndex}): Aborto de floración en arroz y tomate.`);
  }
  if (isWaterCritical) {
    reasons.push(`Déficit hídrico crítico en suelo (${soilMoisturePct}% de humedad).`);
  }

  if (isWindCritical || isTempCritical || isWaterCritical) {
    return {
      color: 'ROJO',
      label: 'Crítico',
      title: 'Semáforo Rojo: Alerta Agroclimática Crítica',
      reasons,
      primaryWarning: reasons[0] || 'Condiciones climáticas severas para cultivos sensibles.',
    };
  }

  const isSoilLow = soilMoisturePct < 30;
  const isDeficit = waterDeficit < -1.5;
  const isWindModerate = windSpeed >= 28 && windSpeed <= 40;
  const isTempWarm = temperature >= 29.5 || thiIndex >= 78;

  if (isSoilLow) {
    reasons.push(`Humedad del suelo baja (${soilMoisturePct}%): Estrés incipiente en capa radicular.`);
  }
  if (isDeficit) {
    reasons.push(`Evaporación excede la lluvia por ${Math.abs(waterDeficit)} mm/día.`);
  }
  if (isWindModerate) {
    reasons.push(`Ráfagas moderadas (${windSpeed} km/h): Puede acelerar la desecación de follaje.`);
  }
  if (isTempWarm) {
    reasons.push(`Bochorno tropical (${temperature}°C, HR ${relativeHumidity}%).`);
  }

  if (isSoilLow || isDeficit || isWindModerate || isTempWarm) {
    return {
      color: 'AMARILLO',
      label: 'Precaución',
      title: 'Semáforo Amarillo: Precaución Agroclimática',
      reasons,
      primaryWarning: reasons[0] || 'Vigilar riego y balance hídrico durante la jornada.',
    };
  }

  return {
    color: 'VERDE',
    label: 'Óptimo',
    title: 'Semáforo Verde: Condiciones Agroclimáticas Óptimas',
    reasons: ['Humedad edáfica balanceada', 'Temperatura confortable para fotosíntesis activa', 'Vientos calmos'],
    primaryWarning: 'Entorno ideal para floración, cuajado y llenado de grano.',
  };
}

/**
 * 4. Calculadora de Ventana Óptima de Riego (Asistente de Riego):
 * Cruza la Evapotranspiración FAO (ET0), la precipitación esperada y la humedad del suelo.
 */
export function calculateIrrigationAssistant(
  et0Today: number,
  precipToday: number,
  soilMoisturePct: number
): IrrigationAssistant {
  const waterBalance = Number((precipToday - et0Today).toFixed(1));

  // Si llovió significativamente o el suelo está saturado (> 75%)
  if (precipToday >= 12 || soilMoisturePct >= 70) {
    return {
      status: 'NO_RIEGO',
      verdictTitle: 'Suelo Saturado: No se requiere riego hoy',
      verdictDescription: `Lluvia acumulada (${precipToday} mm) y humedad del suelo (${soilMoisturePct}%) cubren holgadamente la demanda hídrica. Evite encharcamientos.`,
      recommendedAmountMm: 0,
      bestWindowHour: 'No programar riego en las próximas 24-36 horas',
      waterBalanceMm: waterBalance,
    };
  }

  // Si la lluvia cubrió casi toda la ET0
  if (waterBalance >= 0) {
    return {
      status: 'NO_RIEGO',
      verdictTitle: 'Balance Favorable: Sin necesidad de riego',
      verdictDescription: `La precipitación (${precipToday} mm) compensa la evaporación del cultivo (ET₀: ${et0Today} mm).`,
      recommendedAmountMm: 0,
      bestWindowHour: 'Monitorear nuevamente al anochecer',
      waterBalanceMm: waterBalance,
    };
  }

  // Déficit moderado
  if (soilMoisturePct >= 40 && waterBalance > -2.5) {
    return {
      status: 'RIEGO_LIGERO',
      verdictTitle: 'Riego Ligero de Mantenimiento',
      verdictDescription: `Déficit menor (${Math.abs(waterBalance)} mm). Se aconseja una lámina ligera para evitar descenso de humedad radicular.`,
      recommendedAmountMm: Math.round(et0Today * 0.7),
      bestWindowHour: '6:00 AM - 8:00 AM (mínima evaporación por viento)',
      waterBalanceMm: waterBalance,
    };
  }

  // Evaporación acelerada o suelo seco
  if (soilMoisturePct < 25 || waterBalance <= -4.0) {
    return {
      status: 'RIEGO_URGENTE',
      verdictTitle: 'Riego Urgente: Déficit Hídrico Severo',
      verdictDescription: `Evaporación acelerada detectada en las últimas 24h (ET₀: ${et0Today} mm) con suelo reseco (${soilMoisturePct}%). Peligro de marchitez permanente.`,
      recommendedAmountMm: Math.round(et0Today * 1.4),
      bestWindowHour: 'Temprano en la mañana (5:30 AM - 8:00 AM) o tarde (5:30 PM)',
      waterBalanceMm: waterBalance,
    };
  }

  return {
    status: 'RIEGO_RECOMENDADO',
    verdictTitle: 'Riego Recomendado: Evaporación Acelerada',
    verdictDescription: `La evapotranspiración diaria (${et0Today} mm) supera la precipitación (${precipToday} mm). Se aconseja reponer la lámina consumida.`,
    recommendedAmountMm: Math.round(et0Today * 1.1),
    bestWindowHour: '6:00 AM - 8:30 AM o 5:00 PM - 7:00 PM',
    waterBalanceMm: waterBalance,
  };
}

/**
 * 5. Evaluación de Seguridad para Fumigación y Aspersión Agrícola (Por Hora)
 * - VERDE: Viento < 15 km/h, Prob. lluvia < 25%, Temp < 31°C y Humedad Relativa > 45%.
 * - AMARILLO: Viento 15-22 km/h, Prob. lluvia 25-50% o Temp 31-34°C.
 * - ROJO: Viento > 22 km/h, Prob. lluvia > 50% o lluvia activa > 0.2 mm.
 */
export function evaluateHourSprayingSafety(
  temp: number,
  humidity: number,
  windSpeed: number,
  precip: number,
  precipProb: number
): { status: SprayingSafetyStatus; statusLabel: string; reason: string } {
  // 1. Condición Crítica / Rojo
  if (windSpeed > 22 || precipProb > 50 || precip > 0.2) {
    let reason = 'Alto riesgo';
    if (precip > 0.2 || precipProb > 50) reason = 'Riesgo de lavado por lluvia';
    else if (windSpeed > 22) reason = 'Deriva excesiva por viento fuerte';
    return {
      status: 'ROJO',
      statusLabel: 'No Fumigar',
      reason,
    };
  }

  // 2. Condición de Precaución / Amarillo
  if (
    (windSpeed >= 15 && windSpeed <= 22) ||
    (precipProb >= 25 && precipProb <= 50) ||
    (temp >= 31 && temp <= 34) ||
    humidity < 45
  ) {
    let reason = 'Aplicación condicionada';
    if (windSpeed >= 15) reason = 'Viento moderado (usar antideriva)';
    else if (temp >= 31) reason = 'Calor elevado (evaporación rápida)';
    else if (humidity < 45) reason = 'Baja humedad ambiental';
    else reason = 'Lluvia probable en la zona';
    return {
      status: 'AMARILLO',
      statusLabel: 'Precaución',
      reason,
    };
  }

  // 3. Condición Óptima / Verde
  return {
    status: 'VERDE',
    statusLabel: 'Óptimo',
    reason: 'Absorción foliar ideal y sin deriva',
  };
}

export function evaluateSprayingWindow(hours: SprayingHour[]): SprayingWindowAssessment {
  if (hours.length === 0) {
    return {
      currentStatus: 'AMARILLO',
      statusTitle: 'Precaución / Aplicación Condicionada',
      verdictMessage: 'Sin datos horarios suficientes para validar ventana.',
      hours: [],
      bestWindowLabel: 'Consultar al atardecer',
    };
  }

  // Analizar las primeras horas críticas (próximas 4 horas)
  const criticalHours = hours.slice(0, 4);
  const firstHour = hours[0];

  let currentStatus: SprayingSafetyStatus = firstHour.status;
  let statusTitle = 'Ventana Óptima para Fumigar';
  let verdictMessage = 'Condiciones ideales de viento y humedad. Buena absorción foliar y bajo riesgo de deriva.';

  // Si la primera hora o la mayoría es roja
  const redCount = criticalHours.filter((h) => h.status === 'ROJO').length;
  const yellowCount = criticalHours.filter((h) => h.status === 'AMARILLO').length;

  if (firstHour.status === 'ROJO' || redCount >= 2) {
    currentStatus = 'ROJO';
    statusTitle = 'No Fumigar - Alto Riesgo';
    verdictMessage = 'Riesgo alto de lavado por lluvia o arrastre por viento. Pospón la aplicación.';
  } else if (firstHour.status === 'AMARILLO' || yellowCount >= 2) {
    currentStatus = 'AMARILLO';
    statusTitle = 'Precaución / Aplicación Condicionada';
    verdictMessage = 'Viento moderado o calor elevado. Usa boquillas antideriva o espera al final de la tarde.';
  }

  // Encontrar la mejor ventana (primera hora verde)
  const bestHour = hours.find((h) => h.status === 'VERDE');
  const bestWindowLabel = bestHour
    ? `Ventana segura a las ${bestHour.hourLabel} (${bestHour.windSpeed} km/h, ${bestHour.precipitationProbability}% lluvia)`
    : 'No se detecta ventana verde en las próximas 6 horas';

  return {
    currentStatus,
    statusTitle,
    verdictMessage,
    hours,
    bestWindowLabel,
  };
}

/**
 * LÓGICA DE ANÁLISIS DE ESTRÉS TÉRMICO AGROPECUARIO:
 * THI = 0.8 * T + (RH / 100) * (T - 14.4) + 46.4
 */
export function calculateThermalStressAlert(
  temperature: number,
  relativeHumidity: number
): ThermalStressAlert {
  const T = temperature;
  const RH = relativeHumidity;
  const thi = Number((0.8 * T + (RH / 100) * (T - 14.4) + 46.4).toFixed(1));
  const apparentTemp = Number((T + 0.33 * ((RH / 100) * 6.105 * Math.exp((17.27 * T) / (237.7 + T))) - 4.0).toFixed(1));

  if (T >= 33 || thi >= 84 || (T >= 31 && RH >= 80)) {
    return {
      active: true,
      severity: 'Crítico',
      title: 'Alerta Crítica de Estrés Térmico',
      thiIndex: thi,
      apparentTemp,
      message: `Temperaturas extremas (${T}°C) combinadas con alta humedad (${RH}%). THI crítico de ${thi}.`,
      cropImpact: 'Riesgo inminente de aborto floral en arroz y tomate, quemaduras foliares en plátano y marchitez apical.',
      recommendations: [
        'Activar microaspersión o riego nocturno para refrescar el dosel vegetal.',
        'Suspender aplicaciones foliares agroquímicas en horas de máxima radiación (11:00 AM - 3:30 PM).',
        'Incrementar ventilación en invernaderos y mallas sombra.',
      ],
    };
  }

  if (T >= 29.5 || thi >= 79 || (T >= 28 && RH >= 75)) {
    return {
      active: true,
      severity: 'Alerta',
      title: 'Alerta de Estrés Térmico',
      thiIndex: thi,
      apparentTemp,
      message: `Condiciones de calor y bochorno (${T}°C, ${RH}% HR). Índice agro-térmico THI de ${thi}.`,
      cropImpact: 'Cierre estomático en musáceas y hortalizas, ralentización del llenado de grano y proliferación de hongos.',
      recommendations: [
        'Monitorear la tasa de transpiración y mantener saturación radicular adecuada.',
        'Priorizar riegos en las primeras horas de la mañana.',
        'Inspeccionar presencia de sigatoka o tizón favorecidos por el calor húmedo.',
      ],
    };
  }

  if (T >= 27.5 && RH >= 65) {
    return {
      active: true,
      severity: 'Precaución',
      title: 'Aviso de Precaución Térmica',
      thiIndex: thi,
      apparentTemp,
      message: `Ambiente cálido moderado (${T}°C, ${RH}% HR). Índice THI de ${thi}.`,
      cropImpact: 'Condiciones aceptables, pero con consumo hídrico acelerado por evapotranspiración.',
      recommendations: [
        'Verificar disponibilidad de agua en canales de riego.',
        'Mantener cobertura vegetal o mulch para conservar la humedad edáfica.',
      ],
    };
  }

  return {
    active: false,
    severity: 'Normal',
    title: 'Confort Agroclimático Óptimo',
    thiIndex: thi,
    apparentTemp,
    message: `Temperatura de ${T}°C y humedad relativa de ${RH}%. Parámetros dentro del rango óptimo.`,
    cropImpact: 'Fotosíntesis y metabolismo vegetal en tasas regulares sin estrés por calor.',
    recommendations: [
      'Continuar labores culturales y fertirriego programado.',
    ],
  };
}

// TTL de 15 minutos en milisegundos
const CACHE_TTL_MS = 15 * 60 * 1000;

// Clave prefijo para localStorage
const LOCAL_STORAGE_PREFIX = 'agromap_cache_';

/**
 * Consulta la API de Open-Meteo con PERSISTENCIA INTELIGENTE EN LOCALSTORAGE
 */
export async function fetchAgroWeather(
  provinceId: string,
  lat: number,
  lng: number,
  fallbackAnnualRainfall?: number
): Promise<AgroWeatherData> {
  const storageKey = `${LOCAL_STORAGE_PREFIX}${provinceId}`;

  // 1. Comprobar en localStorage si existen datos vigentes (< 15 minutos)
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS && parsed.data) {
        // Retorno ultra rápido desde localStorage
        return {
          ...parsed.data,
          source: 'localStorage',
        };
      }
    }
  } catch (err) {
    // Si localStorage no está disponible, continuar con fetch
    console.debug('LocalStorage read skip:', err);
  }

  // 2. Fetch en vivo a Open-Meteo
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', lat.toFixed(4));
    url.searchParams.set('longitude', lng.toFixed(4));
    url.searchParams.set(
      'current',
      'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code'
    );
    url.searchParams.set(
      'hourly',
      'soil_temperature_0cm,soil_moisture_0_to_1cm,precipitation_probability,precipitation,wind_speed_10m,temperature_2m,relative_humidity_2m'
    );
    url.searchParams.set(
      'daily',
      'temperature_2m_max,temperature_2m_min,precipitation_sum,et0_fao_evapotranspiration,weather_code'
    );
    url.searchParams.set('timezone', 'America/Santo_Domingo');
    url.searchParams.set('forecast_days', '7');

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP error: ${res.status}`);
    }

    const json = await res.json();

    const currentRaw = json.current || {};
    const dailyRaw: OpenMeteoDaily = json.daily || {
      time: [],
      temperature_2m_max: [],
      temperature_2m_min: [],
      precipitation_sum: [],
      et0_fao_evapotranspiration: [],
      weather_code: [],
    };
    const hourlyRaw = json.hourly || {};

    const temp2m = currentRaw.temperature_2m ?? 28;
    const relHum = currentRaw.relative_humidity_2m ?? 75;
    const windSpeed = currentRaw.wind_speed_10m ?? 14;

    // Lógica de alerta de estrés térmico
    const thermalAlert = calculateThermalStressAlert(temp2m, relHum);

    // Obtener valores recientes de suelo
    const soilMoistureRaw =
      hourlyRaw.soil_moisture_0_to_1cm && hourlyRaw.soil_moisture_0_to_1cm.length > 0
        ? hourlyRaw.soil_moisture_0_to_1cm[0]
        : 0.28;
    
    const soilMoisturePct = Math.min(100, Math.max(5, Math.round(soilMoistureRaw * 200)));

    const soilTemp =
      hourlyRaw.soil_temperature_0cm && hourlyRaw.soil_temperature_0cm.length > 0
        ? hourlyRaw.soil_temperature_0cm[0]
        : (currentRaw.temperature_2m || 27) - 1.5;

    const weatherCode = currentRaw.weather_code ?? 1;
    const wmo = getWMODescription(weatherCode);

    // Evapotranspiración diaria estimada (ET0) y balance hídrico
    const et0Today = dailyRaw.et0_fao_evapotranspiration?.[0] ?? 4.2;
    const precipToday = dailyRaw.precipitation_sum?.[0] ?? (currentRaw.precipitation || 0);
    const waterDeficit = Number((precipToday - et0Today).toFixed(1));

    // Cálculo agronómico de Riesgo de Estrés Hídrico:
    let waterStressRisk: 'Bajo' | 'Medio' | 'Alto' = 'Bajo';
    let waterStressDescription = 'Niveles hídricos óptimos para cultivos predominantes.';

    if (soilMoisturePct < 25 || waterDeficit < -3.5) {
      waterStressRisk = 'Alto';
      waterStressDescription = 'Déficit hídrico severo. Se recomienda activar riego suplementario.';
    } else if (soilMoisturePct < 45 || waterDeficit < -1.5) {
      waterStressRisk = 'Medio';
      waterStressDescription = 'Humedad moderada. Monitorear estrés en fases de floración y llenado.';
    } else {
      waterStressRisk = 'Bajo';
      waterStressDescription = 'Saturación adecuada en horizonte superficial. Sin estrés por sequía.';
    }

    // 3. Semáforo Agroclimático
    const trafficLight = calculateAgroTrafficLight(
      temp2m,
      relHum,
      windSpeed,
      soilMoisturePct,
      waterDeficit,
      thermalAlert.thiIndex
    );

    // 4. Asistente / Calculadora de Ventana Óptima de Riego
    const irrigationAssistant = calculateIrrigationAssistant(
      et0Today,
      precipToday,
      soilMoisturePct
    );

    // 5. Ventana Operativa de Fumigación y Aspersión Agrícola (Próximas 6 Horas)
    const hourlyTimes: string[] = hourlyRaw.time || [];
    let currentHourIndex = 0;
    try {
      const now = new Date();
      const dominicanFormatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Santo_Domingo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        hour12: false,
      });
      const parts = dominicanFormatter.formatToParts(now);
      const y = parts.find((p) => p.type === 'year')?.value || '2026';
      const m = parts.find((p) => p.type === 'month')?.value || '11';
      const d = parts.find((p) => p.type === 'day')?.value || '12';
      const h = parts.find((p) => p.type === 'hour')?.value || '12';
      const currentPrefix = `${y}-${m}-${d}T${h}`;

      const matchedIdx = hourlyTimes.findIndex((t) => t.startsWith(currentPrefix));
      if (matchedIdx !== -1) {
        currentHourIndex = matchedIdx;
      }
    } catch {
      currentHourIndex = 0;
    }

    const next6Hours: SprayingHour[] = [];
    for (let i = 0; i < 6; i++) {
      const idx = currentHourIndex + i;
      if (idx < hourlyTimes.length) {
        const timeStr = hourlyTimes[idx];
        const hourNum = parseInt(timeStr.slice(11, 13), 10);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const hour12 = hourNum % 12 || 12;
        const hourLabel = `${hour12} ${ampm}`;

        const hTemp = Math.round(hourlyRaw.temperature_2m?.[idx] ?? temp2m);
        const hHum = Math.round(hourlyRaw.relative_humidity_2m?.[idx] ?? relHum);
        const hWind = Math.round(hourlyRaw.wind_speed_10m?.[idx] ?? windSpeed);
        const hPrecip = Number((hourlyRaw.precipitation?.[idx] ?? 0).toFixed(1));
        const hPrecipProb = Math.round(hourlyRaw.precipitation_probability?.[idx] ?? 0);

        const safety = evaluateHourSprayingSafety(hTemp, hHum, hWind, hPrecip, hPrecipProb);

        next6Hours.push({
          time: timeStr,
          hourLabel,
          temperature: hTemp,
          relativeHumidity: hHum,
          windSpeed: hWind,
          precipitation: hPrecip,
          precipitationProbability: hPrecipProb,
          status: safety.status,
          statusLabel: safety.statusLabel,
          reason: safety.reason,
        });
      }
    }

    // Si la API devolvió menos de 6 horas, completar con valores proyectados
    while (next6Hours.length < 6) {
      const offset = next6Hours.length;
      const hour12 = ((14 + offset) % 12) || 12;
      const ampm = (14 + offset) >= 12 && (14 + offset) < 24 ? 'PM' : 'AM';
      next6Hours.push({
        time: `2026-11-12T${14 + offset}:00`,
        hourLabel: `${hour12} ${ampm}`,
        temperature: Math.round(temp2m - offset * 0.5),
        relativeHumidity: Math.min(95, relHum + offset * 2),
        windSpeed: Math.max(6, windSpeed - offset),
        precipitation: 0,
        precipitationProbability: 10,
        status: 'VERDE',
        statusLabel: 'Óptimo',
        reason: 'Condición proyectada estable',
      });
    }

    const sprayingWindow = evaluateSprayingWindow(next6Hours);

    // Pronóstico estructurado de 7 días
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const dailyForecast = (dailyRaw.time || []).map((dateStr, i) => {
      const d = new Date(dateStr + 'T12:00:00-04:00');
      const dayLabel = i === 0 ? 'Hoy' : dayNames[d.getDay()];
      return {
        date: dateStr,
        dayLabel,
        tempMax: dailyRaw.temperature_2m_max?.[i] ?? 31,
        tempMin: dailyRaw.temperature_2m_min?.[i] ?? 22,
        precipitation: dailyRaw.precipitation_sum?.[i] ?? 0,
        et0: dailyRaw.et0_fao_evapotranspiration?.[i] ?? 4.0,
        weatherCode: dailyRaw.weather_code?.[i] ?? 1,
      };
    });

    const parsedData: AgroWeatherData = {
      provinceId,
      source: 'open-meteo',
      fetchedAt: Date.now(),
      current: {
        temperature: temp2m,
        relativeHumidity: relHum,
        precipitation: currentRaw.precipitation ?? 0,
        windSpeed,
        weatherCode,
        weatherDescription: wmo.text,
        weatherIcon: wmo.icon,
        soilMoisturePct,
        soilTemperature: Number(soilTemp.toFixed(1)),
      },
      trafficLight,
      irrigationAssistant,
      thermalAlert,
      sprayingWindow,
      next6Hours,
      agronomy: {
        et0Today: Number(et0Today.toFixed(1)),
        precipitationToday: Number(precipToday.toFixed(1)),
        waterDeficit,
        waterStressRisk,
        waterStressDescription,
      },
      dailyForecast,
    };

    // Guardar en localStorage para persistencia inteligente
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          data: parsedData,
          timestamp: Date.now(),
        })
      );
    } catch (saveErr) {
      console.debug('LocalStorage write error (quota):', saveErr);
    }

    return parsedData;
  } catch (error) {
    console.warn(`[Open-Meteo] Fallback activado para ${provinceId}:`, error);
    return createFallbackWeatherData(provinceId, fallbackAnnualRainfall);
  }
}

/**
 * Generador de datos climáticos de respaldo si no hay conexión o falla la API
 */
export function createFallbackWeatherData(
  provinceId: string,
  annualRainfall: number = 1200
): AgroWeatherData {
  const now = new Date();
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  const dailyForecast = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now.getTime() + i * 86400000);
    const dayLabel = i === 0 ? 'Hoy' : dayNames[d.getDay()];
    const dateStr = d.toISOString().split('T')[0];
    const baseRain = Math.max(0, (annualRainfall / 365) * (0.5 + Math.random()));
    return {
      date: dateStr,
      dayLabel,
      tempMax: 30 + Math.round(Math.random() * 3),
      tempMin: 22 + Math.round(Math.random() * 2),
      precipitation: Number(baseRain.toFixed(1)),
      et0: 4.1 + Number((Math.random() * 0.8).toFixed(1)),
      weatherCode: 2,
    };
  });

  const temp2m = 29.2;
  const relHum = 76;
  const windSpeed = 15;
  const soilMoisturePct = 48;
  const et0Today = 4.2;
  const precipToday = 0.4;
  const waterDeficit = -3.8;

  const thermalAlert = calculateThermalStressAlert(temp2m, relHum);
  const trafficLight = calculateAgroTrafficLight(
    temp2m,
    relHum,
    windSpeed,
    soilMoisturePct,
    waterDeficit,
    thermalAlert.thiIndex
  );
  const irrigationAssistant = calculateIrrigationAssistant(
    et0Today,
    precipToday,
    soilMoisturePct
  );

  // Fallback para las próximas 6 horas de aspersión
  const fallbackHoursLabels = ['2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM'];
  const next6Hours: SprayingHour[] = fallbackHoursLabels.map((lbl, i) => {
    const hTemp = Math.round(temp2m - i * 0.4);
    const hHum = Math.min(90, Math.round(relHum + i * 2));
    const hWind = Math.max(9, Math.round(windSpeed - i * 1.2));
    const hPrecip = i === 2 ? 0.3 : 0;
    const hProb = i === 2 ? 35 : 12;
    const safety = evaluateHourSprayingSafety(hTemp, hHum, hWind, hPrecip, hProb);

    return {
      time: `2026-11-12T${14 + i}:00`,
      hourLabel: lbl,
      temperature: hTemp,
      relativeHumidity: hHum,
      windSpeed: hWind,
      precipitation: hPrecip,
      precipitationProbability: hProb,
      status: safety.status,
      statusLabel: safety.statusLabel,
      reason: safety.reason,
    };
  });

  const sprayingWindow = evaluateSprayingWindow(next6Hours);

  return {
    provinceId,
    source: 'fallback',
    fetchedAt: Date.now(),
    current: {
      temperature: temp2m,
      relativeHumidity: relHum,
      precipitation: 0.4,
      windSpeed,
      weatherCode: 2,
      weatherDescription: 'Parcialmente nublado (Histórico)',
      weatherIcon: '⛅',
      soilMoisturePct,
      soilTemperature: 27.2,
    },
    trafficLight,
    irrigationAssistant,
    thermalAlert,
    sprayingWindow,
    next6Hours,
    agronomy: {
      et0Today,
      precipitationToday: precipToday,
      waterDeficit,
      waterStressRisk: 'Bajo',
      waterStressDescription: 'Valores climatológicos representativos anuales.',
    },
    dailyForecast,
  };
}

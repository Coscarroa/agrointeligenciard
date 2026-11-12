/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BASE DE DATOS AGRONÓMICA Y CLIMATOLÓGICA HISTÓRICA POR PROVINCIA (REPÚBLICA DOMINICANA)
 * Cultivos predominantes reales según el Ministerio de Agricultura (MIDA) y Banco Central de la RD.
 * Calendario agroecológico de siembra y cosecha adaptado a los valles y zonas agroclimáticas.
 * Climatología histórica mensual (12 meses): temperatura media (°C) y precipitación media mensual (mm).
 */

export interface CropInfo {
  name: string;
  category: 'Cereales' | 'Musáceas' | 'Frutales' | 'Hortalizas' | 'Leguminosas' | 'Agroindustria' | 'Tubérculos';
  cycleMonths: number;
  economicImpact: string;
  waterNeed: 'Baja' | 'Media' | 'Alta';
  annualProductionTon?: number; // Producción anual estimada en toneladas
}

export interface PlantingCalendar {
  crop: string;
  plantingMonths: string[]; // ej. ['Abr', 'May', 'Jun']
  harvestMonths: string[];  // ej. ['Ago', 'Sep', 'Oct']
  optimalRegime: string;
}

export interface MonthlyClimatology {
  month: string;
  temp: number; // °C promedio histórico
  rainfall: number; // mm precipitación media
}

export interface AgricultureData {
  predominantCrops: CropInfo[];
  plantingCalendar: PlantingCalendar[];
  historicalClimatology: MonthlyClimatology[];
  annualRainfallAvg: number; // mm al año
  soilType: string;
  irrigationInfrastructure: string;
}

export const PROVINCIAL_AGRICULTURE: Record<string, AgricultureData> = {
  "azua": {
    annualRainfallAvg: 680,
    soilType: "Aluvial y franco-arcilloso en el Valle de Azua, calcáreo en zonas semiáridas",
    irrigationInfrastructure: "Canal Ysura y canales derivados del Río Yaque del Sur",
    predominantCrops: [
      { name: "Tomate Industrial", category: "Hortalizas", cycleMonths: 4, economicImpact: "Primer productor nacional de pasta y derivados", waterNeed: "Media",
        annualProductionTon: 85000 },
      { name: "Plátano y Banano", category: "Musáceas", cycleMonths: 10, economicImpact: "Alta exportación y consumo metropolitano", waterNeed: "Alta",
        annualProductionTon: 140000 },
      { name: "Cebolla", category: "Hortalizas", cycleMonths: 4, economicImpact: "Polos hortícolas de Palmar de Ocoa y Sabana Yegua", waterNeed: "Media",
        annualProductionTon: 28000 },
      { name: "Mango de Exportación", category: "Frutales", cycleMonths: 12, economicImpact: "Variedades Keitt, Kent y Mingolo", waterNeed: "Baja",
        annualProductionTon: 32000 }
    ],
    plantingCalendar: [
      { crop: "Tomate Industrial", plantingMonths: ["Sep", "Oct", "Nov"], harvestMonths: ["Ene", "Feb", "Mar"], optimalRegime: "Ciclo de invierno bajo riego por goteo" },
      { crop: "Cebolla", plantingMonths: ["Oct", "Nov"], harvestMonths: ["Feb", "Mar", "Abr"], optimalRegime: "Riego controlado en temporada fresca" },
      { crop: "Plátano", plantingMonths: ["May", "Jun", "Jul"], harvestMonths: ["Mar", "Abr", "May"], optimalRegime: "Siembra sincronizada con agua del canal Ysura" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 25.1, rainfall: 18 },
      { month: "Feb", temp: 25.4, rainfall: 16 },
      { month: "Mar", temp: 26.2, rainfall: 22 },
      { month: "Abr", temp: 27.0, rainfall: 42 },
      { month: "May", temp: 27.8, rainfall: 95 },
      { month: "Jun", temp: 28.5, rainfall: 62 },
      { month: "Jul", temp: 28.9, rainfall: 50 },
      { month: "Ago", temp: 28.8, rainfall: 82 },
      { month: "Sep", temp: 28.3, rainfall: 115 },
      { month: "Oct", temp: 27.6, rainfall: 105 },
      { month: "Nov", temp: 26.7, rainfall: 48 },
      { month: "Dic", temp: 25.5, rainfall: 25 }
    ]
  },
  "baoruco": {
    annualRainfallAvg: 720,
    soilType: "Franco-arenoso y franco-arcilloso en la Hoya de Enriquillo",
    irrigationInfrastructure: "Sistemas de canales del Río Yaque del Sur y pozos profundos",
    predominantCrops: [
      { name: "Plátano de Neiba", category: "Musáceas", cycleMonths: 10, economicImpact: "Famoso por su calidad y tamaño en el mercado nacional", waterNeed: "Alta",
        annualProductionTon: 72000 },
      { name: "Uva de Mesa y Vinícola", category: "Frutales", cycleMonths: 6, economicImpact: "Capital de la Uva en la República Dominicana", waterNeed: "Baja",
        annualProductionTon: 3800 },
      { name: "Café de Altura", category: "Agroindustria", cycleMonths: 12, economicImpact: "Vertiente sur de la Sierra de Neiba", waterNeed: "Media",
        annualProductionTon: 4200 }
    ],
    plantingCalendar: [
      { crop: "Uva (Poda y Brotación)", plantingMonths: ["Ene", "Feb"], harvestMonths: ["Jul", "Ago"], optimalRegime: "Doble ciclo anual de vendimia" },
      { crop: "Plátano", plantingMonths: ["Abr", "May"], harvestMonths: ["Feb", "Mar"], optimalRegime: "Riego por inundación y gravedad en valles" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 25.4, rainfall: 15 },
      { month: "Feb", temp: 25.9, rainfall: 18 },
      { month: "Mar", temp: 26.8, rainfall: 30 },
      { month: "Abr", temp: 27.5, rainfall: 55 },
      { month: "May", temp: 28.1, rainfall: 110 },
      { month: "Jun", temp: 28.6, rainfall: 70 },
      { month: "Jul", temp: 29.1, rainfall: 55 },
      { month: "Ago", temp: 29.0, rainfall: 85 },
      { month: "Sep", temp: 28.5, rainfall: 120 },
      { month: "Oct", temp: 27.8, rainfall: 98 },
      { month: "Nov", temp: 26.9, rainfall: 42 },
      { month: "Dic", temp: 25.8, rainfall: 22 }
    ]
  },
  "barahona": {
    annualRainfallAvg: 850,
    soilType: "Aluvial deltaico en el bajo Yaque y arcillo-calcáreo en la sierra",
    irrigationInfrastructure: "Canales del Río Yaque del Sur y Presa de Monte Grande",
    predominantCrops: [
      { name: "Café Especial Barahona", category: "Agroindustria", cycleMonths: 12, economicImpact: "Reconocido internacionalmente por su acidez fina", waterNeed: "Media",
        annualProductionTon: 5100 },
      { name: "Plátano Barahonero", category: "Musáceas", cycleMonths: 10, economicImpact: "Pilar de la economía de Vicente Noble y Tamayo", waterNeed: "Alta",
        annualProductionTon: 98000 },
      { name: "Caña de Azúcar", category: "Agroindustria", cycleMonths: 12, economicImpact: "Abastece al Ingenio Barahona", waterNeed: "Alta",
        annualProductionTon: 450000 }
    ],
    plantingCalendar: [
      { crop: "Café", plantingMonths: ["May", "Jun"], harvestMonths: ["Nov", "Dic", "Ene"], optimalRegime: "Microclima de montaña de la Sierra de Bahoruco" },
      { crop: "Plátano", plantingMonths: ["May", "Jun"], harvestMonths: ["Mar", "Abr"], optimalRegime: "Riego del Valle del Yaque del Sur" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 25.8, rainfall: 25 },
      { month: "Feb", temp: 26.0, rainfall: 22 },
      { month: "Mar", temp: 26.6, rainfall: 35 },
      { month: "Abr", temp: 27.2, rainfall: 68 },
      { month: "May", temp: 27.9, rainfall: 128 },
      { month: "Jun", temp: 28.6, rainfall: 80 },
      { month: "Jul", temp: 29.0, rainfall: 65 },
      { month: "Ago", temp: 29.1, rainfall: 98 },
      { month: "Sep", temp: 28.7, rainfall: 140 },
      { month: "Oct", temp: 28.0, rainfall: 120 },
      { month: "Nov", temp: 27.1, rainfall: 48 },
      { month: "Dic", temp: 26.2, rainfall: 21 }
    ]
  },
  "dajabon": {
    annualRainfallAvg: 1100,
    soilType: "Franco-arcilloso en cuenca baja y pedregoso en laderas",
    irrigationInfrastructure: "Canal La Vigía y Río Dajabón / Masacre",
    predominantCrops: [
      { name: "Arroz", category: "Cereales", cycleMonths: 5, economicImpact: "Abastece mercado fronterizo y nacional", waterNeed: "Alta",
        annualProductionTon: 62000 },
      { name: "Ganadería Bovina y Láctea", category: "Agroindustria", cycleMonths: 12, economicImpact: "Cuenca lechera del noroeste", waterNeed: "Media",
        annualProductionTon: 18000 },
      { name: "Maní y Guandul", category: "Leguminosas", cycleMonths: 4, economicImpact: "Cultivos tradicionales de llanura", waterNeed: "Baja",
        annualProductionTon: 8500 }
    ],
    plantingCalendar: [
      { crop: "Arroz (Primavera)", plantingMonths: ["Dic", "Ene"], harvestMonths: ["May", "Jun"], optimalRegime: "Riego regulado en llanura aluvial" },
      { crop: "Guandul", plantingMonths: ["May", "Jun"], harvestMonths: ["Dic", "Ene"], optimalRegime: "Aprovecha régimen pluvial de primavera" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 24.2, rainfall: 32 },
      { month: "Feb", temp: 24.8, rainfall: 36 },
      { month: "Mar", temp: 25.8, rainfall: 50 },
      { month: "Abr", temp: 26.7, rainfall: 92 },
      { month: "May", temp: 27.4, rainfall: 175 },
      { month: "Jun", temp: 28.1, rainfall: 120 },
      { month: "Jul", temp: 28.4, rainfall: 95 },
      { month: "Ago", temp: 28.3, rainfall: 135 },
      { month: "Sep", temp: 27.9, rainfall: 165 },
      { month: "Oct", temp: 27.2, rainfall: 130 },
      { month: "Nov", temp: 25.9, rainfall: 55 },
      { month: "Dic", temp: 24.6, rainfall: 35 }
    ]
  },
  "distrito-nacional": {
    annualRainfallAvg: 1450,
    soilType: "Urbano sobre caliza arrecifal cárstica y sedimentos aluviales",
    irrigationInfrastructure: "Sistemas urbanos e hidropónicos de agricultura vertical",
    predominantCrops: [
      { name: "Horticultura Urbana e Hidroponía", category: "Hortalizas", cycleMonths: 2, economicImpact: "Lechugas gourmet, hierbas aromáticas y microgreens", waterNeed: "Media",
        annualProductionTon: 1200 },
      { name: "Viveros Ornamentales", category: "Frutales", cycleMonths: 12, economicImpact: "Comercialización para paisajismo e inmobiliario", waterNeed: "Media",
        annualProductionTon: 800 }
    ],
    plantingCalendar: [
      { crop: "Hortalizas Hidropónicas", plantingMonths: ["Todo el año"], harvestMonths: ["Continuo"], optimalRegime: "Control de clima bajo malla sombra" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 25.3, rainfall: 62 },
      { month: "Feb", temp: 25.5, rainfall: 55 },
      { month: "Mar", temp: 26.1, rainfall: 52 },
      { month: "Abr", temp: 26.8, rainfall: 72 },
      { month: "May", temp: 27.5, rainfall: 175 },
      { month: "Jun", temp: 28.1, rainfall: 142 },
      { month: "Jul", temp: 28.3, rainfall: 148 },
      { month: "Ago", temp: 28.4, rainfall: 178 },
      { month: "Sep", temp: 28.2, rainfall: 182 },
      { month: "Oct", temp: 27.7, rainfall: 180 },
      { month: "Nov", temp: 26.9, rainfall: 110 },
      { month: "Dic", temp: 25.8, rainfall: 74 }
    ]
  },
  "duarte": {
    annualRainfallAvg: 1680,
    soilType: "Vertisoles y suelos aluviales profundos ultra-fértiles del Valle del Cibao Oriental",
    irrigationInfrastructure: "Canal Aglipo I y II, Río Yuna y Río Camú",
    predominantCrops: [
      { name: "Cacao Orgánico Fino de Aroma", category: "Agroindustria", cycleMonths: 12, economicImpact: "San Francisco de Macorís es la Capital Mundial del Cacao Orgánico", waterNeed: "Alta",
        annualProductionTon: 28500 },
      { name: "Arroz Bajo Riego", category: "Cereales", cycleMonths: 5, economicImpact: "Mayor superficie arrocera del país en el Bajo Yuna", waterNeed: "Alta",
        annualProductionTon: 185000 },
      { name: "Plátano y Guineo", category: "Musáceas", cycleMonths: 10, economicImpact: "Consumo masivo interno y procesamiento agroindustrial", waterNeed: "Alta",
        annualProductionTon: 120000 }
    ],
    plantingCalendar: [
      { crop: "Cacao (Cosecha Principal)", plantingMonths: ["Abr", "May"], harvestMonths: ["Oct", "Nov", "Dic", "Ene"], optimalRegime: "Bajo sombra agroforestal regulada" },
      { crop: "Arroz (Primavera)", plantingMonths: ["Dic", "Ene"], harvestMonths: ["May", "Jun"], optimalRegime: "Riego de inundación constante con agua del Yuna" },
      { crop: "Arroz (Verano)", plantingMonths: ["Jun", "Jul"], harvestMonths: ["Oct", "Nov"], optimalRegime: "Segundo ciclo anual de alta productividad" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 24.2, rainfall: 88 },
      { month: "Feb", temp: 24.6, rainfall: 72 },
      { month: "Mar", temp: 25.4, rainfall: 78 },
      { month: "Abr", temp: 26.3, rainfall: 135 },
      { month: "May", temp: 27.1, rainfall: 220 },
      { month: "Jun", temp: 27.8, rainfall: 155 },
      { month: "Jul", temp: 28.0, rainfall: 160 },
      { month: "Ago", temp: 28.2, rainfall: 185 },
      { month: "Sep", temp: 28.0, rainfall: 172 },
      { month: "Oct", temp: 27.3, rainfall: 168 },
      { month: "Nov", temp: 25.9, rainfall: 135 },
      { month: "Dic", temp: 24.7, rainfall: 112 }
    ]
  },
  "el-seibo": {
    annualRainfallAvg: 1550,
    soilType: "Oxísoles y suelos arcillosos en lomerío de la Cordillera Oriental",
    irrigationInfrastructure: "Cuencas de los ríos Soco, Chavón y Nisibón",
    predominantCrops: [
      { name: "Cacao Sánchez y Cacao Fino", category: "Agroindustria", cycleMonths: 12, economicImpact: "Tradición cacaotera del Este", waterNeed: "Alta",
        annualProductionTon: 12500 },
      { name: "Ganadería Bovina (Carne y Leche)", category: "Agroindustria", cycleMonths: 12, economicImpact: "Pastizales de guinea y estrella", waterNeed: "Media" },
      { name: "Cítricos y Naranja", category: "Frutales", cycleMonths: 12, economicImpact: "Plantaciones agroindustriales", waterNeed: "Media",
        annualProductionTon: 48000 }
    ],
    plantingCalendar: [
      { crop: "Cacao", plantingMonths: ["May", "Jun"], harvestMonths: ["Nov", "Dic", "Ene"], optimalRegime: "Sistemas agroforestales con sombra de guama" },
      { crop: "Cítricos", plantingMonths: ["May", "Jun"], harvestMonths: ["Dic", "Ene", "Feb"], optimalRegime: "Lluvias bimodales de la Cordillera Oriental" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 24.6, rainfall: 65 },
      { month: "Feb", temp: 24.9, rainfall: 52 },
      { month: "Mar", temp: 25.6, rainfall: 60 },
      { month: "Abr", temp: 26.4, rainfall: 98 },
      { month: "May", temp: 27.2, rainfall: 210 },
      { month: "Jun", temp: 27.8, rainfall: 162 },
      { month: "Jul", temp: 28.0, rainfall: 170 },
      { month: "Ago", temp: 28.2, rainfall: 195 },
      { month: "Sep", temp: 28.0, rainfall: 190 },
      { month: "Oct", temp: 27.4, rainfall: 172 },
      { month: "Nov", temp: 26.2, rainfall: 115 },
      { month: "Dic", temp: 25.1, rainfall: 82 }
    ]
  },
  "elias-pina": {
    annualRainfallAvg: 1150,
    soilType: "Calcáreo y litosoles de montaña en la Cordillera Central y Sierra de Neiba",
    irrigationInfrastructure: "Ríos Artibonito y Macasías, canales locales",
    predominantCrops: [
      { name: "Habichuelas Negras y Rojas", category: "Leguminosas", cycleMonths: 3, economicImpact: "Granero fronterizo para mercado bi-nacional", waterNeed: "Media",
        annualProductionTon: 14000 },
      { name: "Café Orgánico de Montaña", category: "Agroindustria", cycleMonths: 12, economicImpact: "Comendador, Hondo Valle y Bánica", waterNeed: "Media",
        annualProductionTon: 3800 },
      { name: "Aguacate de Altura", category: "Frutales", cycleMonths: 12, economicImpact: "Variedades Hass y Semil", waterNeed: "Media",
        annualProductionTon: 16500 }
    ],
    plantingCalendar: [
      { crop: "Habichuela", plantingMonths: ["Nov", "Dic"], harvestMonths: ["Feb", "Mar"], optimalRegime: "Siembra de otoño-invierno en el Valle de San Juan-Macasías" },
      { crop: "Café", plantingMonths: ["May", "Jun"], harvestMonths: ["Oct", "Nov", "Dic"], optimalRegime: "Laderas con sombra y niebla en Hondo Valle" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 23.5, rainfall: 25 },
      { month: "Feb", temp: 24.0, rainfall: 30 },
      { month: "Mar", temp: 25.0, rainfall: 48 },
      { month: "Abr", temp: 26.0, rainfall: 95 },
      { month: "May", temp: 26.8, rainfall: 185 },
      { month: "Jun", temp: 27.3, rainfall: 135 },
      { month: "Jul", temp: 27.6, rainfall: 110 },
      { month: "Ago", temp: 27.5, rainfall: 155 },
      { month: "Sep", temp: 27.1, rainfall: 175 },
      { month: "Oct", temp: 26.4, rainfall: 140 },
      { month: "Nov", temp: 25.1, rainfall: 58 },
      { month: "Dic", temp: 23.9, rainfall: 28 }
    ]
  },
  "espaillat": {
    annualRainfallAvg: 1420,
    soilType: "Mollisoles fértiles de alta retención en Moca y laderas de la Cordillera Septentrional",
    irrigationInfrastructure: "Afluentes del Río Camú y pozos de infiltración",
    predominantCrops: [
      { name: "Plátano Mocano", category: "Musáceas", cycleMonths: 10, economicImpact: "Referencia nacional en sabor y rendimiento por hectárea", waterNeed: "Alta",
        annualProductionTon: 115000 },
      { name: "Yuca Mocana", category: "Tubérculos", cycleMonths: 8, economicImpact: "Casabe tradicional y consumo fresco", waterNeed: "Media",
        annualProductionTon: 58000 },
      { name: "Avicultura y Porcicultura", category: "Agroindustria", cycleMonths: 12, economicImpact: "Produce más del 50% de los huevos y pollos del país", waterNeed: "Media",
        annualProductionTon: 65000 },
      { name: "Café de Jamao", category: "Agroindustria", cycleMonths: 12, economicImpact: "Café de sombra en Jamao al Norte", waterNeed: "Media",
        annualProductionTon: 2900 }
    ],
    plantingCalendar: [
      { crop: "Plátano", plantingMonths: ["Abr", "May"], harvestMonths: ["Feb", "Mar"], optimalRegime: "Suelos profundos con lluvia regular" },
      { crop: "Yuca", plantingMonths: ["Abr", "May", "Jun"], harvestMonths: ["Dic", "Ene", "Feb"], optimalRegime: "Secano tecnificado" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 23.8, rainfall: 78 },
      { month: "Feb", temp: 24.2, rainfall: 65 },
      { month: "Mar", temp: 25.1, rainfall: 68 },
      { month: "Abr", temp: 26.0, rainfall: 115 },
      { month: "May", temp: 26.9, rainfall: 195 },
      { month: "Jun", temp: 27.6, rainfall: 125 },
      { month: "Jul", temp: 27.9, rainfall: 130 },
      { month: "Ago", temp: 28.0, rainfall: 152 },
      { month: "Sep", temp: 27.8, rainfall: 145 },
      { month: "Oct", temp: 27.0, rainfall: 140 },
      { month: "Nov", temp: 25.6, rainfall: 120 },
      { month: "Dic", temp: 24.3, rainfall: 95 }
    ]
  },
  "hato-mayor": {
    annualRainfallAvg: 1520,
    soilType: "Suelos franco-arcillosos con drenaje medio en el Llano Costero del Este",
    irrigationInfrastructure: "Ríos Maguá, Higuamo y Casuí",
    predominantCrops: [
      { name: "Cítricos (Naranja Valencia)", category: "Frutales", cycleMonths: 12, economicImpact: "Mayor procesadora de jugos naturales del país", waterNeed: "Media" },
      { name: "Cacao Orgánico", category: "Agroindustria", cycleMonths: 12, economicImpact: "Zona de Sabana de la Mar y El Valle", waterNeed: "Alta",
        annualProductionTon: 16800 },
      { name: "Ganadería Lechera", category: "Agroindustria", cycleMonths: 12, economicImpact: "Fabricación de queso artesanal y pasteurizado", waterNeed: "Media",
        annualProductionTon: 42000 }
    ],
    plantingCalendar: [
      { crop: "Cítricos", plantingMonths: ["May", "Jun"], harvestMonths: ["Nov", "Dic", "Ene", "Feb"], optimalRegime: "Aprovecha régimen de lluvias orientales" },
      { crop: "Cacao", plantingMonths: ["May", "Jun"], harvestMonths: ["Oct", "Nov", "Dic"], optimalRegime: "Sombra densa en zona de amortiguamiento Los Haitises" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 24.8, rainfall: 62 },
      { month: "Feb", temp: 25.1, rainfall: 50 },
      { month: "Mar", temp: 25.8, rainfall: 58 },
      { month: "Abr", temp: 26.6, rainfall: 95 },
      { month: "May", temp: 27.4, rainfall: 205 },
      { month: "Jun", temp: 28.0, rainfall: 155 },
      { month: "Jul", temp: 28.2, rainfall: 165 },
      { month: "Ago", temp: 28.3, rainfall: 188 },
      { month: "Sep", temp: 28.1, rainfall: 182 },
      { month: "Oct", temp: 27.5, rainfall: 165 },
      { month: "Nov", temp: 26.4, rainfall: 108 },
      { month: "Dic", temp: 25.3, rainfall: 78 }
    ]
  },
  "hermanas-mirabal": {
    annualRainfallAvg: 1490,
    soilType: "Vertisoles y Mollisoles ultra-fértiles de Salcedo y Villa Tapia",
    irrigationInfrastructure: "Ríos Cenoví y Jamao, canales secundarios",
    predominantCrops: [
      { name: "Plátano y Guineo Rulo", category: "Musáceas", cycleMonths: 10, economicImpact: "Alta densidad de plantación por hectárea", waterNeed: "Alta",
        annualProductionTon: 88000 },
      { name: "Cacao Fino", category: "Agroindustria", cycleMonths: 12, economicImpact: "Integrado en fincas diversificadas", waterNeed: "Alta",
        annualProductionTon: 9800 },
      { name: "Yuca y Batata", category: "Tubérculos", cycleMonths: 8, economicImpact: "Abastecimiento a mercados mayoristas", waterNeed: "Media",
        annualProductionTon: 45000 }
    ],
    plantingCalendar: [
      { crop: "Plátano", plantingMonths: ["Abr", "May"], harvestMonths: ["Feb", "Mar"], optimalRegime: "Régimen pluvial óptimo del Cibao Central" },
      { crop: "Cacao", plantingMonths: ["May", "Jun"], harvestMonths: ["Nov", "Dic", "Ene"], optimalRegime: "Sombra de leguminosas" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 24.0, rainfall: 80 },
      { month: "Feb", temp: 24.4, rainfall: 68 },
      { month: "Mar", temp: 25.2, rainfall: 72 },
      { month: "Abr", temp: 26.1, rainfall: 125 },
      { month: "May", temp: 27.0, rainfall: 205 },
      { month: "Jun", temp: 27.7, rainfall: 140 },
      { month: "Jul", temp: 27.9, rainfall: 145 },
      { month: "Ago", temp: 28.1, rainfall: 168 },
      { month: "Sep", temp: 27.9, rainfall: 158 },
      { month: "Oct", temp: 27.2, rainfall: 152 },
      { month: "Nov", temp: 25.8, rainfall: 128 },
      { month: "Dic", temp: 24.5, rainfall: 102 }
    ]
  },
  "independencia": {
    annualRainfallAvg: 610,
    soilType: "Aluvial salino cerca del Lago Enriquillo y calcáreo en sierras",
    irrigationInfrastructure: "Ríos Las Damas y Guaniamo, canales en Jimaní y Duvergé",
    predominantCrops: [
      { name: "Cebolla Amarilla y Roja", category: "Hortalizas", cycleMonths: 4, economicImpact: "Polo productor de Duvergé y Las Baitoas", waterNeed: "Media",
        annualProductionTon: 19500 },
      { name: "Uva y Melón", category: "Frutales", cycleMonths: 5, economicImpact: "Valle seco de alta radiación solar", waterNeed: "Baja",
        annualProductionTon: 6500 },
      { name: "Plátano Bajo Riego", category: "Musáceas", cycleMonths: 10, economicImpact: "Alimentación local y comercio fronterizo", waterNeed: "Alta",
        annualProductionTon: 42000 }
    ],
    plantingCalendar: [
      { crop: "Cebolla", plantingMonths: ["Oct", "Nov"], harvestMonths: ["Feb", "Mar"], optimalRegime: "Riego por goteo en clima seco y fresco" },
      { crop: "Melón y Sandía", plantingMonths: ["Dic", "Ene"], harvestMonths: ["Mar", "Abr"], optimalRegime: "Aprovecha alta luminosidad invernal" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 25.2, rainfall: 12 },
      { month: "Feb", temp: 25.6, rainfall: 15 },
      { month: "Mar", temp: 26.5, rainfall: 25 },
      { month: "Abr", temp: 27.3, rainfall: 48 },
      { month: "May", temp: 28.0, rainfall: 95 },
      { month: "Jun", temp: 28.5, rainfall: 60 },
      { month: "Jul", temp: 29.0, rainfall: 45 },
      { month: "Ago", temp: 28.9, rainfall: 75 },
      { month: "Sep", temp: 28.4, rainfall: 110 },
      { month: "Oct", temp: 27.7, rainfall: 88 },
      { month: "Nov", temp: 26.7, rainfall: 35 },
      { month: "Dic", temp: 25.6, rainfall: 18 }
    ]
  },
  "la-altagracia": {
    annualRainfallAvg: 1320,
    soilType: "Calcáreo sobre plataforma cárstica (roca coralina) y suelos rojizos ferralíticos",
    irrigationInfrastructure: "Pozos profundos en acuíferos cársticos y Río Duey / Maimón",
    predominantCrops: [
      { name: "Caña de Azúcar", category: "Agroindustria", cycleMonths: 12, economicImpact: "Llanuras de Higüey abastecedoras de centrales", waterNeed: "Alta",
        annualProductionTon: 450000 },
      { name: "Ganadería Lechera y Cárnica", category: "Agroindustria", cycleMonths: 12, economicImpact: "Queso de hoja y carne para el sector turístico de Punta Cana", waterNeed: "Media",
        annualProductionTon: 48000 },
      { name: "Cacao y Plátano", category: "Agroindustria", cycleMonths: 12, economicImpact: "Nisibón y laderas norteñas", waterNeed: "Alta",
        annualProductionTon: 36000 }
    ],
    plantingCalendar: [
      { crop: "Caña (Zafra)", plantingMonths: ["May", "Jun"], harvestMonths: ["Ene", "Feb", "Mar", "Abr"], optimalRegime: "Zafra mecanizada en período seco" },
      { crop: "Pastos Mejorados", plantingMonths: ["May", "Jun"], harvestMonths: ["Rotación continua"], optimalRegime: "Sincronizado con lluvias de mayo" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 25.2, rainfall: 52 },
      { month: "Feb", temp: 25.4, rainfall: 44 },
      { month: "Mar", temp: 26.0, rainfall: 48 },
      { month: "Abr", temp: 26.7, rainfall: 80 },
      { month: "May", temp: 27.5, rainfall: 180 },
      { month: "Jun", temp: 28.1, rainfall: 135 },
      { month: "Jul", temp: 28.3, rainfall: 142 },
      { month: "Ago", temp: 28.5, rainfall: 168 },
      { month: "Sep", temp: 28.3, rainfall: 172 },
      { month: "Oct", temp: 27.8, rainfall: 155 },
      { month: "Nov", temp: 26.8, rainfall: 102 },
      { month: "Dic", temp: 25.7, rainfall: 68 }
    ]
  },
  "la-romana": {
    annualRainfallAvg: 1180,
    soilType: "Suelos arcillo-limosos profundos sobre roca caliza",
    irrigationInfrastructure: "Sistema integral de riego por aspersión y goteo de Central Romana (Ríos Dulce y Chavón)",
    predominantCrops: [
      { name: "Caña de Azúcar Tecnificada", category: "Agroindustria", cycleMonths: 12, economicImpact: "Sede del Central Romana, mayor ingenio azucarero del país", waterNeed: "Alta",
        annualProductionTon: 1650000 },
      { name: "Ganadería Bovina Cebuina", category: "Agroindustria", cycleMonths: 12, economicImpact: "Genética de alta calidad adaptada al trópico", waterNeed: "Media",
        annualProductionTon: 25000 },
      { name: "Hortalizas de Invernadero", category: "Hortalizas", cycleMonths: 4, economicImpact: "Abastecimiento a resorts hoteleros", waterNeed: "Media",
        annualProductionTon: 15000 }
    ],
    plantingCalendar: [
      { crop: "Caña de Azúcar", plantingMonths: ["May", "Jun"], harvestMonths: ["Ene", "Feb", "Mar", "Abr", "May"], optimalRegime: "Corte y alce mecanizado durante la zafra seca" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 25.5, rainfall: 40 },
      { month: "Feb", temp: 25.7, rainfall: 35 },
      { month: "Mar", temp: 26.3, rainfall: 38 },
      { month: "Abr", temp: 27.0, rainfall: 65 },
      { month: "May", temp: 27.8, rainfall: 155 },
      { month: "Jun", temp: 28.4, rainfall: 120 },
      { month: "Jul", temp: 28.6, rainfall: 128 },
      { month: "Ago", temp: 28.7, rainfall: 150 },
      { month: "Sep", temp: 28.4, rainfall: 162 },
      { month: "Oct", temp: 27.9, rainfall: 145 },
      { month: "Nov", temp: 27.0, rainfall: 92 },
      { month: "Dic", temp: 26.0, rainfall: 52 }
    ]
  },
  "la-vega": {
    annualRainfallAvg: 1580,
    soilType: "Suelos aluviales ricos en materia orgánica en el valle; andisoles volcánicos en Constanza/Jarabacoa",
    irrigationInfrastructure: "Canales del Río Camú y Río Yaque del Norte, Presa de Tavera",
    predominantCrops: [
      { name: "Arroz Bajo Riego", category: "Cereales", cycleMonths: 5, economicImpact: "Polo arrocero líder en el Valle de La Vega Real", waterNeed: "Alta",
        annualProductionTon: 185000 },
      { name: "Hortalizas de Clima Frío (Constanza)", category: "Hortalizas", cycleMonths: 3, economicImpact: "Papa, zanahoria, ajo, lechuga y brócoli (80% del consumo nacional)", waterNeed: "Media" },
      { name: "Plátano y Yuca", category: "Musáceas", cycleMonths: 10, economicImpact: "Grandes extensiones mecanizadas", waterNeed: "Alta",
        annualProductionTon: 135000 },
      { name: "Flores y Fresas de Altura", category: "Frutales", cycleMonths: 12, economicImpact: "Valles intramontanos de Constanza y Jarabacoa", waterNeed: "Media",
        annualProductionTon: 4200 }
    ],
    plantingCalendar: [
      { crop: "Papa y Ajo (Constanza)", plantingMonths: ["Oct", "Nov", "Dic"], harvestMonths: ["Feb", "Mar", "Abr"], optimalRegime: "Valle intramontano a 1,200 msnm con heladas leves" },
      { crop: "Arroz (Primavera)", plantingMonths: ["Dic", "Ene"], harvestMonths: ["May", "Jun"], optimalRegime: "Riego por inundación en el valle central" },
      { crop: "Arroz (Verano)", plantingMonths: ["Jun", "Jul"], harvestMonths: ["Oct", "Nov"], optimalRegime: "Ciclo de verano con altos rendimientos" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 22.8, rainfall: 82 },
      { month: "Feb", temp: 23.3, rainfall: 68 },
      { month: "Mar", temp: 24.2, rainfall: 75 },
      { month: "Abr", temp: 25.1, rainfall: 130 },
      { month: "May", temp: 26.0, rainfall: 225 },
      { month: "Jun", temp: 26.8, rainfall: 150 },
      { month: "Jul", temp: 27.1, rainfall: 155 },
      { month: "Ago", temp: 27.2, rainfall: 178 },
      { month: "Sep", temp: 27.0, rainfall: 165 },
      { month: "Oct", temp: 26.2, rainfall: 158 },
      { month: "Nov", temp: 24.8, rainfall: 122 },
      { month: "Dic", temp: 23.3, rainfall: 98 }
    ]
  },
  "maria-trinidad-sanchez": {
    annualRainfallAvg: 2150,
    soilType: "Suelos aluviales hidromorfos y turberas costeras fértiles en Nagua y El Factor",
    irrigationInfrastructure: "Sistema Aglipo II y cuenca baja del Río Yuna y Río Boba",
    predominantCrops: [
      { name: "Arroz de Nagua", category: "Cereales", cycleMonths: 5, economicImpact: "El Factor es considerado polo arrocero de excelencia", waterNeed: "Alta",
        annualProductionTon: 140000 },
      { name: "Cocotero (Coco de Agua y Seco)", category: "Frutales", cycleMonths: 12, economicImpact: "Mayor litoral cocotero de la República Dominicana", waterNeed: "Media" },
      { name: "Cacao y Plátano", category: "Agroindustria", cycleMonths: 12, economicImpact: "Cultivos de ladera en la loma de Cabrera", waterNeed: "Alta",
        annualProductionTon: 36000 }
    ],
    plantingCalendar: [
      { crop: "Arroz (Primavera)", plantingMonths: ["Ene", "Feb"], harvestMonths: ["May", "Jun"], optimalRegime: "Abundancia hídrica permanente por alta precipitación" },
      { crop: "Arroz (Verano)", plantingMonths: ["Jul", "Ago"], harvestMonths: ["Nov", "Dic"], optimalRegime: "Segundo ciclo regular" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 24.5, rainfall: 185 },
      { month: "Feb", temp: 24.8, rainfall: 135 },
      { month: "Mar", temp: 25.5, rainfall: 120 },
      { month: "Abr", temp: 26.3, rainfall: 160 },
      { month: "May", temp: 27.1, rainfall: 240 },
      { month: "Jun", temp: 27.8, rainfall: 175 },
      { month: "Jul", temp: 28.0, rainfall: 180 },
      { month: "Ago", temp: 28.2, rainfall: 210 },
      { month: "Sep", temp: 28.0, rainfall: 195 },
      { month: "Oct", temp: 27.4, rainfall: 220 },
      { month: "Nov", temp: 26.2, rainfall: 265 },
      { month: "Dic", temp: 25.0, rainfall: 220 }
    ]
  },
  "monsenor-nouel": {
    annualRainfallAvg: 2280,
    soilType: "Suelos aluviales arcillosos y de montaña con alto drenaje en Bonao",
    irrigationInfrastructure: "Presas de Rincón y Hatillo, Río Yuna y Río Maimón",
    predominantCrops: [
      { name: "Arroz Bonao", category: "Cereales", cycleMonths: 5, economicImpact: "Tradición arrocera del valle del Yuna", waterNeed: "Alta",
        annualProductionTon: 78000 },
      { name: "Cacao de Altura", category: "Agroindustria", cycleMonths: 12, economicImpact: "Fincas orgánicas en Piedra Blanca y Maimón", waterNeed: "Alta",
        annualProductionTon: 8200 },
      { name: "Cítricos y Café", category: "Frutales", cycleMonths: 12, economicImpact: "Laderas de la Cordillera Central", waterNeed: "Media",
        annualProductionTon: 18500 }
    ],
    plantingCalendar: [
      { crop: "Arroz", plantingMonths: ["Ene", "Feb"], harvestMonths: ["May", "Jun"], optimalRegime: "Riego continuo con afluentes montañosos" },
      { crop: "Cacao", plantingMonths: ["May", "Jun"], harvestMonths: ["Nov", "Dic", "Ene"], optimalRegime: "Humedad relativa superior al 80%" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 24.1, rainfall: 140 },
      { month: "Feb", temp: 24.5, rainfall: 110 },
      { month: "Mar", temp: 25.3, rainfall: 125 },
      { month: "Abr", temp: 26.2, rainfall: 190 },
      { month: "May", temp: 27.0, rainfall: 310 },
      { month: "Jun", temp: 27.7, rainfall: 230 },
      { month: "Jul", temp: 27.9, rainfall: 220 },
      { month: "Ago", temp: 28.1, rainfall: 260 },
      { month: "Sep", temp: 27.9, rainfall: 245 },
      { month: "Oct", temp: 27.2, rainfall: 230 },
      { month: "Nov", temp: 25.8, rainfall: 185 },
      { month: "Dic", temp: 24.6, rainfall: 160 }
    ]
  },
  "monte-cristi": {
    annualRainfallAvg: 580,
    soilType: "Aluvial salino y franco-arcilloso en el bajo Yaque del Norte; xerófilo en costas",
    irrigationInfrastructure: "Canales Fernando Valerio, Horacio Vásquez y derivación del Yaque del Norte",
    predominantCrops: [
      { name: "Banano Orgánico de Exportación", category: "Musáceas", cycleMonths: 9, economicImpact: "Líder mundial en exportación a la Unión Europea", waterNeed: "Alta",
        annualProductionTon: 175000 },
      { name: "Arroz Bajo Riego", category: "Cereales", cycleMonths: 5, economicImpact: "Proyecto Villa Vásquez y Castañuelas", waterNeed: "Alta",
        annualProductionTon: 185000 },
      { name: "Caprinocultura (Chivo Liniero)", category: "Agroindustria", cycleMonths: 12, economicImpact: "Carne y leche caprina adaptada a bosque seco", waterNeed: "Baja" },
      { name: "Sal Marina", category: "Agroindustria", cycleMonths: 12, economicImpact: "Salinas costeras de alta evaporación solar", waterNeed: "Baja",
        annualProductionTon: 45000 }
    ],
    plantingCalendar: [
      { crop: "Banano Orgánico", plantingMonths: ["Todo el año"], harvestMonths: ["Continuo semanal"], optimalRegime: "Riego tecnificado por microaspersión" },
      { crop: "Arroz", plantingMonths: ["Dic", "Ene"], harvestMonths: ["May", "Jun"], optimalRegime: "Riego controlado con compuertas del Yaque" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 25.0, rainfall: 30 },
      { month: "Feb", temp: 25.4, rainfall: 25 },
      { month: "Mar", temp: 26.2, rainfall: 22 },
      { month: "Abr", temp: 27.1, rainfall: 42 },
      { month: "May", temp: 28.0, rainfall: 80 },
      { month: "Jun", temp: 28.9, rainfall: 40 },
      { month: "Jul", temp: 29.3, rainfall: 25 },
      { month: "Ago", temp: 29.4, rainfall: 45 },
      { month: "Sep", temp: 29.1, rainfall: 78 },
      { month: "Oct", temp: 28.2, rainfall: 92 },
      { month: "Nov", temp: 26.9, rainfall: 68 },
      { month: "Dic", temp: 25.6, rainfall: 42 }
    ]
  },
  "monte-plata": {
    annualRainfallAvg: 1850,
    soilType: "Oxísoles y suelos arcillosos profundos en la llanura de Sabana Grande de Boyá",
    irrigationInfrastructure: "Ríos Ozama, Savita y Yabacao",
    predominantCrops: [
      { name: "Cacao Orgánico", category: "Agroindustria", cycleMonths: 12, economicImpact: "Fuerte desarrollo de cooperativas de pequeños productores", waterNeed: "Alta",
        annualProductionTon: 16800 },
      { name: "Piña MD2 de Exportación", category: "Frutales", cycleMonths: 14, economicImpact: "Cevicos y Sabana Grande de Boyá (mayor polo piñero)", waterNeed: "Media",
        annualProductionTon: 88000 },
      { name: "Ganadería Lechera de Monte Plata", category: "Agroindustria", cycleMonths: 12, economicImpact: "Población ganadera más densa del sureste", waterNeed: "Media",
        annualProductionTon: 52000 },
      { name: "Palma Africana (Aceite)", category: "Agroindustria", cycleMonths: 12, economicImpact: "Plantaciones para extracción de aceites comestibles", waterNeed: "Alta" }
    ],
    plantingCalendar: [
      { crop: "Piña MD2", plantingMonths: ["Mar", "Abr", "May"], harvestMonths: ["May", "Jun", "Jul (año sig.)"], optimalRegime: "Suelos ácidos con buen drenaje" },
      { crop: "Cacao", plantingMonths: ["May", "Jun"], harvestMonths: ["Oct", "Nov", "Dic"], optimalRegime: "Ambiente húmedo de bosque tropical lluvioso" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 24.4, rainfall: 85 },
      { month: "Feb", temp: 24.8, rainfall: 68 },
      { month: "Mar", temp: 25.5, rainfall: 75 },
      { month: "Abr", temp: 26.4, rainfall: 128 },
      { month: "May", temp: 27.2, rainfall: 250 },
      { month: "Jun", temp: 27.8, rainfall: 195 },
      { month: "Jul", temp: 28.0, rainfall: 205 },
      { month: "Ago", temp: 28.2, rainfall: 235 },
      { month: "Sep", temp: 28.0, rainfall: 225 },
      { month: "Oct", temp: 27.4, rainfall: 198 },
      { month: "Nov", temp: 26.1, rainfall: 145 },
      { month: "Dic", temp: 24.9, rainfall: 105 }
    ]
  },
  "pedernales": {
    annualRainfallAvg: 490,
    soilType: "Calcáreo xeromórfico y litosoles rojos bauxíticos",
    irrigationInfrastructure: "Río Pedernales y canal de riego bi-nacional",
    predominantCrops: [
      { name: "Café de Polo / Sierra de Bahoruco", category: "Agroindustria", cycleMonths: 12, economicImpact: "Microclimas de altura en Los Arroyos", waterNeed: "Media",
        annualProductionTon: 3200 },
      { name: "Aguacate Hass de Exportación", category: "Frutales", cycleMonths: 12, economicImpact: "Plantaciones de altura con riego tecnificado", waterNeed: "Media",
        annualProductionTon: 18500 },
      { name: "Habichuela y Maíz", category: "Leguminosas", cycleMonths: 3, economicImpact: "Agricultura familiar y fronteriza", waterNeed: "Baja",
        annualProductionTon: 7800 }
    ],
    plantingCalendar: [
      { crop: "Aguacate Hass", plantingMonths: ["May", "Jun"], harvestMonths: ["Nov", "Dic", "Ene"], optimalRegime: "Zonas montañosas altas (1,000+ msnm)" },
      { crop: "Habichuela", plantingMonths: ["Nov", "Dic"], harvestMonths: ["Feb", "Mar"], optimalRegime: "Aprovecha fresco de montaña" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 25.6, rainfall: 10 },
      { month: "Feb", temp: 25.9, rainfall: 12 },
      { month: "Mar", temp: 26.7, rainfall: 18 },
      { month: "Abr", temp: 27.4, rainfall: 35 },
      { month: "May", temp: 28.1, rainfall: 75 },
      { month: "Jun", temp: 28.7, rainfall: 42 },
      { month: "Jul", temp: 29.2, rainfall: 30 },
      { month: "Ago", temp: 29.1, rainfall: 58 },
      { month: "Sep", temp: 28.7, rainfall: 85 },
      { month: "Oct", temp: 28.0, rainfall: 70 },
      { month: "Nov", temp: 27.0, rainfall: 28 },
      { month: "Dic", temp: 26.0, rainfall: 15 }
    ]
  },
  "peravia": {
    annualRainfallAvg: 760,
    soilType: "Aluvial fértil en el Llano de Baní y calcáreo en colinas",
    irrigationInfrastructure: "Canal Marcos A. Cabral y Presas de Valdesia y Las Barías",
    predominantCrops: [
      { name: "Mango Banilejo de Exportación", category: "Frutales", cycleMonths: 12, economicImpact: "Capital del Mango (Banilejo, Mingolo, Puntica)", waterNeed: "Baja",
        annualProductionTon: 42000 },
      { name: "Cebolla y Tomate", category: "Hortalizas", cycleMonths: 4, economicImpact: "Polo hortícola intensivo", waterNeed: "Media",
        annualProductionTon: 35000 },
      { name: "Plátano Bajo Riego", category: "Musáceas", cycleMonths: 10, economicImpact: "Abastecimiento constante a Santo Domingo", waterNeed: "Alta",
        annualProductionTon: 42000 },
      { name: "Café en la Sierra", category: "Agroindustria", cycleMonths: 12, economicImpact: "Zona alta de Los Jovillos y Valdesia", waterNeed: "Media",
        annualProductionTon: 3100 }
    ],
    plantingCalendar: [
      { crop: "Mango (Floración y Cosecha)", plantingMonths: ["Ene", "Feb"], harvestMonths: ["May", "Jun", "Jul"], optimalRegime: "Floración inducida por temporada seca de invierno" },
      { crop: "Cebolla", plantingMonths: ["Oct", "Nov"], harvestMonths: ["Feb", "Mar"], optimalRegime: "Riego canal Marcos A. Cabral" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 25.2, rainfall: 18 },
      { month: "Feb", temp: 25.5, rainfall: 15 },
      { month: "Mar", temp: 26.3, rainfall: 22 },
      { month: "Abr", temp: 27.1, rainfall: 45 },
      { month: "May", temp: 27.9, rainfall: 105 },
      { month: "Jun", temp: 28.6, rainfall: 65 },
      { month: "Jul", temp: 28.9, rainfall: 55 },
      { month: "Ago", temp: 28.9, rainfall: 90 },
      { month: "Sep", temp: 28.5, rainfall: 130 },
      { month: "Oct", temp: 27.8, rainfall: 115 },
      { month: "Nov", temp: 26.8, rainfall: 48 },
      { month: "Dic", temp: 25.7, rainfall: 25 }
    ]
  },
  "puerto-plata": {
    annualRainfallAvg: 1620,
    soilType: "Franco-arcilloso en valles costeros y margas calcáreas en la sierra",
    irrigationInfrastructure: "Ríos Bajabonico, Camú del Norte y Yásica",
    predominantCrops: [
      { name: "Ganadería Lechera y Quesera", category: "Agroindustria", cycleMonths: 12, economicImpact: "Cuenca quesera de Imbert y Luperón (queso geo)", waterNeed: "Media",
        annualProductionTon: 46000 },
      { name: "Caña de Azúcar (Melaza para Ron)", category: "Agroindustria", cycleMonths: 12, economicImpact: "Materia prima de rones emblemáticos", waterNeed: "Alta" },
      { name: "Cacao y Café de Altura", category: "Agroindustria", cycleMonths: 12, economicImpact: "Yásica, Altamira y Guananico", waterNeed: "Alta",
        annualProductionTon: 7500 }
    ],
    plantingCalendar: [
      { crop: "Cacao", plantingMonths: ["May", "Jun"], harvestMonths: ["Nov", "Dic", "Ene"], optimalRegime: "Lluvias frontales de invierno en costa atlántica" },
      { crop: "Pastos de Pastoreo", plantingMonths: ["Abr", "May"], harvestMonths: ["Continuo"], optimalRegime: "Clima húmedo marítimo" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 24.3, rainfall: 150 },
      { month: "Feb", temp: 24.5, rainfall: 115 },
      { month: "Mar", temp: 25.2, rainfall: 95 },
      { month: "Abr", temp: 26.0, rainfall: 110 },
      { month: "May", temp: 26.9, rainfall: 165 },
      { month: "Jun", temp: 27.7, rainfall: 95 },
      { month: "Jul", temp: 28.0, rainfall: 85 },
      { month: "Ago", temp: 28.2, rainfall: 105 },
      { month: "Sep", temp: 28.1, rainfall: 110 },
      { month: "Oct", temp: 27.4, rainfall: 145 },
      { month: "Nov", temp: 26.0, rainfall: 220 },
      { month: "Dic", temp: 24.8, rainfall: 195 }
    ]
  },
  "samana": {
    annualRainfallAvg: 2350,
    soilType: "Suelos rojizos ferralíticos y calcáreos en península tropical húmeda",
    irrigationInfrastructure: "Cuencas de arroyos permanentes, Río Limón y alta pluviosidad natural",
    predominantCrops: [
      { name: "Cocotero", category: "Frutales", cycleMonths: 12, economicImpact: "Paisaje icónico y aceite de coco virgen", waterNeed: "Media",
        annualProductionTon: 48000 },
      { name: "Jengibre y Cúrcuma Orgánica", category: "Tubérculos", cycleMonths: 9, economicImpact: "Exportación a mercados especializados", waterNeed: "Alta",
        annualProductionTon: 6800 },
      { name: "Ñame y Yautía", category: "Tubérculos", cycleMonths: 9, economicImpact: "Tubérculos tradicionales de ladera", waterNeed: "Alta",
        annualProductionTon: 22000 },
      { name: "Cacao Sombreado", category: "Agroindustria", cycleMonths: 12, economicImpact: "Fincas ecoturísticas", waterNeed: "Alta",
        annualProductionTon: 8500 }
    ],
    plantingCalendar: [
      { crop: "Jengibre", plantingMonths: ["Abr", "May"], harvestMonths: ["Dic", "Ene", "Feb"], optimalRegime: "Laderas con drenaje libre y alta pluviosidad" },
      { crop: "Ñame", plantingMonths: ["Mar", "Abr"], harvestMonths: ["Dic", "Ene"], optimalRegime: "Suelos profundos con humedad constante" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 24.8, rainfall: 160 },
      { month: "Feb", temp: 25.0, rainfall: 120 },
      { month: "Mar", temp: 25.7, rainfall: 110 },
      { month: "Abr", temp: 26.5, rainfall: 140 },
      { month: "May", temp: 27.3, rainfall: 260 },
      { month: "Jun", temp: 27.9, rainfall: 210 },
      { month: "Jul", temp: 28.1, rainfall: 215 },
      { month: "Ago", temp: 28.3, rainfall: 245 },
      { month: "Sep", temp: 28.1, rainfall: 240 },
      { month: "Oct", temp: 27.6, rainfall: 250 },
      { month: "Nov", temp: 26.4, rainfall: 255 },
      { month: "Dic", temp: 25.2, rainfall: 205 }
    ]
  },
  "san-cristobal": {
    annualRainfallAvg: 1680,
    soilType: "Aluvial profundo en el valle del Haina y Nigua; arcilloso en lomas",
    irrigationInfrastructure: "Presa de Valdesia, Presa de Jigüey-Aguacate, Río Nizao y Río Haina",
    predominantCrops: [
      { name: "Aguacate de Exportación (Cambita)", category: "Frutales", cycleMonths: 12, economicImpact: "Cambita Garabitos es el mayor centro de acopio de aguacate del país", waterNeed: "Media" },
      { name: "Cacao y Café", category: "Agroindustria", cycleMonths: 12, economicImpact: "Zonas montañosas de San Cristóbal", waterNeed: "Alta",
        annualProductionTon: 14500 },
      { name: "Cítricos y Hortalizas", category: "Frutales", cycleMonths: 12, economicImpact: "Villa Altagracia y Medina", waterNeed: "Media",
        annualProductionTon: 28000 }
    ],
    plantingCalendar: [
      { crop: "Aguacate (Semil 34)", plantingMonths: ["May", "Jun"], harvestMonths: ["Oct", "Nov", "Dic", "Ene"], optimalRegime: "Microclima templado de montaña en Cambita" },
      { crop: "Cacao", plantingMonths: ["May", "Jun"], harvestMonths: ["Nov", "Dic", "Ene"], optimalRegime: "Lluvias bien distribuidas" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 24.6, rainfall: 58 },
      { month: "Feb", temp: 24.9, rainfall: 50 },
      { month: "Mar", temp: 25.6, rainfall: 55 },
      { month: "Abr", temp: 26.5, rainfall: 88 },
      { month: "May", temp: 27.3, rainfall: 220 },
      { month: "Jun", temp: 27.9, rainfall: 165 },
      { month: "Jul", temp: 28.1, rainfall: 170 },
      { month: "Ago", temp: 28.3, rainfall: 205 },
      { month: "Sep", temp: 28.0, rainfall: 215 },
      { month: "Oct", temp: 27.4, rainfall: 195 },
      { month: "Nov", temp: 26.3, rainfall: 125 },
      { month: "Dic", temp: 25.1, rainfall: 75 }
    ]
  },
  "san-jose-de-ocoa": {
    annualRainfallAvg: 1250,
    soilType: "Suelos de montaña ricos en materia orgánica en valles intermontanos",
    irrigationInfrastructure: "Micro-riego presurizado de montaña, Río Ocoa y afluentes",
    predominantCrops: [
      { name: "Hortalizas Bajo Invernadero", category: "Hortalizas", cycleMonths: 3, economicImpact: "Líder nacional en ambiente protegido (pimientos morrones y tomates)", waterNeed: "Media",
        annualProductionTon: 55000 },
      { name: "Aguacate Hass y Carla", category: "Frutales", cycleMonths: 12, economicImpact: "Exportación a Estados Unidos y Europa", waterNeed: "Media",
        annualProductionTon: 38000 },
      { name: "Café de Especialidad Ocoa", category: "Agroindustria", cycleMonths: 12, economicImpact: "Tradición cafetalera de altura", waterNeed: "Media",
        annualProductionTon: 4500 },
      { name: "Cebolla y Papa", category: "Hortalizas", cycleMonths: 4, economicImpact: "Sabana Larga y Rancho Arriba", waterNeed: "Media",
        annualProductionTon: 32000 }
    ],
    plantingCalendar: [
      { crop: "Pimientos en Invernadero", plantingMonths: ["Jul", "Ago"], harvestMonths: ["Nov", "Dic", "Ene", "Feb", "Mar"], optimalRegime: "Ciclo intensivo de exportación bajo plástico" },
      { crop: "Aguacate Hass", plantingMonths: ["May", "Jun"], harvestMonths: ["Nov", "Dic", "Ene"], optimalRegime: "Pendientes entre 800 y 1,400 msnm" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 21.5, rainfall: 35 },
      { month: "Feb", temp: 21.9, rainfall: 30 },
      { month: "Mar", temp: 22.8, rainfall: 42 },
      { month: "Abr", temp: 23.7, rainfall: 85 },
      { month: "May", temp: 24.5, rainfall: 180 },
      { month: "Jun", temp: 25.1, rainfall: 120 },
      { month: "Jul", temp: 25.4, rainfall: 105 },
      { month: "Ago", temp: 25.3, rainfall: 145 },
      { month: "Sep", temp: 24.9, rainfall: 170 },
      { month: "Oct", temp: 24.2, rainfall: 140 },
      { month: "Nov", temp: 23.0, rainfall: 72 },
      { month: "Dic", temp: 22.0, rainfall: 45 }
    ]
  },
  "san-juan": {
    annualRainfallAvg: 980,
    soilType: "Vertisoles profundos fértiles de alta capacidad de intercambio catiónico en el Valle de San Juan",
    irrigationInfrastructure: "Presa de Sabaneta y red de canales José Joaquín Puello",
    predominantCrops: [
      { name: "Habichuela Roja y Negra", category: "Leguminosas", cycleMonths: 3, economicImpact: "El 'Granero del Sur', principal productor nacional de leguminosas", waterNeed: "Media",
        annualProductionTon: 48000 },
      { name: "Arroz Bajo Riego", category: "Cereales", cycleMonths: 5, economicImpact: "Cultivo rotativo fundamental en el valle", waterNeed: "Alta",
        annualProductionTon: 185000 },
      { name: "Maíz y Sorgo", category: "Cereales", cycleMonths: 4, economicImpact: "Producción para concentrados avícolas y porcinos", waterNeed: "Media",
        annualProductionTon: 24000 },
      { name: "Cebolla", category: "Hortalizas", cycleMonths: 4, economicImpact: "Las Matas de Farfán y Vallejuelo", waterNeed: "Media",
        annualProductionTon: 28000 }
    ],
    plantingCalendar: [
      { crop: "Habichuela de San Juan", plantingMonths: ["Nov", "Dic"], harvestMonths: ["Feb", "Mar"], optimalRegime: "Siembra reglamentada para control de mosca blanca" },
      { crop: "Arroz (Verano)", plantingMonths: ["Jun", "Jul"], harvestMonths: ["Oct", "Nov"], optimalRegime: "Rotación agronómica después de la habichuela" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 23.9, rainfall: 22 },
      { month: "Feb", temp: 24.3, rainfall: 24 },
      { month: "Mar", temp: 25.3, rainfall: 38 },
      { month: "Abr", temp: 26.2, rainfall: 82 },
      { month: "May", temp: 27.0, rainfall: 165 },
      { month: "Jun", temp: 27.6, rainfall: 110 },
      { month: "Jul", temp: 27.9, rainfall: 95 },
      { month: "Ago", temp: 27.9, rainfall: 135 },
      { month: "Sep", temp: 27.4, rainfall: 155 },
      { month: "Oct", temp: 26.6, rainfall: 125 },
      { month: "Nov", temp: 25.2, rainfall: 52 },
      { month: "Dic", temp: 24.1, rainfall: 26 }
    ]
  },
  "san-pedro-de-macoris": {
    annualRainfallAvg: 1220,
    soilType: "Suelos franco-arcillosos calcáreos del Llano Costero del Caribe",
    irrigationInfrastructure: "Pozos de gran aforo y cuencas de los ríos Higuamo y Soco",
    predominantCrops: [
      { name: "Caña de Azúcar Histórica", category: "Agroindustria", cycleMonths: 12, economicImpact: "Ingenio Cristóbal Colón y tradición sucro-alcoholera", waterNeed: "Alta",
        annualProductionTon: 580000 },
      { name: "Ganadería Bovina", category: "Agroindustria", cycleMonths: 12, economicImpact: "Pastoreo extensivo y doble propósito", waterNeed: "Media",
        annualProductionTon: 38000 },
      { name: "Piscicultura y Acuicultura", category: "Agroindustria", cycleMonths: 6, economicImpact: "Tilapia y camarón en estanques", waterNeed: "Alta",
        annualProductionTon: 4200 }
    ],
    plantingCalendar: [
      { crop: "Caña de Azúcar", plantingMonths: ["May", "Jun"], harvestMonths: ["Dic", "Ene", "Feb", "Mar", "Abr"], optimalRegime: "Zafra azucarera invernal" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 25.3, rainfall: 45 },
      { month: "Feb", temp: 25.5, rainfall: 38 },
      { month: "Mar", temp: 26.1, rainfall: 42 },
      { month: "Abr", temp: 26.9, rainfall: 72 },
      { month: "May", temp: 27.7, rainfall: 168 },
      { month: "Jun", temp: 28.2, rainfall: 130 },
      { month: "Jul", temp: 28.4, rainfall: 135 },
      { month: "Ago", temp: 28.5, rainfall: 160 },
      { month: "Sep", temp: 28.3, rainfall: 170 },
      { month: "Oct", temp: 27.8, rainfall: 152 },
      { month: "Nov", temp: 26.9, rainfall: 98 },
      { month: "Dic", temp: 25.8, rainfall: 58 }
    ]
  },
  "sanchez-ramirez": {
    annualRainfallAvg: 1720,
    soilType: "Suelos vertisólicos y aluviales arcillosos muy fértiles en el Valle de Cotuí",
    irrigationInfrastructure: "Presa de Hatillo (mayor lago artificial de las Antillas) y Río Yuna",
    predominantCrops: [
      { name: "Arroz Cotuisano", category: "Cereales", cycleMonths: 5, economicImpact: "Riego garantizado por la Presa de Hatillo", waterNeed: "Alta",
        annualProductionTon: 125000 },
      { name: "Piña de Cotuí", category: "Frutales", cycleMonths: 14, economicImpact: "Reconocida dulzura y tamaño para mercado nacional", waterNeed: "Media",
        annualProductionTon: 62000 },
      { name: "Cacao y Plátano", category: "Agroindustria", cycleMonths: 12, economicImpact: "Fincas familiares en Fantino y La Mata", waterNeed: "Alta",
        annualProductionTon: 36000 }
    ],
    plantingCalendar: [
      { crop: "Arroz (Primavera)", plantingMonths: ["Dic", "Ene"], harvestMonths: ["May", "Jun"], optimalRegime: "Riego por gravedad desde el canal de Hatillo" },
      { crop: "Arroz (Verano)", plantingMonths: ["Jun", "Jul"], harvestMonths: ["Oct", "Nov"], optimalRegime: "Segundo ciclo con alto aprovechamiento hídrico" },
      { crop: "Piña", plantingMonths: ["Abr", "May"], harvestMonths: ["Jun", "Jul (año sig.)"], optimalRegime: "Manejo nutricional con alta radiación" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 24.3, rainfall: 90 },
      { month: "Feb", temp: 24.7, rainfall: 75 },
      { month: "Mar", temp: 25.5, rainfall: 82 },
      { month: "Abr", temp: 26.4, rainfall: 140 },
      { month: "May", temp: 27.2, rainfall: 235 },
      { month: "Jun", temp: 27.8, rainfall: 165 },
      { month: "Jul", temp: 28.0, rainfall: 170 },
      { month: "Ago", temp: 28.2, rainfall: 195 },
      { month: "Sep", temp: 28.0, rainfall: 180 },
      { month: "Oct", temp: 27.3, rainfall: 172 },
      { month: "Nov", temp: 26.0, rainfall: 138 },
      { month: "Dic", temp: 24.8, rainfall: 115 }
    ]
  },
  "santiago": {
    annualRainfallAvg: 1020,
    soilType: "Aluvial fértil en el Valle Medio del Yaque del Norte y colinas arcillosas",
    irrigationInfrastructure: "Canales Ulises Francisco Espaillat (UFE) y Monsieur Bogaert, Presas de Tavera y Bao",
    predominantCrops: [
      { name: "Tabaco Rubio y Negro", category: "Agroindustria", cycleMonths: 5, economicImpact: "Capital Mundial del Cigarro Premium (Villa González, Navarrete)", waterNeed: "Media",
        annualProductionTon: 32000 },
      { name: "Plátano y Guineo", category: "Musáceas", cycleMonths: 10, economicImpact: "Valles irrigados del Yaque", waterNeed: "Alta",
        annualProductionTon: 120000 },
      { name: "Yuca y Hortalizas", category: "Tubérculos", cycleMonths: 8, economicImpact: "Comercialización en el Hospedaje Yaque", waterNeed: "Media",
        annualProductionTon: 48000 },
      { name: "Porcicultura y Avicultura", category: "Agroindustria", cycleMonths: 12, economicImpact: "Mayor concentración agroindustrial avícola", waterNeed: "Media",
        annualProductionTon: 85000 }
    ],
    plantingCalendar: [
      { crop: "Tabaco", plantingMonths: ["Oct", "Nov", "Dic"], harvestMonths: ["Feb", "Mar", "Abr"], optimalRegime: "Ciclo de secano e invierno con curado al aire" },
      { crop: "Plátano", plantingMonths: ["Abr", "May"], harvestMonths: ["Feb", "Mar"], optimalRegime: "Riego permanente con canales UFE y Bogaert" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 24.5, rainfall: 52 },
      { month: "Feb", temp: 24.9, rainfall: 45 },
      { month: "Mar", temp: 25.8, rainfall: 48 },
      { month: "Abr", temp: 26.7, rainfall: 92 },
      { month: "May", temp: 27.6, rainfall: 155 },
      { month: "Jun", temp: 28.3, rainfall: 95 },
      { month: "Jul", temp: 28.6, rainfall: 82 },
      { month: "Ago", temp: 28.7, rainfall: 110 },
      { month: "Sep", temp: 28.4, rainfall: 125 },
      { month: "Oct", temp: 27.6, rainfall: 118 },
      { month: "Nov", temp: 26.2, rainfall: 85 },
      { month: "Dic", temp: 25.0, rainfall: 62 }
    ]
  },
  "santiago-rodriguez": {
    annualRainfallAvg: 1120,
    soilType: "Franco-arenoso en llanuras y pardo forestal en la vertiente norte de la Cordillera Central",
    irrigationInfrastructure: "Ríos Guayubín, Mao y Cana, pequeños embalses",
    predominantCrops: [
      { name: "Ganadería Lechera de San Ignacio", category: "Agroindustria", cycleMonths: 12, economicImpact: "Capital Lechera de la Región Noroeste", waterNeed: "Media",
        annualProductionTon: 38000 },
      { name: "Yuca Industrial y Amarga", category: "Tubérculos", cycleMonths: 8, economicImpact: "Polo casabero de Monción (patrimonio gastronómico)", waterNeed: "Media",
        annualProductionTon: 42000 },
      { name: "Tabaco y Maní", category: "Agroindustria", cycleMonths: 5, economicImpact: "Zonas de secano tecnificado", waterNeed: "Baja",
        annualProductionTon: 16000 }
    ],
    plantingCalendar: [
      { crop: "Yuca para Casabe", plantingMonths: ["Abr", "May"], harvestMonths: ["Dic", "Ene", "Feb"], optimalRegime: "Aprovecha régimen bimodal de lluvias" },
      { crop: "Tabaco", plantingMonths: ["Oct", "Nov"], harvestMonths: ["Feb", "Mar"], optimalRegime: "Secano invernal" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 24.2, rainfall: 35 },
      { month: "Feb", temp: 24.7, rainfall: 38 },
      { month: "Mar", temp: 25.6, rainfall: 50 },
      { month: "Abr", temp: 26.5, rainfall: 95 },
      { month: "May", temp: 27.3, rainfall: 180 },
      { month: "Jun", temp: 28.0, rainfall: 125 },
      { month: "Jul", temp: 28.3, rainfall: 98 },
      { month: "Ago", temp: 28.3, rainfall: 138 },
      { month: "Sep", temp: 27.9, rainfall: 165 },
      { month: "Oct", temp: 27.1, rainfall: 135 },
      { month: "Nov", temp: 25.8, rainfall: 60 },
      { month: "Dic", temp: 24.6, rainfall: 40 }
    ]
  },
  "santo-domingo": {
    annualRainfallAvg: 1520,
    soilType: "Calcáreo sobre roca coralina con bolsones de arcilla roja ferralítica",
    irrigationInfrastructure: "Acuíferos costeros, Río Ozama, Isabela y Haina",
    predominantCrops: [
      { name: "Cítricos y Frutas Tropicales", category: "Frutales", cycleMonths: 12, economicImpact: "Guanábana, lechosa y parchita en La Victoria y Guerra", waterNeed: "Media",
        annualProductionTon: 34000 },
      { name: "Cacao y Plátano", category: "Agroindustria", cycleMonths: 12, economicImpact: "Zonas periféricas de Santo Domingo Norte", waterNeed: "Alta",
        annualProductionTon: 36000 },
      { name: "Ganadería Bovina y Porcina", category: "Agroindustria", cycleMonths: 12, economicImpact: "Abastecimiento cárnico y lechero periurbano", waterNeed: "Media",
        annualProductionTon: 42000 }
    ],
    plantingCalendar: [
      { crop: "Lechosa y Frutales", plantingMonths: ["Abr", "May"], harvestMonths: ["Dic", "Ene", "Feb"], optimalRegime: "Riego tecnificado por goteo" },
      { crop: "Plátano", plantingMonths: ["May", "Jun"], harvestMonths: ["Mar", "Abr"], optimalRegime: "Humedad regular de la cuenca del Ozama" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 25.2, rainfall: 65 },
      { month: "Feb", temp: 25.4, rainfall: 58 },
      { month: "Mar", temp: 26.0, rainfall: 56 },
      { month: "Abr", temp: 26.7, rainfall: 78 },
      { month: "May", temp: 27.5, rainfall: 185 },
      { month: "Jun", temp: 28.0, rainfall: 148 },
      { month: "Jul", temp: 28.2, rainfall: 155 },
      { month: "Ago", temp: 28.4, rainfall: 185 },
      { month: "Sep", temp: 28.2, rainfall: 190 },
      { month: "Oct", temp: 27.7, rainfall: 185 },
      { month: "Nov", temp: 26.8, rainfall: 115 },
      { month: "Dic", temp: 25.7, rainfall: 78 }
    ]
  },
  "valverde": {
    annualRainfallAvg: 750,
    soilType: "Aluvial profundo clase I y II, altamente fértil en el Valle Occidental del Cibao",
    irrigationInfrastructure: "Canales Mao-Gurabo, Luis L. Bogaert y Río Yaque del Norte",
    predominantCrops: [
      { name: "Banano Orgánico de Exportación (Mao)", category: "Musáceas", cycleMonths: 9, economicImpact: "Mao es la 'Ciudad de los Bellos Atardeceres' y capital bananera", waterNeed: "Alta" },
      { name: "Arroz Bajo Riego", category: "Cereales", cycleMonths: 5, economicImpact: "Altos rendimientos por hectárea en parcelas tecnificadas", waterNeed: "Alta",
        annualProductionTon: 185000 },
      { name: "Plátano y Cebolla", category: "Musáceas", cycleMonths: 10, economicImpact: "Mercado local e internacional", waterNeed: "Media",
        annualProductionTon: 62000 }
    ],
    plantingCalendar: [
      { crop: "Banano Orgánico", plantingMonths: ["Todo el año"], harvestMonths: ["Continuo semanal"], optimalRegime: "Riego presurizado con agua del Yaque del Norte" },
      { crop: "Arroz (Primavera)", plantingMonths: ["Dic", "Ene"], harvestMonths: ["May", "Jun"], optimalRegime: "Inundación controlada" },
      { crop: "Arroz (Verano)", plantingMonths: ["Jun", "Jul"], harvestMonths: ["Oct", "Nov"], optimalRegime: "Segundo ciclo con radiación solar plena" }
    ],
    historicalClimatology: [
      { month: "Ene", temp: 24.7, rainfall: 38 },
      { month: "Feb", temp: 25.1, rainfall: 35 },
      { month: "Mar", temp: 26.0, rainfall: 42 },
      { month: "Abr", temp: 26.9, rainfall: 78 },
      { month: "May", temp: 27.8, rainfall: 145 },
      { month: "Jun", temp: 28.6, rainfall: 82 },
      { month: "Jul", temp: 28.9, rainfall: 65 },
      { month: "Ago", temp: 29.0, rainfall: 92 },
      { month: "Sep", temp: 28.7, rainfall: 115 },
      { month: "Oct", temp: 27.9, rainfall: 105 },
      { month: "Nov", temp: 26.5, rainfall: 62 },
      { month: "Dic", temp: 25.2, rainfall: 45 }
    ]
  }
};

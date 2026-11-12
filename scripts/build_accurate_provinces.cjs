const fs = require('fs');

const rawGeo = JSON.parse(fs.readFileSync('src/data/dominican_republic_highres.geojson', 'utf8'));

// Helper to compute centroid from polygon / multipolygon
function getCentroid(geometry) {
  let pts = [];
  if (geometry.type === 'Polygon') {
    pts = geometry.coordinates[0];
  } else if (geometry.type === 'MultiPolygon') {
    let maxLen = 0;
    geometry.coordinates.forEach(poly => {
      if (poly[0].length > maxLen) {
        maxLen = poly[0].length;
        pts = poly[0];
      }
    });
  }
  let sumLat = 0, sumLng = 0;
  pts.forEach(p => { sumLng += p[0]; sumLat += p[1]; });
  return { lat: +(sumLat / pts.length).toFixed(4), lng: +(sumLng / pts.length).toFixed(4) };
}

const PROVINCE_INFO = {
  'DO-01': {
    id: 'distrito-nacional',
    name: 'Distrito Nacional',
    officialName: 'Distrito Nacional',
    region: 'Sureste',
    macroRegionCode: 'sureste',
    planRegionNum: 'X',
    planRegionName: 'Región Ozama',
    subRegion: 'Región X - Ozama (Ley 345-22)',
    capital: 'Santo Domingo de Guzmán',
    surfaceKm2: 91.29,
    population: 1029110,
    economicShare: 32.5,
    economicActivities: ['Servicios Financieros', 'Comercio Mayorista y Minorista', 'Turismo Cultural', 'Administración Pública', 'Telecomunicaciones'],
    touristAttractions: ['Ciudad Colonial (Patrimonio Humanidad UNESCO)', 'Alcázar de Colón', 'Malecón de Santo Domingo', 'Parque Mirador Sur', 'Museo de las Casas Reales'],
    description: 'Sede del gobierno central y corazón financiero de la República Dominicana. Alberga la Ciudad Colonial, primada de América.',
    zoom: 12
  },
  'DO-02': {
    id: 'azua',
    name: 'Azua',
    officialName: 'Azua de Compostela',
    region: 'Suroeste',
    macroRegionCode: 'suroeste',
    planRegionNum: 'VII',
    planRegionName: 'Región El Valle',
    subRegion: 'Región VII - El Valle (Ley 345-22)',
    capital: 'Azua de Compostela',
    surfaceKm2: 2672.93,
    population: 240209,
    economicShare: 14.2,
    economicActivities: ['Agroindustria de Tomates y Bananos', 'Cultivo de Cebolla y Mango', 'Generación Energética', 'Pesca'],
    touristAttractions: ['Playa Monterrío y Playa Chiquita', 'Parque Nacional Sierra Martín García', 'Bahía de Ocoa', 'Monumento a la Batalla del 19 de Marzo'],
    description: 'Tierra histórica de heroicas batallas republicanas, fértiles valles agroindustriales y las apacibles aguas de la Bahía de Ocoa.',
    zoom: 10
  },
  'DO-03': {
    id: 'baoruco',
    name: 'Baoruco',
    officialName: 'Baoruco (Bahoruco)',
    region: 'Suroeste',
    macroRegionCode: 'suroeste',
    planRegionNum: 'VI',
    planRegionName: 'Región Enriquillo',
    subRegion: 'Región VI - Enriquillo (Ley 345-22)',
    capital: 'Neiba',
    surfaceKm2: 1115.78,
    population: 108777,
    economicShare: 6.8,
    economicActivities: ['Vitivinicultura (Uvas y Vino de Neiba)', 'Cultivo de Plátano Barahonero', 'Café de Altura', 'Agricultura de Valle'],
    touristAttractions: ['Balneario Las Marías', 'Lago Enriquillo', 'Sierra de Neiba', 'Ruta de la Uva y Viñedos'],
    description: 'Capital de la uva y cuna de la vitivinicultura en las Antillas, coronada por la Sierra de Neiba y el místico Lago Enriquillo.',
    zoom: 10
  },
  'DO-04': {
    id: 'barahona',
    name: 'Barahona',
    officialName: 'Barahona',
    region: 'Suroeste',
    macroRegionCode: 'suroeste',
    planRegionNum: 'VI',
    planRegionName: 'Región Enriquillo',
    subRegion: 'Región VI - Enriquillo (Ley 345-22)',
    capital: 'Santa Cruz de Barahona',
    surfaceKm2: 1737.67,
    population: 200889,
    economicShare: 15.6,
    economicActivities: ['Minería de Larimar (Piedra Semipreciosa Única)', 'Producción Azucarera y Café', 'Ecoturismo de Aventura', 'Comercio Marítimo'],
    touristAttractions: ['Playa San Rafael y Los Patos', 'Mina de Larimar en Bahoruco', 'Polo Magnético', 'Bahía de Neiba', 'Río Los Patos'],
    description: 'La célebre Perla del Sur, donde la cordillera se une espectacularmente con las olas azul turquesa del Mar Caribe.',
    zoom: 10
  },
  'DO-05': {
    id: 'dajabon',
    name: 'Dajabón',
    officialName: 'Dajabón',
    region: 'Cibao / Norte',
    macroRegionCode: 'cibao',
    planRegionNum: 'IV',
    planRegionName: 'Región Cibao Noroeste',
    subRegion: 'Región IV - Cibao Noroeste (Ley 345-22)',
    capital: 'Dajabón',
    surfaceKm2: 1018.83,
    population: 74185,
    economicShare: 3.5,
    economicActivities: ['Mercado Binacional Fronterizo', 'Ganadería Bovina', 'Cultivo de Arroz y Café'],
    touristAttractions: ['Mercado Binacional de Dajabón', 'Monumento a la Batalla de Beller', 'Río Masacre', 'Arco Fronterizo'],
    description: 'Eje del intercambio comercial y cultural en la frontera norte dominico-haitiana, escenario de memorables batallas de la independencia.',
    zoom: 11
  },
  'DO-06': {
    id: 'duarte',
    name: 'Duarte',
    officialName: 'Duarte',
    region: 'Cibao / Norte',
    macroRegionCode: 'cibao',
    planRegionNum: 'III',
    planRegionName: 'Región Cibao Nordeste',
    subRegion: 'Región III - Cibao Nordeste (Ley 345-22)',
    capital: 'San Francisco de Macorís',
    surfaceKm2: 1620.72,
    population: 308353,
    economicShare: 11.2,
    economicActivities: ['Producción de Cacao Orgánico de Exportación', 'Cultivo Arrocero', 'Ganadería Lechera', 'Comercio Agroindustrial'],
    touristAttractions: ['Reserva Científica Loma Quita Espuela', 'Sendero del Cacao', 'Catedral Santa Ana', 'Río Jaya'],
    description: 'Epicentro del cacao de clase mundial y bastión agrícola del Cibao Oriental con rica tradición democrática y productiva.',
    zoom: 10
  },
  'DO-07': {
    id: 'elias-pina',
    name: 'Elías Piña',
    officialName: 'Elías Piña',
    region: 'Suroeste',
    macroRegionCode: 'suroeste',
    planRegionNum: 'VII',
    planRegionName: 'Región El Valle',
    subRegion: 'Región VII - El Valle (Ley 345-22)',
    capital: 'Comendador',
    surfaceKm2: 1395.84,
    population: 64615,
    economicShare: 3.2,
    economicActivities: ['Comercio Transfronterizo', 'Cultivo de Habichuelas, Café y Maní', 'Ganadería Menor'],
    touristAttractions: ['Puerta Binacional Comendador-Belladère', 'Cerro de San Francisco', 'Río Artibonito', 'Cueva de San Francisco'],
    description: 'Guardián fronterizo de la cordillera central, de alto valor estratégico militar y activo intercambio comercial binacional.',
    zoom: 11
  },
  'DO-08': {
    id: 'el-seibo',
    name: 'El Seibo',
    officialName: 'El Seibo (El Seybo)',
    region: 'Sureste',
    macroRegionCode: 'sureste',
    planRegionNum: 'VIII',
    planRegionName: 'Región Yuma',
    subRegion: 'Región VIII - Yuma (Ley 345-22)',
    capital: 'Santa Cruz de El Seibo',
    surfaceKm2: 1781.09,
    population: 99168,
    economicShare: 4.8,
    economicActivities: ['Ganadería Bovina (Engorde y Leche)', 'Cacao Fino de Aroma', 'Mabí Seibano Tradicional', 'Ecoturismo en Miches'],
    touristAttractions: ['Montaña Redonda (Columpios panorámicos)', 'Playa Esmeralda (Miches)', 'Basílica de la Santísima Cruz', 'Laguna Redonda y Limón'],
    description: 'Una de las provincias primigenias de la República, famosa por sus vistas de 360 grados en Montaña Redonda y sus costas vírgenes.',
    zoom: 10
  },
  'DO-09': {
    id: 'espaillat',
    name: 'Espaillat',
    officialName: 'Espaillat',
    region: 'Cibao / Norte',
    macroRegionCode: 'cibao',
    planRegionNum: 'I',
    planRegionName: 'Región Cibao Norte',
    subRegion: 'Región I - Cibao Norte (Ley 345-22)',
    capital: 'Moca',
    surfaceKm2: 838.61,
    population: 241058,
    economicShare: 9.6,
    economicActivities: ['Avicultura (Huevos y Pollos)', 'Porcicultura Tecnificada', 'Cultivo de Plátano y Yuca', 'Turismo Costero (Gaspar Hernández)'],
    touristAttractions: ['Santuario Sagrado Corazón de Jesús', 'Playa Rogelio', 'Calle 26 de Julio y Museo Ramón Cáceres', 'Ruta del Café Montefrío'],
    description: 'Capital agropecuaria de la nación y cuna de destacados héroes republicanos, une la sierra productiva con el Océano Atlántico.',
    zoom: 11
  },
  'DO-10': {
    id: 'independencia',
    name: 'Independencia',
    officialName: 'Independencia',
    region: 'Suroeste',
    macroRegionCode: 'suroeste',
    planRegionNum: 'VI',
    planRegionName: 'Región Enriquillo',
    subRegion: 'Región VI - Enriquillo (Ley 345-22)',
    capital: 'Jimaní',
    surfaceKm2: 1952.25,
    population: 58951,
    economicShare: 3.1,
    economicActivities: ['Comercio Fronterizo Internacional', 'Agricultura en Valles', 'Pesca Continental'],
    touristAttractions: ['Parque Nacional Isla Cabritos', 'Lago Enriquillo (Cocodrilos e Iguanas)', 'Las Caritas de los Indios', 'Balneario Boca de Cachón'],
    description: 'Frontera suroeste que alberga la mayor masa del Lago Enriquillo, el punto más bajo sobre el nivel del mar en todo el Caribe.',
    zoom: 10
  },
  'DO-11': {
    id: 'la-altagracia',
    name: 'La Altagracia',
    officialName: 'La Altagracia',
    region: 'Sureste',
    macroRegionCode: 'sureste',
    planRegionNum: 'VIII',
    planRegionName: 'Región Yuma',
    subRegion: 'Región VIII - Yuma (Ley 345-22)',
    capital: 'Salvaleón de Higüey',
    surfaceKm2: 2995.70,
    population: 446060,
    economicShare: 28.4,
    economicActivities: ['Turismo Internacional de Sol y Playa', 'Hotelería y Golf', 'Ganadería Bovina', 'Transporte Aéreo'],
    touristAttractions: ['Punta Cana y Playa Bávaro', 'Basílica Catedral de Nuestra Señora de la Altagracia', 'Isla Saona', 'Parque Nacional Cotubanamá', 'Hoyo Azul'],
    description: 'Motor turístico insignia del Caribe y principal polo receptor de turistas y divisas, además de centro espiritual mariano del país.',
    zoom: 10
  },
  'DO-12': {
    id: 'la-romana',
    name: 'La Romana',
    officialName: 'La Romana',
    region: 'Sureste',
    macroRegionCode: 'sureste',
    planRegionNum: 'VIII',
    planRegionName: 'Región Yuma',
    subRegion: 'Región VIII - Yuma (Ley 345-22)',
    capital: 'La Romana',
    surfaceKm2: 650.48,
    population: 287915,
    economicShare: 16.5,
    economicActivities: ['Industria Azucarera (Central Romana)', 'Turismo de Élite y Golf', 'Zonas Francas Industriales', 'Puerto de Cruceros'],
    touristAttractions: ['Altos de Chavón (Villa de artistas del siglo XVI)', 'Casa de Campo Resort', 'Isla Catalina', 'Cueva de las Maravillas'],
    description: 'Pujante enclave agroindustrial del azúcar convertido en icono global del turismo de lujo, diseño mediterráneo y golf.',
    zoom: 11
  },
  'DO-13': {
    id: 'la-vega',
    name: 'La Vega',
    officialName: 'La Vega',
    region: 'Cibao / Norte',
    macroRegionCode: 'cibao',
    planRegionNum: 'II',
    planRegionName: 'Región Cibao Sur',
    subRegion: 'Región II - Cibao Sur (Ley 345-22)',
    capital: 'Concepción de La Vega',
    surfaceKm2: 2292.41,
    population: 442720,
    economicShare: 14.8,
    economicActivities: ['Agricultura de Clima Templado (Constanza)', 'Ecoturismo de Aventura (Jarabacoa)', 'Agroindustria', 'Comercio'],
    touristAttractions: ['Valle de Constanza y Valle Nuevo (Pirámide)', 'Jarabacoa (Ciudad de la Eterna Primavera)', 'Saltos de Jimenoa y Baiguate', 'Carnaval Vegano'],
    description: 'Corazón montañoso y ecológico de la isla, poseedora de los picos más elevados de las Antillas y el carnaval más celebrado del país.',
    zoom: 10
  },
  'DO-14': {
    id: 'maria-trinidad-sanchez',
    name: 'María Trinidad Sánchez',
    officialName: 'María Trinidad Sánchez',
    region: 'Cibao / Norte',
    macroRegionCode: 'cibao',
    planRegionNum: 'III',
    planRegionName: 'Región Cibao Nordeste',
    subRegion: 'Región III - Cibao Nordeste (Ley 345-22)',
    capital: 'Nagua',
    surfaceKm2: 1204.18,
    population: 156633,
    economicShare: 5.4,
    economicActivities: ['Cultivo de Arroz y Coco', 'Pesca Marina', 'Ganadería Lechera', 'Servicios Turísticos de Playa'],
    touristAttractions: ['Playa Diamante y Playa Grande', 'Laguna Dudú (Cenotes kársticos)', 'Cabo Francés Viejo', 'Poza de Bojolo'],
    description: 'Franja litoral atlántica de cocotales infinitos, cenotes de agua dulce esmeralda y extensos arrozales regados por ríos caudalosos.',
    zoom: 10
  },
  'DO-15': {
    id: 'monte-cristi',
    name: 'Monte Cristi',
    officialName: 'Monte Cristi',
    region: 'Cibao / Norte',
    macroRegionCode: 'cibao',
    planRegionNum: 'IV',
    planRegionName: 'Región Cibao Noroeste',
    subRegion: 'Región IV - Cibao Noroeste (Ley 345-22)',
    capital: 'San Fernando de Monte Cristi',
    surfaceKm2: 1875.09,
    population: 123519,
    economicShare: 5.8,
    economicActivities: ['Producción de Sal Marina', 'Banano Orgánico de Exportación', 'Pesca y Comercio Portuario'],
    touristAttractions: ['Parque Nacional El Morro', 'Cayo Siete Hermanos', 'Reloj Público de Eiffel', 'Casa Museo Máximo Gómez y José Martí'],
    description: 'Centinela del extremo noroeste dominicano con su imponente meseta El Morro, manglares prístinos y el mayor arrecife coralino insular.',
    zoom: 10
  },
  'DO-16': {
    id: 'pedernales',
    name: 'Pedernales',
    officialName: 'Pedernales',
    region: 'Suroeste',
    macroRegionCode: 'suroeste',
    planRegionNum: 'VI',
    planRegionName: 'Región Enriquillo',
    subRegion: 'Región VI - Enriquillo (Ley 345-22)',
    capital: 'Pedernales',
    surfaceKm2: 1954.11,
    population: 34375,
    economicShare: 2.8,
    economicActivities: ['Turismo Sostenible de Alta Gama (Cabo Rojo)', 'Minería de Bauxita y Caliza', 'Pesca Artesanal', 'Comercio Fronterizo'],
    touristAttractions: ['Bahía de las Águilas (Aguas Cristalinas)', 'Parque Nacional Jaragua', 'Hoyo de Pelempito (Sierra de Bahoruco)', 'Laguna de Oviedo', 'Isla Beata'],
    description: 'Paraíso ecológico virgen de la República Dominicana, hogar de Bahía de las Águilas y una asombrosa reserva de biosfera.',
    zoom: 10
  },
  'DO-17': {
    id: 'peravia',
    name: 'Peravia',
    officialName: 'Peravia',
    region: 'Suroeste',
    macroRegionCode: 'suroeste',
    planRegionNum: 'V',
    planRegionName: 'Región Valdesia',
    subRegion: 'Región V - Valdesia (Ley 345-22)',
    capital: 'Baní',
    surfaceKm2: 785.27,
    population: 209372,
    economicShare: 16.4,
    economicActivities: ['Capital del Mango Dominicano', 'Dulces Típicos Tradicionales', 'Salinas Marinas Históricas', 'Zonas Francas'],
    touristAttractions: ['Monumento Natural Dunas de Baní', 'Bahía de las Calderas y Salinas de Puerto Hermoso', 'Playa Salinas', 'Museo Generalísimo Máximo Gómez'],
    description: 'Tierra del mango y de los dulces criollos, famosa por sus formaciones dunares caribeñas únicas en Las Calderas.',
    zoom: 11
  },
  'DO-18': {
    id: 'puerto-plata',
    name: 'Puerto Plata',
    officialName: 'Puerto Plata',
    region: 'Cibao / Norte',
    macroRegionCode: 'cibao',
    planRegionNum: 'I',
    planRegionName: 'Región Cibao Norte',
    subRegion: 'Región I - Cibao Norte (Ley 345-22)',
    capital: 'San Felipe de Puerto Plata',
    surfaceKm2: 1791.57,
    population: 338354,
    economicShare: 13.5,
    economicActivities: ['Turismo de Cruceros y Resorts', 'Deportes Acuáticos de Viento (Cabarete)', 'Ganadería Lechera', 'Comercio Portuario'],
    touristAttractions: ['Teleférico de la Loma Isabel de Torres', '27 Charcos de Damajagua', 'Fortaleza Colonial San Felipe', 'Cabarete', 'Cayo Arena'],
    description: 'La histórica Novia del Atlántico, pionera del turismo dominicano con arquitectura victoriana, cruceros internacionales y playas doradas.',
    zoom: 10
  },
  'DO-19': {
    id: 'hermanas-mirabal',
    name: 'Hermanas Mirabal',
    officialName: 'Hermanas Mirabal (Salcedo)',
    region: 'Cibao / Norte',
    macroRegionCode: 'cibao',
    planRegionNum: 'III',
    planRegionName: 'Región Cibao Nordeste',
    subRegion: 'Región III - Cibao Nordeste (Ley 345-22)',
    capital: 'Salcedo',
    surfaceKm2: 426.05,
    population: 96442,
    economicShare: 3.9,
    economicActivities: ['Cultivo de Plátano, Cacao y Café', 'Porcicultura', 'Artesanía y Turismo Histórico-Cultural'],
    touristAttractions: ['Casa Museo Hermanas Mirabal (Patria, Minerva y María Teresa)', 'Ruta de los Murales de Salcedo', 'Reserva Científica La Salcedoa', 'Ecoparque de la Paz'],
    description: 'Suelo inmortal de las heroínas hermanas Mirabal (Las Mariposas), faro de libertad y civismo para toda América.',
    zoom: 11
  },
  'DO-20': {
    id: 'samana',
    name: 'Samaná',
    officialName: 'Samaná',
    region: 'Cibao / Norte',
    macroRegionCode: 'cibao',
    planRegionNum: 'III',
    planRegionName: 'Región Cibao Nordeste',
    subRegion: 'Región III - Cibao Nordeste (Ley 345-22)',
    capital: 'Santa Bárbara de Samaná',
    surfaceKm2: 841.81,
    population: 114490,
    economicShare: 4.6,
    economicActivities: ['Ecoturismo Internacional y Avistamiento de Cetáceos', 'Pesca Artesanal', 'Cultivo de Coco y Frutales'],
    touristAttractions: ['Santuario de Ballenas Jorobadas', 'Cascada El Limón', 'Las Terrenas y Playa Cosón', 'Cayo Levantado (Isla Bacardí)', 'Parque Nacional Los Haitises'],
    description: 'Península paradisíaca bendecida con playas vírgenes, densos cocotales y el santuario de las ballenas jorobadas en su bahía.',
    zoom: 10
  },
  'DO-21': {
    id: 'san-cristobal',
    name: 'San Cristóbal',
    officialName: 'San Cristóbal',
    region: 'Sureste',
    macroRegionCode: 'sureste',
    planRegionNum: 'V',
    planRegionName: 'Región Valdesia',
    subRegion: 'Región V - Valdesia (Ley 345-22)',
    capital: 'San Cristóbal',
    surfaceKm2: 1240.58,
    population: 688828,
    economicShare: 18.5,
    economicActivities: ['Industria Manufacturera y Zonas Francas', 'Comercio Portuario (Río Haina)', 'Generación Hidroeléctrica', 'Agropecuaria'],
    touristAttractions: ['Cuevas del Pomier (Capital Rupestre del Caribe)', 'Presas de Valdesia y Jigüey', 'Playa Palenque y Najayo', 'Casa de Caoba'],
    description: 'Cuna de la Constitución dominicana, puerta hacia el Sur profundo y hogar del mayor complejo portuario comercial en el Río Haina.',
    zoom: 11
  },
  'DO-22': {
    id: 'san-juan',
    name: 'San Juan',
    officialName: 'San Juan',
    region: 'Suroeste',
    macroRegionCode: 'suroeste',
    planRegionNum: 'VII',
    planRegionName: 'Región El Valle',
    subRegion: 'Región VII - El Valle (Ley 345-22)',
    capital: 'San Juan de la Maguana',
    surfaceKm2: 3356.66,
    population: 244668,
    economicShare: 15.8,
    economicActivities: ['Agricultura (El Granero del Sur - Habichuelas, Arroz, Maíz)', 'Ganadería Bovina', 'Comercio Regional'],
    touristAttractions: ['Plaza Ceremonial Indígena (Corral de los Indios)', 'Parque Nacional José del Carmen Ramírez (Pico Duarte sur)', 'Catedral San Juan Bautista'],
    description: 'El valle agrícola más extenso de la cordillera central, de inestimable valor arqueológico taíno y granero alimentario de la nación.',
    zoom: 10
  },
  'DO-23': {
    id: 'san-pedro-de-macoris',
    name: 'San Pedro de Macorís',
    officialName: 'San Pedro de Macorís',
    region: 'Sureste',
    macroRegionCode: 'sureste',
    planRegionNum: 'IX',
    planRegionName: 'Región Higuamo',
    subRegion: 'Región IX - Higuamo (Ley 345-22)',
    capital: 'San Pedro de Macorís',
    surfaceKm2: 1256.51,
    population: 337145,
    economicShare: 14.2,
    economicActivities: ['Industria Azucarera y Generación Eléctrica', 'Zonas Francas Industriales', 'Cuna de Peloteros de Grandes Ligas', 'Comercio Portuario'],
    touristAttractions: ['Playa Juan Dolio y Guayacanes', 'Centro Histórico Neoclásico', 'Río Higuamo', 'Malecón de San Pedro', 'Cueva de las Maravillas (frontera)'],
    description: 'Cuna de poetas y legendarios bateadores de Grandes Ligas, histórica capital azucarera con exquisita herencia arquitectónica de los cocolos.',
    zoom: 11
  },
  'DO-24': {
    id: 'sanchez-ramirez',
    name: 'Sánchez Ramírez',
    officialName: 'Sánchez Ramírez',
    region: 'Cibao / Norte',
    macroRegionCode: 'cibao',
    planRegionNum: 'II',
    planRegionName: 'Región Cibao Sur',
    subRegion: 'Región II - Cibao Sur (Ley 345-22)',
    capital: 'Cotuí',
    surfaceKm2: 1176.76,
    population: 162642,
    economicShare: 6.9,
    economicActivities: ['Minería Aurífera y Argentífera (Pueblo Viejo)', 'Cultivo de Arroz y Piña', 'Pesca en Embalses'],
    touristAttractions: ['Presa de Hatillo (Mayor embalse de agua dulce de las Antillas)', 'Guácaras Taínas de Comedero', 'Sierra Prieta', 'Parque Central de Cotuí'],
    description: 'Capital minera del oro en República Dominicana, dueña del majestuoso embalse de la Presa de Hatillo y rica tradición orfebre.',
    zoom: 11
  },
  'DO-25': {
    id: 'santiago',
    name: 'Santiago',
    officialName: 'Santiago',
    region: 'Cibao / Norte',
    macroRegionCode: 'cibao',
    planRegionNum: 'I',
    planRegionName: 'Región Cibao Norte',
    subRegion: 'Región I - Cibao Norte (Ley 345-22)',
    capital: 'Santiago de los Caballeros',
    surfaceKm2: 2810.15,
    population: 1074684,
    economicShare: 38.2,
    economicActivities: ['Zonas Francas Textiles y de Dispositivos Médicos', 'Puros y Tabaco Premium Artesanal', 'Servicios Médicos y Universitarios', 'Comercio'],
    touristAttractions: ['Monumento a los Héroes de la Restauración', 'Centro Cultural Eduardo León Jimenes', 'Catedral Santiago Apóstol', 'Camp David', 'Fábricas de Cigarros'],
    description: 'Segunda metrópoli del país y capital económica del Cibao, reconocida internacionalmente como la capital mundial de los cigarros artesanales.',
    zoom: 10
  },
  'DO-26': {
    id: 'santiago-rodriguez',
    name: 'Santiago Rodríguez',
    officialName: 'Santiago Rodríguez',
    region: 'Cibao / Norte',
    macroRegionCode: 'cibao',
    planRegionNum: 'IV',
    planRegionName: 'Región Cibao Noroeste',
    subRegion: 'Región IV - Cibao Noroeste (Ley 345-22)',
    capital: 'San Ignacio de Sabaneta',
    surfaceKm2: 1150.59,
    population: 64635,
    economicShare: 2.8,
    economicActivities: ['Capital del Casabe Taíno Tradicional', 'Ganadería Lechera y de Quesos', 'Producción de Tabaco y Madera'],
    touristAttractions: ['Monumento Histórico de la Restauración', 'Fábricas de Casabe de Sabaneta', 'Presa de Monción', 'Parque Nacional Nalga de Maco'],
    description: 'Cuna de la gesta de la Restauración de 1863 y baluarte cultural del casabe de yuca y los quesos criollos artesanales.',
    zoom: 11
  },
  'DO-27': {
    id: 'valverde',
    name: 'Valverde',
    officialName: 'Valverde',
    region: 'Cibao / Norte',
    macroRegionCode: 'cibao',
    planRegionNum: 'IV',
    planRegionName: 'Región Cibao Noroeste',
    subRegion: 'Región IV - Cibao Noroeste (Ley 345-22)',
    capital: 'Mao',
    surfaceKm2: 818.46,
    population: 177857,
    economicShare: 6.4,
    economicActivities: ['Cultivo de Banano Orgánico de Exportación', 'Producción Arrocera de Riego', 'Comercio Agrícola e Industria'],
    touristAttractions: ['Balneario Poza de Boquerón', 'Puente San Rafael sobre el Río Yaque del Norte', 'Parque Central Amado Franco Bidó', 'Ruta del Banano'],
    description: 'Mao La Ciudad de los Bellos Atardeceres, centro de la tecnología de regadío arrocero y bananero más eficiente de la Línea Noroeste.',
    zoom: 11
  },
  'DO-28': {
    id: 'monsenor-nouel',
    name: 'Monseñor Nouel',
    officialName: 'Monseñor Nouel',
    region: 'Cibao / Norte',
    macroRegionCode: 'cibao',
    planRegionNum: 'II',
    planRegionName: 'Región Cibao Sur',
    subRegion: 'Región II - Cibao Sur (Ley 345-22)',
    capital: 'Bonao',
    surfaceKm2: 1020.35,
    population: 174520,
    economicShare: 7.2,
    economicActivities: ['Minería de Ferro-Níquel', 'Cultivo de Arroz y Cacao', 'Ecoturismo Fluvial de Montaña', 'Comercio de Paso'],
    touristAttractions: ['Saltos de Jima', 'Museo y Casa de Arte Cándido Bidó', 'Balnearios del Río Fula', 'Parque Nacional Loma la Humeadora'],
    description: 'Bonao Villa de las Hortensias, paso obligado entre el Norte y el Sur, célebre por sus cristalinos ríos y la obra plástica de Cándido Bidó.',
    zoom: 11
  },
  'DO-29': {
    id: 'monte-plata',
    name: 'Monte Plata',
    officialName: 'Monte Plata',
    region: 'Sureste',
    macroRegionCode: 'sureste',
    planRegionNum: 'IX',
    planRegionName: 'Región Higuamo',
    subRegion: 'Región IX - Higuamo (Ley 345-22)',
    capital: 'Monte Plata',
    surfaceKm2: 2619.38,
    population: 205499,
    economicShare: 6.5,
    economicActivities: ['Provincia Esmeralda (Ganadería Vacuna)', 'Cultivo de Piña MD2 de Exportación', 'Palma Aceitera y Cacao', 'Ecoturismo Fluvial'],
    touristAttractions: ['Salto de Socoa', 'Balnearios Río Comate', 'Iglesia Histórica San Antonio de Padua en Bayaguana', 'Parque Nacional Los Haitises (Sur)'],
    description: 'Llamada la Provincia Esmeralda por su verdor constante, cascadas cristalinas y extensas plantaciones de piñas doradas.',
    zoom: 10
  },
  'DO-30': {
    id: 'hato-mayor',
    name: 'Hato Mayor',
    officialName: 'Hato Mayor',
    region: 'Sureste',
    macroRegionCode: 'sureste',
    planRegionNum: 'IX',
    planRegionName: 'Región Higuamo',
    subRegion: 'Región IX - Higuamo (Ley 345-22)',
    capital: 'Hato Mayor del Rey',
    surfaceKm2: 1276.81,
    population: 90017,
    economicShare: 4.2,
    economicActivities: ['Ganadería Bovina y Equina', 'Cultivo de Cítricos (Naranjas Dulces)', 'Cacao Orgánico', 'Ecoturismo y Espeleología'],
    touristAttractions: ['Cueva Fun Fun (Mayor caverna del Caribe)', 'Parque Nacional Los Haitises', 'Sabana de la Mar y Bahía San Lorenzo', 'Rancho Capote'],
    description: 'Primera provincia declarada ecoturística del Este, con inmensas cavernas subterráneas milenarias y colinas ondulantes de cítricos.',
    zoom: 10
  },
  'DO-31': {
    id: 'san-jose-de-ocoa',
    name: 'San José de Ocoa',
    officialName: 'San José de Ocoa',
    region: 'Suroeste',
    macroRegionCode: 'suroeste',
    planRegionNum: 'V',
    planRegionName: 'Región Valdesia',
    subRegion: 'Región V - Valdesia (Ley 345-22)',
    capital: 'San José de Ocoa',
    surfaceKm2: 840.83,
    population: 69081,
    economicShare: 5.2,
    economicActivities: ['Agricultura en Invernaderos de Alta Precisión', 'Aguacates Hass de Exportación', 'Café de Sombra', 'Ecoturismo de Altura'],
    touristAttractions: ['Ruta del Café de Ocoa', 'Parque Libertad y Glorieta Central', 'Tatón (La Suiza del Caribe)', 'Río Nizao'],
    description: 'Líder nacional en agricultura en ambiente protegido bajo invernaderos, un oasis apacible entre montañas y valles con neblina.',
    zoom: 11
  },
  'DO-32': {
    id: 'santo-domingo',
    name: 'Santo Domingo',
    officialName: 'Santo Domingo',
    region: 'Sureste',
    macroRegionCode: 'sureste',
    planRegionNum: 'X',
    planRegionName: 'Región Ozama',
    subRegion: 'Región X - Ozama (Ley 345-22)',
    capital: 'Santo Domingo Este',
    surfaceKm2: 1298.31,
    population: 2769589,
    economicShare: 36.8,
    economicActivities: ['Industria Manufacturera y Zonas Francas', 'Megapuerto Multimodal Caucedo', 'Comercio Metropolitano', 'Agroindustria'],
    touristAttractions: ['Parque Nacional Los Tres Ojos (Cenotes subterráneos)', 'Faro a Colón', 'Acuario Nacional', 'Playa Boca Chica', 'Parque Mirador del Este'],
    description: 'La provincia más poblada del país, que rodea al Distrito Nacional e integra importantes núcleos industriales, logísticos portuarios y residenciales.',
    zoom: 11
  }
};

// Build high-precision PROVINCES array and GEOJSON
const provincesList = [];
const geoFeatures = [];

rawGeo.features.forEach(f => {
  const iso = f.properties.ISO;
  const meta = PROVINCE_INFO[iso];
  if (!meta) {
    console.error('Unknown ISO:', iso);
    return;
  }

  const centroid = getCentroid(f.geometry);

  const provinceObj = {
    ...meta,
    isoCode: iso,
    center: centroid,
    geometry: f.geometry
  };

  provincesList.push(provinceObj);

  geoFeatures.push({
    type: 'Feature',
    id: meta.id,
    properties: {
      id: meta.id,
      iso: iso,
      name: meta.name,
      officialName: meta.officialName,
      region: meta.region,
      macroRegionCode: meta.macroRegionCode,
      planRegionNum: meta.planRegionNum,
      planRegionName: meta.planRegionName,
      subRegion: meta.subRegion,
      capital: meta.capital,
      surfaceKm2: meta.surfaceKm2,
      population: meta.population,
      economicShare: meta.economicShare,
      economicActivities: meta.economicActivities,
      touristAttractions: meta.touristAttractions,
      description: meta.description,
      centerLat: centroid.lat,
      centerLng: centroid.lng,
      zoom: meta.zoom
    },
    geometry: f.geometry
  });
});

provincesList.sort((a, b) => a.name.localeCompare(b.name, 'es'));

const tsContent = `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DATOS GEOESPACIALES Y POLÍTICOS OFICIALES DE LA REPÚBLICA DOMINICANA (2023)
 * Basado en la Ley 345-22 (Regiones Únicas de Planificación)
 * Fuente Cartográfica y Demográfica: Instituto Geográfico Nacional (IGN) / Oficina Nacional de Estadística (ONE - X Censo)
 */

export interface ProvinceData {
  id: string;
  isoCode: string;
  name: string;
  officialName: string;
  region: 'Cibao / Norte' | 'Suroeste' | 'Sureste';
  macroRegionCode: 'cibao' | 'suroeste' | 'sureste';
  planRegionNum: string;
  planRegionName: string;
  subRegion: string;
  capital: string;
  surfaceKm2: number;
  population: number;
  economicShare: number;
  economicActivities: string[];
  touristAttractions: string[];
  description: string;
  center: { lat: number; lng: number };
  zoom: number;
  geometry: any;
}

export const DOMINICAN_PROVINCES: ProvinceData[] = ${JSON.stringify(provincesList, null, 2)};

export const DOMINICAN_GEOJSON = {
  type: "FeatureCollection",
  features: ${JSON.stringify(geoFeatures)}
};
`;

fs.writeFileSync('src/data/dominicanProvinces.ts', tsContent);
console.log('Successfully updated src/data/dominicanProvinces.ts with population and economic stats!');

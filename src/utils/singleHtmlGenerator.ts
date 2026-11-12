/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DOMINICAN_PROVINCES, DOMINICAN_GEOJSON } from '../data/dominicanProvinces.ts';

export function generateSingleFileHtml(customApiKey: string = "YOUR_API_KEY"): string {
  const jsonProvinces = JSON.stringify(DOMINICAN_PROVINCES, null, 2);
  const jsonGeojson = JSON.stringify(DOMINICAN_GEOJSON);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mapa Político de la República Dominicana - Google Maps API</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <style>
    /* ==========================================================================
       ESTILOS CSS MODERNOS PARA EL MAPA POLÍTICO DE LA REPÚBLICA DOMINICANA
       ========================================================================== */
    :root {
      --bg-dark: #0f172a;
      --bg-surface: rgba(15, 23, 42, 0.88);
      --border-subtle: rgba(255, 255, 255, 0.12);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --cibao-color: #0ea5e9;
      --suroeste-color: #10b981;
      --sureste-color: #f59e0b;
      --accent-color: #38bdf8;
      --radius-lg: 16px;
      --radius-md: 10px;
      --shadow-xl: 0 20px 30px -10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 0, 0, 0.4);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body, html {
      width: 100%;
      height: 100%;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background-color: var(--bg-dark);
      color: var(--text-main);
      -webkit-font-smoothing: antialiased;
    }

    /* Contenedor principal del mapa de Google */
    #map {
      width: 100%;
      height: 100vh;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }

    /* Barra Superior Flotante */
    .top-nav {
      position: absolute;
      top: 16px;
      left: 16px;
      right: 16px;
      max-width: 1200px;
      margin: 0 auto;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 10px 18px;
      background: var(--bg-surface);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 1.05rem;
      color: #fff;
      letter-spacing: -0.02em;
      white-space: nowrap;
    }

    .brand-flag {
      display: inline-block;
      width: 22px;
      height: 15px;
      border-radius: 3px;
      box-shadow: 0 0 4px rgba(0,0,0,0.3);
      vertical-align: middle;
    }

    /* Pestañas de Filtro por Región */
    .region-filters {
      display: flex;
      gap: 6px;
      background: rgba(0, 0, 0, 0.3);
      padding: 4px;
      border-radius: var(--radius-md);
      overflow-x: auto;
    }

    .filter-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 6px 12px;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .filter-btn:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
    }

    .filter-btn.active {
      color: #fff;
      background: rgba(255, 255, 255, 0.16);
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .filter-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }
    .filter-dot.cibao { background-color: var(--cibao-color); }
    .filter-dot.suroeste { background-color: var(--suroeste-color); }
    .filter-dot.sureste { background-color: var(--sureste-color); }

    /* Buscador Rápido */
    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-input {
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      color: #fff;
      padding: 6px 12px 6px 32px;
      font-size: 0.85rem;
      outline: none;
      width: 190px;
      transition: all 0.2s ease;
    }

    .search-input:focus {
      border-color: var(--accent-color);
      background: rgba(255, 255, 255, 0.12);
      width: 230px;
    }

    .search-icon {
      position: absolute;
      left: 10px;
      color: var(--text-muted);
      pointer-events: none;
      font-size: 0.85rem;
    }

    /* Selector de Tipo de Mapa Flotante */
    .map-type-bar {
      position: absolute;
      top: 86px;
      left: 16px;
      z-index: 10;
      display: flex;
      gap: 4px;
      background: var(--bg-surface);
      backdrop-filter: blur(16px);
      padding: 4px;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-xl);
    }

    .type-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 6px 12px;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .type-btn:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
    }

    .type-btn.active {
      color: #fff;
      background: #0284c7;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }

    /* Tooltip Flotante del Cursor */
    #province-tooltip {
      position: absolute;
      z-index: 20;
      pointer-events: none;
      display: none;
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 8px 14px;
      border-radius: 8px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.6);
      backdrop-filter: blur(8px);
      transform: translate(-50%, -130%);
      transition: opacity 0.1s ease;
      text-align: center;
      min-width: 140px;
    }

    #province-tooltip .tt-name {
      font-weight: 700;
      font-size: 0.95rem;
      color: #fff;
      font-family: 'Outfit', sans-serif;
    }

    #province-tooltip .tt-region {
      font-size: 0.72rem;
      color: var(--text-muted);
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Panel Flotante de Información Lateral */
    .info-panel {
      position: absolute;
      top: 86px;
      right: 20px;
      width: 380px;
      max-height: calc(100vh - 110px);
      background: var(--bg-surface);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      z-index: 10;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: translateX(0);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
    }

    .info-panel.hidden {
      transform: translateX(420px);
      opacity: 0;
      pointer-events: none;
    }

    .panel-header {
      padding: 18px 20px 14px 20px;
      border-bottom: 1px solid var(--border-subtle);
      position: relative;
    }

    .panel-close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      background: rgba(255, 255, 255, 0.08);
      border: none;
      color: var(--text-muted);
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .panel-close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
    }

    .badge-region {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }

    .badge-region.cibao { color: var(--cibao-color); }
    .badge-region.suroeste { color: var(--suroeste-color); }
    .badge-region.sureste { color: var(--sureste-color); }

    .province-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      line-height: 1.2;
    }

    .province-capital-subtitle {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .panel-body {
      padding: 18px 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .info-section-title {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .tag-item {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.78rem;
      color: #e2e8f0;
    }

    .attraction-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 0.82rem;
      color: #cbd5e1;
      padding: 4px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }
    .attraction-item:last-child {
      border-bottom: none;
    }
    .attraction-icon {
      color: #38bdf8;
      margin-top: 2px;
      flex-shrink: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .stat-card {
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: var(--radius-md);
      padding: 10px 12px;
    }

    .stat-label {
      font-size: 0.7rem;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    .stat-value {
      font-family: 'Outfit', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
      color: #fff;
      margin-top: 2px;
    }

    /* Leyenda de Mapa Inferior Izquierda */
    .map-legend {
      position: absolute;
      bottom: 24px;
      left: 20px;
      background: var(--bg-surface);
      backdrop-filter: blur(16px);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 10px 16px;
      z-index: 10;
      box-shadow: var(--shadow-xl);
    }

    .legend-title {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
      margin-bottom: 6px;
    }

    .legend-items {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .legend-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.75rem;
      color: #e2e8f0;
    }

    .legend-box {
      width: 14px;
      height: 14px;
      border-radius: 3px;
    }

    /* Estado de Error de Clave API */
    #api-key-banner {
      display: none;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(15, 23, 42, 0.96);
      border: 1px solid rgba(239, 68, 68, 0.4);
      border-radius: var(--radius-lg);
      padding: 28px;
      max-width: 480px;
      text-align: center;
      z-index: 99;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
    }

    .banner-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      color: #f87171;
      margin-bottom: 10px;
    }

    .banner-text {
      font-size: 0.88rem;
      color: #cbd5e1;
      line-height: 1.5;
      margin-bottom: 16px;
    }

    .key-input-group {
      display: flex;
      gap: 8px;
    }

    .key-input {
      flex: 1;
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(0, 0, 0, 0.4);
      color: #fff;
      font-size: 0.85rem;
    }

    .key-btn {
      background: #0284c7;
      border: none;
      color: #fff;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .top-nav {
        flex-direction: column;
        align-items: stretch;
      }
      .map-type-bar {
        top: auto;
        bottom: 70px;
        left: 10px;
        right: 10px;
        justify-content: center;
      }
      .info-panel {
        top: auto;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        max-height: 60vh;
        border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      }
      .map-legend {
        display: none;
      }
    }
  </style>
</head>
<body>

  <!-- Contenedor del Mapa Google Maps -->
  <div id="map"></div>

  <!-- Barra Superior de Navegación y Filtros -->
  <header class="top-nav">
    <div class="brand">
      <svg class="brand-flag" viewBox="0 0 640 480">
        <path fill="#002f6c" d="M0 0h640v480H0z"/>
        <path fill="#ce1126" d="M360 0h280v200H360zM0 280h280v200H0z"/>
        <path fill="#fff" d="M280 0h80v480h-80zM0 200h640v80H0z"/>
      </svg>
      <span>República Dominicana · Mapa Político (IGN 2023)</span>
    </div>

    <!-- Filtros por Región Macroeconómica -->
    <div class="region-filters">
      <button class="filter-btn active" data-region="all">
        <span>Todas (32)</span>
      </button>
      <button class="filter-btn" data-region="cibao">
        <span class="filter-dot cibao"></span>
        <span>Cibao / Norte (14)</span>
      </button>
      <button class="filter-btn" data-region="suroeste">
        <span class="filter-dot suroeste"></span>
        <span>Suroeste (10)</span>
      </button>
      <button class="filter-btn" data-region="sureste">
        <span class="filter-dot sureste"></span>
        <span>Sureste (8)</span>
      </button>
    </div>

    <!-- Buscador Rápido de Provincias -->
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input type="text" id="province-search" class="search-input" placeholder="Buscar provincia..." autocomplete="off">
    </div>
  </header>

  <!-- Botones para Cambiar el Tipo de Mapa -->
  <div class="map-type-bar">
    <button class="type-btn active" data-maptype="roadmap">🗺️ Político</button>
    <button class="type-btn" data-maptype="terrain">⛰️ Relieve</button>
    <button class="type-btn" data-maptype="satellite">🛰️ Satélite</button>
    <button class="type-btn" data-maptype="hybrid">🌐 Híbrido</button>
  </div>

  <!-- Tooltip Flotante del Cursor -->
  <div id="province-tooltip">
    <div class="tt-name" id="tt-name">Provincia</div>
    <div class="tt-region" id="tt-region">Región</div>
  </div>

  <!-- Panel Lateral Flotante de Datos Generales -->
  <aside class="info-panel hidden" id="info-panel">
    <div class="panel-header">
      <button class="panel-close-btn" id="close-panel-btn" title="Cerrar panel">✕</button>
      <div class="badge-region cibao" id="panel-badge-region">
        <span class="filter-dot cibao" id="panel-badge-dot"></span>
        <span id="panel-region-text">Región Cibao / Norte</span>
      </div>
      <h1 class="province-title" id="panel-province-name">Santiago</h1>
      <p class="province-capital-subtitle">Capital: <strong id="panel-capital-name" class="text-white">Santiago de los Caballeros</strong></p>
    </div>

    <div class="panel-body">
      <!-- Estadísticas Clave Oficiales IGN / ONE -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Superficie Oficial (IGN)</div>
          <div class="stat-value" id="panel-surface">2,810.15 km²</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Región Planificación</div>
          <div class="stat-value" id="panel-subregion" style="font-size: 0.95rem;">I. Cibao Norte</div>
        </div>
      </div>

      <!-- Resumen Descriptivo -->
      <div>
        <div class="info-section-title">Reseña Geopolítica</div>
        <p style="font-size: 0.84rem; line-height: 1.5; color: #cbd5e1;" id="panel-description">
          Descripción de la provincia...
        </p>
      </div>

      <!-- Actividades Económicas Principales -->
      <div>
        <div class="info-section-title">Actividades Económicas Clave</div>
        <div class="tags-container" id="panel-economic-tags">
          <!-- Renderizado dinámico -->
        </div>
      </div>

      <!-- Atractivos Turísticos Clave -->
      <div>
        <div class="info-section-title">Principales Atractivos Turísticos</div>
        <div id="panel-attractions-list">
          <!-- Renderizado dinámico -->
        </div>
      </div>
    </div>
  </aside>

  <!-- Leyenda de Colores del Mapa -->
  <div class="map-legend">
    <div class="legend-title">Macro-Regiones Políticas (Ley 345-22)</div>
    <div class="legend-items">
      <div class="legend-row">
        <div class="legend-box" style="background: rgba(14, 165, 233, 0.7); border: 1px solid #0284c7;"></div>
        <span>Cibao / Norte (14 provincias · Regiones I, II, III, IV)</span>
      </div>
      <div class="legend-row">
        <div class="legend-box" style="background: rgba(16, 185, 129, 0.7); border: 1px solid #059669;"></div>
        <span>Suroeste (10 provincias · Regiones V, VI, VII)</span>
      </div>
      <div class="legend-row">
        <div class="legend-box" style="background: rgba(245, 158, 11, 0.7); border: 1px solid #d97706;"></div>
        <span>Sureste (8 provincias · Regiones VIII, IX, X)</span>
      </div>
    </div>
  </div>

  <!-- Diálogo para Configuración de API Key si se prueba sin clave -->
  <div id="api-key-banner">
    <h2 class="banner-title">Configuración de Google Maps API Key</h2>
    <p class="banner-text">
      Para inicializar el mapa localmente, ingresa tu API Key de Google Maps Platform válida o reemplaza <code>YOUR_API_KEY</code> en el script.
    </p>
    <div class="key-input-group">
      <input type="text" id="manual-api-key-input" class="key-input" placeholder="AIzaSy..." />
      <button class="key-btn" id="save-key-btn">Cargar Mapa</button>
    </div>
  </div>

  <!-- ==========================================================================
       LÓGICA JAVASCRIPT: DATA LAYER, INTERACTIVIDAD Y GOOGLE MAPS API
       ========================================================================== -->
  <script>
    // DICCIONARIO COMPLETO DE LAS 32 DEMARCACIONES POLÍTICAS DE REPÚBLICA DOMINICANA (IGN 2023)
    const PROVINCIAS_RD = ${jsonProvinces};

    // CAPA GEOJSON EMBEBIDA CON TRAZOS DE ALTA RESOLUCIÓN Y DETALLE CARTOGRÁFICO
    const GEOJSON_RD = ${jsonGeojson};

    // Configuración de Paleta Cromática por Región Macroeconómica
    const COLORES_REGION = {
      cibao: {
        fill: '#0ea5e9',
        fillRgba: 'rgba(14, 165, 233, 0.38)',
        stroke: '#0284c7',
        name: 'Cibao / Norte'
      },
      suroeste: {
        fill: '#10b981',
        fillRgba: 'rgba(16, 185, 129, 0.38)',
        stroke: '#059669',
        name: 'Suroeste'
      },
      sureste: {
        fill: '#f59e0b',
        fillRgba: 'rgba(245, 158, 11, 0.38)',
        stroke: '#d97706',
        name: 'Sureste'
      }
    };

    // Variables de Estado de la Aplicación
    let mapInstance = null;
    let selectedProvinceId = null;
    let activeRegionFilter = 'all';
    let currentMapType = 'roadmap';
    const tooltipEl = document.getElementById('province-tooltip');
    const ttNameEl = document.getElementById('tt-name');
    const ttRegionEl = document.getElementById('tt-region');
    const infoPanelEl = document.getElementById('info-panel');

    // Estilo minimalista y limpio para el mapa político
    const cleanMapStyle = [
      { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
      { featureType: "poi.business", stylers: [{ visibility: "off" }] },
      { featureType: "transit", stylers: [{ visibility: "off" }] },
      { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
      { featureType: "road.local", elementType: "labels", stylers: [{ visibility: "off" }] },
      { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#334155" }, { weight: 2 }] },
      { featureType: "administrative.province", elementType: "geometry.stroke", stylers: [{ visibility: "off" }] },
      { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#091a30" }] },
      { featureType: "landscape", elementType: "geometry.fill", stylers: [{ color: "#0f172a" }] }
    ];

    /**
     * Inicializa Google Maps y configura la Capa de Datos Geoespaciales
     */
    function initMap() {
      const dominicanRepublicCenter = { lat: 18.7357, lng: -70.1627 };

      // Creación del objeto de Mapa
      mapInstance = new google.maps.Map(document.getElementById('map'), {
        center: dominicanRepublicCenter,
        zoom: 8,
        minZoom: 7,
        maxZoom: 16,
        mapTypeId: currentMapType,
        styles: cleanMapStyle,
        backgroundColor: '#091a30',
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM
        }
      });

      // Cargar los límites políticos en la capa Data Layer
      mapInstance.data.addGeoJson(GEOJSON_RD);

      // Aplicar estilos dinámicos a las entidades vectoriales de la capa
      mapInstance.data.setStyle((feature) => {
        const macroRegion = feature.getProperty('macroRegionCode');
        const provinceId = feature.getId() || feature.getProperty('id');
        const isHovered = feature.getProperty('isHovered');
        const isSelected = provinceId === selectedProvinceId;
        const regionCfg = COLORES_REGION[macroRegion] || COLORES_REGION.cibao;

        let isVisible = true;
        if (activeRegionFilter !== 'all' && macroRegion !== activeRegionFilter) {
          isVisible = false;
        }

        if (!isVisible) {
          return { visible: false };
        }

        const isSat = currentMapType === 'satellite' || currentMapType === 'hybrid';

        return {
          fillColor: regionCfg.fill,
          fillOpacity: isSelected
            ? (isSat ? 0.65 : 0.8)
            : (isHovered ? (isSat ? 0.55 : 0.7) : (isSat ? 0.25 : 0.38)),
          strokeColor: isSelected
            ? '#ffffff'
            : (isHovered ? '#ffffff' : regionCfg.stroke),
          strokeWeight: isSelected ? 3.5 : (isHovered ? 2.5 : 1.5),
          zIndex: isSelected ? 10 : (isHovered ? 5 : 1),
          cursor: 'pointer'
        };
      });

      // Eventos interactivos
      mapInstance.data.addListener('mouseover', (event) => {
        const feature = event.feature;
        feature.setProperty('isHovered', true);

        const name = feature.getProperty('name');
        const region = feature.getProperty('region');
        const plan = feature.getProperty('planRegionName');

        ttNameEl.textContent = name;
        ttRegionEl.textContent = plan ? \`\${region} · \${plan}\` : region;
        tooltipEl.style.display = 'block';
      });

      mapInstance.data.addListener('mousemove', (event) => {
        const domEvent = event.domEvent;
        if (domEvent) {
          tooltipEl.style.left = domEvent.pageX + 'px';
          tooltipEl.style.top = domEvent.pageY + 'px';
        }
      });

      mapInstance.data.addListener('mouseout', (event) => {
        event.feature.setProperty('isHovered', false);
        tooltipEl.style.display = 'none';
      });

      mapInstance.data.addListener('click', (event) => {
        const feature = event.feature;
        const provinceId = feature.getId() || feature.getProperty('id');
        selectProvince(provinceId);
      });

      setupUIControls();
    }

    /**
     * Selecciona una provincia, enfoca la cámara y actualiza el panel de datos
     */
    function selectProvince(provinceId) {
      const province = PROVINCIAS_RD.find(p => p.id === provinceId);
      if (!province) return;

      selectedProvinceId = provinceId;

      mapInstance.panTo(province.center);
      mapInstance.setZoom(Math.max(9, province.zoom));
      mapInstance.data.revertStyle();

      renderProvinceDetails(province);
    }

    /**
     * Renderiza la información detallada en el panel lateral
     */
    function renderProvinceDetails(p) {
      document.getElementById('panel-province-name').textContent = p.name;
      document.getElementById('panel-capital-name').textContent = p.capital;
      document.getElementById('panel-region-text').textContent = \`Región \${p.region}\`;
      document.getElementById('panel-subregion').textContent = p.planRegionNum ? \`\${p.planRegionNum}. \${p.planRegionName}\` : p.subRegion;
      document.getElementById('panel-surface').textContent = (p.surfaceKm2 ? p.surfaceKm2.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '') + ' km²';
      document.getElementById('panel-description').textContent = p.description;

      const badgeEl = document.getElementById('panel-badge-region');
      const dotEl = document.getElementById('panel-badge-dot');
      badgeEl.className = 'badge-region ' + p.macroRegionCode;
      dotEl.className = 'filter-dot ' + p.macroRegionCode;

      const tagsContainer = document.getElementById('panel-economic-tags');
      tagsContainer.innerHTML = '';
      p.economicActivities.forEach(act => {
        const span = document.createElement('span');
        span.className = 'tag-item';
        span.textContent = act;
        tagsContainer.appendChild(span);
      });

      const attractionsContainer = document.getElementById('panel-attractions-list');
      attractionsContainer.innerHTML = '';
      p.touristAttractions.forEach(attr => {
        const div = document.createElement('div');
        div.className = 'attraction-item';
        div.innerHTML = \`<span class="attraction-icon">★</span><span>\${attr}</span>\`;
        attractionsContainer.appendChild(div);
      });

      infoPanelEl.classList.remove('hidden');
    }

    /**
     * Configuración de los eventos de la interfaz de usuario
     */
    function setupUIControls() {
      // Botón de cerrar el panel de información
      document.getElementById('close-panel-btn').addEventListener('click', () => {
        infoPanelEl.classList.add('hidden');
        selectedProvinceId = null;
        mapInstance.data.revertStyle();
      });

      // Selector de Tipo de Mapa (Político, Relieve, Satélite, Híbrido)
      const typeButtons = document.querySelectorAll('.type-btn');
      typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          typeButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const chosenType = btn.getAttribute('data-maptype');
          currentMapType = chosenType;
          mapInstance.setMapTypeId(chosenType);

          if (chosenType === 'satellite' || chosenType === 'hybrid') {
            mapInstance.setOptions({ styles: [] });
          } else {
            mapInstance.setOptions({ styles: cleanMapStyle });
          }

          mapInstance.data.revertStyle();
        });
      });

      // Filtros por Región Macroeconómica
      const filterButtons = document.querySelectorAll('.filter-btn');
      filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          filterButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          activeRegionFilter = btn.getAttribute('data-region');
          mapInstance.data.revertStyle();

          if (activeRegionFilter === 'cibao') {
            mapInstance.panTo({ lat: 19.38, lng: -70.45 });
            mapInstance.setZoom(8);
          } else if (activeRegionFilter === 'suroeste') {
            mapInstance.panTo({ lat: 18.45, lng: -71.20 });
            mapInstance.setZoom(8);
          } else if (activeRegionFilter === 'sureste') {
            mapInstance.panTo({ lat: 18.60, lng: -69.25 });
            mapInstance.setZoom(8);
          } else {
            mapInstance.panTo({ lat: 18.7357, lng: -70.1627 });
            mapInstance.setZoom(8);
          }
        });
      });

      // Buscador rápido de provincias
      const searchInput = document.getElementById('province-search');
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) return;

        const match = PROVINCIAS_RD.find(p => 
          p.name.toLowerCase().includes(query) || 
          p.capital.toLowerCase().includes(query)
        );

        if (match && query.length >= 3) {
          selectProvince(match.id);
        }
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const query = searchInput.value.toLowerCase().trim();
          const match = PROVINCIAS_RD.find(p => 
            p.name.toLowerCase().includes(query) || 
            p.capital.toLowerCase().includes(query)
          );
          if (match) {
            selectProvince(match.id);
          }
        }
      });
    }

    /**
     * Cargador dinámico del script de Google Maps API
     */
    function loadGoogleMapsScript(apiKey) {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      window.initMap = initMap;
      const script = document.createElement('script');
      script.src = \`https://maps.googleapis.com/maps/api/js?key=\${apiKey}&callback=initMap&libraries=places&v=weekly\`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        document.getElementById('api-key-banner').style.display = 'block';
      };
      document.head.appendChild(script);
    }

    const configuredApiKey = "${customApiKey}";
    if (configuredApiKey && configuredApiKey !== "YOUR_API_KEY") {
      loadGoogleMapsScript(configuredApiKey);
    } else {
      document.getElementById('api-key-banner').style.display = 'block';
      document.getElementById('save-key-btn').addEventListener('click', () => {
        const userKey = document.getElementById('manual-api-key-input').value.trim();
        if (userKey) {
          document.getElementById('api-key-banner').style.display = 'none';
          loadGoogleMapsScript(userKey);
        }
      });
    }
  </script>
</body>
</html>`;
}

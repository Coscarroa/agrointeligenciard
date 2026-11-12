/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { DOMINICAN_GEOJSON, DOMINICAN_PROVINCES, ProvinceData } from '../data/dominicanProvinces.ts';
import { PROVINCIAL_AGRICULTURE } from '../data/provinciasData.ts';
import { KeyRound, Map as MapIcon, Globe, Layers, Sparkles } from 'lucide-react';

export type MapTypeId = 'roadmap' | 'terrain' | 'satellite' | 'hybrid';

interface MapContainerProps {
  selectedProvince: ProvinceData | null;
  onSelectProvince: (province: ProvinceData | null) => void;
  activeRegion: 'all' | 'cibao' | 'suroeste' | 'sureste';
  selectedCrop?: string;
  onMapLoaded?: () => void;
  apiKey?: string;
  mapType?: MapTypeId;
  onMapTypeChange?: (type: MapTypeId) => void;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  selectedProvince,
  onSelectProvince,
  activeRegion,
  selectedCrop = 'all',
  onMapLoaded,
  apiKey,
  mapType = 'roadmap',
  onMapTypeChange,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const cleanMapStyleRef = useRef<google.maps.MapTypeStyle[]>([]);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const frameProvinceBoundsRef = useRef<((province: ProvinceData) => void) | null>(null);

  const [localMapType, setLocalMapType] = useState<MapTypeId>(mapType);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentKey, setCurrentKey] = useState<string>(
    apiKey || (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || ''
  );
  const [customKeyInput, setCustomKeyInput] = useState('');

  // Tooltip state
  const [tooltipData, setTooltipData] = useState<{
    visible: boolean;
    name: string;
    region: string;
    planRegionName?: string;
    surfaceKm2?: number;
    cropMatches?: string[];
    x: number;
    y: number;
  }>({
    visible: false,
    name: '',
    region: '',
    x: 0,
    y: 0,
  });

  const handleTypeChange = (newType: MapTypeId) => {
    setLocalMapType(newType);
    onMapTypeChange?.(newType);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(newType);

      if (newType === 'satellite' || newType === 'hybrid') {
        mapInstanceRef.current.setOptions({ styles: [] });
      } else {
        mapInstanceRef.current.setOptions({ styles: cleanMapStyleRef.current });
      }

      mapInstanceRef.current.data.revertStyle();
    }
  };

  // 5. Conmutador Rápido Flotante (Político vs. Satélite)
  const togglePoliticalSatellite = () => {
    const nextType: MapTypeId = localMapType === 'satellite' ? 'roadmap' : 'satellite';
    handleTypeChange(nextType);
  };

  const initGoogleMap = useCallback(async (keyToUse: string) => {
    if (!mapRef.current) return;
    setLoading(true);
    setLoadError(null);

    try {
      setOptions({
        key: keyToUse,
        v: 'weekly',
        language: 'es',
        region: 'DO',
        solutionChannel: 'gmp_mcp_codeassist_v1_aistudio',
      });

      const { Map } = (await importLibrary('maps')) as google.maps.MapsLibrary;

      // Centro geográfico de la República Dominicana
      const dominicanRepublicCenter = { lat: 18.7357, lng: -70.1627 };

      // Estilo minimalista y limpio para destacar el mapa político
      const cleanMapStyle: google.maps.MapTypeStyle[] = [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
        { featureType: 'poi.medical', stylers: [{ visibility: 'off' }] },
        { featureType: 'poi.school', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
        { featureType: 'road.local', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'road.arterial', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        {
          featureType: 'administrative.country',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#002f6c' }, { weight: 2 }],
        },
        {
          featureType: 'water',
          elementType: 'geometry.fill',
          stylers: [{ color: '#08182b' }],
        },
        {
          featureType: 'landscape.natural',
          elementType: 'geometry.fill',
          stylers: [{ color: '#0f172a' }],
        },
      ];

      cleanMapStyleRef.current = cleanMapStyle;

      const map = new Map(mapRef.current, {
        center: dominicanRepublicCenter,
        zoom: 8,
        minZoom: 7,
        maxZoom: 16,
        mapTypeId: localMapType,
        styles: (localMapType === 'satellite' || localMapType === 'hybrid') ? [] : cleanMapStyle,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM,
        },
      });

      mapInstanceRef.current = map;

      // Inyectar GeoJSON oficial con alta definición en la capa Data Layer
      map.data.addGeoJson(DOMINICAN_GEOJSON as any);

      // Estilos dinámicos de las provincias según su región, cultivo filtrado y tipo de mapa
      const regionColors: Record<string, { fill: string; stroke: string }> = {
        cibao: { fill: '#0ea5e9', stroke: '#0284c7' },
        suroeste: { fill: '#10b981', stroke: '#059669' },
        sureste: { fill: '#f59e0b', stroke: '#d97706' },
      };

      map.data.setStyle((feature: google.maps.Data.Feature) => {
        const macroRegion = feature.getProperty('macroRegionCode') as string;
        const provinceId = (feature.getId() as string) || (feature.getProperty('id') as string);
        const isHovered = feature.getProperty('isHovered');
        const isSelected = selectedProvince?.id === provinceId;
        const color = regionColors[macroRegion] || regionColors.cibao;

        let visible = true;
        if (activeRegion !== 'all' && macroRegion !== activeRegion) {
          visible = false;
        }

        if (!visible) {
          return { visible: false };
        }

        const isSat = localMapType === 'satellite' || localMapType === 'hybrid';

        // 6. Lógica de resaltado por Tipo de Cultivo
        let isCropProducer = true;
        if (selectedCrop && selectedCrop !== 'all') {
          const provAgro = PROVINCIAL_AGRICULTURE[provinceId];
          isCropProducer = provAgro
            ? provAgro.predominantCrops.some((c) =>
                c.name.toLowerCase().includes(selectedCrop.toLowerCase())
              )
            : false;
        }

        // Si hay un cultivo filtrado y esta provincia NO lo produce, atenuar visualmente
        if (selectedCrop && selectedCrop !== 'all' && !isCropProducer) {
          return {
            fillColor: '#334155',
            fillOpacity: isSat ? 0.12 : 0.15,
            strokeColor: '#475569',
            strokeWeight: 0.8,
            zIndex: 0,
            cursor: 'pointer',
          };
        }

        // Si es productora del cultivo filtrado, resaltar con contorno dorado/esmeralda
        const cropHighlightStroke = selectedCrop !== 'all' && isCropProducer ? '#10b981' : color.stroke;
        const cropHighlightWeight = selectedCrop !== 'all' && isCropProducer ? 3 : 1.5;

        return {
          fillColor: color.fill,
          fillOpacity: isSelected
            ? (isSat ? 0.65 : 0.8)
            : (isHovered ? (isSat ? 0.55 : 0.7) : (isSat ? 0.28 : 0.42)),
          strokeColor: isSelected
            ? '#ffffff'
            : (isHovered ? '#ffffff' : cropHighlightStroke),
          strokeWeight: isSelected ? 3.5 : (isHovered ? 2.5 : cropHighlightWeight),
          zIndex: isSelected ? 10 : (isHovered ? 5 : (isCropProducer && selectedCrop !== 'all' ? 3 : 1)),
          cursor: 'pointer',
        };
      });

      // Función utilitaria para calcular los límites LatLngBounds de una provincia
      const frameProvinceBounds = (province: ProvinceData) => {
        if (!mapInstanceRef.current) return;
        const bounds = new google.maps.LatLngBounds();

        // Si la provincia tiene geometría GeoJSON con coordenadas
        if (province.geometry && province.geometry.coordinates) {
          const coords = province.geometry.coordinates;
          const processCoords = (arr: any[]) => {
            if (typeof arr[0] === 'number' && typeof arr[1] === 'number') {
              bounds.extend(new google.maps.LatLng(arr[1], arr[0]));
            } else {
              arr.forEach(processCoords);
            }
          };
          processCoords(coords);
        } else {
          // Fallback con radio alrededor del centroide
          const delta = 0.28;
          bounds.extend(new google.maps.LatLng(province.center.lat - delta, province.center.lng - delta));
          bounds.extend(new google.maps.LatLng(province.center.lat + delta, province.center.lng + delta));
        }

        const isDesktop = window.innerWidth >= 768;
        const padding = isDesktop
          ? { top: 195, right: 445, bottom: 40, left: 60 }
          : { top: 160, right: 30, bottom: 260, left: 30 };

        mapInstanceRef.current.fitBounds(bounds, padding);
      };

      // Guardar función en ref para acceso exterior
      frameProvinceBoundsRef.current = frameProvinceBounds;

      // Eventos interactivos de la capa de datos
      map.data.addListener('mouseover', (e: google.maps.Data.MouseEvent) => {
        e.feature.setProperty('isHovered', true);
        const name = e.feature.getProperty('name') as string;
        const region = e.feature.getProperty('region') as string;
        const planRegionName = e.feature.getProperty('planRegionName') as string;
        const surfaceKm2 = e.feature.getProperty('surfaceKm2') as number;
        const provinceId = (e.feature.getId() as string) || (e.feature.getProperty('id') as string);

        const provAgro = PROVINCIAL_AGRICULTURE[provinceId];
        const cropMatches = provAgro ? provAgro.predominantCrops.map((c) => c.name) : [];

        setTooltipData((prev) => ({
          ...prev,
          visible: true,
          name,
          region,
          planRegionName,
          surfaceKm2,
          cropMatches,
        }));
      });

      map.data.addListener('mousemove', (e: google.maps.Data.MouseEvent) => {
        const domEvent = e.domEvent as MouseEvent;
        if (domEvent) {
          setTooltipData((prev) => ({
            ...prev,
            x: domEvent.pageX,
            y: domEvent.pageY,
          }));
        }
      });

      map.data.addListener('mouseout', (e: google.maps.Data.MouseEvent) => {
        e.feature.setProperty('isHovered', false);
        setTooltipData((prev) => ({ ...prev, visible: false }));
      });

      map.data.addListener('click', (e: google.maps.Data.MouseEvent) => {
        const provinceId = (e.feature.getId() as string) || (e.feature.getProperty('id') as string);
        const found = DOMINICAN_PROVINCES.find((p) => p.id === provinceId);
        if (found) {
          onSelectProvince(found);
          frameProvinceBounds(found);
        }
      });

      setLoading(false);
      onMapLoaded?.();
    } catch (err: any) {
      console.error('Error al inicializar Google Maps:', err);
      setLoadError(err?.message || 'Error desconocido al cargar Google Maps');
      setLoading(false);
    }
  }, [activeRegion, selectedProvince, onSelectProvince, onMapLoaded, localMapType, selectedCrop]);

  // Actualizar estilos y cámara cuando cambie selectedProvince
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.data.revertStyle();
      if (selectedProvince && frameProvinceBoundsRef.current) {
        frameProvinceBoundsRef.current(selectedProvince);
      }
    }
  }, [selectedProvince]);

  // Actualizar estilos cuando cambie el filtro de cultivos o la región
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.data.revertStyle();
    }
  }, [selectedCrop, activeRegion]);

  // Actualizar cámara cuando cambie el filtro regional
  useEffect(() => {
    if (mapInstanceRef.current) {
      if (activeRegion === 'cibao') {
        mapInstanceRef.current.panTo({ lat: 19.38, lng: -70.45 });
        mapInstanceRef.current.setZoom(8);
      } else if (activeRegion === 'suroeste') {
        mapInstanceRef.current.panTo({ lat: 18.45, lng: -71.20 });
        mapInstanceRef.current.setZoom(8);
      } else if (activeRegion === 'sureste') {
        mapInstanceRef.current.panTo({ lat: 18.60, lng: -69.25 });
        mapInstanceRef.current.setZoom(8);
      } else {
        mapInstanceRef.current.panTo({ lat: 18.7357, lng: -70.1627 });
        mapInstanceRef.current.setZoom(8);
      }
    }
  }, [activeRegion]);

  // Montaje inicial del mapa
  useEffect(() => {
    if (currentKey) {
      initGoogleMap(currentKey);
    } else {
      setLoading(false);
    }
  }, [currentKey, initGoogleMap]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950">
      {/* Contenedor del Mapa Canvas */}
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: '100vh' }} />

      {/* 5. CONMUTADOR FLOTANTE MINIMALISTA DE CAPAS (POLÍTICO VS. SATÉLITE) */}
      <div className="absolute top-[152px] md:top-[180px] left-3 md:left-4 z-20 flex items-center p-1 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl">
        <button
          onClick={togglePoliticalSatellite}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700/60 text-white transition-all group shadow-sm"
          title="Alternar fluidamente entre mapa político limpio y fotografía satelital real"
        >
          {localMapType === 'satellite' ? (
            <>
              <MapIcon className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <span>Ver Mapa Político</span>
            </>
          ) : (
            <>
              <Globe className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Ver Satélite Real</span>
            </>
          )}
        </button>

        {/* Indicador de cultivo activo si está filtrado */}
        {selectedCrop && selectedCrop !== 'all' && (
          <div className="hidden sm:flex items-center gap-1.5 ml-2 pl-2 border-l border-slate-800 text-[11px] text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mostrando cuenca de: <strong>{selectedCrop}</strong></span>
          </div>
        )}
      </div>

      {/* Tooltip Flotante */}
      {tooltipData.visible && (
        <div
          ref={tooltipRef}
          style={{
            left: `${tooltipData.x}px`,
            top: `${tooltipData.y}px`,
          }}
          className="fixed z-30 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2.5 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl text-center min-w-[160px] animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="font-outfit font-bold text-sm text-white">{tooltipData.name}</div>
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
            {tooltipData.region} {tooltipData.planRegionName ? `· ${tooltipData.planRegionName}` : ''}
          </div>
          {tooltipData.cropMatches && tooltipData.cropMatches.length > 0 && (
            <div className="text-[10px] text-emerald-400 mt-1 font-medium truncate max-w-[200px]">
              {tooltipData.cropMatches.slice(0, 2).join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Pantalla de Carga */}
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm text-white">
          <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="font-outfit font-semibold text-sm">Cargando Capa Geoespacial de República Dominicana...</p>
        </div>
      )}

      {/* Banner / Formulario de Configuración de Clave API si no está configurada */}
      {!currentKey && !loading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-md w-full p-6 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-sky-950 border border-sky-800 text-sky-400 flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-outfit font-bold text-lg text-white">Clave de Google Maps Platform</h3>
              <p className="text-xs text-slate-300 mt-1">
                Ingresa tu clave de la API de JavaScript de Google Maps para explorar el mapa interactivo en vivo.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customKeyInput}
                onChange={(e) => setCustomKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-sky-500"
              />
              <button
                onClick={() => {
                  if (customKeyInput.trim()) {
                    setCurrentKey(customKeyInput.trim());
                  }
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Cargar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de Error en caso de falla de carga */}
      {loadError && (
        <div className="absolute top-20 left-4 right-4 max-w-lg mx-auto z-30 p-4 bg-rose-950/90 border border-rose-800 text-rose-200 rounded-xl text-xs backdrop-blur-md shadow-xl flex items-center justify-between">
          <div>
            <strong className="block font-semibold mb-0.5">Error al inicializar Google Maps</strong>
            <span>{loadError}</span>
          </div>
          <button
            onClick={() => setLoadError(null)}
            className="ml-3 px-2 py-1 bg-rose-900 hover:bg-rose-800 text-white rounded text-xs"
          >
            Descartar
          </button>
        </div>
      )}
    </div>
  );
};

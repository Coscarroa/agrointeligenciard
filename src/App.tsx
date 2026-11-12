/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { MapContainer, MapTypeId } from './components/MapContainer.tsx';
import { ProvinceInfoPanel } from './components/ProvinceInfoPanel.tsx';
import { MapLegend } from './components/MapLegend.tsx';
import { QuotaBanner } from './components/QuotaBanner.tsx';
import { AcademicFooter } from './components/AcademicFooter.tsx';
import { AlertSubscriptionModal, FarmLeadData } from './components/AlertSubscriptionModal.tsx';
import { AdminMetricsModal } from './components/AdminMetricsModal.tsx';
import { SupportModal } from './components/SupportModal.tsx';
import { DOMINICAN_PROVINCES, ProvinceData } from './data/dominicanProvinces.ts';
import { PROVINCIAL_AGRICULTURE } from './data/provinciasData.ts';

export default function App() {
  const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(
    DOMINICAN_PROVINCES[0]
  );
  const [activeRegion, setActiveRegion] = useState<'all' | 'cibao' | 'suroeste' | 'sureste'>('all');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [mapType, setMapType] = useState<MapTypeId>('roadmap');
  const [searchQuery, setSearchQuery] = useState('');

  // Modales de Conversión, Administración y Apoyo Solidario
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isAdminMetricsOpen, setIsAdminMetricsOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // FASE 3: Detección del parámetro '?admin=true' en la URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdminMode(true);
    }
  }, []);

  // Filtrado de provincias para el buscador rápido
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return DOMINICAN_PROVINCES.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.capital.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.economicActivities.some((act) => act.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleSelectProvince = (province: ProvinceData | null) => {
    setSelectedProvince(province);
    setSearchQuery('');
  };

  const handleCenterProvince = (province: ProvinceData) => {
    setSelectedProvince(province);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* Banner de Monitoreo de Cuota Google Maps */}
      <QuotaBanner />

      {/* Header Rediseñado: Banner Panorámico Superior + Barra de Herramientas Oscura Integrada */}
      <Header
        activeRegion={activeRegion}
        onSelectRegion={setActiveRegion}
        selectedCrop={selectedCrop}
        onSelectCrop={setSelectedCrop}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSupport={() => setIsSupportModalOpen(true)}
      />

      {/* Resultados Flotantes de la Búsqueda Rápida */}
      {searchQuery.trim().length > 0 && (
        <div className="absolute top-[175px] md:top-[195px] left-4 md:left-6 w-80 max-h-72 z-30 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl overflow-y-auto p-1.5 space-y-1">
          {searchResults.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-400">
              No se encontraron provincias con "{searchQuery}"
            </div>
          ) : (
            searchResults.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectProvince(p)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-left transition-colors text-xs text-slate-200"
              >
                <div>
                  <div className="font-semibold text-white">{p.name}</div>
                  <div className="text-[11px] text-slate-400">Capital: {p.capital}</div>
                </div>
                <span className="text-[10px] uppercase font-bold text-sky-400">
                  {p.region}
                </span>
              </button>
            ))
          )}
        </div>
      )}

      {/* Contenedor del Mapa de Google con Capas Geoespaciales y Filtro de Cultivos */}
      <MapContainer
        selectedProvince={selectedProvince}
        onSelectProvince={handleSelectProvince}
        activeRegion={activeRegion}
        selectedCrop={selectedCrop}
        mapType={mapType}
        onMapTypeChange={setMapType}
      />

      {/* Panel Flotante de Información de la Provincia */}
      <ProvinceInfoPanel
        province={selectedProvince}
        onClose={() => setSelectedProvince(null)}
        onCenterProvince={handleCenterProvince}
        onOpenSubscribeModal={() => setIsSubscribeModalOpen(true)}
      />

      {/* Leyenda de Macro-Regiones */}
      <MapLegend />

      {/* FASE 1: Footer de Respaldo y Uso Educativo / Gremial */}
      <AcademicFooter
        onOpenAdminMetrics={() => setIsAdminMetricsOpen(true)}
        isAdminVisible={isAdminMode}
      />

      {/* FASE 2: Modal de Registro de Finca y Telemetría */}
      <AlertSubscriptionModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        defaultProvinceId={selectedProvince?.id || 'duarte'}
        onLeadSuccess={(lead) => {
          console.log('[Lead Registrado]:', lead);
        }}
      />

      {/* FASE 3: Modal de Métricas B2B (?admin=true) */}
      <AdminMetricsModal
        isOpen={isAdminMetricsOpen}
        onClose={() => setIsAdminMetricsOpen(false)}
      />

      {/* MODAL DE APOYO COMUNITARIO Y DONACIÓN (GoFundMe & PayPal) */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
}

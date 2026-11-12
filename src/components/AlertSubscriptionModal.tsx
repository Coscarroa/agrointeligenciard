/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MODAL DE REGISTRO DE FINCA Y TELEMETRÍA (FASE 2: CAPTURA DE LEADS)
 * Captura verificada de productores agrícolas dominicanos:
 * - Nombre del Productor / Técnico
 * - Canal de Recepción: WhatsApp (con máscara RD +1 809/829/849), Correo o Ambos
 * - Provincia de la Finca (preseleccionada con la activa)
 * - Cultivo Principal
 * - Extensión de la Finca en tareas dominicanas
 * - Persistencia en localStorage (`agromap_leads_rd`) y preparación para Webhook
 */

import React, { useState } from 'react';
import { X, CheckCircle2, Send, Sprout, MapPin, Phone, Mail, Award, ArrowRight } from 'lucide-react';
import { DOMINICAN_PROVINCES } from '../data/dominicanProvinces.ts';

export interface FarmLeadData {
  id: string;
  createdAt: string;
  producerName: string;
  channel: 'whatsapp' | 'email' | 'both';
  phone: string;
  email: string;
  provinceId: string;
  provinceName: string;
  crop: string;
  farmSizeTareas: string;
}

interface AlertSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProvinceId?: string;
  onLeadSuccess?: (lead: FarmLeadData) => void;
}

const DOMINICAN_CROPS_LIST = [
  'Arroz',
  'Plátano / Guineo',
  'Cacao Orgánico / Fino',
  'Café de Altura',
  'Aguacate (Hass & Semil)',
  'Caña de Azúcar',
  'Vegetales Orientales / Invernadero',
  'Cebolla / Tomate Industrial',
  'Mango de Exportación',
  'Piña MD2',
  'Ganadería Bovina / Lechera',
  'Yuca / Tubérculos',
  'Otros Cultivos',
];

const FARM_SIZE_OPTIONS = [
  'Menos de 50 tareas (< 3.14 ha)',
  '50 - 200 tareas (3.14 - 12.5 ha)',
  '200 - 1,000 tareas (12.5 - 62.8 ha)',
  'Más de 1,000 tareas (> 62.8 ha)',
];

export const AlertSubscriptionModal: React.FC<AlertSubscriptionModalProps> = ({
  isOpen,
  onClose,
  defaultProvinceId = 'duarte',
  onLeadSuccess,
}) => {
  const [producerName, setProducerName] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'email' | 'both'>('whatsapp');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [provinceId, setProvinceId] = useState(defaultProvinceId);
  const [crop, setCrop] = useState('Arroz');
  const [farmSizeTareas, setFarmSizeTareas] = useState(FARM_SIZE_OPTIONS[1]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Formato de máscara telefónica dominicana (XXX) XXX-XXXX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw.length > 10) raw = raw.slice(0, 10);

    let formatted = '';
    if (raw.length > 0) {
      formatted = `(${raw.slice(0, 3)}`;
      if (raw.length > 3) {
        formatted += `) ${raw.slice(3, 6)}`;
      }
      if (raw.length > 6) {
        formatted += `-${raw.slice(6, 10)}`;
      }
    }
    setPhone(formatted);
  };

  /**
   * Conexión al Webhook de Google Apps Script para guardar suscripciones en Google Sheets
   * URL de despliegue Web App de Google Apps Script:
   * https://script.google.com/macros/s/AKfycbxCtiZc7hpP11Hal_UHBipyv9Q_5FGNcRwc9jh13STIQZYn7AgwXGV2CNfePY13Dlvb/exec
   */
  const GOOGLE_APPS_SCRIPT_WEBHOOK_URL =
    'https://script.google.com/macros/s/AKfycbxCtiZc7hpP11Hal_UHBipyv9Q_5FGNcRwc9jh13STIQZYn7AgwXGV2CNfePY13Dlvb/exec';

  const sendToWebhook = async (leadData: FarmLeadData) => {
    // Preparar carga de datos estructurada con nombres claros y contacto unificado
    const contactInfo =
      leadData.channel === 'whatsapp'
        ? leadData.phone
        : leadData.channel === 'email'
        ? leadData.email
        : `WhatsApp: ${leadData.phone} | Email: ${leadData.email}`;

    const payload = {
      nombre: leadData.producerName,
      canal: leadData.channel,
      contacto: contactInfo,
      telefono: leadData.phone,
      email: leadData.email,
      provincia: leadData.provinceName,
      provinciaId: leadData.provinceId,
      cultivo: leadData.crop,
      tareas: leadData.farmSizeTareas,
      fecha: leadData.createdAt,
      // Metadatos de procedencia
      origen: 'Agrointeligencia RD Web App',
      id: leadData.id,
    };

    try {
      // IMPORTANTE PARA GOOGLE APPS SCRIPT:
      // Usar mode: 'no-cors' y Content-Type: 'text/plain;charset=utf-8' con JSON.stringify(payload)
      // para evitar bloqueos por políticas CORS en el navegador al invocar el script de Google.
      await fetch(GOOGLE_APPS_SCRIPT_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      console.log('[Agrointeligencia RD] Suscripción enviada exitosamente a Google Apps Script:', payload);
    } catch (webhookErr) {
      // no-cors maneja la petición como opaca; si ocurre un fallo de red grave se registra pero no bloquea al usuario
      console.warn('[Agrointeligencia RD] Notificación Webhook enviada con estado opaco:', webhookErr);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!producerName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }

    if ((channel === 'whatsapp' || channel === 'both') && phone.replace(/[^0-9]/g, '').length < 10) {
      setErrorMsg('Ingresa un número de WhatsApp dominicano válido de 10 dígitos (ej. 809-555-1234).');
      return;
    }

    if ((channel === 'email' || channel === 'both') && (!email.trim() || !email.includes('@'))) {
      setErrorMsg('Por favor ingresa un correo electrónico válido.');
      return;
    }

    setIsSubmitting(true);

    const selectedProvObj = DOMINICAN_PROVINCES.find((p) => p.id === provinceId);
    const provinceName = selectedProvObj ? selectedProvObj.name : provinceId;

    const newLead: FarmLeadData = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      producerName: producerName.trim(),
      channel,
      phone: phone.trim(),
      email: email.trim(),
      provinceId,
      provinceName,
      crop,
      farmSizeTareas,
    };

    try {
      // 1. Guardar en localStorage bajo la clave 'agromap_leads_rd' como respaldo instantáneo
      const existingRaw = localStorage.getItem('agromap_leads_rd');
      const existingLeads: FarmLeadData[] = existingRaw ? JSON.parse(existingRaw) : [];
      existingLeads.unshift(newLead);
      localStorage.setItem('agromap_leads_rd', JSON.stringify(existingLeads));

      // 2. Disparar el Webhook real de Google Apps Script
      await sendToWebhook(newLead);

      setIsSubmitting(false);
      setIsSubmitted(true);
      onLeadSuccess?.(newLead);
    } catch (err) {
      console.error('Error al registrar finca:', err);
      setIsSubmitting(false);
      setErrorMsg('Hubo un problema al procesar la solicitud. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden transition-all">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Pantalla de Confirmación Exitosa */
          <div className="p-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/90 border border-emerald-600/60 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-950/50">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="font-outfit font-bold text-2xl text-white">
              ¡Finca Registrada con Éxito!
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              Estimado(a) <strong>{producerName}</strong>, hemos registrado tu parcela de{' '}
              <strong>{crop}</strong> en <strong>{DOMINICAN_PROVINCES.find((p) => p.id === provinceId)?.name}</strong>.
            </p>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-left text-xs space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Sprout className="w-4 h-4" />
                <span>¿Qué recibirás cada lunes a las 6:00 AM?</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] pl-1">
                <li>Ventana óptima de riego y pronóstico de lluvias de la semana.</li>
                <li>Alertas tempranas de estrés térmico e inversión de temperatura.</li>
                <li>Recomendaciones de manejo de plagas favorables por humedad relativa.</li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all"
            >
              Volver al Mapa del Dashboard
            </button>
          </div>
        ) : (
          /* Formulario de Suscripción */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {/* Encabezado */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-700/60 mb-1.5">
                <Sprout className="w-3 h-3 text-emerald-400" />
                <span>Servicio Gratuito para Productores Dominicanos</span>
              </div>
              <h3 className="font-outfit font-bold text-xl text-white">
                Suscribe tu Finca al Reporte Agroclimático
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Recibe telemetría edafológica, lluvias esperadas y alertas agronómicas cada lunes sin costo.
              </p>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Campos del Formulario */}
            <div className="space-y-3 text-xs">
              {/* 1. Nombre */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nombre del Productor o Técnico Agrícola <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={producerName}
                  onChange={(e) => setProducerName(e.target.value)}
                  placeholder="Ej. Ing. Rafael Almonte"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* 2. Canal de Recepción */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  ¿Dónde prefieres recibir las alertas cada lunes? <span className="text-emerald-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel('whatsapp')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                      channel === 'whatsapp'
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('email')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                      channel === 'email'
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Correo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('both')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                      channel === 'both'
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Ambos</span>
                  </button>
                </div>
              </div>

              {/* Inputs condicionales de contacto */}
              {(channel === 'whatsapp' || channel === 'both') && (
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Número de WhatsApp (RD +1) <span className="text-emerald-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-mono text-xs flex items-center">
                      🇩🇴 +1
                    </span>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="(809) 555-1234"
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {(channel === 'email' || channel === 'both') && (
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Correo Electrónico <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="productor@campo.do"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              )}

              {/* 3. Provincia de la Finca */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Provincia de la Finca
                  </label>
                  <select
                    value={provinceId}
                    onChange={(e) => setProvinceId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                  >
                    {DOMINICAN_PROVINCES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.region})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Cultivo Principal */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Cultivo Principal
                  </label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                  >
                    {DOMINICAN_CROPS_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 5. Extensión en Tareas Dominicanas */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Extensión de la Finca (Tareas Dominicanas)
                </label>
                <select
                  value={farmSizeTareas}
                  onChange={(e) => setFarmSizeTareas(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                >
                  {FARM_SIZE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botón Enviar */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Registrando Finca...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Suscribir mi Finca Gratis</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[10px] text-slate-500 text-center">
              Tus datos son privados y se usan exclusivamente para alertas agronómicas certificadas.
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

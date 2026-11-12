/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ALIANZA COMERCIAL SEGMENTADA POR CULTIVO (FASE 3: MONETIZACIÓN B2B)
 * Componente modular ubicado al final del ProvinceInfoPanel, etiquetado sutilmente
 * como "Aliado Comercial Recomendado". Adapta su oferta de valor según el cultivo
 * predominante de la provincia seleccionada (Arroz, Cacao, Musáceas, Café, etc.).
 */

import React, { useState } from 'react';
import { ShoppingBag, ArrowUpRight, CheckCircle2, ShieldCheck, Sparkles, Building } from 'lucide-react';
import { ProvinceData } from '../data/dominicanProvinces.ts';
import { PROVINCIAL_AGRICULTURE } from '../data/provinciasData.ts';

interface SponsorBannerProps {
  province: ProvinceData;
  onOpenInquiry?: (partnerName: string, category: string) => void;
}

interface SponsorConfig {
  partnerName: string;
  category: string;
  headline: string;
  badge: string;
  description: string;
  ctaText: string;
  accentColor: string;
  benefits: string[];
  contactPhone: string;
}

export const SponsorBanner: React.FC<SponsorBannerProps> = ({ province, onOpenInquiry }) => {
  const [inquirySent, setInquirySent] = useState(false);

  // Determinar el cultivo predominante y la mejor oferta segmentada
  const agro = PROVINCIAL_AGRICULTURE[province.id];
  const crops = agro?.predominantCrops || [];
  const primaryCropName = crops[0]?.name.toLowerCase() || '';

  // Configuración segmentada según el rubro agropecuario
  let sponsor: SponsorConfig = {
    partnerName: 'AgroInsumos del Caribe',
    category: 'Fertilización y Riego Tecnificado',
    headline: 'Fertilizantes y Nutrición Foliar de Alta Asimilación',
    badge: 'Aliado Comercial Certificado',
    description: `Programas nutricionales y enmiendas de suelo formuladas para el perfil agroecológico de ${province.name}.`,
    ctaText: 'Solicitar Cotización Mayorista',
    accentColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
    benefits: ['Entregas directas en finca en 24h', 'Asistencia técnica agronómica en campo'],
    contactPhone: '+18095550190',
  };

  if (primaryCropName.includes('arroz')) {
    sponsor = {
      partnerName: 'Fertilizantes Cibao Oriental (FERTICIBAO)',
      category: 'Insumos Especializados para Arroz',
      headline: 'Nutrición y Protección para Valles Arroceros',
      badge: 'Aliado Arrocero Recomendado',
      description: `Urea perlada, mezclas NPK a la medida y biofungicidas para Pyricularia en ${province.name} y cuenca del Yuna.`,
      ctaText: 'Cotizar Lotes de Fertilizante',
      accentColor: 'border-sky-500/40 text-sky-400 bg-sky-950/20',
      benefits: ['Financiamiento a cosecha', 'Análisis foliar gratuito para parcelas > 100 tareas'],
      contactPhone: '+18095550144',
    };
  } else if (primaryCropName.includes('cacao')) {
    sponsor = {
      partnerName: 'AgroTec Orgánica del Nordeste',
      category: 'Bioinsumos y Certificación de Cacao',
      headline: 'Bioestimulantes y Herramientas para Cacao Fino',
      badge: 'Aliado Cacaotero Certificado',
      description: `Insumos certificados USDA Organic y Fair Trade para manejo de mazorca negra y podas en ${province.name}.`,
      ctaText: 'Consultar Paquete Orgánico',
      accentColor: 'border-amber-500/40 text-amber-400 bg-amber-950/20',
      benefits: ['Prima de exportación para cooperativas', 'Tijeras telescópicas y micronutrientes'],
      contactPhone: '+18095550188',
    };
  } else if (primaryCropName.includes('plátano') || primaryCropName.includes('banano')) {
    sponsor = {
      partnerName: 'Soluciones Plataneras & Bananeras RD',
      category: 'Riego por Goteo y Manejo de Musáceas',
      headline: 'Cintas de Riego y Fungicidas Antracnosis',
      badge: 'Aliado para Musáceas',
      description: `Sistemas presurizados y fundas tratadas para racimos con calidad de exportación en ${province.name}.`,
      ctaText: 'Cotizar Cintas y Mangueras',
      accentColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
      benefits: ['Ahorro del 40% en consumo de agua', 'Despacho desde Mao, La Vega y Azua'],
      contactPhone: '+18095550172',
    };
  } else if (primaryCropName.includes('café') || primaryCropName.includes('aguacate')) {
    sponsor = {
      partnerName: 'AgroSistemas de Montaña',
      category: 'Tecnología para Laderas y Altura',
      headline: 'Sistemas de Micro-Aspersión y Abonos de Altura',
      badge: 'Especialista en Montaña',
      description: `Equipos livianos de bombeo solar y desgranadoras ecológicas para las serranías de ${province.name}.`,
      ctaText: 'Ver Catálogo Agro-Montaña',
      accentColor: 'border-teal-500/40 text-teal-400 bg-teal-950/20',
      benefits: ['Paneles solares adaptados a laderas', 'Crédito con tasa preferencial'],
      contactPhone: '+18095550165',
    };
  }

  const handleInquiryClick = () => {
    // Abrir WhatsApp directo al asesor comercial del sponsor
    const msg = encodeURIComponent(
      `Hola ${sponsor.partnerName}, vi su banner en Agrointeligencia RD para la provincia de ${province.name}. Me interesa cotizar sus insumos para mi cultivo.`
    );
    window.open(`https://wa.me/${sponsor.contactPhone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
    setInquirySent(true);
    onOpenInquiry?.(sponsor.partnerName, sponsor.category);
  };

  return (
    <div className={`p-3.5 rounded-2xl border ${sponsor.accentColor} transition-all duration-300 relative overflow-hidden space-y-2.5`}>
      {/* Etiqueta sutil SaaS */}
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
          <Building className="w-3 h-3 text-slate-400" />
          <span>Aliado Comercial Recomendado</span>
        </span>
        <span className="font-semibold px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/60 text-slate-300 text-[9px] flex items-center gap-1">
          <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
          <span>{sponsor.badge}</span>
        </span>
      </div>

      {/* Titular del Patrocinador */}
      <div>
        <div className="font-outfit font-bold text-white text-sm flex items-center justify-between">
          <span>{sponsor.headline}</span>
        </div>
        <div className="text-[11px] font-medium text-emerald-400/90 mt-0.5 flex items-center gap-1">
          <span>Por {sponsor.partnerName}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">{sponsor.category}</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-snug mt-1">
          {sponsor.description}
        </p>
      </div>

      {/* Beneficios clave */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[10.5px] text-slate-300">
        {sponsor.benefits.map((benefit, i) => (
          <div key={i} className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-lg border border-white/5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">{benefit}</span>
          </div>
        ))}
      </div>

      {/* Botón CTA B2B */}
      <div className="pt-1 flex items-center justify-between">
        <span className="text-[10px] text-slate-400">
          Atención técnica en {province.name}
        </span>
        <button
          onClick={handleInquiryClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all group"
        >
          <span>{sponsor.ctaText}</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

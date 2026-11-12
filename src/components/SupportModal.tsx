/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MODAL DE APOYO COMUNITARIO Y DONACIÓN (GOFUNDME & PAYPAL)
 * Permite a los usuarios contribuir al sostenimiento de Agrointeligencia RD:
 * - Mensaje de impacto social y educativo
 * - Opción A: Campaña oficial en GoFundMe
 * - Opción B: Donación directa vía PayPal (cesil.roa@gmail.com) con botón de copiar correo
 */

import React, { useState } from 'react';
import { X, Heart, ExternalLink, Copy, Check, ShieldCheck, Sparkles, Globe, Mail } from 'lucide-react';

/**
 * =========================================================================
 * ENLACES EDITABLES DE RECAUDACIÓN Y APOYO
 * Puedes sustituir GOFUNDME_URL por el enlace directo definitivo de tu campaña.
 * =========================================================================
 */
export const GOFUNDME_URL = 'https://gofundme.com';
export const PAYPAL_EMAIL = 'cesil.roa@gmail.com';
// Enlace oficial de pago directo PayPal
export const PAYPAL_DONATION_URL = `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=${encodeURIComponent(
  PAYPAL_EMAIL
)}&item_name=${encodeURIComponent('Apoyo a Servidores Agrointeligencia RD')}&currency_code=USD`;

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PAYPAL_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Error al copiar correo:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-6 space-y-4">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
          title="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado con Icono de Apoyo Solidario */}
        <div className="text-center space-y-2 pt-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-950/40">
            <Heart className="w-6 h-6 fill-amber-400/20" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Iniciativa Abierta y Gratuita
            </span>
            <h3 className="font-outfit font-bold text-xl sm:text-2xl text-white mt-1.5">
              Apoya a Agrointeligencia RD
            </h3>
          </div>

          {/* Mensaje de Impacto */}
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            Mantén <strong>Agrointeligencia RD</strong> gratuita para miles de agricultores, asociaciones y estudiantes dominicanos. Tu aporte financia los servidores de alta disponibilidad y el envío de alertas climáticas rurales.
          </p>
        </div>

        {/* Opciones de Donación */}
        <div className="space-y-3 pt-2">
          {/* Opción A — GoFundMe */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#02a95c]" />
                <span>Campaña Comunitaria</span>
              </span>
              <span className="text-[10px] text-slate-400">Tarjetas de crédito / débito</span>
            </div>

            <a
              href={GOFUNDME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-[#02a95c] hover:bg-[#028e4d] text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Apoyar campaña en GoFundMe</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Opción B — PayPal Directo */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#0070ba]" />
                <span>Donación Directa PayPal</span>
              </span>
              <span className="text-[10px] text-slate-400">Transferencia instantánea</span>
            </div>

            <a
              href={PAYPAL_DONATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-[#0070ba] hover:bg-[#005ea6] text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Donar directo con PayPal</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Botón para copiar correo */}
            <div className="flex items-center justify-between pt-1 text-[11px] bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800/80">
              <div className="text-slate-400 truncate mr-2">
                Cuenta:{' '}
                <strong className="text-slate-200 font-mono select-all">
                  {PAYPAL_EMAIL}
                </strong>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors shrink-0"
                title="Copiar correo para transferir desde tu app PayPal"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold text-[10px]">¡Correo copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px]">Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Garantía de Transparencia */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Fondos dedicados 100% a infraestructura de datos agroclimáticos libres en RD.</span>
        </div>
      </div>
    </div>
  );
};

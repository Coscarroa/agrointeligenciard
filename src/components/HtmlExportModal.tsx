/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { X, Copy, Check, Download, ExternalLink, Code } from 'lucide-react';
import { generateSingleFileHtml } from '../utils/singleHtmlGenerator.ts';

interface HtmlExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentApiKey?: string;
}

export const HtmlExportModal: React.FC<HtmlExportModalProps> = ({
  isOpen,
  onClose,
  currentApiKey = "YOUR_API_KEY",
}) => {
  const [apiKeyInput, setApiKeyInput] = useState<string>(currentApiKey);
  const [copied, setCopied] = useState(false);

  const singleHtmlCode = useMemo(() => {
    return generateSingleFileHtml(apiKeyInput || "YOUR_API_KEY");
  }, [apiKeyInput]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(singleHtmlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error("No se pudo copiar al portapapeles", e);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([singleHtmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mapa_politico_republica_dominicana.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-950 border border-sky-800/60 text-sky-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-outfit font-bold text-lg text-white">
                Bloque de Código HTML Único (Autónomo)
              </h3>
              <p className="text-xs text-slate-400">
                Archivo HTML5 listo para guardar y probar en local con estilos CSS en <code>&lt;style&gt;</code> y lógica de Google Maps en <code>&lt;script&gt;</code>.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Configuración de API Key para exportar */}
        <div className="px-5 py-3 bg-slate-950/70 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[280px]">
            <span className="text-slate-300 font-medium">Marcador de API Key:</span>
            <input
              type="text"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="YOUR_API_KEY o tu clave real"
              className="flex-1 max-w-xs px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono text-xs focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Copiado!' : 'Copiar Código'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs bg-sky-600 hover:bg-sky-500 text-white transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Descargar .html</span>
            </button>
          </div>
        </div>

        {/* Visor de Código Fuente */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-[11px] text-slate-300 leading-relaxed select-all">
          <pre>
            <code>{singleHtmlCode}</code>
          </pre>
        </div>

        {/* Pie informativo */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>
            Incluye GeoJSON embebido de las 32 demarcaciones y el mapa de calor regional.
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
          >
            Cerrar Visor
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  ListChecks, 
  Key, 
  FileText, 
  Copy, 
  Check, 
  Sparkles 
} from 'lucide-react';

export default function SummaryCards({ data }) {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const { resumen, puntos_clave = [], decisiones = [], tareas = [], preguntas = [] } = data;

  const generateMarkdown = () => {
    let md = `# Resumen de la Reunión — MeetingAI\n\n`;
    
    if (resumen) {
      md += `## Resumen Ejecutivo\n${resumen}\n\n`;
    }
    
    if (puntos_clave.length > 0) {
      md += `## Puntos Clave\n`;
      puntos_clave.forEach((p) => {
        md += `- ${p}\n`;
      });
      md += `\n`;
    }

    if (decisiones.length > 0) {
      md += `## Decisiones Acordadas\n`;
      decisiones.forEach((d) => {
        md += `- [x] ${d}\n`;
      });
      md += `\n`;
    }

    if (tareas.length > 0) {
      md += `## Tareas y Compromisos\n`;
      tareas.forEach((t) => {
        md += `- [ ] ${t}\n`;
      });
      md += `\n`;
    }

    if (preguntas.length > 0) {
      md += `## Preguntas Abiertas\n`;
      preguntas.forEach((q) => {
        md += `- ? ${q}\n`;
      });
      md += `\n`;
    }

    return md;
  };

  const handleCopy = () => {
    const md = generateMarkdown();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Barra de Acciones */}
      <div className="flex items-center justify-between bg-[#18181f] border border-gray-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>Resultados del Análisis IA</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/20 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>¡Copiado en Markdown!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar en Markdown</span>
            </>
          )}
        </button>
      </div>

      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Resumen Ejecutivo */}
        <div className="md:col-span-2 bg-[#18181f] border border-gray-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs tracking-wider uppercase mb-3">
            <FileText className="w-4 h-4" />
            <span>Resumen Ejecutivo</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
            {resumen || 'No se generó resumen.'}
          </p>
        </div>

        {/* Puntos Clave */}
        <div className="bg-[#18181f] border border-gray-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase mb-3">
            <Key className="w-4 h-4" />
            <span>Puntos Clave ({puntos_clave.length})</span>
          </div>
          {puntos_clave.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-300">
              {puntos_clave.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500 italic">No se identificaron puntos clave específicos.</p>
          )}
        </div>

        {/* Decisiones */}
        <div className="bg-[#18181f] border border-gray-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>Decisiones Acordadas ({decisiones.length})</span>
          </div>
          {decisiones.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-300">
              {decisiones.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500 italic">No se registraron decisiones explícitas.</p>
          )}
        </div>

        {/* Tareas */}
        <div className="bg-[#18181f] border border-gray-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-3">
            <ListChecks className="w-4 h-4" />
            <span>Tareas y Acciones ({tareas.length})</span>
          </div>
          {tareas.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-300">
              {tareas.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded border border-amber-500/40 bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5 text-[10px] text-amber-400">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500 italic">No se asignaron tareas.</p>
          )}
        </div>

        {/* Preguntas Abiertas */}
        <div className="bg-[#18181f] border border-gray-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs tracking-wider uppercase mb-3">
            <HelpCircle className="w-4 h-4" />
            <span>Preguntas Abiertas ({preguntas.length})</span>
          </div>
          {preguntas.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-300">
              {preguntas.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500 italic">No quedaron preguntas abiertas registradas.</p>
          )}
        </div>
      </div>
    </div>
  );
}

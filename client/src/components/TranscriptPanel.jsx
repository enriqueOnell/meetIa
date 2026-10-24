import React from 'react';
import { Mic, MicOff, RotateCcw, AlertCircle, FileText } from 'lucide-react';

export default function TranscriptPanel({
  transcript,
  setTranscript,
  interimTranscript,
  isListening,
  isSupported,
  error,
  startListening,
  stopListening,
  resetTranscript,
  onGenerateSummary,
  isLoadingSummary
}) {
  return (
    <div className="bg-[#18181f] border border-gray-800 rounded-2xl p-5 flex flex-col h-full shadow-xl">
      {/* Encabezado del panel */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800/80 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Transcripción en Vivo</h3>
            <p className="text-xs text-gray-400">Dictado por voz o edición directa</p>
          </div>
        </div>

        {/* Indicador de estado */}
        <div className="flex items-center gap-2">
          {isListening ? (
            <span className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Grabando audio
            </span>
          ) : (
            <span className="text-xs text-gray-500 bg-gray-900 border border-gray-800 px-2.5 py-1 rounded-full">
              Pausado
            </span>
          )}
        </div>
      </div>

      {/* Alerta de soporte o errores */}
      {error && (
        <div className="mb-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Controles de Voz */}
      <div className="flex items-center gap-2 mb-3">
        {isSupported && (
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm ${
              isListening
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/30'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5" />
                <span>Pausar Micrófono</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span>Activar Micrófono</span>
              </>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={resetTranscript}
          disabled={!transcript && !interimTranscript}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-gray-200 bg-gray-900/60 hover:bg-gray-800 border border-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Limpiar transcripción"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Limpiar</span>
        </button>

        <div className="ml-auto text-[11px] text-gray-500">
          {transcript.trim() ? `${transcript.trim().split(/\s+/).length} palabras` : '0 palabras'}
        </div>
      </div>

      {/* Textarea Fallback & En vivo */}
      <div className="flex-1 relative flex flex-col min-h-[180px]">
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Escribe aquí manualmente o enciende el micrófono para transcribir la reunión en tiempo real..."
          className="w-full flex-1 bg-[#121215] border border-gray-800 focus:border-violet-500/80 rounded-xl p-3.5 text-xs text-gray-200 placeholder-gray-600 resize-none outline-none leading-relaxed font-mono"
        />

        {interimTranscript && (
          <div className="p-2.5 mt-2 bg-violet-950/20 border border-violet-800/30 rounded-xl text-xs text-violet-300 italic flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
            <span>Escuchando: "{interimTranscript}"</span>
          </div>
        )}
      </div>

      {/* Botón de envío al LLM */}
      <div className="mt-3 pt-3 border-t border-gray-800/80">
        <button
          type="button"
          onClick={onGenerateSummary}
          disabled={!transcript.trim() || isLoadingSummary}
          className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-violet-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoadingSummary ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analizando con IA...</span>
            </>
          ) : (
            <span>Analizar y Resumir Reunión</span>
          )}
        </button>
      </div>
    </div>
  );
}

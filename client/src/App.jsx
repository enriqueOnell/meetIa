import React, { useState } from 'react';
import JitsiMeeting from './components/JitsiMeeting';
import TranscriptPanel from './components/TranscriptPanel';
import SummaryCards from './components/SummaryCards';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { Sparkles, Video, ShieldCheck, ArrowRight, Settings2, Sliders } from 'lucide-react';

export default function App() {
  const [inMeeting, setInMeeting] = useState(false);
  const [roomName, setRoomName] = useState('MeetingAI-Demo');
  const [userName, setUserName] = useState('Usuario');

  // Configuración de Proveedor de IA
  const [provider, setProvider] = useState('deepseek'); // 'deepseek' | 'ollama'
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('deepseek-chat');
  const [showConfig, setShowConfig] = useState(false);

  // Estado de Resumen
  const [summaryData, setSummaryData] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Hook de Reconocimiento de Voz
  const {
    isListening,
    transcript,
    setTranscript,
    interimTranscript,
    isSupported,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition();

  const handleJoin = (e) => {
    e.preventDefault();
    if (roomName.trim()) {
      setInMeeting(true);
    }
  };

  const handleGenerateSummary = async () => {
    if (!transcript.trim()) return;

    setIsLoadingSummary(true);
    setApiError(null);

    try {
      const response = await fetch('/api/meetings/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transcript,
          provider,
          model: provider === 'deepseek' ? (model || 'deepseek-chat') : (model || 'gemma:2b'),
          apiKey: apiKey.trim() || undefined
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || `Error ${response.status} al procesar la reunión.`);
      }

      setSummaryData(result.data);
    } catch (err) {
      console.error('Error generando resumen:', err);
      setApiError(err.message || 'Error de conexión con el backend.');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-gray-800/80 bg-[#17171c]/70 backdrop-blur-md sticky top-0 z-30 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-violet-300 bg-clip-text text-transparent">
              MeetingAI <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 font-semibold border border-violet-500/30">MVP</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-gray-900 border border-gray-800 hover:border-gray-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-violet-400" />
            <span>Config IA ({provider.toUpperCase()})</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 bg-gray-900/60 border border-gray-800 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
            Sin OpenAI SDK
          </div>
        </div>
      </header>

      {/* Panel de Configuración de IA (Desplegable) */}
      {showConfig && (
        <div className="bg-[#181820] border-b border-gray-800 p-4 animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">PROVEEDOR LLM</label>
              <select
                value={provider}
                onChange={(e) => {
                  const p = e.target.value;
                  setProvider(p);
                  if (p === 'deepseek') setModel('deepseek-chat');
                  if (p === 'ollama') setModel('gemma:2b');
                }}
                className="w-full bg-[#121215] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-violet-500"
              >
                <option value="deepseek">DeepSeek API (Cloud)</option>
                <option value="ollama">Ollama / Gemma (Local)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                {provider === 'deepseek' ? 'DEEPSEEK API KEY (Opcional si está en .env)' : 'HOST OLLAMA'}
              </label>
              {provider === 'deepseek' ? (
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-[#121215] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-violet-500 font-mono"
                />
              ) : (
                <input
                  type="text"
                  value="http://localhost:11434"
                  readOnly
                  className="w-full bg-[#121215]/60 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-400 outline-none"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">MODELO</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder={provider === 'deepseek' ? 'deepseek-chat' : 'gemma:2b'}
                className="w-full bg-[#121215] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-violet-500 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 md:p-6 max-w-7xl w-full mx-auto">
        {!inMeeting ? (
          <div className="flex-1 flex items-center justify-center py-10">
            <div className="w-full max-w-md bg-[#18181f] border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="text-center mb-8">
                <div className="inline-flex p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 mb-3">
                  <Video className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Ingresar a la Reunión</h2>
                <p className="text-sm text-gray-400 mt-1">Conéctate a Jitsi Meet para iniciar la transcripción en vivo con IA</p>
              </div>

              <form onSubmit={handleJoin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                    Nombre de la Sala
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Ej. Reunion-Estrategia-Q1"
                    required
                    className="w-full bg-[#121215] border border-gray-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                    Tu Nombre o Alias
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Tu nombre"
                    required
                    className="w-full bg-[#121215] border border-gray-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 transition-all outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-violet-600/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Iniciar Reunión con Jitsi</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-5">
            {/* Barra superior de la reunión */}
            <div className="flex items-center justify-between bg-[#18181f] border border-gray-800 rounded-2xl px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold text-white">Sala: {roomName}</span>
                <span className="text-xs text-gray-500 hidden sm:inline">| Participante: {userName}</span>
              </div>
              <button
                onClick={() => setInMeeting(false)}
                className="text-xs px-3.5 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                Salir de la reunión
              </button>
            </div>

            {/* Error de API si ocurre */}
            {apiError && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-center justify-between">
                <span>{apiError}</span>
                <button onClick={() => setApiError(null)} className="text-gray-400 hover:text-white cursor-pointer ml-3">✕</button>
              </div>
            )}

            {/* Grid Principal: Jitsi + Panel de Transcripción */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[520px]">
              {/* Jitsi Video Frame */}
              <div className="lg:col-span-7 xl:col-span-8 flex flex-col min-h-[480px]">
                <JitsiMeeting
                  roomName={roomName}
                  displayName={userName}
                  onLeave={() => setInMeeting(false)}
                />
              </div>

              {/* Panel de Transcripción y Dictado */}
              <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
                <TranscriptPanel
                  transcript={transcript}
                  setTranscript={setTranscript}
                  interimTranscript={interimTranscript}
                  isListening={isListening}
                  isSupported={isSupported}
                  error={speechError}
                  startListening={startListening}
                  stopListening={stopListening}
                  resetTranscript={resetTranscript}
                  onGenerateSummary={handleGenerateSummary}
                  isLoadingSummary={isLoadingSummary}
                />
              </div>
            </div>

            {/* Resultados del Resumen IA */}
            {summaryData && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <SummaryCards data={summaryData} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook para transcripción de voz utilizando la Web Speech API nativa.
 * Maneja de forma robusta navegadores con soporte limitado (como Firefox)
 * y errores de red o concurrencia de micrófono con WebRTC/Jitsi.
 */
export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    const isFirefox = typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setError(
        isFirefox
          ? 'Firefox no habilita reconocimiento de voz de forma predeterminada. Usa Chrome/Brave/Edge o escribe notas directamente en el cuadro de texto.'
          : 'Web Speech API no está disponible en este navegador. Puedes usar el cuadro de texto manual.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      recognition.onstart = () => {
        setIsListening(true);
        isListeningRef.current = true;
        setError(null);
      };

      recognition.onresult = (event) => {
        let currentInterim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalChunk += item[0].transcript + ' ';
          } else {
            currentInterim += item[0].transcript;
          }
        }

        if (finalChunk) {
          setTranscript((prev) => (prev ? `${prev.trim()} ${finalChunk.trim()}` : finalChunk.trim()));
        }
        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event) => {
        console.warn('SpeechRecognition error:', event.error);
        isListeningRef.current = false;
        setIsListening(false);

        if (event.error === 'not-allowed') {
          setError('Permiso de micrófono bloqueado. Habilita el acceso o usa el cuadro de texto.');
        } else if (event.error === 'network') {
          setError('El servicio de voz no pudo conectar con el servidor de reconocimiento (error network). Usa el cuadro de texto para tomar notas o prueba en Chrome/Brave con conexión activa.');
        } else if (event.error === 'audio-capture') {
          setError('El micrófono está ocupado por otra aplicación (ej. la videollamada de Jitsi). Libéralo o usa el cuadro de texto.');
        } else if (event.error !== 'no-speech') {
          setError(`Aviso de voz (${event.error}). Puedes continuar editando manualmente.`);
        }
      };

      recognition.onend = () => {
        if (isListeningRef.current) {
          try {
            recognition.start();
          } catch (e) {
            console.warn('Error reanudando reconocimiento:', e);
            setIsListening(false);
            isListeningRef.current = false;
          }
        } else {
          setIsListening(false);
          setInterimTranscript('');
        }
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Error inicializando SpeechRecognition:', err);
      setIsSupported(false);
      setError('No se pudo inicializar el servicio de voz.');
    }

    return () => {
      isListeningRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) return;
    setError(null);
    isListeningRef.current = true;
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn('Recognition already started or error:', e);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Error stopping recognition:', e);
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    setTranscript,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}

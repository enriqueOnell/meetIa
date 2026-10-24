import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook para transcripción de voz utilizando la Web Speech API nativa.
 * Incluye fallback de soporte y sincronización de transcripción en tiempo real.
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
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('La Web Speech API no está soportada en este navegador. Puedes usar el cuadro de texto manual.');
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
        if (event.error === 'not-allowed') {
          setError('Permiso de micrófono denegado. Habilita el acceso o usa el cuadro de texto.');
          setIsListening(false);
          isListeningRef.current = false;
        } else if (event.error !== 'no-speech') {
          setError(`Error en reconocimiento de voz: ${event.error}`);
        }
      };

      recognition.onend = () => {
        // Si el usuario no lo detuvo explícitamente, reanudar para mantener continuous listening
        if (isListeningRef.current) {
          try {
            recognition.start();
          } catch (e) {
            console.error('Error reanudando reconocimiento:', e);
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
      setError('Error al iniciar el reconocedor de voz.');
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

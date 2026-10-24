import React, { useEffect, useRef, useState } from 'react';

/**
 * Parsea tanto un enlace completo de Jitsi (ej. https://meet.jit.si/MiSala o https://mi-instancia.org/MiSala)
 * como un nombre simple de sala (ej. MiSala).
 */
function parseJitsiTarget(input) {
  if (!input) return { domain: 'meet.jit.si', roomName: 'MeetingAI-Demo' };

  let trimmed = input.trim();

  // Si empieza con http:// o https://
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const url = new URL(trimmed);
      const domain = url.host || 'meet.jit.si';
      // Extraer path sin '/' inicial ni params
      const pathRoom = url.pathname.replace(/^\/+/, '').split('/')[0];
      return {
        domain: domain || 'meet.jit.si',
        roomName: decodeURIComponent(pathRoom || 'MeetingAI-Demo')
      };
    } catch (e) {
      console.warn('Error parseando URL de Jitsi:', e);
    }
  }

  // Si incluye '/' sin protocolo (ej. meet.jit.si/MiSala)
  if (trimmed.includes('/')) {
    const parts = trimmed.split('/');
    if (parts.length >= 2 && parts[0].includes('.')) {
      return {
        domain: parts[0],
        roomName: parts.slice(1).join('/')
      };
    }
  }

  // Nombre de sala directo
  return {
    domain: 'meet.jit.si',
    roomName: trimmed
  };
}

export default function JitsiMeeting({ meetingInput, displayName, onLeave }) {
  const containerRef = useRef(null);
  const apiRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const { domain, roomName } = parseJitsiTarget(meetingInput);

  useEffect(() => {
    if (!window.JitsiMeetExternalAPI) {
      console.error('Jitsi Meet External API no está cargado');
      setLoading(false);
      return;
    }

    if (!containerRef.current) return;

    // Limpiar instancia previa si existe
    if (apiRef.current) {
      apiRef.current.dispose();
    }

    const options = {
      roomName: roomName || 'MeetingAI-Room-Demo',
      width: '100%',
      height: '100%',
      parentNode: containerRef.current,
      userInfo: {
        displayName: displayName || 'Participante MeetingAI'
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        prejoinPageEnabled: false,
        disableDeepLinking: true,
        theme: {
          palette: {
            ui01: '#121212',
            ui02: '#1e1e24',
            ui03: '#2a2a35'
          }
        }
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'chat', 'recording',
          'raisehand', 'videoquality', 'filmstrip', 'tileview'
        ]
      }
    };

    try {
      const api = new window.JitsiMeetExternalAPI(domain, options);
      apiRef.current = api;

      api.addEventListeners({
        videoConferenceJoined: () => {
          setLoading(false);
        },
        videoConferenceLeft: () => {
          if (onLeave) onLeave();
        }
      });
    } catch (err) {
      console.error('Error inicializando Jitsi Meet:', err);
      setLoading(false);
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [domain, roomName, displayName, onLeave]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-gray-800 bg-[#16161a] shadow-2xl flex flex-col">
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#121212]/90 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-300 font-medium">Conectando a la reunión de Jitsi...</p>
          <span className="text-xs text-gray-500 mt-1">
            {domain}/{roomName}
          </span>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full flex-1" />
    </div>
  );
}

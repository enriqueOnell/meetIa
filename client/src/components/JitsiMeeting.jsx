import React, { useEffect, useRef, useState } from 'react';
import { Video, VideoOff, Mic, Settings, Users } from 'lucide-react';

export default function JitsiMeeting({ roomName, displayName, onLeave }) {
  const containerRef = useRef(null);
  const apiRef = useRef(null);
  const [loading, setLoading] = useState(true);

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

    const domain = 'meet.jit.si';
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
  }, [roomName, displayName, onLeave]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-gray-800 bg-[#16161a] shadow-2xl flex flex-col">
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#121212]/90 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-300 font-medium">Conectando a la sala de Jitsi...</p>
          <span className="text-xs text-gray-500 mt-1">Sala: {roomName}</span>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full flex-1" />
    </div>
  );
}

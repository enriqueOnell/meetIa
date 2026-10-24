# Tareas: MeetingAI MVP

- [x] **T1: Scaffold, UI Inicial y Jitsi**
  - Inicializar Vite + React + Tailwind en `/client`.
  - Inicializar Express + CORS + dotenv en `/server`.
  - Cargar SDK de Jitsi IFrame API y renderizar vista con tema oscuro (`#121212`) y acentos (`#8b5cf6`).
  - *Criterio de aceptación / Hecho cuando:* El cliente y servidor corran simultáneamente, y Jitsi cargue en pantalla oscura.

- [x] **T2: Captura de Voz y Controles**
  - Implementar custom hook de Web Speech API nativa (grabar/pausar/reanudar/limpiar).
  - Integrar textarea de fallback editable y sincronizado.
  - *Criterio de aceptación / Hecho cuando:* El usuario pueda dictar por voz y ver la transcripción en vivo, o ingresar/editar texto manualmente.

- [x] **T3: Backend y Adaptación a IA (DeepSeek/Gemma)**
  - Implementar endpoint `POST /api/meetings/summarize`.
  - Conexión con `fetch` nativo hacia DeepSeek API y Ollama local (Gemma).
  - Garantizar respuesta en JSON estricto (`resumen`, `puntos_clave`, `decisiones`, `tareas`, `preguntas`). Prohibido SDK OpenAI.
  - *Criterio de aceptación / Hecho cuando:* El endpoint devuelva un JSON estructurado válido consumiendo DeepSeek u Ollama.

- [x] **T4: Flujo Completo y UI de Resultados**
  - Conectar frontend con endpoint `/api/meetings/summarize`.
  - Renderizar tarjetas estilizadas para cada sección del JSON.
  - Botón de copiado con formato Markdown completo al portapapeles.
  - *Criterio de aceptación / Hecho cuando:* Una transcripción real o manual genere el resumen estructurado en tarjetas copiables a Markdown en la interfaz.
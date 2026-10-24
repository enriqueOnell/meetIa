# Tareas: MeetingAI MVP

- [ ] **T1: UI Inicial y Jitsi IFrame**
  - Crear el router básico o condicionales (Dashboard -> MeetingRoom).
  - Cargar SDK de `meet.jit.si` y renderizar div principal.
  - *Hecho cuando:* El usuario entra a la app, ve los colores oscuros (#121212) y puede iniciar una videollamada integrada.

- [ ] **T2: Captura de Voz y Controles**
  - Implementar hook `useTranscription.js`.
  - Crear UI lateral con botones de Iniciar/Pausar/Detener y un `<textarea>` para el modo fallback.
  - *Hecho cuando:* Al hablar al micrófono (o escribir a mano), el texto se almacene en el estado de React.

- [ ] **T3: Backend y Adaptación a DeepSeek / Gemma Local**
  - Crear endpoint POST `/api/meetings/summarize`.
  - Configurar la petición HTTP (vía `fetch`) apuntando a `https://api.deepseek.com/v1/chat/completions` (con API Key) o a `http://localhost:11434/api/generate` (Gemma en Ollama, sin API Key).
  - Escribir el prompt restrictivo exigiendo el JSON del plan.
  - *Hecho cuando:* Al enviar un texto de prueba vía Postman, el backend se comunique con DeepSeek o Gemma local y devuelva el JSON estructurado.

- [ ] **T4: Flujo Completo y Renderizado**
  - Conectar el botón "Generar Resumen" del frontend al backend enviando la transcripción acumulada.
  - Crear vista `SummaryReport.jsx` usando grid de Tailwind y tarjetas violetas (#8b5cf6).
  - Añadir función "Copiar al portapapeles" en Markdown.
  - *Hecho cuando:* La app permita grabar la voz en la reunión, generar el reporte y copiar el resultado.
# Plan de Acción: MeetingAI MVP

## Integración de IA
- **Opción A (Nube)**: DeepSeek API (modelo `deepseek-chat`). Requiere API Key y conexión a internet.
- **Opción B (Local)**: Gemma ejecutándose en local mediante Ollama (modelo `gemma:2b` o superior) expuesto en el puerto 11434. Costo cero y máxima privacidad.
- **Estrategia**: Se utilizará `fetch` nativo en el controlador del backend (`server/controllers/meetingController.js`) para hacer las peticiones HTTP directas al LLM seleccionado, exigiendo siempre un output en JSON.

## Arquitectura
- **Frontend** (`client/`): React + Vite. Componentes principales: `Dashboard.jsx`, `MeetingRoom.jsx`, `SummaryReport.jsx`.
- **Backend** (`server/`): Node + Express con middleware CORS y JSON Parser.
- **Integración de IA**:
  - *Alternativa seleccionada*: DeepSeek 4.1 Flash (vía API compatible).
  - *Alternativa descartada*: Modelos de OpenAI (para reducción de costos y cumplimiento de la constitución).

## Modelo de Datos (Contrato Backend-Frontend)
Endpoint `POST /api/meetings/summarize`
**Response Esperado (JSON Estricto)**:
```json
{
  "resumen": "string",
  "puntos_clave": ["string"],
  "decisiones": ["string"],
  "tareas": [
    { "responsable": "string", "tarea": "string", "fecha": "string" }
  ],
  "preguntas": ["string"]
}
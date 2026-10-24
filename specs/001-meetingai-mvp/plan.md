# Plan de Implementación: MeetingAI MVP

## 1. Arquitectura General
- **Frontend (`client/`)**: React + Vite + Tailwind CSS.
  - Vista Dashboard para unirse a salas de Jitsi (Jitsi IFrame API).
  - Capturador de audio mediante Web Speech API nativa.
  - Cuadro `<textarea>` como fallback manual.
  - Visualizador de tarjetas de resumen con botón de copiado a Markdown.
- **Backend (`server/`)**: Node.js + Express.
  - Middlewares: `cors`, `express.json()`, `dotenv`.
  - Integración nativa (`fetch`) con LLMs (DeepSeek / Gemma local vía Ollama).

## 2. Integración de IA
- **Endpoint**: `POST /api/meetings/summarize`
- **Request Body**:
  ```json
  {
    "transcript": "string",
    "provider": "deepseek" | "ollama",
    "model": "deepseek-chat" | "gemma:2b" | "gemma:7b" // opcional con defaults
  }
  ```
- **Conectores (fetch nativo)**:
  - DeepSeek: `https://api.deepseek.com/v1/chat/completions` (usando `DEEPSEEK_API_KEY`).
  - Gemma vía Ollama: `http://localhost:11434/v1/chat/completions` o `http://localhost:11434/api/generate`.
- **Formato JSON Estricto**:
  ```json
  {
    "resumen": "string",
    "puntos_clave": ["string"],
    "decisiones": ["string"],
    "tareas": ["string"],
    "preguntas": ["string"]
  }
  ```

## 3. Fases de Ejecución

### Fase 1: Inicialización de Estructuras
- [ ] Inicializar backend en `server/` con `package.json`, Express, CORS y dotenv.
- [ ] Inicializar frontend en `client/` con Vite + React + Tailwind CSS.
- [ ] Configurar variables de entorno `.env.example` y `.env` para ambos entornos.

### Fase 2: Backend (API & Servicio LLM)
- [ ] Crear servicio de inferencia con `fetch` nativo para DeepSeek y Ollama con prompt estricto en JSON.
- [ ] Crear endpoint `POST /api/meetings/summarize` con validaciones y manejo de errores.
- [ ] Probar endpoint con mock o transcripción de prueba.

### Fase 3: Frontend (Captura y Jitsi)
- [ ] Integrar Jitsi IFrame API en componente de reunión.
- [ ] Implementar hook/servicio de Web Speech API nativo con controles (Iniciar, Pausar, Limpiar).
- [ ] Añadir fallback de `<textarea>` editable en tiempo real.

### Fase 4: Frontend (Consumo y Visualización)
- [ ] Conectar frontend con endpoint `POST /api/meetings/summarize`.
- [ ] Diseñar tarjetas en Tailwind CSS (tema oscuro `#121212`, acentos `#8b5cf6`).
- [ ] Implementar función para exportar/copiar el análisis completo a Markdown.
# AGENTS.md — MeetingAI MVP

## Proyecto
Aplicación web (MVP) para transcripción en tiempo real y resumen inteligente de reuniones usando React, Vite, Express, Jitsi IFrame API y LLMs independientes (DeepSeek 4.1 Flash o Gemma).

## Comandos
- Frontend: `cd client && npm run dev` (puerto 5173)
- Backend: `cd server && npm run dev` (puerto 3000)
- Estilos: Tailwind ya está inicializado vía `npx tailwindcss init -p`.

## Estilo y convenciones
- Frontend en React (JSX), ECMAScript moderno, TailwindCSS para estilos.
- Backend en Node.js + Express.
- Idioma del código en inglés (variables, funciones), pero las respuestas UI de la IA y documentación en español.

## Reglas
- Lee `docs/constitution.md` y la spec activa en `specs/001-meetingai-mvp/spec.md` antes de tocar código.
- Tienes prohibido usar la API estándar de OpenAI (GPT-4/3.5). Todo procesamiento debe realizarse configurando el cliente para DeepSeek 4.1 Flash o Gemma (ej. usando Groq o la base URL de DeepSeek).
- Al terminar cualquier tarea: Verifica que tanto el cliente como el servidor levanten sin errores de dependencias.
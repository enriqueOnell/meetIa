# AGENTS.md — MeetingAI MVP

## Proyecto
Aplicación web diseñada para crear salas de videollamada, capturar transcripciones de voz en tiempo real y generar resúmenes automáticos mediante inteligencia artificial[cite: 2]. Arquitectura dividida en un cliente (React + Vite) y un servidor (Node + Express) integrado con Jitsi, Web Speech API y OpenAI.

## Comandos
- Ejecutar Frontend: `npm run dev` (En puerto 5173, desde carpeta `/client`).
- Ejecutar Backend: `npm run dev` (Requiere nodemon, en puerto 3000, desde carpeta `/server`).
- Instalar dependencias: `npm install` (Ejecutar independientemente en ambas carpetas).

## Estilo y convenciones
- Javascript moderno (ES6+) con Hooks funcionales en React[cite: 2].
- Diseño estético estricto mediante Tailwind CSS utilizando tema oscuro (fondo carbón `#121212` y superficie `#1e1e1e`) con acentos violetas (`#8b5cf6`).

## Reglas
- Lee `docs/constitution.md` y la spec activa antes de tocar código[cite: 2].
- No alterar las variables de entorno sin antes añadir su equivalente en `.env.example`.
- Si fallan los permisos de micrófono de la Web Speech API, mostrar SIEMPRE un input manual como fallback.

## Al terminar cualquier tarea
- Ejecutar la suite completa para asegurar que ambos servidores levantan correctamente[cite: 2] y que el JSON del reporte de IA se muestra de forma íntegra en la UI.
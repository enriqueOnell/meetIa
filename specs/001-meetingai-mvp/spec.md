# Especificación: MeetingAI MVP

## Requisitos Funcionales (EARS)

- **RF1**: El sistema mostrará un Dashboard para ingresar a Jitsi Meet mediante Jitsi IFrame API.
- **RF2**: El sistema usará la Web Speech API nativa del navegador para la transcripción en vivo.
- **RF3**: El sistema ofrecerá un cuadro de texto (`<textarea>`) como fallback manual si no hay micrófono disponible o falla la Web Speech API.
- **RF4**: El sistema enviará la transcripción al backend (`Node.js/Express`) para ser procesada por DeepSeek o Gemma local vía `fetch` nativo, solicitando y validando una respuesta en formato JSON estructurado.
- **RF5**: El sistema renderizará tarjetas interactivas (resumen ejecutivo, puntos clave, decisiones y tareas/action items) copiables en formato Markdown.

## Fuera de Alcance

- Autenticación y gestión de usuarios (Auth).
- Persistencia en base de datos.
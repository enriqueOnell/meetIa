# Especificación: MeetingAI MVP

## Requisitos Funcionales (EARS)
1. **RF1**: Cuando el usuario ingrese al inicio, el sistema deberá mostrar un Dashboard para ingresar un link y crear la sala Jitsi.
2. **RF2**: Mientras la reunión esté activa, el sistema deberá utilizar Web Speech API (`useTranscription.js`) para acumular el texto hablado.
3. **RF3**: Si el navegador deniega permisos de micrófono, el sistema deberá ofrecer un cuadro de texto para ingresar los apuntes manualmente.
4. **RF4**: Cuando se detenga la reunión, el sistema enviará la transcripción al backend para ser procesada por DeepSeek 4.1 Flash / Gemma, requiriendo JSON estructurado.
5. **RF5**: El sistema deberá renderizar las tarjetas del resumen (resumen, puntos clave, decisiones, tareas) y permitir su copia al portapapeles en formato Markdown.

## Fuera de Alcance
- Autenticación o login de usuarios.
- Almacenamiento persistente en base de datos.
- Soporte para navegadores incompatibles con Web Speech API (se delega todo al fallback manual).

## Criterios de Finalización
- La interfaz Jitsi carga correctamente embebida.
- El backend devuelve correctamente el JSON interpretado por DeepSeek/Gemma.
- El modo oscuro de Tailwind se aplica globalmente.
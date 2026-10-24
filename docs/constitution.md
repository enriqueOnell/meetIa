# Constitución del Proyecto

1. **Stack Limitado:** Frontend estricto en React/Vite con Tailwind CSS; Backend exclusivo con Node.js y Express.
2. **Dependencias Externas:** Obligatorio delegar el video a Jitsi IFrame API y la captura de voz a Web Speech API del navegador.
3. **Resiliencia UI:** Proveer siempre un textarea manual si el usuario deniega los permisos de audio.
4. **Validación de Entorno:** Mostrar alertas claras en la interfaz si Jitsi falla o si la clave de OpenAI no está configurada.
5. **Calidad de Prompting:** Los prompts enviados a OpenAI deben exigir de forma inquebrantable una salida en formato JSON estructurado.
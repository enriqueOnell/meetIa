# Constitución del Proyecto MeetingAI

1. **Stack Tecnológico Estricto**: Frontend con React + Vite + TailwindCSS. Backend con Node.js + Express.
2. **Independencia de OpenAI Estricta**: Está prohibido usar la API de OpenAI. El backend utilizará la API oficial de DeepSeek o una instancia local de Gemma (ej. vía Ollama). Para mantener el proyecto ligero, se priorizará el uso de `fetch` nativo de Node.js en lugar de instalar el SDK de `openai`, apuntando directamente a `https://api.deepseek.com/v1` o `http://localhost:11434/v1`.
3. **Manejo de Audio Robusto**: Uso exclusivo de Web Speech API nativa. SIEMPRE debe proveerse un `textarea` manual como fallback en caso de bloqueos del micrófono por parte del navegador.
4. **Formato Estricto de IA**: El LLM deberá devolver las salidas (resumen, decisiones, tareas) en formato JSON puro.
5. **UI Minimalista/Oscura**: Se debe usar un tema oscuro (fondo `#121212`, acentos `#8b5cf6`) y lucide-react para los iconos.
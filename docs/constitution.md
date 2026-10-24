# Constitución — MeetingAI MVP

1. **Stack**: Frontend React + Vite + Tailwind CSS. Backend Node.js + Express.
2. **Independencia de OpenAI Estricta**: Prohibido usar la API de OpenAI o su SDK. El backend utilizará `fetch` nativo apuntando a DeepSeek (`https://api.deepseek.com/v1`) o Gemma local vía Ollama (`http://localhost:11434/v1`).
3. **Audio**: Web Speech API nativa con `<textarea>` de fallback.
4. **IA**: Salidas estrictas en formato JSON.
5. **UI**: Tema oscuro (`#121212`) y acentos (`#8b5cf6`).
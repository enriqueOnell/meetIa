/**
 * Servicio de LLM utilizando exclusivamente fetch nativo.
 * Soporta DeepSeek API y Ollama local (Gemma u otros modelos compatibles con formato OpenAI API).
 * Cumple con la regla estricta de no usar SDKs de OpenAI ni de terceros.
 */

const SYSTEM_PROMPT = `Eres un asistente experto en análisis y resumen de reuniones de trabajo y proyectos.
Tu objetivo es analizar la transcripción de una reunión y extraer información estructurada en español.

Debes responder ÚNICAMENTE con un objeto JSON válido, sin bloques de código markdown (\`\`\`json), sin comentarios y sin texto adicional antes o después.

La estructura exacta del JSON DEBE ser:
{
  "resumen": "Resumen ejecutivo claro y conciso de lo conversado (2-4 párrafos)",
  "puntos_clave": ["Punto 1", "Punto 2", "Punto 3"],
  "decisiones": ["Decisión 1 acordada", "Decisión 2 acordada"],
  "tareas": ["Acción o tarea asignada 1 (Responsable si aplica)", "Acción 2"],
  "preguntas": ["Duda o pregunta abierta pendiente 1", "Pregunta 2"]
}

Si alguna categoría no tiene elementos explícitos en la transcripción, devuelve un array vacío [] para ese campo. No inventes información no mencionada.`;

/**
 * Limpia y parsea el texto JSON devuelto por el modelo
 */
function cleanAndParseJSON(rawContent) {
  if (typeof rawContent !== 'string') {
    throw new Error('El contenido retornado por el modelo no es una cadena válida.');
  }

  // Remover posibles backticks de markdown que algunos modelos agregan
  let cleaned = rawContent.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  cleaned = cleaned.trim();

  // Encontrar el primer '{' y el último '}' para extraer únicamente el bloque JSON si hay texto circundante
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    const parsed = JSON.parse(cleaned);

    // Asegurar estructura esperada por la especificación
    return {
      resumen: typeof parsed.resumen === 'string' ? parsed.resumen : '',
      puntos_clave: Array.isArray(parsed.puntos_clave) ? parsed.puntos_clave : [],
      decisiones: Array.isArray(parsed.decisiones) ? parsed.decisiones : [],
      tareas: Array.isArray(parsed.tareas) ? parsed.tareas : [],
      preguntas: Array.isArray(parsed.preguntas) ? parsed.preguntas : []
    };
  } catch (err) {
    console.error('Error parseando JSON de respuesta del modelo:', rawContent);
    throw new Error(`La respuesta del modelo no cumple con el formato JSON estricto: ${err.message}`);
  }
}

/**
 * Inferencia usando DeepSeek API (Cloud)
 */
async function callDeepSeek({ transcript, model = 'deepseek-chat', apiKey }) {
  const key = apiKey || process.env.DEEPSEEK_API_KEY;
  if (!key) {
    throw new Error('No se encontró DEEPSEEK_API_KEY en las variables de entorno ni en la petición.');
  }

  const endpoint = 'https://api.deepseek.com/v1/chat/completions';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Transcripción de la reunión:\n\n${transcript}` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error DeepSeek API (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawContent = data?.choices?.[0]?.message?.content;
  return cleanAndParseJSON(rawContent);
}

/**
 * Inferencia usando Gemma vía Ollama local
 */
async function callOllama({ transcript, model = 'gemma:2b', baseUrl }) {
  const host = baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const endpoint = `${host}/v1/chat/completions`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Transcripción de la reunión:\n\n${transcript}` }
      ],
      format: 'json',
      stream: false,
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error Ollama (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawContent = data?.choices?.[0]?.message?.content || data?.message?.content;
  return cleanAndParseJSON(rawContent);
}

/**
 * Método unificado para resumir reunión
 */
export async function summarizeMeeting({ transcript, provider = 'deepseek', model, apiKey, baseUrl }) {
  if (!transcript || typeof transcript !== 'string' || !transcript.trim()) {
    throw new Error('La transcripción es obligatoria y no puede estar vacía.');
  }

  const selectedProvider = provider.toLowerCase();

  if (selectedProvider === 'ollama' || selectedProvider === 'gemma') {
    return await callOllama({
      transcript,
      model: model || 'gemma:2b',
      baseUrl
    });
  }

  // Default a deepseek
  return await callDeepSeek({
    transcript,
    model: model || 'deepseek-chat',
    apiKey
  });
}

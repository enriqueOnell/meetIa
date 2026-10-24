import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { summarizeMeeting } from './services/llmService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MeetingAI MVP Backend',
    timestamp: new Date().toISOString()
  });
});

// Endpoint principal para resumir la reunión
app.post('/api/meetings/summarize', async (req, res) => {
  try {
    const { transcript, provider, model, apiKey, baseUrl } = req.body;

    if (!transcript || !transcript.trim()) {
      return res.status(400).json({
        error: 'El campo "transcript" es requerido.'
      });
    }

    const summaryResult = await summarizeMeeting({
      transcript,
      provider: provider || 'deepseek',
      model,
      apiKey,
      baseUrl
    });

    return res.json({
      success: true,
      data: summaryResult
    });
  } catch (error) {
    console.error('[Error /api/meetings/summarize]:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error interno al procesar el resumen de la reunión.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`[MeetingAI Server] Servidor ejecutándose en http://localhost:${PORT}`);
});

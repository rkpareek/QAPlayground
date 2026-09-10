import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(customApiKey?: string): GoogleGenAI | null {
  const key = customApiKey || process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Agentic Python Learning Server-Side Gemini API Proxy
  app.post('/api/learn-python/generate', async (req, res) => {
    try {
      const { systemPrompt, userPrompt, apiKey } = req.body;

      const ai = getGeminiClient(apiKey);
      if (!ai) {
        return res.status(400).json({
          error: 'No Gemini API key configured. Provide GEMINI_API_KEY environment variable or custom key in settings.',
        });
      }

      // Use modern @google/genai SDK with gemini-3.8-flash
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt || 'Hello Python Coach',
        config: {
          systemInstruction: systemPrompt || undefined,
          temperature: 0.3,
        },
      });

      return res.json({
        text: response.text || '',
      });
    } catch (error: any) {
      console.error('Gemini API execution error:', error);
      return res.status(500).json({
        error: error?.message || 'Gemini processing failed',
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

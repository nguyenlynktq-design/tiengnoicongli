import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Public folder for pre-synthesized WAV files
const publicDir = path.resolve(process.cwd(), 'public');
const cacheDir = path.resolve(publicDir, 'audio', 'cache');

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// Serve static assets from public/
app.use(express.static(publicDir));

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: AI TTS on-demand with caching
app.post('/api/tts', async (req, res) => {
  try {
    const { text, style, voice } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text parameter is required' });
      return;
    }

    const voiceName = voice || 'Aoede';
    const stylePrompt = style || 'Đọc bằng giọng nữ miền Bắc Hà Nội chuẩn xác, thanh lịch, ấm áp, truyền cảm sư phạm như cô giáo Ngữ văn';
    
    // Create cache key based on hash
    const hash = crypto.createHash('md5').update(`${text}_${voiceName}_${stylePrompt}`).digest('hex');
    const cacheFileName = `${hash}.wav`;
    const cacheFilePath = path.join(cacheDir, cacheFileName);
    const audioUrl = `/audio/cache/${cacheFileName}`;

    if (fs.existsSync(cacheFilePath)) {
      res.json({ audioUrl, cached: true });
      return;
    }

    // Call Gemini TTS model: gemini-3.8-flash-lite-tts
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.trim(),
              speechMetadata: {
                style: stylePrompt,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      res.status(502).json({ error: 'No audio returned from Gemini model' });
      return;
    }

    const buffer = Buffer.from(base64Audio, 'base64');
    fs.writeFileSync(cacheFilePath, buffer);

    res.json({ audioUrl, cached: false });
  } catch (err: any) {
    console.error('TTS error:', err?.message || err);
    res.status(500).json({ error: err?.message || 'TTS generation failed' });
  }
});

// Endpoint: List available static audio files
app.get('/api/audio-list', (req, res) => {
  try {
    const audioDir = path.resolve(publicDir, 'audio');
    if (fs.existsSync(audioDir)) {
      const files = fs.readdirSync(audioDir).filter((f) => f.endsWith('.wav'));
      res.json({ audios: files });
    } else {
      res.json({ audios: [] });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Mount Vite or Serve Static build
async function startServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

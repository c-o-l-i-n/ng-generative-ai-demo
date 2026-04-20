import { GoogleGenAI } from '@google/genai';
import { serve } from '@hono/node-server';
import dotenv from 'dotenv';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { stream } from 'hono/streaming';

dotenv.config();

const { GOOGLE_AI_STUDIO_API_KEY } = process.env;

if (!GOOGLE_AI_STUDIO_API_KEY) {
  throw new Error('Provide GOOGLE_AI_STUDIO_API_KEY in a .env file');
}

const ai = new GoogleGenAI({ apiKey: GOOGLE_AI_STUDIO_API_KEY });
const chat = ai.chats.create({ model: 'gemini-3.1-flash-lite-preview' });

const app = new Hono();

app.use(cors());

app.post('/message', async (c) => {
  const prompt = await c.req.text();

  console.log('Received prompt:', prompt);

  if (!prompt) {
    return c.body(null, 400);
  }

  return stream(c, async (s) => {
    try {
      console.log('Generating response:');
      const response = await chat.sendMessageStream({
        message: prompt,
      });

      for await (const chunk of response) {
        const chunkText = chunk.text;
        console.log(chunkText);
        await s.write(chunkText ?? '');
      }
    } catch (err) {
      console.error('Error generating response:', err);
    }
  });
});

const port = 3000;
serve({ fetch: app.fetch, port }, () => {
  console.log('Server is running on port', port);
});

import { GoogleGenerativeAI } from '@google/generative-ai';
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

const genAI = new GoogleGenerativeAI(GOOGLE_AI_STUDIO_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
const chat = model.startChat();

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
      const result = await chat.sendMessageStream(prompt);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        await s.write(chunkText);
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

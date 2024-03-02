import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const server = express();
const port = 3000;

const googleAiStudioApiKey = process.env['GOOGLE_AI_STUDIO_API_KEY'];

if (!googleAiStudioApiKey) {
  throw new Error('Provide GOOGLE_AI_STUDIO_API_KEY in a .env file');
}

const genAI = new GoogleGenerativeAI(googleAiStudioApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
const chat = model.startChat();

server.use(express.text());
server.use(cors());

server.listen(port, () => {
  console.log('Server is running on port', port);
});

server.post('/message', async (req, res) => {
  const prompt: string = req.body;
  const result = await chat.sendMessageStream(prompt);

  for await (const partialMessage of result.stream) {
    res.write(partialMessage.text());
  }

  res.end();
});

# 🤖 Angular Generative AI Demo

[Demo](https://github.com/c-o-l-i-n/ng-generative-ai-demo/assets/40863449/b296b7b6-c6b4-4f83-adcb-de9c98c2c00f)

## 🤔 Why does this matter?

Integrating generative AI into Angular apps unlocks a realm of possibilities for enhancing user interactions and experiences. With LLM APIs and some RxJS magic, developers can implement personalized chatbots, interactive storytelling, and dynamic content creation.

## 🏃 Getting started

1. Visit the [Google AI Studio](https://aistudio.google.com/app/apikey) to generate an API key.

2. Create a `.env` file in the project root with your API key:

   ```
   GOOGLE_AI_STUDIO_API_KEY=paste-api-key-here
   ```

3. Run `npm install` to install dependencies.

4. Run `npm run server` to start the backend server (`server.ts`) on port 3000. The server accepts a message request and uses the Google Gemini API to stream an AI-generated response.

5. In another terminal, run `npm start` to start the Angular dev server on port 4200.

6. Navigate to `http://localhost:4200/`

## 🔑 Key takeaways

- **Unleashing Generative AI:** Integrate powerful AI capabilities into Angular apps using an LLM API, offering users dynamic and engaging experiences.

- **Real-time Text Streaming:** Utilize RxJS and Signals to stream real-time AI text responses directly to users, enhancing interactivity and responsiveness.

- **HTTP Client Configuration:** Configure the Angular HTTP client to handle real-time AI text streams:

  1. Provide the HTTP client "with fetch" in [`app.config.ts`](src/app/app.config.ts):

  ```typescript
  provideHttpClient(withFetch());
  ```

  2. Tell the HTTP client to observe text events and report progress:

  ```typescript
  this.http.post('http://localhost:3000/message', prompt, {
    observe: 'events',
    responseType: 'text',
    reportProgress: true,
  });
  ```

## 🔭 Files to explore

- [`message.service.ts`](src/app/message.service.ts)
- [`app.config.ts`](src/app/app.config.ts)
- [`server.ts`](src/server.ts)

# 🤖 Angular Generative AI Demo

[Demo](https://github.com/c-o-l-i-n/ng-generative-ai-demo/assets/40863449/b296b7b6-c6b4-4f83-adcb-de9c98c2c00f)

## 🤔 Why does this matter?

Generative AI is changing the way we interact with technology. As AI chatbots become more commonplace, users expect certain behaviors from our apps, such as realtime text updates. Using LLM APIs, Signals, and some RxJS magic, we can create modern AI-driven user experiences.

## 🏃 Getting started

> [!NOTE]  
> The Gemini API is free, so long as you're willing to share all of your usage data with Google.

1. Run `git clone https://github.com/c-o-l-i-n/ng-generative-ai-demo.git` to clone this repo.

2. Visit the [Google AI Studio](https://aistudio.google.com/app/apikey) to generate an API key.

3. Create a `.env` file in the project root with your API key:

   ```
   GOOGLE_AI_STUDIO_API_KEY=paste-api-key-here
   ```

4. Run `npm install` to install dependencies.

5. Run `npm run server` to start the backend server (`server.ts`) on port 3000.

6. In another terminal, run `npm start` to start the Angular dev server on port 4200.

7. Navigate to `http://localhost:4200/`

## 🔑 Key takeaways

- **Manage State with Signals:** Track chat state using Angular Signals. `completeMessages` and `incomingMessage` are writable signals; `messages` and `generatingInProgress` are derived with `computed`.

- **Realtime Text Streaming with RxJS Observables:** Utilize RxJS to react to realtime updates from the LLM API.

- **HTTP Client Configuration:** Configure the Angular HTTP client to handle realtime text streams:
  1. Provide the HTTP client "with fetch" in [`app.config.ts`](src/app/app.config.ts):

  ```typescript
  provideHttpClient(withFetch()),
  ```

  2. Tell the HTTP client to observe text events and report progress:

  ```typescript
  this.http.post('http://localhost:3000/message', prompt, {
    responseType: 'text',
    observe: 'events',
    reportProgress: true,
  });
  ```

- **Loading State:** While waiting for the first chunk, show a pulsing indicator. In this demo, we use Tailwind's `animate-pulse` class:

  ```html
  <div class="size-4 animate-pulse rounded-full bg-white"></div>
  ```

- **Markdown Rendering:** Render AI responses as markdown using [ngx-markdown](https://github.com/jfcere/ngx-markdown):

  ```html
  <markdown [data]="message.text" />
  ```

## 🔭 Files to explore

- [`message.service.ts`](src/app/message.service.ts)
- [`app.config.ts`](src/app/app.config.ts)
- [`server.ts`](src/server.ts)

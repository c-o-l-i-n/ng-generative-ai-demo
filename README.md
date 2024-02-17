# 🤖 Angular Generative AI Demo

[Demo](https://github.com/c-o-l-i-n/test-video/assets/40863449/5e1c3228-c421-4988-a19c-ac98a57d17ff)

## 🏃 Getting started

Create a `.env` file in the project root with your [Google AI Studio API key](https://aistudio.google.com/app/apikey):

```
GOOGLE_AI_STUDIO_API_KEY=paste-api-key-here
```

Run `npm run server` to start the backend server (`server.ts`) on port 3000. The server accepts a message request and uses the Google Gemini API to stream an AI-generated response.

Run `npm start` to start the Angular dev server on port 4200.

Navigate to `http://localhost:4200/`

## 🔑 Key takeaways

Using the Google AI Studio API (or any other LLM API), we can add world-class generative AI to our Angular app!

By combining RxJS and Signals, we can stream realtime AI text responses to the user.

To get the realtime stream of text from the AI, we need to configure 2 things with the HTTP client:

1. Provide the HTTP client "with fetch":

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

See `message.service.ts` for more implementation details.

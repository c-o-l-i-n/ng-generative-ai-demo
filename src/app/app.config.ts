import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      // use `fetch` behind the scenes to support streaming partial responses
      withFetch(),
    ),

    // add markdown support to handle llm output
    provideMarkdown(),
  ],
};

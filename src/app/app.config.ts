import { ApplicationConfig } from '@angular/core';
import { provideMarkdown } from 'ngx-markdown';

export const appConfig: ApplicationConfig = {
  providers: [
    // add markdown support to handle llm output
    provideMarkdown(),
  ],
};

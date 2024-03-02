import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      // use `fetch` behind the scenes to support streaming partial responses
      withFetch(),
    ),
  ],
};

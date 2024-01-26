import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ApiConnectorConfiguration } from '@meme-lib/api-connector';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: ApiConnectorConfiguration,
      useValue: new ApiConnectorConfiguration({ basePath: '' }),
    },
  ],
};

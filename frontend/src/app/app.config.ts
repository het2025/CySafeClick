import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { reducers, metaReducers } from './store';
import { provideHttpClient } from '@angular/common/http';
import { NotificationEffects } from './store/notification.store';
import { DigestEffects } from './store/digest.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideStore(reducers, { metaReducers }),
    provideEffects([NotificationEffects, DigestEffects]),
    provideHttpClient()
  ]
};

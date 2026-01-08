// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));


import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { APP_INITIALIZER, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from './app/keycloak-init';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { keycloakTokenInterceptor } from './app/keycloak-token.interceptor';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { AppDateAdapter, APP_DATE_FORMATS } from './app/format-datepicker';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';



bootstrapApplication(AppComponent, {
  providers: [
    // provideHttpClient(
    //   withInterceptors([keycloakTokenInterceptor])
    // ),

    // importProvidersFrom(KeycloakAngularModule),
    // KeycloakService,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeKeycloak,
    //   multi: true,
    //   deps: [KeycloakService],
    // },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    provideNativeDateAdapter(),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },

  ],
});
function provideMomentDateAdapter(): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
  throw new Error('Function not implemented.');
}


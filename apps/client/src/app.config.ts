import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { provideStore } from '@ngxs/store';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';

import { appRoutes } from './app.routes';
import { AuthState } from './core/states/auth/auth.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),
    provideAnimations(),
    provideStore(
      [AuthState],
      withNgxsLoggerPlugin(),
      withNgxsStoragePlugin({
        keys: ['auth', 'user.savedTours', 'booking.bookings'],
      }),
      withNgxsReduxDevtoolsPlugin()
    ),
  ],
};

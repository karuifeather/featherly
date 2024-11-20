import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const appRoutes: Route[] = [
  { path: '', component: HomeComponent },
  {
    path: 'portal',
    loadChildren: () =>
      import('./pages/portal/portal.routes').then((m) => m.portalRoutes),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

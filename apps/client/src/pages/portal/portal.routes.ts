import { Route } from '@angular/router';
import { PortalComponent } from './portal.component';

export const portalRoutes: Route[] = [
  {
    path: '',
    component: PortalComponent,
    children: [
      { path: '', component: PortalComponent },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }, // Wildcard within portal
    ],
  },
];

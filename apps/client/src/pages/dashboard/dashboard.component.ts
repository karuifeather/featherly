import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthStateModel } from '../../core/states/auth/auth.model';
import { AuthState } from '../../core/states/auth/auth.state';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardComponent {
  private store = inject(Store);
  user$: Observable<AuthStateModel['user'] | null>;

  drawerOpen = false;

  tourPosts = [
    {
      title: 'The Great Canyon Adventure',
      description: 'Explore the stunning views of the Grand Canyon.',
      images: [
        'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828692/nat-9_dz9zov.jpg',
        'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828692/nat-8_tv2m3g.jpg',
      ],
      likes: 123,
      comments: [
        { user: 'Jane Doe', text: 'This place looks amazing!' },
        { user: 'John Smith', text: 'Can’t wait to visit!' },
      ],
    },
    {
      title: 'The Great Canyon Adventure',
      description: 'Explore the stunning views of the Grand Canyon.',
      images: [
        'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828692/nat-9_dz9zov.jpg',
        'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828692/nat-8_tv2m3g.jpg',
      ],
      likes: 123,
      comments: [
        { user: 'Jane Doe', text: 'This place looks amazing!' },
        { user: 'John Smith', text: 'Can’t wait to visit!' },
      ],
    },
    // Add more posts as needed
  ];

  // State for the user menu dropdown
  isUserMenuOpen = false;

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {
    this.user$ = this.store.select(AuthState.user);
  }

  toggleDrawer(): void {
    this.drawerOpen = !this.drawerOpen;
  }

  // Toggle the user menu
  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  // Log the user out
  logout(): void {
    const handleLogout = () => {
      this.router.navigate(['/']);
    };
    this.dashboardService.logout(handleLogout);
  }
}

import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { Store } from '@ngxs/store';
import { filter, Observable } from 'rxjs';
import { AuthStateModel } from '../../core/states/auth/auth.model';
import { AuthState } from '../../core/states/auth/auth.state';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);
  user$: Observable<AuthStateModel['user'] | null>;
  searchQuery = '';
  hideSearchBar = true;
  private hiddenRoutes = ['/dashboard', '/dashboard/home', '/dashboard/search']; // Routes where the search bar should be hidden

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

  ngOnInit(): void {
    // Check the current route on initialization
    const currentRoute = this.router.url.split('?')[0]; // Remove query params
    this.hideSearchBar = this.hiddenRoutes.includes(currentRoute);

    // Listen to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const updatedRoute = event.url.split('?')[0]; // Remove query params
        this.hideSearchBar = this.hiddenRoutes.includes(updatedRoute);
      });
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

  onSearch(): void {
    console.log('Search query:', this.searchQuery);
    // Navigate to the search results page with the query as a parameter
    if (this.searchQuery.trim()) {
      this.router.navigate(['/dashboard/search'], {
        queryParams: { keyword: this.searchQuery.trim() },
      });
    }

    this.searchQuery = '';
  }
}

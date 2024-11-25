import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardComponent {
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

  // Mock user data
  user = {
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'https://via.placeholder.com/40', // Replace with actual avatar URL
  };

  // Mock notifications
  notifications = [
    { id: 1, message: 'New tour booking request', read: false },
    { id: 2, message: 'Update available for your tour', read: true },
  ];

  // State for the user menu dropdown
  isUserMenuOpen = false;

  isNotificationsOpen = false;

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  toggleDrawer(): void {
    this.drawerOpen = !this.drawerOpen;
  }

  toggleNotificationsDropdown(): void {
    this.isNotificationsOpen = !this.isNotificationsOpen;
  }

  getUnreadNotificationsCount(): number {
    return this.notifications.filter((notification) => !notification.read)
      .length;
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

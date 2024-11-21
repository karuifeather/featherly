import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
})
export class HeaderComponent {
  user: {
    name: string;
    photo: string;
    accountConfirmToken?: string;
  } | null = {
    name: 'John Doe',
    photo: 'john.jpg',
    accountConfirmToken: 'sample-token', // Example value
  };

  dropdownOpen = false; // Tracks if the dropdown is open

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    console.log('User logged out');
    this.user = null; // Simulate logout
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    console.log('Scrolled');
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }
}

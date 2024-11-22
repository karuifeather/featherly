import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
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
    photo:
      'https://res.cloudinary.com/drj6tdlhy/image/upload/v1732165738/png-transparent-default-avatar_gpkcme.png',
    accountConfirmToken: 'sample-token', // Example value
  };

  dropdownOpen = false; // Tracks if the dropdown is open

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    console.log('User logged out');
    this.user = null; // Simulate logging out
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

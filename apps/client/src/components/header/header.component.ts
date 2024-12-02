import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
})
export class HeaderComponent {
  menuVisible = false;

  // Toggle the visibility of the menu
  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  // Close the menu when a link is clicked
  closeMenu() {
    this.menuVisible = false;
  }

  // Close the menu when clicking outside of it
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const menuElement = document.getElementById('mobile-menu');
    const hamburgerButton = document.getElementById('hamburger-btn');

    // Close the menu if clicking outside the menu or hamburger button
    if (
      this.menuVisible &&
      menuElement &&
      !menuElement.contains(event.target as Node) &&
      hamburgerButton &&
      !hamburgerButton.contains(event.target as Node)
    ) {
      this.menuVisible = false;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }
}

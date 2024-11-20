import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
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

  logout() {
    console.log('User logged out');
    this.user = null; // Simulate logout
  }
}

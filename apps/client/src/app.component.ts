import { Component } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent, FooterComponent],
})
export class AppComponent {
  isDashboard = false; // Tracks whether the current route is /dashboard

  constructor(private titleService: Title, private router: Router) {
    this.setTitle('Featherly | Find Exciting tours for adventurous people');
    this.router.events.subscribe(() => {
      this.isDashboard = this.router.url.startsWith('/dashboard');
    });
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}

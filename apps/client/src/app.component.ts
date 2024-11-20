import { Component } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterModule],
})
export class AppComponent {
  constructor(private titleService: Title) {
    this.setTitle('Featherly | Find Exciting tours for adventurous people');
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}

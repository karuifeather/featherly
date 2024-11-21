import { Component } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
})
export class AppComponent {
  constructor(private titleService: Title) {
    this.setTitle('Featherly | Find Exciting tours for adventurous people');
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}

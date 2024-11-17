import { Component } from '@angular/core';

import { NavigationComponent } from './components/navigation/navigation.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PopupComponent } from './components/popup/popup.component';

import { AboutComponent } from './pages/home/about/about.component';
import { FeaturesComponent } from './pages/home/features/features.component';
import { ToursComponent } from './pages/home/tours/tours.component';
import { StoriesComponent } from './pages/home/stories/stories.component';
import { BookingComponent } from './pages/home/booking/booking.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    NavigationComponent,
    HeaderComponent,
    AboutComponent,
    FeaturesComponent,
    ToursComponent,
    StoriesComponent,
    BookingComponent,
    FooterComponent,
    PopupComponent,
  ],
})
export class AppComponent {
  constructor(private titleService: Title) {
    this.setTitle('Featherly | Find Exciting tours for adventurous people');
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}

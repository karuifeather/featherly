import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';
import { register as registerSwiperElements } from 'swiper/element/bundle';

registerSwiperElements();

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);

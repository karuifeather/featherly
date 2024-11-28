import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { TourState } from '../../core/states/tour/tour.state';
import { ToursService } from './tours.service';
import { Observable, take } from 'rxjs';
import { Tour } from '../../core/states/tour/tour.model';

@Component({
  selector: 'app-tours',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ToursComponent implements OnInit {
  drawerOpen = false;

  private store = inject(Store);

  toursFeed$: Observable<Tour[]> = this.store.select(TourState.getToursFeed);

  constructor(
    private tourService: ToursService,
    private cdr: ChangeDetectorRef
  ) {}

  minPrice = 100; // Default minimum price
  maxPrice = 1000; // Default maximum price

  ngOnInit() {
    this.toursFeed$.subscribe((tours) => {
      if (!tours.length) {
        // Fetch tours if not already fetched
        this.tourService.fetchTours();
      }
    });
  }

  updatePriceRange(): void {
    // Prevent overlap: Ensure minPrice is less than or equal to maxPrice
    if (this.minPrice > this.maxPrice) {
      this.minPrice = this.maxPrice - 50; // Ensure a minimum step gap
    }
    if (this.maxPrice < this.minPrice) {
      this.maxPrice = this.minPrice + 50; // Ensure a minimum step gap
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  onSearch() {
    alert('Filter search hit');
  }
}

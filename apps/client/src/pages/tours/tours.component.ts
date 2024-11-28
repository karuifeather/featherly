import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { ToursFeed, TourStateModel } from '../../core/states/tour/tour.model';
import { TourState } from '../../core/states/tour/tour.state';
import { ToursService } from './tours.service';
import { Observable, take } from 'rxjs';
import { Tour } from '../../core/states/tour/tour.model';
import { ClearToursState } from '../../core/states/tour/tour.actions';

@Component({
  selector: 'app-tours',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ToursComponent implements OnInit, OnDestroy {
  drawerOpen = false;
  limit = 4;

  private store = inject(Store);

  toursFeed$: Observable<ToursFeed> = this.store.select(TourState.getToursFeed);
  currentPage$: Observable<number> = this.store.select(
    TourState.getCurrentPage
  );
  totalPages$: Observable<number> = this.store.select(TourState.getTotalPages);

  constructor(private tourService: ToursService) {}

  minPrice = 100; // Default minimum price
  maxPrice = 1000; // Default maximum price

  ngOnInit() {
    this.toursFeed$.subscribe((toursFeed) => {
      if (toursFeed.tours.length === 0) {
        // Fetch tours if not already fetched
        this.tourService.fetchTours({ page: 1, limit: 4 });
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

  nextPage(currentPage: number, totalPages: number) {
    if (currentPage < totalPages) {
      this.tourService.fetchTours({ page: currentPage + 1, limit: 4 });
      this.scrollToTop();
    }
  }

  prevPage(currentPage: number) {
    if (currentPage > 1) {
      this.tourService.fetchTours({ page: currentPage - 1, limit: 4 });
      this.scrollToTop();
    }
  }

  ngOnDestroy() {
    this.store.dispatch(new ClearToursState());
  }
}

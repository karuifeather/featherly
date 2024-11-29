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
import { ToursFeed } from '../../core/states/tour/tour.model';
import { TourState } from '../../core/states/tour/tour.state';
import { ToursService } from './tours.service';
import { Observable } from 'rxjs';
import { ClearToursState } from '../../core/states/tour/tour.actions';
import { TourFiltersComponent } from '../../components/filter/filter.component';

@Component({
  selector: 'app-tours',
  imports: [CommonModule, RouterModule, FormsModule, TourFiltersComponent],
  templateUrl: './tours.component.html',
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

  ngOnInit() {
    this.toursFeed$.subscribe((toursFeed) => {
      if (toursFeed.tours.length === 0) {
        // Fetch tours if not already fetched
        this.tourService.fetchTours({ page: 1, limit: this.limit });
      }
    });
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  nextPage(currentPage: number, totalPages: number) {
    if (currentPage < totalPages) {
      this.tourService.fetchTours({ page: currentPage + 1, limit: this.limit });
      this.scrollToTop();
    }
  }

  prevPage(currentPage: number) {
    if (currentPage > 1) {
      this.tourService.fetchTours({ page: currentPage - 1, limit: this.limit });
      this.scrollToTop();
    }
  }

  ngOnDestroy() {
    this.store.dispatch(new ClearToursState());
  }
}

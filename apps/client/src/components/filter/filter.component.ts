import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { TourState } from '../../core/states/tour/tour.state';
import { Tour } from '../../core/states/tour/tour.model';

@Component({
  selector: 'app-filters',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class TourFiltersComponent {
  private store = inject(Store);
  // Filters
  minRange = 100; // Minimum slider value
  maxRange = 2500; // Maximum slider value
  minPrice = 100; // Default min price
  maxPrice = 2500; // Default max price

  selectedSort = 'priceLowToHigh';
  selectedDifficulties = { easy: false, medium: false, difficult: false };

  // Tours data (Replace with NGXS state selector)
  toursFeed$ = this.store.selectSnapshot(TourState.getToursFeed);

  filteredTours: Tour[] = [];

  updatePriceRange(): void {
    // Prevent overlap: Ensure minPrice is less than or equal to maxPrice
    if (this.minPrice > this.maxPrice) {
      this.minPrice = this.maxPrice - 50; // Ensure a minimum step gap
    }
    if (this.maxPrice < this.minPrice) {
      this.maxPrice = this.minPrice + 50; // Ensure a minimum step gap
    }
  }

  onSearch(): void {
    const selectedDifficulties = Object.keys(this.selectedDifficulties).filter(
      (key) =>
        this.selectedDifficulties[key as keyof typeof this.selectedDifficulties]
    );

    // Filter tours
    this.filteredTours = this.toursFeed$.tours.filter((tour) => {
      return (
        tour.price >= this.minPrice &&
        tour.price <= this.maxPrice &&
        (selectedDifficulties.length === 0 ||
          selectedDifficulties.includes(tour.difficulty))
      );
    });

    // Sort filtered tours
    if (this.selectedSort === 'priceLowToHigh') {
      this.filteredTours.sort((a, b) => a.price - b.price);
    } else if (this.selectedSort === 'priceHighToLow') {
      this.filteredTours.sort((a, b) => b.price - a.price);
    } else if (this.selectedSort === 'rating') {
      this.filteredTours.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
    }

    this.toursFeed$.tours = this.filteredTours;
  }
}

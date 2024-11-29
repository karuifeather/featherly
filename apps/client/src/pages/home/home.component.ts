import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, Observable, take } from 'rxjs';
import { Tour } from '../../core/states/tour/tour.model';
import { TourState } from '../../core/states/tour/tour.state';
import { User } from '../../core/states/auth/auth.model';
import { HomeService } from './home.service';
import { BookingState } from '../../core/states/booking/booking.state';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  standalone: true,
})
export class HomeComponent implements OnInit {
  searchQuery = '';
  private store = inject(Store);

  recommendedTours$: Observable<Tour[] | null> = this.store.select(
    TourState.getRecommendedTours
  );

  upcomingBookings$ = this.store
    .select(BookingState.getUpcomingBookings)
    .pipe(
      map((bookings) =>
        bookings?.sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        )
      )
    );

  user$: Observable<User | null> = this.store.select(
    (state) => state.auth.user
  );

  constructor(private homeService: HomeService, private router: Router) {}

  ngOnInit(): void {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.homeService.fetchRecommendedTours(user.id);
        this.homeService.fetchUpcomingBookings(user.id);
      } else {
        console.error('No user found in the state.');
      }
    });
  }

  onSubmit(): void {
    // Navigate to the search results page with the query as a parameter
    console.log('searchQuery', this.searchQuery);
    this.router.navigate(['/dashboard/search'], {
      queryParams: { keyword: this.searchQuery },
    });
  }

  isAdmin(user: User | null): boolean {
    return !!user && user.role === 'admin';
  }
}

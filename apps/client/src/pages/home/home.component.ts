import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, take } from 'rxjs';
import { Tour } from '../../core/states/tour/tour.model';
import { TourState } from '../../core/states/tour/tour.state';
import { User } from '../../core/states/auth/auth.model';
import { HomeService } from './home.service';
import { Booking } from '../../core/states/booking/booking.model';
import { BookingState } from '../../core/states/booking/booking.state';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  standalone: true,
})
export class HomeComponent implements OnInit {
  private store = inject(Store);

  recommendedTours$: Observable<Tour[] | null> = this.store.select(
    TourState.getRecommendedTours
  );

  upcomingBookings$: Observable<Booking[] | null> = this.store.select(
    BookingState.getUpcomingBookings
  );

  user$: Observable<User | null> = this.store.select(
    (state) => state.auth.user
  );

  constructor(private homeService: HomeService) {}

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

  isAdmin(user: User | null): boolean {
    return !!user && user.role === 'admin';
  }
}

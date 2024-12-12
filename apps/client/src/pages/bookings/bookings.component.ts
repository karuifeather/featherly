import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { BookingsService } from './bookings.service';
import { BookingState } from '../../core/states/booking/booking.state';
import { map } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  imports: [CommonModule, RouterModule],
  standalone: true,
})
export class BookingsComponent implements OnInit {
  activeTab: 'upcoming' | 'past' = 'upcoming';
  store = inject(Store);

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
  pastBookings$ = this.store.select(BookingState.getPastBookings);

  constructor(private bookingsService: BookingsService) {}

  ngOnInit() {
    const user = this.store.selectSnapshot((state) => state.auth.user);

    if (!user) {
      // Handle the unlikely case where user is not available
      console.error('User not found in state.');
      return;
    }

    // Always Fetch upcoming bookings
    this.bookingsService.fetchUpcomingBookings(user.id);

    // Fetch past bookings if not already fetched
    const pastBookings = this.store.selectSnapshot(
      BookingState.getPastBookings
    );

    if (!pastBookings) {
      this.bookingsService.fetchPastBookings(user.id);
    }
  }

  setActiveTab(tab: 'upcoming' | 'past') {
    this.activeTab = tab;
  }
}

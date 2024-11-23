import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  imports: [CommonModule],
  standalone: true,
})
export class BookingsComponent {
  activeTab: 'upcoming' | 'past' = 'upcoming';

  bookings = [
    {
      title: 'The Alpine Forest Adventure',
      date: new Date('2024-12-15'),
      location: 'Boulder, Colorado',
      guests: 2,
      image:
        'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828690/nat-2_hshww7.jpg',
      status: 'upcoming',
    },
    {
      title: 'The Great Canyon Tour',
      date: new Date('2023-10-10'),
      location: 'Grand Canyon, Arizona',
      guests: 4,
      image:
        'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828692/nat-8_tv2m3g.jpg',
      status: 'past',
    },
    {
      title: 'Relaxation Retreat',
      date: new Date('2023-09-15'),
      location: 'Malibu Beach, California',
      guests: 1,
      image:
        'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828692/nat-9_dz9zov.jpg',
      status: 'past',
    },
  ];

  get activeBookings() {
    return this.bookings.filter((booking) => booking.status === this.activeTab);
  }

  setActiveTab(tab: 'upcoming' | 'past') {
    this.activeTab = tab;
  }
}

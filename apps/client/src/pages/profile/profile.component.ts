import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ProfileComponent {
  profile = {
    firstName: 'John',
    lastName: 'Doe',
    memberSince: '2022-01-01',
    imageUrl: 'https://via.placeholder.com/150',
  };

  currentTab = 'createdTours';

  tabs = [
    { key: 'createdTours', label: 'Created Tours' },
    { key: 'likedTours', label: 'Liked Tours' },
    { key: 'savedTours', label: 'Saved Tours' },
  ];

  createdTours = [
    {
      name: 'The Alpine Forest Adventure',
      description: 'A breathtaking adventure.',
      image:
        'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828690/nat-1_spztdy.jpg',
    },
    {
      name: 'The Desert Safari',
      description: 'Experience the golden dunes.',
      image:
        'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828690/nat-3_jry3ei.jpg',
    },
  ];

  likedTours = [
    {
      name: 'The Beachside Bliss',
      description: 'Relax by the ocean.',
      image:
        'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828690/nat-3_jry3ei.jpg',
    },
  ];

  savedTours = [
    {
      name: 'The Mountain Escape',
      description: 'Escape to the mountains.',
      image:
        'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828690/nat-3_jry3ei.jpg',
    },
  ];
}

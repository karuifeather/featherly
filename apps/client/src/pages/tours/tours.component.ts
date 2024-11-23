import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tours',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ToursComponent {
  drawerOpen = false;
  tourPosts = [
    {
      title: 'The Alpine Forest Adventure',
      slug: 'the-alpine-forest-adventure',
      description:
        'Explore the pristine alpine forests and breathtaking landscapes with expert guides.',
      images: [
        'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828692/nat-9_dz9zov.jpg',
        'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828690/nat-2_hshww7.jpg',
      ],
      duration: 7,
      maxGroupSize: 12,
      difficulty: 'medium',
      ratingsAverage: 4.8,
      ratingsQuantity: 57,
      price: 799,
      likes: 123,
      comments: [
        { user: 'Jane Doe', text: 'Absolutely stunning experience!' },
        { user: 'John Smith', text: 'Highly recommend this adventure.' },
      ],
    },
    {
      title: 'Desert Safari Adventure',
      slug: 'desert-safari-adventure',
      description:
        'Experience the thrill of a desert safari, including dune bashing, camel rides, and stargazing.',
      images: [
        'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828692/nat-10_qweewy.jpg',
        'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828692/nat-11_jkasdf.jpg',
      ],
      duration: 5,
      maxGroupSize: 15,
      difficulty: 'easy',
      ratingsAverage: 4.5,
      ratingsQuantity: 43,
      price: 599,
      likes: 89,
      comments: [
        { user: 'Emily Wilson', text: 'The desert was mesmerizing!' },
        { user: 'Michael Brown', text: 'Loved the camel ride and campfire.' },
      ],
    },
  ];

  minPrice = 100; // Default minimum price
  maxPrice = 1000; // Default maximum price

  updatePriceRange(): void {
    // Prevent overlap: Ensure minPrice is less than or equal to maxPrice
    if (this.minPrice > this.maxPrice) {
      this.minPrice = this.maxPrice - 50; // Ensure a minimum step gap
    }
    if (this.maxPrice < this.minPrice) {
      this.maxPrice = this.minPrice + 50; // Ensure a minimum step gap
    }
  }

  onSearch() {
    alert('Filter search hit');
  }
}

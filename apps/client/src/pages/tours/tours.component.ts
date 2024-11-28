import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
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
export class ToursComponent implements OnInit {
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
  ];

  minPrice = 100; // Default minimum price
  maxPrice = 1000; // Default maximum price

  currentPage = 1;
  itemsPerPage = 2; // Number of items per page
  paginatedPosts: typeof this.tourPosts = []; // This contains only the posts for the current page

  ngOnInit() {
    // Initialize paginated posts
    this.updatePaginatedPosts();
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

  updatePaginatedPosts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPosts = this.tourPosts.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedPosts();
      this.scrollToTop();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedPosts();
      this.scrollToTop();
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Adds smooth scrolling
    });
  }

  get totalPages() {
    return Math.ceil(this.tourPosts.length / this.itemsPerPage);
  }

  onSearch() {
    alert('Filter search hit');
  }
}

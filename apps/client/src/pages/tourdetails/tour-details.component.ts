import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import mapboxgl from 'mapbox-gl';

export type Location = {
  type: 'Point'; // Fixed value for type
  coordinates: [number, number]; // Tuple for latitude and longitude
  address: string; // Address of the location
  description: string; // Description of the location
  day: number; // Day number for the location
};

@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-details.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class TourDetailComponent implements OnInit {
  tour: any; // Replace with your actual Tour model

  // Example data
  sampleTour = {
    name: 'The Alpine Forest Adventure',
    slug: 'the-alpine-forest-adventure',
    duration: 7,
    maxGroupSize: 12,
    difficulty: 'medium',
    ratingsAverage: 4.8,
    ratingsQuantity: 57,
    price: 799,
    priceDiscount: 699,
    summary: 'A breathtaking 7-day hike through pristine alpine forests.',
    description:
      'This guided tour takes you deep into the heart of the alpine wilderness, featuring breathtaking views, secluded trails, and incredible wildlife.',
    imageCover:
      'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828692/nat-9_dz9zov.jpg',
    images: [
      'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828693/nat-5_nye0nq.jpg',
      'https://res.cloudinary.com/drj6tdlhy/image/upload/v1731828693/nat-10_u61elf.jpg',
    ],
    startDates: [new Date('2023-12-01'), new Date('2024-01-15')],
    startLocation: {
      type: 'Point',
      coordinates: [-105.2705, 40.015],
      address: 'Boulder, Colorado, USA',
      description: 'Tour starting point in Boulder.',
    },
    locations: [
      {
        type: 'Point',
        coordinates: [-105.3605, 40.0205],
        address: 'Trailhead',
        description: 'The trail begins here.',
        day: 1,
      },
      {
        type: 'Point',
        coordinates: [-105.4605, 40.0305],
        address: 'Campground',
        description: 'First campsite along the trail.',
        day: 2,
      },
    ],
    guides: ['John Doe', 'Jane Smith'],
  };

  lightboxImage: string | null = null;

  openLightbox(image: string): void {
    this.lightboxImage = image;
  }

  closeLightbox(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.lightboxImage = null;
  }

  reviews = [
    {
      user: 'Jane Doe',
      userAvatar: 'https://via.placeholder.com/150',
      rating: 5,
      date: new Date('2023-11-10'),
      text: 'Absolutely loved this tour! The guide was fantastic, and the views were breathtaking.',
    },
    {
      user: 'John Smith',
      userAvatar: 'https://via.placeholder.com/150',
      rating: 4,
      date: new Date('2023-10-25'),
      text: 'Great experience, but I wish there were more time at the scenic spots.',
    },
  ];

  // Helper to generate stars
  getRatingStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  // Helper to generate empty stars
  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  writeReview(): void {
    alert('Redirecting to the write review page...');
  }

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('tourSlug');

    // Replace this with an API call to fetch tour data
    if (slug === 'the-alpine-forest-adventure') {
      this.tour = this.sampleTour;
      this.tour.ratingsQuantity = 2;
    }

    this.initializeMap();
  }

  initializeMap() {
    (mapboxgl as any).accessToken =
      'pk.eyJ1Ijoia2VtdW1ha2lpaSIsImEiOiJja2psMW5wdW8wMWVlMnVseTZsbHZpYzFiIn0.JwU5WzgEZm8Py3s1eeyBBQ';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/kemumakiii/ckl8pdp5g06jl17nrq8jpp2ug',
      center: this.tour.startLocation.coordinates,
      scrollZoom: false,
    });

    const bounds = new mapboxgl.LngLatBounds();

    // Add starting location marker

    const createMarker = () => {
      const el = document.createElement('div');

      el.className = 'marker';
      el.style.backgroundImage =
        "url('https://res.cloudinary.com/drj6tdlhy/image/upload/v1732130033/pin_shlscl.png')";
      el.style.width = '32px';
      el.style.height = '40px';
      el.style.backgroundSize = 'cover';

      return el;
    };

    new mapboxgl.Marker({ element: createMarker(), anchor: 'bottom' })
      .setLngLat(this.tour.startLocation.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 30, closeOnClick: false }).setHTML(
          `<p>${this.tour.startLocation.description}</p>`
        )
      )
      .addTo(map);

    // Add markers for tour locations
    this.tour.locations.forEach((location: Location) => {
      new mapboxgl.Marker({ element: createMarker(), anchor: 'bottom' })
        .setLngLat(location.coordinates)
        .addTo(map);

      // Add a popup
      new mapboxgl.Popup({ offset: 30, closeOnClick: false })
        .setLngLat(location.coordinates)
        .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
        .addTo(map);

      // Extend the bounds to include the location
      bounds.extend(location.coordinates);
    });

    // Define route coordinates
    const routeCoordinates = [
      this.tour.startLocation.coordinates,
      ...this.tour.locations.map((location: Location) => location.coordinates),
    ];

    // Add a line layer for the route
    map.on('load', () => {
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates,
          },
        },
      });

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#55c57a',
          'line-opacity': 0.6,
          'line-width': 3,
        },
      });

      map.fitBounds(bounds, {
        padding: { top: 200, bottom: 150, left: 100, right: 100 },
        maxZoom: 12, // Prevent zooming in too much
      });
    });
  }

  bookTour(): void {
    alert('Booking feature coming soon!');
  }
}

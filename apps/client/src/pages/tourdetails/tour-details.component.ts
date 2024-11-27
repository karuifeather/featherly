import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import mapboxgl from 'mapbox-gl';
import { TourDetailsService } from './tour-details.service';
import { Location, Tour } from '../../core/states/tour/tour.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-details.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class TourDetailComponent implements OnInit {
  tour$: Observable<Tour | null> = of(null);

  lightboxImage: string | null = null;

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourDetailService: TourDetailsService,
    private store: Store
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('tourSlug');

    // Redirect to home if no slug is present in the URL
    if (!slug) {
      this.router.navigate(['/dashboard/home']);
      return;
    }

    // Fetch the tour details or get from the store
    this.tour$ = this.store.select(
      (state) => state.tour.tourDetails?.[slug] || null
    );

    this.tour$.subscribe((tour) => {
      if (tour) {
        this.initializeMap(tour);
      } else {
        this.tourDetailService.getTourDetails(slug).then((fetchedTour) => {
          if (fetchedTour) {
            this.initializeMap(fetchedTour);
          }
        });
      }
    });
  }

  openLightbox(image: string): void {
    this.lightboxImage = image;
  }

  closeLightbox(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.lightboxImage = null;
  }

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

  initializeMap(tour: Tour): void {
    (mapboxgl as any).accessToken =
      'pk.eyJ1Ijoia2VtdW1ha2lpaSIsImEiOiJja2psMW5wdW8wMWVlMnVseTZsbHZpYzFiIn0.JwU5WzgEZm8Py3s1eeyBBQ';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/kemumakiii/ckl8pdp5g06jl17nrq8jpp2ug',
      center: tour.startLocation.coordinates,
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
      .setLngLat(tour.startLocation.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 30, closeOnClick: false }).setHTML(
          `<p>${tour.startLocation.description}</p>`
        )
      )
      .addTo(map);

    // Add markers for tour locations
    tour.locations!.forEach((location: Location) => {
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
      tour.startLocation.coordinates,
      ...tour.locations!.map((location: Location) => location.coordinates),
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

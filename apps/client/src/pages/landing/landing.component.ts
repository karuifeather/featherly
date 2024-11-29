import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterConfigOptions, RouterModule } from '@angular/router';
import { LandingService } from './landing.service';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Tour } from '../../core/states/tour/tour.model';
import { TourState } from '../../core/states/tour/tour.state';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit {
  searchQuery = '';
  private store = inject(Store);

  // Observable for popular tours from the store
  popularTours$: Observable<Tour[] | null> = this.store.select(
    TourState.getPopularTours
  );

  constructor(private landingService: LandingService, private router: Router) {}

  ngOnInit() {
    this.landingService.fetchPopularTours();
  }

  onSubmit(): void {
    // Navigate to the search results page with the query as a parameter
    this.router.navigate(['/search'], {
      queryParams: { keyword: this.searchQuery },
    });
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingService } from './landing.service';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Tour } from '../../core/states/tour/tour.model';
import { TourState } from '../../core/states/tour/tour.state';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit {
  private store = inject(Store);

  // Observable for popular tours from the store
  popularTours$: Observable<Tour[] | null> = this.store.select(
    TourState.getPopularTours
  );

  constructor(private landingService: LandingService) {}

  ngOnInit() {
    this.landingService.fetchPopularTours();
  }
}

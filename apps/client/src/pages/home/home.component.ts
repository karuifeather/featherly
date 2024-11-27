import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, take } from 'rxjs';
import { Tour } from '../../core/states/tour/tour.model';
import { TourState } from '../../core/states/tour/tour.state';
import { User } from '../../core/states/auth/auth.model';
import { HomeService } from './home.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent implements OnInit {
  private store = inject(Store);
  @ViewChild('slider', { static: false }) slider!: ElementRef;

  recommendedTours$: Observable<Tour[] | null> = this.store.select(
    TourState.getRecommendedTours
  );

  user$: Observable<User | null> = this.store.select(
    (state) => state.auth.user
  );

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.homeService.fetchRecommendedTours(user.id);
      } else {
        console.error('No user found in the state.');
      }
    });
  }

  isAdmin(user: User | null): boolean {
    return !!user && user.role === 'admin';
  }

  scrollLeft() {
    this.slider.nativeElement.scrollLeft -= 300; // Scroll left by 300px
  }

  scrollRight() {
    this.slider.nativeElement.scrollLeft += 300; // Scroll right by 300px
  }
}

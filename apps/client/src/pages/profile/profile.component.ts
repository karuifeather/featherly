import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../../core/states/auth/auth.state';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ProfileComponent {
  private store = inject(Store);

  user$ = this.store.select(AuthState.user);

  currentTab = 'createdTours';

  tabs = [
    { key: 'createdTours', label: 'Created Tours' },
    { key: 'likedTours', label: 'Liked Tours' },
    { key: 'savedTours', label: 'Saved Tours' },
  ];

  createdTours: any[] = [];
  likedTours: any[] = [];
  savedTours: any[] = [];
}

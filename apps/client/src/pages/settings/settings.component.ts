import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AuthState } from '../../core/states/auth/auth.state';
import { User } from '../../core/states/auth/auth.model';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  isChanged = false;
  password = '';
  private store = inject(Store);

  user$ = this.store.selectSnapshot(AuthState.user) as User;

  profile = JSON.parse(JSON.stringify(this.user$));
  originalProfile = { ...this.profile }; // To compare with original values

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profile.photo = reader.result as string;
        this.isChanged = true;
      };
      reader.readAsDataURL(file);
      this.isChanged = true;
    }
  }

  onInputChange() {
    this.isChanged = this.isProfileChanged();
  }

  // Check if the current profile is different from the original
  private isProfileChanged(): boolean {
    return (
      this.profile.fname !== this.originalProfile.fname ||
      this.profile.lname !== this.originalProfile.lname ||
      this.profile.email !== this.originalProfile.email ||
      this.profile.photo !== this.originalProfile.photo ||
      this.password.length > 0
    );
  }

  saveChanges(): void {
    if (this.isChanged) {
      this.isChanged = false;
      alert('Feature coming soon!');
    }
  }
}

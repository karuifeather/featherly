import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  isChanged = false;

  profile = {
    firstName: 'John',
    lastName: 'Doe',
    imageUrl: 'https://via.placeholder.com/150',
    email: 'john.doe@example.com',
    password: '',
    address: '123 Main Street',
    city: 'Springfield',
    zip: '12345',
    memberSince: new Date('2020-01-01'),
  };

  originalProfile = { ...this.profile }; // To compare with original values

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profile.imageUrl = reader.result as string;
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
      JSON.stringify(this.profile) !== JSON.stringify(this.originalProfile)
    );
  }

  saveChanges(): void {
    if (this.isChanged) {
      console.log('Profile saved:', this.profile);
      this.isChanged = false;
      alert('Profile changes saved!');
    }
  }
}

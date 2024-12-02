import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  password = '';
  confirmPassword = '';
  isSubmitting = false;

  doPasswordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  onSubmit(form: any) {
    if (form.valid && this.password === this.confirmPassword) {
      this.isSubmitting = true;
      console.log('Feature coming soon!');
      alert('Your password has been reset successfully!');
    } else {
      alert('Please ensure passwords match and all fields are valid.');
    }
  }
}

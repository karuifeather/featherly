import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  email = '';
  isSubmitting = false;

  onSubmit(form: any) {
    this.isSubmitting = true;
    if (form.valid) {
      alert('Feature coming soon!');
    } else {
      alert('Please enter a valid email address.');
    }
  }
}

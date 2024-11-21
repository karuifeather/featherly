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

  doPasswordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  onSubmit(form: any) {
    if (form.valid && this.password === this.confirmPassword) {
      console.log(form);
      console.log('Password reset successfully!');
      alert('Your password has been reset successfully!');
    } else {
      alert('Please ensure passwords match and all fields are valid.');
    }
  }
}

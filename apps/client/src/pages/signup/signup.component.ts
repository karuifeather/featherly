import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  user = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  onSubmit(form: any) {
    if (form.valid) {
      console.log('Form Data:', form.value);
      alert('Sign-up successful!');
    } else {
      alert('Please correct the errors before submitting.');
    }
  }
}

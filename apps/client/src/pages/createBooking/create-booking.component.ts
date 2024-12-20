import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from '../../components/payment/payment.component';
import { firstValueFrom, map, Observable } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import { Tour } from '../../core/states/tour/tour.model';
import { Store } from '@ngxs/store';
import { TourState } from '../../core/states/tour/tour.state';

@Component({
  selector: 'app-create-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PaymentComponent, RouterModule],
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @ViewChild('paymentComponent') paymentComponent!: PaymentComponent;

  store = inject(Store);
  bookingForm!: FormGroup;
  tourDetails$!: Observable<Tour | null>;
  tourDetails!: Tour | null;
  step = 1;
  availableStartDates: Date[] = []; // Store dates as Date objects
  selectedStartDate!: Date; // Selected start date as a Date object

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    // Get the slug from the route
    const tourSlug = this.route.snapshot.paramMap.get('tourSlug');
    if (!tourSlug) {
      this.notificationService.showError('Invalid tour ID. Redirecting...');
      this.router.navigate(['/dashboard']); // Redirect to the dashboard if the tourSlug is missing
      return;
    }

    // Select the tour from the state using the selector
    this.tourDetails$ = this.store
      .select(TourState.getTourById)
      .pipe(map((selectorFn) => selectorFn(tourSlug)));

    try {
      // Cache the tour details synchronously for use in the component
      this.tourDetails = await firstValueFrom(this.tourDetails$);
      if (!this.tourDetails) {
        this.notificationService.showError('Tour not found. Redirecting...');
        this.router.navigate(['/dashboard']);
        return;
      }

      // Convert available start dates from strings to Date objects
      this.availableStartDates = (this.tourDetails.startDates || []).map(
        (date) => new Date(date)
      );
    } catch (error) {
      this.notificationService.showError('An error occurred. Redirecting...');
      this.router.navigate(['/dashboard']);
      return;
    }

    // Initialize the form
    this.bookingForm = this.fb.group({
      numberOfGuests: [1, [Validators.required, Validators.min(1)]],
      paymentMethod: ['card', Validators.required], // Default payment method
      startDate: [this.availableStartDates[0], Validators.required], // Add startDate to track the selected date
    });
  }

  onNextStep(): void {
    if (this.step === 1 && this.bookingForm.invalid) {
      this.notificationService.showError(
        'Please fill out all required fields.'
      );
      return;
    }

    if (this.step === 2 && !this.bookingForm.value.startDate) {
      this.notificationService.showError('Please select a start date.');
      return;
    }

    if (this.step === 4) {
      this.onConfirmBooking();
    } else {
      this.step++;
    }
  }

  onPreviousStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  onSelectStartDate(date: Date): void {
    this.bookingForm.patchValue({ startDate: date });
  }

  async onConfirmBooking(): Promise<void> {
    if (!this.tourDetails) {
      this.notificationService.showError('Tour details are missing.');
      return;
    }

    try {
      const isSuccess = await this.paymentComponent.handlePayment();

      if (!isSuccess) throw new Error('Payment failed.');
      this.notificationService.showSuccess('Booking successful!');
      this.router.navigate(['/dashboard/bookings']);
    } catch (error: any) {
      this.notificationService.showError(
        error?.response?.data?.message || 'An error occurred.'
      );
    }
  }
}

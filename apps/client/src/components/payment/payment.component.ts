import { Component, Input, OnInit } from '@angular/core';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { AxiosInstance } from 'axios';
import { AxiosService } from '../../core/services/axios.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  imports: [],
  standalone: true,
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  @Input() amount!: number; // Total amount for the booking
  @Input() tourSlug!: string; // ID of the tour being booked
  @Input() totalPeople!: number; // Total number of people for the booking
  @Input() startDate!: Date; // Start date of the tour

  stripe: Stripe | null = null;
  cardElement!: any;
  clientSecret: string | null = null;
  isProcessing = false;
  axiosInstance: AxiosInstance;

  constructor(private axiosService: AxiosService) {
    this.axiosInstance = this.axiosService.instance;
  }

  async ngOnInit() {
    this.stripe = (await loadStripe(
      'pk_test_51QLyvGDMpAXXsDeGCIcWJ8huSMXz1peg7IZ0bhnXQe1h4jtGMGAoXty7UaNAYmeD3BkrsXQ7cscMeDBlTUxEoYF80094UE0iGk'
    )) as Stripe;

    if (!this.stripe) {
      console.error('Failed to initialize Stripe!');
      return;
    }

    // Create Stripe elements
    const elements = this.stripe.elements();

    // Updated style for the card element
    const style = {
      base: {
        color: '#ffffff',
        fontSize: '16px',
        fontFamily: "'Poppins', sans-serif",
        '::placeholder': {
          color: '#a0aec0',
        },
        backgroundColor: '#1a202c',
        padding: '10px',
        display: 'block', // Ensure fields are block-level elements
      },
      invalid: {
        color: '#f56565',
        iconColor: '#f56565',
      },
    };

    this.cardElement = elements.create('card', { style });
    this.cardElement.mount('#card-element');

    this.createPaymentIntent();
  }

  async createPaymentIntent() {
    try {
      const payload = {
        tourSlug: this.tourSlug,
        totalPeople: this.totalPeople,
        startDate: this.startDate,
      };

      const response = await this.axiosInstance.post(
        '/bookings/create-payment-intent',
        { ...payload }
      );

      const { clientSecret, totalPrice } = response.data;
      this.clientSecret = clientSecret;
      this.amount = totalPrice; // ideally, totalPrice would now include tax and other fees
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  }

  async handlePayment() {
    if (!this.clientSecret) {
      console.error('Client secret not available.');
      return;
    }

    this.isProcessing = true;

    const { error, paymentIntent } = await this.stripe!.confirmCardPayment(
      this.clientSecret,
      {
        payment_method: {
          card: this.cardElement,
        },
      }
    );

    if (error) {
      console.error('Payment Error:', error.message);
      this.isProcessing = false;
      return false;
    } else {
      console.log('Payment Successful:', paymentIntent);
      this.isProcessing = false;
      return true;
    }
  }
}

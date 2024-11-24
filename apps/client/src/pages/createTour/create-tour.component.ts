import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

const discountLessThanPrice: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const price = control.get('price')?.value;
  const discount = control.get('priceDiscount')?.value;
  return discount !== null && price !== null && discount >= price
    ? { discountLessThanPrice: true }
    : null;
};

@Component({
  selector: 'app-create-tour',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-tour.component.html',
  styleUrl: './create-tour.component.scss',
})
export class CreateTourComponent {
  tourForm: FormGroup;
  step = 1;

  constructor(private fb: FormBuilder) {
    this.tourForm = this.fb.group({
      generalInfo: this.fb.group({
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(40),
          ],
        ],
        summary: ['', [Validators.required, Validators.maxLength(255)]],
      }),

      pricing: this.fb.group(
        {
          price: [null, [Validators.required, Validators.min(1)]],
          priceDiscount: [null, [Validators.min(0)]],
          duration: [null, [Validators.required, Validators.min(1)]],
          difficulty: ['', [Validators.required]],
        },
        { validators: discountLessThanPrice }
      ),

      startLocation: this.fb.group({
        address: ['', Validators.required],
        description: ['', Validators.required],
      }),

      locations: this.fb.array([]),

      images: this.fb.group({
        imageCover: [null, Validators.required],
        gallery: [[], Validators.required],
      }),
    });
  }

  /**
   * Form Group Getters
   */
  get generalInfoGroup(): FormGroup {
    return this.tourForm.get('generalInfo') as FormGroup;
  }

  get pricingGroup(): FormGroup {
    return this.tourForm.get('pricing') as FormGroup;
  }

  get startLocation(): FormGroup {
    return this.tourForm.get('startLocation') as FormGroup;
  }

  get additionalLocations(): FormArray {
    return this.tourForm.get('locations') as FormArray;
  }

  get images(): FormGroup {
    return this.tourForm.get('images') as FormGroup;
  }

  // Move to the next step
  nextStep(): void {
    if (this.canProceed()) {
      this.step++;
    }
  }

  // Move to the previous step
  prevStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  // Check if the user can proceed to the next step
  canProceed(): boolean | undefined {
    if (this.step === 1) {
      return this.tourForm.get('generalInfo')?.valid || false;
    }

    if (this.step === 2) {
      return this.tourForm.get('pricing')?.valid || false;
    }

    if (this.step === 3) {
      const startLocationValid =
        this.tourForm.get('startLocation')?.valid ?? false;
      const locationsValid = (
        this.tourForm.get('locations') as FormArray
      )?.controls.every((location) => location.valid);

      return startLocationValid && locationsValid;
    }

    if (this.step === 4) {
      const imageCover = this.images.get('imageCover')?.value;
      const images = this.images.get('gallery')?.value;
      return !!imageCover && images && images.length > 0;
    }

    return true;
  }

  // Add a new location dynamically
  addLocation(): void {
    const locationGroup = this.fb.group({
      address: ['', Validators.required],
      description: ['', Validators.required],
      day: ['', [Validators.required, Validators.min(1)]],
    });
    this.additionalLocations.push(locationGroup);
  }

  // Remove a location dynamically
  removeLocation(index: number): void {
    this.additionalLocations.removeAt(index);
  }

  onCoverImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const control = this.images.get('imageCover');
      if (control) {
        control.setValue(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  }

  onGalleryImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    const readers: Promise<string | ArrayBuffer | null>[] = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((results) => {
      const validResults = results.filter((result) => !!result) as string[];

      const currentImages = this.images.get('gallery')?.value || [];
      this.images.get('gallery')?.setValue([...currentImages, ...validResults]);
    });
  }

  // Submit the form
  submitTour(): void {
    if (this.tourForm.valid) {
      alert('Tour submitted!');
    }
  }
}

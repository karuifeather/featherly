export interface TourStateModel {
  popularTours: Tour[] | null;
  recommendedTours: Tour[] | null;
  toursFeed: Tour[];
  loading: boolean;
  error: string | null;
}

export interface Tour {
  name: string;
  slug: string;
  duration: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'medium' | 'difficult';
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount?: number;
  summary: string;
  description?: string;
  imageCover: string;
  images?: string[];
  startDates?: Date[];
  secretTour?: boolean;
  startLocation: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
    address: string;
    description: string;
  };
  locations?: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
    description: string;
    day: number;
  }[];
  user: string;
}

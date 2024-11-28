export interface TourStateModel {
  popularTours: Tour[] | null;
  recommendedTours: Tour[] | null;
  tourDetails: Record<string, Tour | null> | null;
  toursFeed: ToursFeed;
  loading: boolean;
  error: string | null;
}

export interface ToursFeed {
  currentPage: number;
  totalPages: number;
  tours: Tour[];
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
  locations?: Location[];
  user: string;
}

export type Location = {
  type: 'Point'; // Fixed value for type
  coordinates: [number, number]; // Tuple for latitude and longitude
  address: string; // Address of the location
  description: string; // Description of the location
  day: number; // Day number for the location
};

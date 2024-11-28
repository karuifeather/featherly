import { Tour } from './tour.model';

export class FetchPopularTours {
  static readonly type = '[Tour] Fetch Popular Tours';
}

export class SetPopularTours {
  static readonly type = '[Tour] Set Popular Tours';
  constructor(public payload: Tour[]) {}
}

export class FetchRecommendedTours {
  static readonly type = '[Tour] Fetch Recommended Tours';
}

export class SetRecommendedTours {
  static readonly type = '[Tour] Set Recommended Tours';
  constructor(public payload: Tour[]) {}
}

export class FetchToursFeed {
  static readonly type = '[Tour] Fetch Tours Feed';
}

export class SetToursFeed {
  static readonly type = '[Tour] Set Tours Feed';
  constructor(
    public payload: {
      tours: Tour[];
      page: number;
      limit: number;
      totalPages: number;
    }
  ) {}
}

export class ClearToursState {
  static readonly type = '[Tour] Clear Tours State';
}

export class FetchTourDetails {
  static readonly type = '[Tour] Fetch Tour Details';
}

export class SetTourDetails {
  static readonly type = '[Tour] Save Tour Details';
  constructor(public payload: { slug: string; tour: Tour }) {}
}

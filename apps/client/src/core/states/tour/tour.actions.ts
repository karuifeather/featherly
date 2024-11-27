export class SetPopularTours {
  static readonly type = '[Tour] Set Popular Tours';
  constructor(public payload: any[]) {}
}

export class SetRecommendedTours {
  static readonly type = '[Tour] Set Recommended Tours';
  constructor(public payload: any[]) {}
}

export class SetToursFeed {
  static readonly type = '[Tour] Set Tours Feed';
  constructor(public payload: any[]) {}
}

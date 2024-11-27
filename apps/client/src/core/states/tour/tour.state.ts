import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { TourStateModel } from './tour.model';
import {
  SetPopularTours,
  SetRecommendedTours,
  SetToursFeed,
} from './tour.actions';

@State<TourStateModel>({
  name: 'tour',
  defaults: {
    popularTours: null,
    recommendedTours: null,
    toursFeed: [],
    loading: false,
    error: null,
  },
})
@Injectable()
export class TourState {
  @Selector()
  static getPopularTours(state: TourStateModel) {
    return state.popularTours;
  }

  @Selector()
  static getRecommendedTours(state: TourStateModel) {
    return state.recommendedTours;
  }

  @Selector()
  static getToursFeed(state: TourStateModel) {
    return state.toursFeed;
  }

  @Selector()
  static getLoading(state: TourStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: TourStateModel) {
    return state.error;
  }

  @Action(SetPopularTours)
  setPopularTours(ctx: StateContext<TourStateModel>, action: SetPopularTours) {
    ctx.patchState({ popularTours: action.payload });
  }

  @Action(SetRecommendedTours)
  setRecommendedTours(
    ctx: StateContext<TourStateModel>,
    action: SetRecommendedTours
  ) {
    ctx.patchState({ recommendedTours: action.payload });
  }

  @Action(SetToursFeed)
  setToursFeed(ctx: StateContext<TourStateModel>, action: SetToursFeed) {
    ctx.patchState({ toursFeed: action.payload });
  }
}

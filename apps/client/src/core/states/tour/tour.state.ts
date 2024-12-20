import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Tour, TourStateModel } from './tour.model';
import {
  ClearToursState,
  FetchPopularTours,
  FetchRecommendedTours,
  FetchTourDetails,
  FetchToursFeed,
  SetPopularTours,
  SetRecommendedTours,
  SetTourDetails,
  SetToursFeed,
} from './tour.actions';

@State<TourStateModel>({
  name: 'tour',
  defaults: {
    popularTours: null,
    recommendedTours: null,
    toursFeed: {
      currentPage: 1,
      totalPages: 0,
      tours: [],
    },
    tourDetails: null,
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

  @Selector()
  static getTourDetails(state: TourStateModel) {
    return (slug: string): Tour | null => state.tourDetails?.[slug] || null;
  }

  @Selector()
  static getTourById(state: TourStateModel) {
    return (id: string) => (state.tourDetails ? state.tourDetails[id] : null);
  }

  @Selector()
  static getCurrentPage(state: TourStateModel) {
    return state.toursFeed.currentPage || 1;
  }

  @Selector()
  static getTotalPages(state: TourStateModel) {
    return state.toursFeed.totalPages || 0;
  }

  @Action(FetchPopularTours)
  fetchPopularTours(ctx: StateContext<TourStateModel>) {
    // Set loading to true
    ctx.patchState({ loading: true, error: null });
  }

  @Action(SetPopularTours)
  setPopularTours(ctx: StateContext<TourStateModel>, action: SetPopularTours) {
    ctx.patchState({
      popularTours: action.payload,
      loading: false,
      error: null,
    });
  }

  @Action(FetchRecommendedTours)
  fetchRecommendedTours(ctx: StateContext<TourStateModel>) {
    // Set loading to true
    ctx.patchState({ loading: true, error: null });
  }

  @Action(SetRecommendedTours)
  setRecommendedTours(
    ctx: StateContext<TourStateModel>,
    action: SetRecommendedTours
  ) {
    ctx.patchState({
      recommendedTours: action.payload,
      loading: false,
      error: null,
    });
  }

  @Action(FetchToursFeed)
  fetchToursFeed(ctx: StateContext<TourStateModel>) {
    // Set loading to true
    ctx.patchState({ loading: true, error: null });
  }

  @Action(SetToursFeed)
  setToursFeed(ctx: StateContext<TourStateModel>, action: SetToursFeed) {
    const { page, tours, limit, totalPages } = action.payload;

    ctx.patchState({
      toursFeed: {
        tours,
        currentPage: page,
        totalPages: Math.ceil(totalPages / limit),
      },
      loading: false,
      error: null,
    });
  }

  @Action(ClearToursState)
  clearToursState(ctx: StateContext<TourStateModel>) {
    ctx.patchState({
      toursFeed: {
        tours: [],
        currentPage: 1,
        totalPages: 0,
      },
      loading: false,
      error: null,
    });
  }

  @Action(FetchTourDetails)
  fetchTourDetails(ctx: StateContext<TourStateModel>) {
    // Set loading to true
    ctx.patchState({ loading: true, error: null });
  }

  @Action(SetTourDetails)
  saveTourDetails(ctx: StateContext<TourStateModel>, action: SetTourDetails) {
    const { slug, tour } = action.payload;
    const state = ctx.getState();

    // Save the tour details into the state
    ctx.patchState({
      tourDetails: {
        ...state.tourDetails,
        [slug]: tour,
      },
      loading: false,
      error: null,
    });
  }
}

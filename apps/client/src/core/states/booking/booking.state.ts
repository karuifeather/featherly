import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import {
  FetchUpcomingBookings,
  SetUpcomingBookings,
  FetchPastBookings,
  SetPastBookings,
} from './booking.actions';
import { BookingStateModel } from './booking.model';

@State<BookingStateModel>({
  name: 'booking',
  defaults: {
    upcomingBookings: null,
    pastBookings: null,
    loading: false,
    error: null,
  },
})
@Injectable()
export class BookingState {
  @Selector()
  static getUpcomingBookings(state: BookingStateModel) {
    return state.upcomingBookings;
  }

  @Selector()
  static getPastBookings(state: BookingStateModel) {
    return state.pastBookings;
  }

  @Selector()
  static getLoading(state: BookingStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: BookingStateModel) {
    return state.error;
  }

  @Action(FetchUpcomingBookings)
  fetchUpcomingBookings(ctx: StateContext<BookingStateModel>) {
    ctx.patchState({ loading: true });
  }

  @Action(SetUpcomingBookings)
  setUpcomingBookings(
    ctx: StateContext<BookingStateModel>,
    action: SetUpcomingBookings
  ) {
    ctx.patchState({
      upcomingBookings: action.payload,
      loading: false,
    });
  }

  @Action(FetchPastBookings)
  fetchPastBookings(ctx: StateContext<BookingStateModel>) {
    ctx.patchState({ loading: true });
  }

  @Action(SetPastBookings)
  setPastBookings(
    ctx: StateContext<BookingStateModel>,
    action: SetPastBookings
  ) {
    ctx.patchState({
      pastBookings: action.payload,
      loading: false,
    });
  }
}

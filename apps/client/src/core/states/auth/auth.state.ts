import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import {
  LoginRequest,
  LoginSuccess,
  LoginFailure,
  Logout,
  LogoutRequest,
  SignupRequest,
  SignupSuccess,
  SignupFailure,
} from './auth.actions';
import { AuthStateModel, User } from './auth.model';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
})
@Injectable()
export class AuthState {
  @Selector()
  static token(state: AuthStateModel): string | null {
    return state.token;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return !!state.token;
  }

  @Selector()
  static user(state: AuthStateModel): User | null {
    return state.user;
  }

  @Action(LoginRequest)
  loginRequest(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({ loading: true, error: null });
  }

  @Action(LoginSuccess)
  loginSuccess(ctx: StateContext<AuthStateModel>, action: LoginSuccess) {
    const { token, user } = action.payload;
    ctx.patchState({ user, token, loading: false, error: null });
  }

  @Action(LoginFailure)
  loginFailure(ctx: StateContext<AuthStateModel>, action: LoginFailure) {
    ctx.patchState({ loading: false, error: action.error });
  }

  @Action(LogoutRequest)
  logoutRequest(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({ loading: true, error: null });
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.setState({ user: null, token: null, loading: false, error: null });
  }

  @Action(SignupRequest)
  signupRequest(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({ loading: true, error: null });
  }

  @Action(SignupSuccess)
  signupSuccess(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({ loading: false, error: null });
  }

  @Action(SignupFailure)
  signupFailure(ctx: StateContext<AuthStateModel>, action: SignupFailure) {
    ctx.patchState({ loading: false, error: action.error });
  }
}

import { State, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import {
  LoginRequest,
  LoginSuccess,
  LoginFailure,
  Logout,
} from './auth.actions';
import { AuthStateModel } from './auth.model';

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

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.setState({ user: null, token: null, loading: false, error: null });
  }
}

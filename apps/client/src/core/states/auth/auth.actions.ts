import { User } from './auth.model';

// Action to trigger login loading
export class LoginRequest {
  static readonly type = '[Auth] LoginRequest';
  constructor(public payload: { email: string; password: string }) {}
}

// Action to trigger logout loading
export class LogoutRequest {
  static readonly type = '[Auth] LogoutRequest';
}

// Action to save login response to state
export class LoginSuccess {
  static readonly type = '[Auth] LoginSuccess';
  constructor(public payload: { token: string; user: User }) {}
}

export class LoginFailure {
  static readonly type = '[Auth] LoginFailure';
  constructor(public error: string) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class SetAuthToken {
  static readonly type = '[Auth] SetAuthToken';
  constructor(public token: string) {}
}

// Action to trigger sign-up loading
export class SignupRequest {
  static readonly type = '[Auth] SignupRequest';
}

// Action for successful sign-up
export class SignupSuccess {
  static readonly type = '[Auth] SignupSuccess';
}

// Action for sign-up failure
export class SignupFailure {
  static readonly type = '[Auth] SignupFailure';
  constructor(public error: string) {}
}

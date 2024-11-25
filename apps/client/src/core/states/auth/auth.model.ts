export interface AuthStateModel {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface User {
  fname: string;
  lname: string;
  email: string;
  photo: string;
  role: 'user' | 'guide' | 'admin';
}

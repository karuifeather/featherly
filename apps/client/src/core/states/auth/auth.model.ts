export interface AuthStateModel {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  fname: string;
  lname: string;
  email: string;
  photo: string;
  createdAt: string;
  role: 'user' | 'guide' | 'admin';
}

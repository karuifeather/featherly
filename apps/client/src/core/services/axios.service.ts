import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root', // Makes it globally available
})
export class AxiosService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: environment.apiUrl,
      timeout: 5000,
      withCredentials: true,
    });

    // Add request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle global errors here
        console.error(error);
        return Promise.reject(error);
      }
    );
  }

  get instance() {
    return this.axiosInstance;
  }
}

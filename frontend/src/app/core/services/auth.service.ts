import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api';
  private readonly TOKEN_KEY = 'pokemon_token';

  // Signals for reactive state management
  private readonly userSignal = signal<User | null>(null);
  private readonly isLoadingSignal = signal<boolean>(false);

  // Public computed signals
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.userSignal());
  readonly isLoading = this.isLoadingSignal.asReadonly();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    this.loadUserFromToken();
  }

  /**
   * User login
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);

    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      }),
      catchError(error => {
        this.isLoadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * User registration
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);

    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, userData).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      }),
      catchError(error => {
        this.isLoadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * User logout
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.userSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Get stored JWT token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get current user profile
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/auth/profile`);
  }

  /**
   * Check if user is authenticated
   */
  isUserAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Check if token is expired (basic check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.access_token);
    this.userSignal.set(response.user);
    this.isLoadingSignal.set(false);
    this.router.navigate(['/']);
  }

  /**
   * Load user from stored token
   */
  private loadUserFromToken(): void {
    if (this.isUserAuthenticated()) {
      this.getCurrentUser().subscribe({
        next: (user) => {
          this.userSignal.set(user);
        },
        error: () => {
          this.logout();
        }
      });
    }
  }
} 
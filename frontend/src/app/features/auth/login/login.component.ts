import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-container">
      <div class="auth-card-wrapper">
        <mat-card class="auth-card">
          <mat-card-header>
            <div class="auth-header">
              <mat-icon class="auth-icon">catching_pokemon</mat-icon>
              <h1>Welcome Back</h1>
              <p>Sign in to your Pokémon account</p>
            </div>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Username</mat-label>
                <input 
                  matInput 
                  formControlName="username" 
                  required
                  autocomplete="username">
                <mat-icon matSuffix>person</mat-icon>
                @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
                  <mat-error>
                    @if (loginForm.get('username')?.errors?.['required']) {
                      Username is required
                    }
                  </mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Password</mat-label>
                <input 
                  matInput 
                  [type]="hidePassword ? 'password' : 'text'"
                  formControlName="password" 
                  required
                  autocomplete="current-password">
                <button 
                  mat-icon-button 
                  matSuffix 
                  type="button"
                  (click)="hidePassword = !hidePassword"
                  [attr.aria-label]="'Hide password'"
                  [attr.aria-pressed]="hidePassword">
                  <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                  <mat-error>
                    @if (loginForm.get('password')?.errors?.['required']) {
                      Password is required
                    } @else if (loginForm.get('password')?.errors?.['minlength']) {
                      Password must be at least 6 characters
                    }
                  </mat-error>
                }
              </mat-form-field>

              <button 
                mat-raised-button 
                color="primary" 
                type="submit"
                class="full-width auth-button"
                [disabled]="loginForm.invalid || authService.isLoading()">
                @if (authService.isLoading()) {
                  <mat-spinner diameter="20"></mat-spinner>
                  Signing in...
                } @else {
                  Sign In
                }
              </button>
            </form>
          </mat-card-content>

          <mat-card-actions>
            <div class="auth-footer">
              <p>Don't have an account? 
                <a routerLink="/auth/register" class="auth-link">Sign up here</a>
              </p>
            </div>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  returnUrl = '/';

  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
    // Redirect to home if already authenticated
    if (this.authService.isUserAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      
      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Login failed. Please try again.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
} 
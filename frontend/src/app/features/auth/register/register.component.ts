import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
  selector: 'app-register',
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
              <h1>Join the Adventure</h1>
              <p>Create your Pokémon account</p>
            </div>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Username</mat-label>
                <input 
                  matInput 
                  formControlName="username" 
                  required
                  autocomplete="username">
                <mat-icon matSuffix>person</mat-icon>
                @if (registerForm.get('username')?.invalid && registerForm.get('username')?.touched) {
                  <mat-error>
                    @if (registerForm.get('username')?.errors?.['required']) {
                      Username is required
                    } @else if (registerForm.get('username')?.errors?.['minlength']) {
                      Username must be at least 3 characters
                    }
                  </mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email (Optional)</mat-label>
                <input 
                  matInput 
                  type="email"
                  formControlName="email"
                  autocomplete="email">
                <mat-icon matSuffix>email</mat-icon>
                @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                  <mat-error>
                    @if (registerForm.get('email')?.errors?.['email']) {
                      Please enter a valid email address
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
                  autocomplete="new-password">
                <button 
                  mat-icon-button 
                  matSuffix 
                  type="button"
                  (click)="hidePassword = !hidePassword"
                  [attr.aria-label]="'Hide password'"
                  [attr.aria-pressed]="hidePassword">
                  <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                  <mat-error>
                    @if (registerForm.get('password')?.errors?.['required']) {
                      Password is required
                    } @else if (registerForm.get('password')?.errors?.['minlength']) {
                      Password must be at least 6 characters
                    }
                  </mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Confirm Password</mat-label>
                <input 
                  matInput 
                  [type]="hideConfirmPassword ? 'password' : 'text'"
                  formControlName="confirmPassword" 
                  required
                  autocomplete="new-password">
                <button 
                  mat-icon-button 
                  matSuffix 
                  type="button"
                  (click)="hideConfirmPassword = !hideConfirmPassword"
                  [attr.aria-label]="'Hide confirm password'"
                  [attr.aria-pressed]="hideConfirmPassword">
                  <mat-icon>{{ hideConfirmPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                @if (registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched) {
                  <mat-error>
                    @if (registerForm.get('confirmPassword')?.errors?.['required']) {
                      Please confirm your password
                    } @else if (registerForm.hasError('passwordMismatch')) {
                      Passwords do not match
                    }
                  </mat-error>
                }
              </mat-form-field>

              <button 
                mat-raised-button 
                color="primary" 
                type="submit"
                class="full-width auth-button"
                [disabled]="registerForm.invalid || authService.isLoading()">
                @if (authService.isLoading()) {
                  <mat-spinner diameter="20"></mat-spinner>
                  Creating account...
                } @else {
                  Create Account
                }
              </button>
            </form>
          </mat-card-content>

          <mat-card-actions>
            <div class="auth-footer">
              <p>Already have an account? 
                <a routerLink="/auth/login" class="auth-link">Sign in here</a>
              </p>
            </div>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly authService: AuthService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
    
    // Redirect to home if already authenticated
    if (this.authService.isUserAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {}

  /**
   * Custom validator to check if passwords match
   */
  private passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...userData } = this.registerForm.value;
      
      this.authService.register(userData).subscribe({
        next: (response) => {
          this.snackBar.open('Account created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/']);
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Registration failed. Please try again.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
} 
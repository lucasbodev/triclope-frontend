import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { LoginRequest } from '../../../shared/models/auth.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Connexion à Triclope</h2>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Nom d'utilisateur</label>
            <input
              id="username"
              type="text"
              formControlName="username"
              class="form-control"
              [class.error]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
              placeholder="Entrez votre nom d'utilisateur"
            />
            <div class="error-message" *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
              Le nom d'utilisateur est requis
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="form-control"
              [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              placeholder="Entrez votre mot de passe"
            />
            <div class="error-message" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              Le mot de passe est requis
            </div>
          </div>

          <div class="error-message" *ngIf="errorMessage()">
            {{ errorMessage() }}
          </div>

          <button
            type="submit"
            class="btn-primary"
            [disabled]="loginForm.invalid || isLoading()"
          >
            {{ isLoading() ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <div class="test-credentials">
          <h4>Comptes de test :</h4>
          <p><strong>Utilisateur :</strong> lucas / <strong>Mot de passe :</strong> password</p>
          <p><strong>Utilisateur :</strong> noe / <strong>Mot de passe :</strong> password</p>
        </div>

        <div class="register-link">
          <p>Pas encore de compte ? <a routerLink="/auth/register">S'inscrire</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 20px;
    }

    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #555;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .form-control.error {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    .btn-primary {
      width: 100%;
      padding: 0.75rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .register-link {
      text-align: center;
      margin-top: 1.5rem;
    }

    .register-link a {
      color: #007bff;
      text-decoration: none;
    }

    .register-link a:hover {
      text-decoration: underline;
    }

    .test-credentials {
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      border-left: 4px solid #007bff;
    }

    .test-credentials h4 {
      margin: 0 0 0.5rem 0;
      color: #007bff;
      font-size: 0.9rem;
    }

    .test-credentials p {
      margin: 0.25rem 0;
      font-size: 0.8rem;
      color: #666;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const loginRequest: LoginRequest = this.loginForm.value;

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response.success) {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Login error details:', error);
          
          if (error.status === 400 || error.status === 401) {
            this.errorMessage.set('Nom d\'utilisateur ou mot de passe incorrect');
          } else if (error.status === 0) {
            this.errorMessage.set('Erreur de connexion au serveur');
          } else {
            this.errorMessage.set('Une erreur est survenue lors de la connexion');
          }
        }
      });
    }
  }
}
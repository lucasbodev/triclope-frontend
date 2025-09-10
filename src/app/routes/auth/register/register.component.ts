import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { RegisterRequest } from '../../../shared/models/auth.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h2>Inscription à Triclope</h2>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Prénom</label>
              <input
                id="firstName"
                type="text"
                formControlName="firstName"
                class="form-control"
                [class.error]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched"
                placeholder="Votre prénom"
              />
              <div class="error-message" *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched">
                Le prénom est requis
              </div>
            </div>

            <div class="form-group">
              <label for="lastName">Nom</label>
              <input
                id="lastName"
                type="text"
                formControlName="lastName"
                class="form-control"
                [class.error]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched"
                placeholder="Votre nom"
              />
              <div class="error-message" *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched">
                Le nom est requis
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="username">Nom d'utilisateur</label>
            <input
              id="username"
              type="text"
              formControlName="username"
              class="form-control"
              [class.error]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
              placeholder="Choisissez un nom d'utilisateur"
            />
            <div class="error-message" *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched">
              <span *ngIf="registerForm.get('username')?.errors?.['required']">Le nom d'utilisateur est requis</span>
              <span *ngIf="registerForm.get('username')?.errors?.['minlength']">Le nom d'utilisateur doit contenir au moins 3 caractères</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="form-control"
              [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
              placeholder="votre.email@exemple.com"
            />
            <div class="error-message" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
              <span *ngIf="registerForm.get('email')?.errors?.['required']">L'email est requis</span>
              <span *ngIf="registerForm.get('email')?.errors?.['email']">L'email n'est pas valide</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="form-control"
              [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
              placeholder="Choisissez un mot de passe"
            />
            <div class="error-message" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
              <span *ngIf="registerForm.get('password')?.errors?.['required']">Le mot de passe est requis</span>
              <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Le mot de passe doit contenir au moins 6 caractères</span>
            </div>
          </div>

          <div class="error-message" *ngIf="errorMessage()">
            {{ errorMessage() }}
          </div>

          <div class="success-message" *ngIf="successMessage()">
            {{ successMessage() }}
          </div>

          <button
            type="submit"
            class="btn-primary"
            [disabled]="registerForm.invalid || isLoading()"
          >
            {{ isLoading() ? 'Inscription...' : 'S\'inscrire' }}
          </button>
        </form>

        <div class="login-link">
          <p>Déjà un compte ? <a routerLink="/auth/login">Se connecter</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 20px;
    }

    .register-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 500px;
    }

    h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
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

    .success-message {
      color: #28a745;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      text-align: center;
      padding: 0.75rem;
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 4px;
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

    .login-link {
      text-align: center;
      margin-top: 1.5rem;
    }

    .login-link a {
      color: #007bff;
      text-decoration: none;
    }

    .login-link a:hover {
      text-decoration: underline;
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      const registerRequest: RegisterRequest = this.registerForm.value;

      this.authService.register(registerRequest).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response.success) {
            this.successMessage.set('Inscription réussie ! Vous pouvez maintenant vous connecter.');
            this.registerForm.reset();
            // Rediriger vers la page de connexion après 2 secondes
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 2000);
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          if (error.error?.error) {
            this.errorMessage.set(error.error.error);
          } else {
            this.errorMessage.set('Une erreur est survenue lors de l\'inscription');
          }
          console.error('Register error:', error);
        }
      });
    }
  }
}
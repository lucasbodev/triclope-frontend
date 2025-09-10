import { Injectable, signal } from '@angular/core';
import { Observable, BehaviorSubject, tap, map, catchError, throwError } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { LoginRequest, RegisterRequest, AuthResponse, AuthUser, RefreshRequest, RefreshResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseHttpService {
  private readonly endpoint = 'api/v1/auth';
  private readonly TOKEN_KEY = 'triclope_access_token';
  private readonly REFRESH_TOKEN_KEY = 'triclope_refresh_token';
  private readonly USERNAME_KEY = 'triclope_username';

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Signals pour la réactivité
  isAuthenticated = signal<boolean>(this.hasValidToken());
  currentUser = signal<AuthUser | null>(null);

  /**
   * Connexion utilisateur
   */
  login(request: LoginRequest): Observable<{ success: boolean; message?: string }> {
    return this.post<AuthResponse>(`${this.endpoint}/login`, request).pipe(
      tap(response => this.handleAuthSuccess(response, request.username)),
      map(() => ({ success: true })),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Inscription utilisateur
   */
  register(request: RegisterRequest): Observable<{ success: boolean; message?: string }> {
    return this.post<{ message: string }>(`${this.endpoint}/register`, request).pipe(
      map(response => ({ success: true, message: response.message }))
    );
  }

  /**
   * Rafraîchissement du token
   */
  refreshToken(): Observable<RefreshResponse> {
    const username = this.getUsername();
    if (!username) {
      throw new Error('No username found for token refresh');
    }

    const request: RefreshRequest = { username };
    return this.post<RefreshResponse>(`${this.endpoint}/refresh`, request).pipe(
      tap(response => {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh_token);
      })
    );
  }

  /**
   * Déconnexion utilisateur
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }

  /**
   * Récupère le token JWT
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Récupère le refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Récupère le nom d'utilisateur
   */
  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  /**
   * Récupère l'utilisateur actuel depuis le token JWT
   */
  getCurrentUser(): AuthUser | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        username: payload.sub,
        role: payload.scope?.includes('admin') ? 'ADMIN' : 'USER',
        enabled: true
      };
    } catch {
      return null;
    }
  }

  /**
   * Récupère l'ID de l'utilisateur actuel
   */
  getCurrentUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }

  private handleAuthSuccess(response: AuthResponse, username: string): void {
    localStorage.setItem(this.TOKEN_KEY, response.access_token);
    localStorage.setItem(this.USERNAME_KEY, username);
    
    const user = this.getCurrentUser();
    this.currentUserSubject.next(user);
    this.isAuthenticated.set(true);
    this.currentUser.set(user);
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Vérification basique de l'expiration du token
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }
}
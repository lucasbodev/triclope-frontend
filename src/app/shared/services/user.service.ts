import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { 
  User, 
  UserCreationRequest, 
  UserUpdateRequest 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseHttpService {
  private readonly endpoint = 'api/v1/user';

  /**
   * Récupère tous les utilisateurs
   * Note: Endpoint à implémenter côté backend si nécessaire
   */
  getAllUsers(): Observable<User[]> {
    return this.get<User[]>(this.endpoint);
  }

  /**
   * Récupère un utilisateur par son ID
   * Note: Endpoint à implémenter côté backend si nécessaire
   */
  getUserById(id: string): Observable<User> {
    return this.get<User>(`${this.endpoint}/${id}`);
  }

  /**
   * Crée un nouvel utilisateur
   * Note: Endpoint à implémenter côté backend si nécessaire
   */
  createUser(request: UserCreationRequest): Observable<User> {
    return this.post<User>(this.endpoint, request);
  }

  /**
   * Met à jour un utilisateur
   * Note: Endpoint à implémenter côté backend si nécessaire
   */
  updateUser(request: UserUpdateRequest): Observable<User> {
    return this.put<User>(this.endpoint, request);
  }

  /**
   * Supprime un utilisateur
   * Note: Endpoint à implémenter côté backend si nécessaire
   */
  deleteUser(id: string): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }
}
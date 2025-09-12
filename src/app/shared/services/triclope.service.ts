import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { 
  Triclope, 
  TriclopeCreationRequest, 
  TriclopeUpdateRequest, 
  AddMemberRequest,
  User,
  Participation
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class TriclopeService extends BaseHttpService {
  private readonly endpoint = 'api/v1/triclope';

  /**
   * Récupère tous les triclopes
   */
  getAllTriclopes(): Observable<Triclope[]> {
    return this.get<Triclope[]>(this.endpoint);
  }

  /**
   * Récupère les triclopes d'un utilisateur
   */
  getTriclopesByUserId(userId: string): Observable<Triclope[]> {
    return this.get<Triclope[]>(`${this.endpoint}/user/${userId}`);
  }

  /**
   * Crée un nouveau triclope
   */
  createTriclope(request: TriclopeCreationRequest): Observable<Triclope> {
    const formData = new FormData();
    formData.append('name', request.name);
    formData.append('createdBy', request.createdBy);
    if (request.logo) {
      // Convert byte array to blob
      const blob = new Blob([new Uint8Array(request.logo)], { type: 'image/*' });
      formData.append('logo', blob);
    }

    return this.http.post<Triclope>(`${this.baseUrl}/${this.endpoint}`, formData, {
      headers: {} // No Content-Type header for FormData
    });
  }

  /**
   * Met à jour un triclope
   */
  updateTriclope(request: TriclopeUpdateRequest): Observable<Triclope> {
    return this.put<Triclope>(this.endpoint, request);
  }

  /**
   * Récupère tous les utilisateurs d'un triclope
   */
  getUsersByTriclopeId(triclopeId: string): Observable<User[]> {
    return this.get<User[]>(`${this.endpoint}/${triclopeId}/user`);
  }

  /**
   * Récupère toutes les participations d'un triclope
   */
  getParticipationsByTriclopeId(triclopeId: string): Observable<Participation[]> {
    return this.get<Participation[]>(`${this.endpoint}/${triclopeId}/participation`);
  }

  /**
   * Ajoute un membre à un triclope
   */
  addMemberToTriclope(triclopeId: string, request: AddMemberRequest): Observable<void> {
    return this.post<void>(`${this.endpoint}/${triclopeId}/member`, request);
  }
}
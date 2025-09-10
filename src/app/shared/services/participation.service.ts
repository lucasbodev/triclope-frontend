import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { 
  Participation, 
  ParticipationCreationRequest, 
  ParticipationUpdateRequest 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService extends BaseHttpService {
  private readonly endpoint = 'api/v1/participation';

  /**
   * Récupère toutes les participations
   */
  getAllParticipations(): Observable<Participation[]> {
    return this.get<Participation[]>(this.endpoint);
  }

  /**
   * Récupère une participation par son ID
   */
  getParticipationById(id: string): Observable<Participation> {
    return this.get<Participation>(`${this.endpoint}/${id}`);
  }

  /**
   * Récupère les participations d'un triclope
   */
  getParticipationsByTriclopeId(triclopeId: string): Observable<Participation[]> {
    return this.get<Participation[]>(`${this.endpoint}/triclope/${triclopeId}`);
  }

  /**
   * Récupère les participations données par un utilisateur
   */
  getParticipationsGivenByUserId(userId: string): Observable<Participation[]> {
    return this.get<Participation[]>(`${this.endpoint}/user/${userId}/given`);
  }

  /**
   * Récupère les participations reçues par un utilisateur
   */
  getParticipationsReceivedByUserId(userId: string): Observable<Participation[]> {
    return this.get<Participation[]>(`${this.endpoint}/user/${userId}/received`);
  }

  /**
   * Crée une nouvelle participation
   */
  createParticipation(request: ParticipationCreationRequest): Observable<Participation> {
    return this.post<Participation>(this.endpoint, request);
  }

  /**
   * Met à jour une participation
   */
  updateParticipation(id: string, request: ParticipationUpdateRequest): Observable<Participation> {
    return this.put<Participation>(`${this.endpoint}/${id}`, request);
  }

  /**
   * Supprime une participation
   */
  deleteParticipation(id: string): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }
}
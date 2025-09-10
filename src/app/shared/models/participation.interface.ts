import { User } from './user.interface';

export interface Participation {
  id: string;
  quantity: number;
  createdAt: string; // ISO date string
  triclopeId: string;
  giver: User;
  taker: User;
}

export interface ParticipationCreationRequest {
  triclopeId: string;
  giverId: string;
  takerId: string;
  quantity: number;
}

export interface ParticipationUpdateRequest {
  id: string;
  quantity: number;
}
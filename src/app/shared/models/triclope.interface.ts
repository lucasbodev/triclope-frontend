export interface Triclope {
  id: string;
  name: string;
  creationDate: string; // ISO date string
  logo?: number[] | null; // byte array for the logo image
}

export interface TriclopeCreationRequest {
  name: string;
  logo?: number[] | null; // byte array (optionnel pour l'instant)
  createdBy: string;
}

export interface TriclopeUpdateRequest {
  id: string;
  name: string;
  logo?: number[] | null; // byte array (optionnel pour l'instant)
  createdBy: string;
}

export interface AddMemberRequest {
  userId: string;
}
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserCreationRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserUpdateRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
export type Role = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export interface HealthcareProvider {
  name: string;
  address: string;
  phone: string;
  description: string;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

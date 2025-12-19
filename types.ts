
export enum Role {
  USER = 'user',
  BOT = 'bot'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface HealthTip {
  title: string;
  description: string;
  category: 'diet' | 'lifestyle' | 'emergency' | 'general';
}

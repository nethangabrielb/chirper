export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  avatar?: string | null;
  onboarded: boolean;
}

export interface ChatMessage {
  id: number;
  content: string;
  createdAt: Date;
  roomId: number;
  receiverId: number;
  senderId: number;
}

export interface Room {
  id: number;
  messages?: Array<ChatMessage>;
  users: Array<User>;
}

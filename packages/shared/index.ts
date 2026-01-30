import { User } from "../../apps/backend/src/types/user";

export const SOCKET_EVENTS = {
  MESSAGE: "message",
} as const;

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

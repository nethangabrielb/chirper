export const SOCKET_EVENTS = {
  MESSAGE: "message",
} as const;

export interface ChatMessage {
  id: string;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: Date;
}

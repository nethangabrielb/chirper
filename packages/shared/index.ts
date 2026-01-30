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

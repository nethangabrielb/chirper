export interface NotificationBody {
  receiverId: number;
  content: string;
  postId?: number;
  senderId: number;
  replyContent?: string;
}

import { socket } from "@/socket/client";

import { User } from "@/types/user";

const notificationHandler = {
  emitLikeNotification: (user: User, receiverId: number, postId: number) => {
    socket.emit("notification", user, receiverId, "like", postId);
  },
  emitReplyNotification: (
    user: User,
    receiverId: number,
    replyId: number,
    postContent: string,
  ) => {
    socket.emit(
      "notification",
      user,
      receiverId,
      "reply",
      replyId,
      postContent,
    );
  },
};

export default notificationHandler;

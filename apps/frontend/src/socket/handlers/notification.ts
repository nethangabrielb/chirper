import { socket } from "@/socket/client";

import { User } from "@/types/user";

const notificationHandler = {
  emitLikeNotification: (user: User, receiverId: number, postId: number) => {
    socket.emit("notification", user, receiverId, "like", postId);
  },
};

export default notificationHandler;

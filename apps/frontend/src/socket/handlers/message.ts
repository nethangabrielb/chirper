import { NewMessage } from "@/app/messages/components/chat-room";
import { socket } from "@/socket/client";
import { QueryClient } from "@tanstack/react-query";

import { MessageType } from "@/types/message";
import { User } from "@/types/user";

const messageEventsHandler = {
  create: (
    newMessage: NewMessage,
    queryClient: QueryClient,
    id: number,
    tempMessageId: string,
    senderId: number,
  ) => {
    socket.emit(
      "newMessage",
      newMessage,
      senderId,
      (response: {
        success: boolean;
        message: {
          receiverId: number;
          senderId: number;
          content: string;
          roomId: number;
          id: number;
        };
      }) => {
        if (response.success) {
          queryClient.setQueryData(
            ["messages", String(id)],
            (prev: Array<MessageType>) => {
              const updated = prev.map((message: NewMessage) => {
                if (message.tempId === tempMessageId) {
                  return { ...message, loading: false };
                } else {
                  return message;
                }
              });
              return [...updated];
            },
          );
        }
      },
    );
  },
};

const notificationHandler = {
  emitLikeNotification: (user: User, receiverId: number, postId: number) => {
    socket.emit("notification", user, receiverId, "like", postId);
  },
};

export { messageEventsHandler, notificationHandler };

import { newMessage } from "@/app/messages/components/chat-room";
import { socket } from "@/socket/client";
import { QueryClient } from "@tanstack/react-query";

import { MessageType } from "@/types/message";

const messageEventsHandler = {
  create: (
    newMessage: newMessage,
    queryClient: QueryClient,
    id: number,
    tempMessageId: string,
  ) => {
    socket.emit(
      "newMessage",
      newMessage,
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
              console.log(prev);
              const updated = prev.map((message: newMessage) => {
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

export default messageEventsHandler;

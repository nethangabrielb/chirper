import { socket } from "@/socket/client";

const messageEventsHandler = {
  create: (message: {
    receiverId: number;
    senderId: number;
    content: string;
    roomId: number;
  }) => {
    socket.emit(
      "newMessage",
      message,
      (response: {
        success: boolean;
        message: {
          receiverId: number;
          senderId: number;
          content: string;
          roomId: number;
        };
      }) => {
        console.log(response.success);
      },
    );
  },
};

export default messageEventsHandler;

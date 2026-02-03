"use client";

import Message from "@/app/messages/components/message";
import useUser from "@/stores/user.store";

import { MessageType } from "@/types/message";
import { User } from "@/types/user";

const ChatRoom = ({ messages }: { messages: Array<MessageType> }) => {
  const user = useUser((state) => state.user) as User;

  return (
    <div className="flex flex-col w-full h-full p-4 gap-2">
      {messages?.map((message) => (
        <Message
          message={message.content}
          key={message.id}
          className={`${user.id === message.senderId ? "bg-primary self-end" : "bg-darker"}`}
        ></Message>
      ))}
    </div>
  );
};

export default ChatRoom;

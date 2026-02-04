"use client";

import Message from "@/app/messages/components/message";
import useRooms from "@/app/messages/hooks/useRooms";
import useUser from "@/stores/user.store";

import { useRouter } from "next/navigation";

import { ActionButton } from "@/components/button";

import { MessageType } from "@/types/message";
import { RoomType } from "@/types/room";
import { User } from "@/types/user";

const ChatRoom = ({
  messages,
  paramsId,
}: {
  messages: Array<MessageType>;
  paramsId?: number;
}) => {
  const router = useRouter();
  const currentUser = useUser((state) => state.user) as User;
  const { chatRooms } = useRooms();

  const currentRoom = chatRooms?.filter(
    (room: RoomType) => room.id === Number(paramsId),
  );
  const roomOtherUser = currentRoom[0]?.users?.find(
    (user: User) => user.id !== currentUser.id,
  );

  console.log(roomOtherUser);

  return (
    <div className="flex flex-col w-full h-full p-4 gap-2 relative">
      <div className="flex gap-4 items-center backdrop-blur-lg absolute top-0 mt-4">
        <img
          src={roomOtherUser?.avatar}
          alt={`@${roomOtherUser?.username}'s avatar`}
          className="rounded-full size-[64px] my-2 object-cover"
        />
        <h1 className="font-bold text-xl">{roomOtherUser?.name}</h1>
      </div>
      <div className="flex flex-col items-center pt-28 pb-8">
        <img
          src={roomOtherUser?.avatar}
          alt={`@${roomOtherUser?.username}'s avatar`}
          className="rounded-full size-[64px] my-2 object-cover"
        />
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-xl">{roomOtherUser?.name}</h1>
          <p className="text-darker text-sm">@{roomOtherUser?.username}</p>
        </div>
        <ActionButton
          onClick={() => router.push(`/profile/${roomOtherUser?.id}`)}
          className="mt-4 font-bold hover:bg-neutral-300!"
        >
          View Profile
        </ActionButton>
      </div>
      {messages?.map((message) => (
        <Message
          message={message.content}
          key={message.id}
          className={`${currentUser.id === message.senderId ? "bg-primary self-end" : "bg-darker"}`}
        ></Message>
      ))}
    </div>
  );
};

export default ChatRoom;

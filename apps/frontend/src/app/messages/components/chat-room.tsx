"use client";

import Message from "@/app/messages/components/message";
import useRooms from "@/app/messages/hooks/useRooms";
import useBoxHeight from "@/hooks/useBoxHeight";
import { socket } from "@/socket/client";
import messageEventsHandler from "@/socket/handlers/message";
import useUser from "@/stores/user.store";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { useEffect, useRef } from "react";

import { useRouter } from "next/navigation";

import { ActionButton } from "@/components/button";
import TextInput from "@/components/input-field";

import { MessageType } from "@/types/message";
import { RoomType } from "@/types/room";
import { User } from "@/types/user";

export interface newMessage {
  receiverId: number;
  senderId: number;
  content: string;
  roomId: number;
  loading?: boolean;
  tempId?: string;
}

const ChatRoom = ({
  messages,
  paramsId,
  updateMessagesOptimistic,
}: {
  messages: Array<MessageType>;
  paramsId?: number;
  updateMessagesOptimistic: (
    message: newMessage,
    element: HTMLDivElement,
  ) => void;
}) => {
  const router = useRouter();
  const currentUser = useUser((state) => state.user) as User;
  const { chatRooms } = useRooms();
  const typeInputRef = useRef<HTMLDivElement>(null);
  const bottomMessages = useRef<HTMLDivElement>(null);
  const { height, setHeight } = useBoxHeight();
  const { getValues, register, handleSubmit, watch, setValue } = useForm();
  const queryClient = useQueryClient();

  const currentRoom = chatRooms?.find(
    (room: RoomType) => room.id === Number(paramsId),
  );
  const roomOtherUser =
    currentRoom &&
    currentRoom?.users?.find((user: User) => user.id !== currentUser.id);

  useEffect(() => {
    if (typeInputRef?.current?.getBoundingClientRect()) {
      setHeight(typeInputRef?.current?.getBoundingClientRect().height);
    }
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      bottomMessages.current?.scrollIntoView({ behavior: "auto" });
    });
  }, [paramsId]);

  useEffect(() => {
    const updateMessage = (message: MessageType) => {
      updateMessagesOptimistic(message, bottomMessages.current!);
    };
    socket.on("newMessage", updateMessage);

    return () => {
      socket.off("newMessage", updateMessage);
    };
  }, []);

  useEffect(() => {
    socket.emit("joinRoom", String(paramsId), currentUser?.id);

    return () => {
      socket.emit("leaveRoom", String(paramsId), currentUser?.id);
    };
  }, [paramsId, currentUser?.id]);

  const messageHandler = () => {
    const values = getValues();

    setValue("message", "");

    const id = crypto.randomUUID();

    updateMessagesOptimistic(
      {
        senderId: currentUser?.id,
        receiverId: roomOtherUser?.id,
        content: values.message,
        roomId: currentRoom.id,
        loading: true,
        tempId: id,
      },
      bottomMessages.current as HTMLDivElement,
    );

    messageEventsHandler.create(
      {
        senderId: currentUser?.id,
        receiverId: roomOtherUser?.id,
        content: values.message,
        roomId: currentRoom.id,
      },
      queryClient,
      paramsId!,
      id,
      currentUser?.id,
    );
  };

  return (
    <div className="flex flex-col w-[65%] h-full gap-2 relative pr-2 py-2">
      <div
        className="flex flex-col gap-2 overflow-y-scroll p-4 [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar]:max-h-[90%]
        [&::-webkit-scrollbar-track]:rounded-xl
      [&::-webkit-scrollbar-track]:bg-background
        [&::-webkit-scrollbar-thumb]:rounded-xl
      [&::-webkit-scrollbar-thumb]:bg-accent"
      >
        <div
          className="flex gap-4 items-center absolute left-0 pl-4 z-100 top-0 pt-4 pb-1 backdrop-blur-xs"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)",
          }}
        >
          <img
            src={roomOtherUser?.avatar}
            alt={`@${roomOtherUser?.username}'s avatar`}
            className="rounded-full size-[64px] my-2 object-cover bg-background"
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
            key={message.id ?? message.tempId}
            className={`${currentUser.id === message.senderId ? "bg-primary self-end" : "bg-accent"}`}
            loading={message.loading}
          ></Message>
        ))}
        <div className="mb-auto h-[4px]! flex-none"></div>
        <div
          style={{ height: `${height / 2}px` }}
          className="flex-none mt-auto"
          ref={bottomMessages}
        ></div>
        <div className="w-full absolute bottom-0 left-0 p-4" ref={typeInputRef}>
          <form onSubmit={handleSubmit(messageHandler)}>
            <TextInput
              className="bg-accent w-[98%] rounded-4xl p-4 pr-4 text-white shadow-[0_29px_10px_10px_rgba(0,0,0,1)]"
              placeholder="Write your message"
              register={register}
              watch={watch}
            ></TextInput>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;

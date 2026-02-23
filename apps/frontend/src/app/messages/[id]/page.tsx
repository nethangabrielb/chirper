"use client";

import ChatRoom, { NewMessage } from "@/app/messages/components/chat-room";
import ChatRows from "@/app/messages/components/chat-rows";
import { socket } from "@/socket/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { use, useEffect } from "react";

import Head from "next/head";

import messageApi from "@/lib/api/message";

import { MessageType } from "@/types/message";

const MessagesSlug = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { data, refetch } = useQuery({
    queryKey: ["messages", id],
    queryFn: async () => {
      const messages = await messageApi.getMessagesByRoom(Number(id));
      return messages.data;
    },
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();

  const updateMessagesOptimistic = (
    newMessage: NewMessage,
    element?: HTMLDivElement,
  ) => {
    queryClient.setQueryData(["messages", id], (prev: Array<MessageType>) => {
      if (!prev) return [newMessage];
      return [...prev, newMessage];
    });
    setTimeout(() => {
      element && element.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    const handleReconnect = async () => refetch();

    socket.on("connect", handleReconnect);

    return () => {
      socket.off("connect", handleReconnect);
    };
  }, [id]);

  useEffect(() => {
    document.title = "Messages / Twitter Clone";
  }, []);

  return (
    <>
      <Head>
        <title>{document.title}</title>
        <meta
          name="description"
          content="Home page of my attempt to make a clone of Twitter"
        />
      </Head>
      <div className="lg:w-[70vw] border-l border-r border-l-border border-r-border h-full relative ml-4 flex">
        <div className="w-[35%] h-full flex flex-col gap-8 border-r border-r-border">
          <div>
            <h1 className="text-text text-xl font-bold p-4">Chat</h1>
          </div>

          {/* Chat columns with chat rows, where I will render all the chats the user have */}
          <ChatRows params={Number(id)}></ChatRows>
        </div>

        {/* Render the chatroom from the chat rows */}
        <ChatRoom
          messages={data && data}
          paramsId={Number(id)}
          updateMessagesOptimistic={updateMessagesOptimistic}
        ></ChatRoom>
      </div>
    </>
  );
};

export default MessagesSlug;

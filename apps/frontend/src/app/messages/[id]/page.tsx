"use client";

import ChatRoom from "@/app/messages/components/chat-room";
import ChatRows from "@/app/messages/components/chat-rows";
import { useQuery } from "@tanstack/react-query";

import { use, useEffect } from "react";

import Head from "next/head";

import messageApi from "@/lib/api/message";

const MessagesSlug = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { data } = useQuery({
    queryKey: ["messages", id],
    queryFn: async () => {
      const messages = await messageApi.getMessagesByRoom(Number(id));
      return messages;
    },
  });

  useEffect(() => {
    document.title = "Twitter / Messages";
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
        <ChatRoom messages={data?.data}></ChatRoom>
      </div>
    </>
  );
};

export default MessagesSlug;

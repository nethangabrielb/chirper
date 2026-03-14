"use client";

import ChatRoom, { NewMessage } from "@/app/messages/components/chat-room";
import ChatRows from "@/app/messages/components/chat-rows";
import { ChatListSkeleton, ChatRoomSkeleton } from "@/app/messages/components/messages-skeleton";
import { socket } from "@/socket/client";
import useUser from "@/stores/user.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { use, useEffect } from "react";

import Head from "next/head";

import messageApi from "@/lib/api/message";

import { MessageType } from "@/types/message";
import { User } from "@/types/user";

const MessagesSlug = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const currentUser = useUser((store) => store.user) as User;
  const { data, refetch } = useQuery({
    queryKey: ["messages", id],
    queryFn: async () => {
      const messages = await messageApi.getMessagesByRoom(Number(id));
      return messages.data;
    },
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();
  const setReadMutation = useMutation({
    mutationFn: async (params: number) => {
      const res = await messageApi.setMessagesRead(params);
      return res;
    },
    onSuccess: (res) => {
      if (res.status === "success") {
        queryClient.invalidateQueries({
          queryKey: ["chatRooms"],
        });
      }
    },
  });

   useEffect(() => {
    setReadMutation.mutate(Number(id));
  }, [id]);


  const updateMessagesOptimistic =  (
    newMessage: NewMessage,
    element?: HTMLDivElement,
  ) => {
    queryClient.setQueryData(["messages", id], (prev: Array<MessageType>) => {
      if (!prev) return [newMessage];
      return [...prev, newMessage];
    });

    queryClient.invalidateQueries({
      queryKey: ["chatRooms"],
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
    document.title = "Messages / Chirper";
  }, []);

  return (
    <div className="h-svh">
      <Head>
        <title>{document.title}</title>
        <meta
          name="description"
          content="Home page of my attempt to make a clone of Twitter"
        />
      </Head>
      <div className="w-full md:w-auto lg:w-[70vw] border-l border-r border-l-border border-r-border h-full relative md:ml-4 flex">
        <div className="hidden md:flex md:w-[35%] h-full flex-col gap-8 border-r border-r-border">
          <div>
            <h1 className="text-text text-xl font-bold p-4">Chat</h1>
          </div>

          {/* Chat columns with chat rows, where I will render all the chats the user have */}
          {!currentUser ? <ChatListSkeleton /> : <ChatRows params={Number(id)}></ChatRows>}
        </div>

        {/* Render the chatroom from the chat rows */}
        {!data ? (
          <ChatRoomSkeleton />
        ) : (
          <ChatRoom
            messages={data && data}
            paramsId={Number(id)}
            updateMessagesOptimistic={updateMessagesOptimistic}
          ></ChatRoom>
        )}
      </div>
    </div>
  );
};

export default MessagesSlug;

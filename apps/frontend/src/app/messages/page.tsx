"use client";

import ChatRows from "@/app/messages/components/chat-rows";
import { UsersDialog } from "@/app/messages/components/chat-users-list";
import useUser from "@/stores/user.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail } from "lucide-react";

import { useEffect, useState } from "react";

import Head from "next/head";
import { useRouter } from "next/navigation";

import roomApi from "@/lib/api/room";
import userApi from "@/lib/api/user";
import { chatroomExisted } from "@/lib/utils";

import { User, UserPartial } from "@/types/user";

const Messages = () => {
  const queryClient = useQueryClient();
  const [searchUser, setSearchUser] = useState<string>("");
  const currentUser = useUser((state) => state.user) as User;
  const router = useRouter();
  const { data, isPending } = useQuery({
    queryKey: ["chatUsersList", searchUser],
    queryFn: async () => {
      if (searchUser.length >= 1) {
        const res = await userApi.getUserSearchResults(searchUser);
        return res;
      } else {
        const res = await userApi.getUsersChatlist();
        return res;
      }
    },
  });
  const mutation = useMutation({
    mutationFn: async (visitedUser: UserPartial) => {
      if (currentUser && visitedUser) {
        const res = await roomApi.createChatRoom(currentUser, visitedUser);
        return res;
      }
    },
    onSuccess: async (res) => {
      if (res.status === "success") {
        await queryClient.prefetchQuery({ queryKey: ["user"] });
        router.push(`/messages/${res.data.id}`);
      }
    },
  });

  useEffect(() => {
    document.title = "Messages / Twitter Clone";
  }, []);

  const messageUser = (visitedUserId: number, visitedUser: UserPartial) => {
    // Check currentUser rooms if there is a room with the user IDs of current and visited user
    const chatroom = chatroomExisted(
      currentUser?.id,
      visitedUserId,
      currentUser?.rooms,
    );

    // If there is, redirect to the id of the room
    if (chatroom) {
      router.push(`/messages/${chatroom.id}`);
    } else {
      // Otherwise, use useMutation and create the room and redirect to that room
      mutation.mutate(visitedUser);
    }
  };

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
          <ChatRows></ChatRows>
        </div>

        {/* Render the chatroom from the chat rows */}
        <div className="w-[65%] flex justify-center items-center">
          <div className="flex flex-col items-center gap-2">
            <div className="p-6 bg-accent rounded-full w-fit">
              <Mail size={32}></Mail>
            </div>
            <h1 className="font-bold text-xl">Start a conversation</h1>
            <p className="text-darker font-light">
              Choose from your existing conversations, or start a new one.
            </p>
            <UsersDialog
              users={data ?? []}
              messageUser={messageUser}
              setSearchUser={setSearchUser}
              isPending={isPending}
              searchUser={searchUser}
            ></UsersDialog>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;

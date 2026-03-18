"use client";

import ChatRows from "@/app/messages/components/chat-rows";
import { UsersDialog } from "@/app/messages/components/chat-users-list";
import { ChatListSkeleton } from "@/app/messages/components/messages-skeleton";
import useUser from "@/stores/user.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, MailPlus } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";

import { useEffect, useState } from "react";


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
    mutationFn: async (visitedUser: {
      id: number;
      name: string;
      username: string;
      avatar: string;
    }) => {
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
    document.title = "Messages / Chirper";
  }, []);

  const messageUser = (
    visitedUserId: number,
    visitedUser: { id: number; name: string; username: string; avatar: string },
  ) => {
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
      <div className="w-full md:w-auto lg:w-[70vw] border-l border-r border-l-border border-r-border min-h-screen relative md:ml-4 flex">
        <div className="w-full md:w-[35%] flex flex-col gap-2 md:border-r md:border-r-border h-svh pl-2 relative">
          <div>
            <h1 className="text-text text-xl font-bold p-4">Chat</h1>
          </div>

          <div className="md:hidden block absolute top-2 right-2 bg-background z-50">
            <UsersDialog
              users={data ?? []}
              messageUser={messageUser}
              setSearchUser={setSearchUser}
              isPending={isPending}
              searchUser={searchUser}
            >
              <MailPlus size={32}></MailPlus>
            </UsersDialog>
          </div>

          {/* Chat columns with chat rows, where I will render all the chats the user have */}
          {!currentUser ? <ChatListSkeleton /> : <ChatRows></ChatRows>}
        </div>

        {/* Render the chatroom from the chat rows */}
        <div className="hidden md:flex md:w-[65%] justify-center items-center">
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

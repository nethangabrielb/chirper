import { Mailbox, Search } from "lucide-react";

import React, { Dispatch, ReactNode, SetStateAction } from "react";

import { ActionButton } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UsersListSkeleton } from "@/components/users-list-skeleton";


export const UsersDialog = ({
  users,
  messageUser,
  setSearchUser,
  isPending,
  searchUser,
  children
}: {
  users: Array<{ id: number; name: string; username: string; avatar: string }>;
  messageUser: (visitedUserId: number, visitedUser: {id: number, name: string, username: string, avatar: string}) => void;
  setSearchUser: Dispatch<SetStateAction<string>>;
  isPending: boolean;
  searchUser: string;
  children?: ReactNode
}) => {
  return (
    <Dialog>
      <DialogTrigger>
        {
          children ? children : <ActionButton className="mt-4">New Chat</ActionButton>
        }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="h-fit">
          <DialogTitle>New message</DialogTitle>
          <div className="group pl-2 flex items-center my-6 bg-accent/40 focus-within:bg-background focus-within:outline focus-within:outline-primary border border-border rounded-lg">
            <Search className="text-neutral-400 peer" size={18}></Search>
            <input
              type="text"
              className="p-3 rounded-lg w-full placeholder:font-light placeholder:text-[14px] text-[14px] outline-0 "
              placeholder="Search name or username"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const target = e.target as HTMLInputElement;
                const value = target.value;

                setSearchUser(value);
              }}
            />
          </div>
        </DialogHeader>
        <div
          className="flex flex-col gap-4 overflow-y-scroll [&::-webkit-scrollbar]:w-2 lg:h-[450px]
        [&::-webkit-scrollbar]:max-h-[90%]
        [&::-webkit-scrollbar-track]:rounded-xl
      [&::-webkit-scrollbar-track]:bg-background
        [&::-webkit-scrollbar-thumb]:rounded-xl
      [&::-webkit-scrollbar-thumb]:bg-accent"
        >
          {users.length >= 1 ? (
            users?.map((user) => {
              return (
                <button
                  key={user?.id}
                  className="flex gap-2 items-center hover:bg-accent mx-1 rounded-md p-1"
                  onClick={() => messageUser(user?.id, user)}
                >
                  <div>
                    <img
                      src={user.avatar}
                      alt={`${user.name}'s avatar`}
                      className="size-[54px] rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <p>{user.name}</p>
                    <p className="text-darker">@{user.username}</p>
                  </div>
                </button>
              );
            })
          ) : isPending ? (
            <>
              <UsersListSkeleton></UsersListSkeleton>
              <UsersListSkeleton></UsersListSkeleton>
              <UsersListSkeleton></UsersListSkeleton>
              <UsersListSkeleton></UsersListSkeleton>
              <UsersListSkeleton></UsersListSkeleton>
            </>
          ) : (
            (users.length === 0 && searchUser.length === 0) ||
            (searchUser.length > 0 && (
              <div className="m-auto -translate-y-20 flex flex-col items-center gap-2">
                <Mailbox size={46}></Mailbox>
                <p className="text-darker font-bold">No users found</p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

"use client";

import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton for individual chat row items in the sidebar list */
export const ChatRowSkeleton = () => {
  return (
    <div className="flex items-center gap-4 px-2 py-1">
      <Skeleton className="size-[56px] min-w-[56px] rounded-full" />
      <div className="flex flex-col gap-2 w-full relative">
        <Skeleton className="h-4 w-[120px]" />
        <div className="absolute border-b-muted border-b-[1.5px] w-full bottom-0" />
      </div>
    </div>
  );
};

/** Skeleton for the full chat list (left panel) */
export const ChatListSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <ChatRowSkeleton key={i} />
      ))}
    </>
  );
};

/** Skeleton for the chat room (right panel) */
export const ChatRoomSkeleton = () => {
  return (
    <div className="flex flex-col w-full md:w-[65%] h-svh md:h-full gap-2 relative pr-2 py-2">
      <div className="flex flex-col gap-2 p-4 h-full">
        {/* Header: avatar + name */}
        <div className="flex gap-2 md:gap-4 items-center pl-2 md:pl-4 pt-4 pb-1">
          <Skeleton className="size-[40px] md:size-[64px] rounded-full" />
          <Skeleton className="h-5 w-[120px]" />
        </div>

        {/* Profile intro */}
        <div className="flex flex-col items-center pt-12 md:pt-20 pb-4 md:pb-8 gap-2">
          <Skeleton className="size-[48px] md:size-[64px] rounded-full" />
          <Skeleton className="h-5 w-[140px]" />
          <Skeleton className="h-3 w-[100px]" />
          <Skeleton className="h-8 w-[100px] rounded-full mt-2" />
        </div>

        {/* Message bubbles */}
        <div className="flex flex-col gap-3 mt-4">
          <Skeleton className="h-10 w-[60%] rounded-2xl self-start" />
          <Skeleton className="h-10 w-[45%] rounded-2xl self-end" />
          <Skeleton className="h-14 w-[70%] rounded-2xl self-start" />
          <Skeleton className="h-10 w-[50%] rounded-2xl self-end" />
          <Skeleton className="h-10 w-[55%] rounded-2xl self-start" />
        </div>
      </div>

      {/* Input bar at bottom */}
      <div className="w-full absolute bottom-0 left-0 p-4">
        <Skeleton className="h-14 w-full md:w-[98%] rounded-full" />
      </div>
    </div>
  );
};

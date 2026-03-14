import useRooms from "@/app/messages/hooks/useRooms";
import useUser from "@/stores/user.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Link from "next/link";

import messageApi from "@/lib/api/message";
import { cn } from "@/lib/utils";

import { MessageType } from "@/types/message";
import { RoomType } from "@/types/room";
import { User } from "@/types/user";

const ChatRows = ({ params }: { params?: number }) => {
  const { chatRooms } = useRooms();
  const currentUser = useUser((state) => state.user) as User;
  const queryClient = useQueryClient();
  const setReadMutation = useMutation({
    mutationFn: async (params: number) => {
      const res = await messageApi.setMessagesRead(params);
      return res;
    },
    onSuccess: (res) => {
      if (res.status === "success") {
        queryClient.invalidateQueries({
          queryKey: ["chatRooms", currentUser?.id],
        });
      }
    },
  });
  return (
    <div className="flex flex-col [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:max-h-[90%]
    [&::-webkit-scrollbar-track]:rounded-xl
    [&::-webkit-scrollbar-track]:bg-background
    [&::-webkit-scrollbar-thumb]:rounded-xl
    [&::-webkit-scrollbar-thumb]:bg-accent overflow-y-scroll pb-[68.8px] md:pb-0">
      {chatRooms?.map((room: RoomType) => {
        const otherUser = room?.users.find(
          (user) => user?.id !== currentUser?.id,
        );
        const unreadMessagesCount = room.messages.filter(
          (message: MessageType) =>
            message.unread === true && message.senderId !== currentUser?.id,
        ).length;

        return (
          <Link
            href={`/messages/${room.id}`}
            key={room.id}
            className={cn(
              "flex items-center gap-4 px-2 transition-all hover:bg-muted relative",
              room.id === params && "bg-muted",
            )}
            onClick={() => setReadMutation.mutate(Number(room.id))}
          >
            {unreadMessagesCount > 0 && (
              <p className="text-white bg-primary p-2 flex justify-center items-center absolute right-4 rounded-full size-8">
                {unreadMessagesCount}
              </p>
            )}
            <img
              src={otherUser?.avatar}
              alt={`@${otherUser?.username}'s avatar`}
              className="rounded-full size-[56px] my-2 object-cover"
            />
            <div className="flex flex-col w-full h-full justify-center relative">
              <p>{otherUser?.name}</p>
              <div className="absolute border-b-muted border-b-[1.5px] w-full bottom-0 " />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ChatRows;

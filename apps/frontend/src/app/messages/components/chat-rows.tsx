import useRooms from "@/app/messages/hooks/useRooms";
import useUser from "@/stores/user.store";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { RoomType } from "@/types/room";
import { User } from "@/types/user";

const ChatRows = ({ params }: { params?: number }) => {
  const { chatRooms } = useRooms();
  const currentUser = useUser((state) => state.user) as User;

  return (
    <div className="flex flex-col">
      {chatRooms?.map((room: RoomType) => {
        const otherUser = room?.users.find(
          (user) => user.id !== currentUser.id,
        );
        return (
          <Link
            href={`/messages/${room.id}`}
            key={room.id}
            className={cn(
              "flex items-center gap-4 px-2 transition-all hover:bg-muted relative",
              room.id === params && "bg-muted",
            )}
          >
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

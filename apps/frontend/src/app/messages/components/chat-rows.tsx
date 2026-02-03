import useRooms from "@/app/messages/hooks/useRooms";
import useUser from "@/stores/user.store";

import { RoomType } from "@/types/room";
import { User } from "@/types/user";

const ChatRows = () => {
  const { chatRooms } = useRooms();
  const currentUser = useUser((state) => state.user) as User;

  return (
    <div className="flex flex-col gap-4">
      {chatRooms?.map((room: RoomType) => {
        const otherUser = room?.users.find(
          (user) => user.id !== currentUser.id,
        );
        return (
          <div key={room.id} className="flex items-center gap-4">
            <img
              src={otherUser?.avatar}
              alt={`@${otherUser?.username}'s avatar`}
              className="rounded-full size-[56px]"
            />
            <div className="flex flex-col">
              <p>{otherUser?.name}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatRows;

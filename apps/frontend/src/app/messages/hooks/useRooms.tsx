import useMessagesNotifications from "@/stores/messages.store";
import useUser from "@/stores/user.store";
import { useQuery } from "@tanstack/react-query";

import { useState } from "react";

import roomApi from "@/lib/api/room";

import { RoomType } from "@/types/room";
import { User } from "@/types/user";

const useRooms = () => {
  const user = useUser((state) => state.user) as User;
  const [newMessagesCount, setNewMessagesCount] = useState<null | number>(null);
  const setUnreadNotifications = useMessagesNotifications(
    (state) => state.setUnreadMessages,
  );
  const { data: chatRooms } = useQuery<RoomType[]>({
    queryKey: ["chatRooms", user?.id],
    queryFn: async () => {
      if (user) {
        const res = await roomApi.getByUserId(user.id);

        let unreadLength = 0;

        const unreadMessages = res.map(
          (room: RoomType) =>
            room.messages.filter(
              (message) =>
                message.unread === true && message.senderId !== user.id,
            ).length,
        );
        unreadMessages.forEach((unreadCount: number) => {
          unreadLength += unreadCount;
        });

        setUnreadNotifications(unreadLength);
        setNewMessagesCount(unreadLength);

        return res;
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!user?.id,
  });

  return { chatRooms, newMessagesCount };
};

export default useRooms;

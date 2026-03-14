import useMessagesNotifications from "@/stores/messages.store";
import useUser from "@/stores/user.store";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useEffect, useState } from "react";

import { socket } from "@/socket/client";
import roomApi from "@/lib/api/room";

import { RoomType } from "@/types/room";
import { User } from "@/types/user";

const useRooms = () => {
  const user = useUser((state) => state.user) as User;
  const [newMessagesCount, setNewMessagesCount] = useState<null | number>(null);
  const setUnreadNotifications = useMessagesNotifications(
    (state) => state.setUnreadMessages,
  );
  const queryClient = useQueryClient();

  // Global socket listener for message notifications (same pattern as useNotifications)
  useEffect(() => {
    const handler = (receiverId: number) => {
      if (receiverId === user?.id) {
        queryClient.invalidateQueries({
          queryKey: ["chatRooms"],
        });
      }
    };

    socket.on("newMessageNotification", handler);

    return () => {
      socket.off("newMessageNotification", handler);
    };
  }, [user?.id]);

  const { data: chatRooms } = useQuery<RoomType[]>({
    queryKey: ["chatRooms", user?.id],
    queryFn: async () => {
      if (user) {
        const res = await roomApi.getByUserId(user?.id);

        let unreadLength = 0;

        const unreadMessages = res.map(
          (room: RoomType) =>
            room?.messages?.filter(
              (message) =>
                message?.unread === true && message?.senderId !== user?.id,
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

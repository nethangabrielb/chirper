import { socket } from "@/socket/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useEffect, useState } from "react";

import notificationsApi from "@/lib/api/notifications";

import { User } from "@/types/user";

const useNotifications = (user: User) => {
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // query for user's notifications
  const { data: notifications } = useQuery({
    queryKey: ["notifications", user],
    queryFn: async () => {
      const notifications = await notificationsApi.getNotifications();
      return notifications;
    },
  });

  // useEffect to initiate socket listening for notifications
  useEffect(() => {
    const resetNotificationsCache = async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    socket.on("notification", (receiverId, notification) => {
      if (receiverId === user.id) {
        setUnreadCount((prev) => prev + 1);
        resetNotificationsCache();
      }
    });
  }, [user]);

  // return the notifications
  return { notifications, setUnreadCount, unreadCount };
};

export default useNotifications;

import { socket } from "@/socket/client";
import { useQuery } from "@tanstack/react-query";

import { useEffect, useState } from "react";

import { User } from "@/types/user";

const useNotifications = (user: User) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // query for user's notifications
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const notifications = notificationsApi.getNotifications();
      return notifications;
    },
  });

  // useEffect to initiate socket listening for notifications
  useEffect(() => {
    socket.on("notification", (receiverId, notification) => {
      if (receiverId === user.id) {
        setUnreadCount((prev) => prev + 1);
      }
    });
  }, [user]);

  // return the notifications
  return { notifications, setUnreadCount, unreadCount };
};

export default useNotifications;

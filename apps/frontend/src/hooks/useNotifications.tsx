import { socket } from "@/socket/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useEffect } from "react";

import notificationsApi from "@/lib/api/notifications";

import { User } from "@/types/user";

interface NotificationBody {
  id: number;
  receiverId: number;
  content: string;
  createdAt: Date;
  unread?: boolean;
}

const useNotifications = (user: User) => {
  const queryClient = useQueryClient();

  // query for user's notifications
  const { data: notifications } = useQuery({
    queryKey: ["notifications", user.id],
    queryFn: async () => {
      const notifications = await notificationsApi.getNotifications();
      return notifications.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!user?.id,
  });

  const resetNotificationsCache = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["notifications", user?.id],
    });
  };

  // useEffect to initiate socket listening for notifications
  useEffect(() => {
    const notificationHandler = (
      receiverId: number,
      notification: NotificationBody,
    ) => {
      if (receiverId === user.id) {
        queryClient.setQueryData(
          ["notifications", user.id],
          (old: NotificationBody[]) => {
            return [...old, { ...notification, unread: true }].sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            );
          },
        );
      }
    };

    socket.on("notification", notificationHandler);

    return () => {
      socket.off("notification", notificationHandler);
    };
  }, [user.id]);

  const notificationsCount = notifications?.filter(
    (notification: NotificationBody) => notification.unread,
  ).length;

  // return the notifications
  return { notifications, resetNotificationsCache, notificationsCount };
};

export default useNotifications;

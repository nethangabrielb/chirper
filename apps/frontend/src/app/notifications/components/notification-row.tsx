import { Dot } from "lucide-react";

import Link from "next/link";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { formatDateNotification } from "@/lib/utils";

import { Notification } from "@/types/notification";

type Props = {
  notification: Notification;
};

const NotificationRow = ({ notification }: Props) => {
  const redirectLink = () => {
    if (notification.post) {
      if (notification.post.deleted) {
        return `/post/invalid`;
      } else {
        return `/post/${notification?.postId}`;
      }
    } else {
      return `/profile/${notification?.senderId}`;
    }
  };

  const href = redirectLink();

  return (
    <Link
      className="p-4 border-b border-b-border flex flex-col gap-2 hover:bg-secondary/40 transition-all"
      href={href}
    >
      <Avatar>
        <AvatarImage src={notification?.sender?.avatar} sizes="4"></AvatarImage>
      </Avatar>
      <div>
        <div className="flex items-center gap-2">
          <p className="text-text">{notification.content}</p>
          <Dot size={8}></Dot>
          <p className="text-darker text-sm font-light">
            {formatDateNotification(notification.createdAt)}
          </p>
        </div>
        {notification.post && (
          <p className="text-darker font-light overflow-x-hidden max-w-[60%] overflow-ellipsis">
            {notification.post.content}
          </p>
        )}
      </div>
    </Link>
  );
};

export default NotificationRow;

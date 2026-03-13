import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

import { FollowType } from "@/types/follow";
import { RoomType } from "@/types/room";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateSlugPost(date: Date) {
  return format(date, "h:mm b . PP");
}

export function formatDateNotification(date: Date) {
  return format(date, "PP, h:mm b");
}

export function formatDateFeedPost(date: Date) {
  return format(date, "PP");
}

export function isFollowing(
  currentUserFollowings: Array<{ id: number; following: FollowType }>,
  followerId: number,
) {
  if (currentUserFollowings) {
    const isUserFollowing = currentUserFollowings.find((followings) => {
      return followings.following.id === followerId;
    });
    if (isUserFollowing) {
      return { following: true, follow: isUserFollowing };
    } else {
      return { following: false, follow: isUserFollowing };
    }
  }
}

export function chatroomExisted(
  currentUserId: number,
  visitedUserId: number,
  rooms: Array<RoomType>,
) {
  const hash = new Map<number, Array<number>>();
  let chatroom: {
    id: number;
    users: Array<{ id: number; name: string; username: string }>;
  } | null = null;
  for (const room of rooms) {
    hash.set(room.id, []);

    room.users.forEach((user) => {
      if (currentUserId === user.id || visitedUserId === user.id) {
        hash.set(room.id, [...(hash.get(room.id) as Array<number>), user?.id]);
      }
    });

    const currentHash = hash.get(room.id);

    if (
      currentHash?.includes(currentUserId) &&
      currentHash?.includes(visitedUserId)
    ) {
      chatroom = room;
      break;
    }
  }

  return chatroom;
}

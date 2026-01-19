import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

import { FollowType } from "@/types/follow";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateSlugPost(date: Date) {
  return format(date, "h:mm b . PP");
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

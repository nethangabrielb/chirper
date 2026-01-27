import useFollows from "@/hooks/useFollows";
import useUser from "@/stores/user.store";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

import { Activity } from "react";

import Link from "next/link";

import { ActionButton } from "@/components/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { User } from "@/types/user";

export function ProfileHoverCard({ user }: Readonly<{ user: User }>) {
  const currentUser = useUser((state) => state.user) as User;
  const { isUserFollowing, followMutation, unfollowMutation } = useFollows({
    currentUserId: currentUser?.id,
    currentUserFollowings: currentUser?.followings,
    visitedUserId: user?.id,
  });

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Avatar>
          <AvatarImage src={user.avatar} alt={`${user.username}'s avatar`} />
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 shadow-xl shadow-secondary bg-background relative">
        <Activity mode={currentUser.id === user?.id ? "hidden" : "visible"}>
          {isUserFollowing ? (
            <ActionButton
              className="absolute right-0 mr-4 bg-primary text-white hover:border-red-500 hover:bg-red-500/10! hover:text-red-500 transition-all"
              hoverText="Unfollow"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                unfollowMutation.mutate();
              }}
            >
              Following
            </ActionButton>
          ) : (
            <ActionButton
              className="hover:bg-primary! absolute right-0 mr-4 bg-primary text-white"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                followMutation.mutate();
              }}
            >
              Follow
            </ActionButton>
          )}
        </Activity>

        <div className="flex flex-col justify-between">
          <Link className="cursor-pointer" href={`/profile/${user.id}`}>
            <Avatar className="size-[72px]! mb-4">
              <AvatarImage
                src={user.avatar}
                alt={`${user.username}'s avatar`}
              />
            </Avatar>
          </Link>
          <div className="space-y-1">
            <div className="flex flex-col items-start">
              <p className="text-[22px] text-text font-bold">{user?.name}</p>
              <Link
                className="text-darker font-light text-[15px] hover:underline"
                href={`/profile/${user.id}`}
              >
                @{user?.username}
              </Link>
            </div>
            {user && (
              <div className="flex items-center gap-2 my-4">
                <Calendar size={18} className="text-darker"></Calendar>
                <p className="text-darker ">
                  Joined on {format(user?.createdAt, "LLLL yyyy")}
                </p>
              </div>
            )}
            <div className="flex gap-4">
              <Link
                className="text-darker hover:underline"
                href={`/profile/${user?.id}/followers`}
              >
                <span className="text-white">{user?._count.Followings}</span>{" "}
                Followers
              </Link>
              <Link
                className="text-darker hover:underline"
                href={`/profile/${user?.id}/followings`}
              >
                <span className="text-white">{user?._count.Followers}</span>{" "}
                Followings
              </Link>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

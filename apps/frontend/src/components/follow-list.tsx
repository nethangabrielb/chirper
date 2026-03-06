import useFollows from "@/hooks/useFollows";

import Link from "next/link";

import { ActionButton } from "@/components/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

import { User, UserPartial } from "@/types/user";

const FollowListRow = ({
  isUser,
  user,
  currentUser,
  className,
}: {
  isUser: boolean;
  user: UserPartial;
  currentUser: User;
  className?: string;
}) => {
  const { optimisticFollow, followMutation, unfollowMutation } = useFollows({
    currentUserId: currentUser.id,
    currentUser,
    currentUserFollowings: currentUser.followings,
    visitedUserId: user.id,
  });

  return (
    <Link href={`/profile/${user.id}`}>
      <section
        className={cn("flex items-center justify-between group", className)}
      >
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src={user?.avatar}
              alt={`${user?.username}'s avatar`}
            />
          </Avatar>
          <div className="flex flex-col">
            <p className="text-[15px] text-text font-bold group-hover:underline">
              {user?.name}
            </p>
            <p className="text-[15px] text-darker font-bold">
              @{user?.username}
            </p>
          </div>
        </div>
        {isUser ? (
          <></>
        ) : optimisticFollow ? (
          <ActionButton
            className="bg-background border border-white text-white hover:border hover:border-red-500 hover:bg-red-500/10! hover:text-red-500 transition-all"
            hoverText="Unfollow"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              unfollowMutation.mutate();
            }}
          >
            Following
          </ActionButton>
        ) : optimisticFollow === false && currentUser.id === user.id ? (
          <ActionButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              followMutation.mutate();
            }}
          >
            Follow back
          </ActionButton>
        ) : (
          <ActionButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              followMutation.mutate();
            }}
          >
            Follow
          </ActionButton>
        )}
      </section>
    </Link>
  );
};

export default FollowListRow;

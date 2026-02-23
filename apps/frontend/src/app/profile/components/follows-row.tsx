import useFollows from "@/hooks/useFollows";

import { ActionButton } from "@/components/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { FollowType } from "@/types/follow";

type Props = {
  follow: FollowType;
  isUser: boolean;
  pathId: number;
  currentUserId: number;
  visitedUserId: number;
  currentUserFollowings: Array<{ id: number; following: FollowType }>;
};

const Follows = ({
  follow,
  isUser,
  pathId,
  currentUserId,
  currentUserFollowings,
  visitedUserId,
}: Props) => {
  const { optimisticFollow, followMutation, unfollowMutation } = useFollows({
    pathId: Number(pathId),
    currentUserId,
    currentUserFollowings,
    visitedUserId,
  });

  return (
    <div
      key={crypto.randomUUID()}
      className="p-4 flex items-center justify-between hover:bg-secondary/40 cursor-pointer transition-all"
    >
      <section className="flex items-center justify-between group">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src={follow?.avatar}
              alt={`${follow?.username}'s avatar`}
            />
          </Avatar>
          <div className="flex flex-col">
            <p className="text-[15px] text-text font-bold group-hover:underline">
              {follow?.name}
            </p>
            <p className="text-[15px] text-darker font-bold">
              @{follow?.username}
            </p>
          </div>
        </div>
      </section>
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
      ) : optimisticFollow === false && currentUserId === visitedUserId ? (
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
    </div>
  );
};

export default Follows;

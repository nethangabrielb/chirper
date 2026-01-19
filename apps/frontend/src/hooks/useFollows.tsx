import { useEffect, useState } from "react";

import { isFollowing } from "@/lib/utils";

import { FollowType } from "@/types/follow";

type Props = {
  pathId?: number;
  currentUserId?: number;
  visitedUserId: number;
  currentUserFollowings: Array<{ following: FollowType }>;
};

const useFollows = ({
  pathId,
  currentUserId,
  currentUserFollowings,
  visitedUserId,
}: Props) => {
  const [isUserFollowing, setIsUserFollowing] = useState<boolean | null>(null);

  useEffect(() => {
    const setIsCurrentUserFollowing = () => {
      if (visitedUserId) {
        const isCurrentUserFollowing = isFollowing(
          currentUserFollowings,
          visitedUserId,
        ) as boolean;
        setIsUserFollowing(isCurrentUserFollowing);
      }
    };
    setIsCurrentUserFollowing();
  }, [visitedUserId, pathId]);

  return { isUserFollowing };
};

export default useFollows;

import { useMutation } from "@tanstack/react-query";

import { useEffect, useOptimistic, useState } from "react";

import followApi from "@/lib/api/follow";
import { isFollowing } from "@/lib/utils";

import { FollowType } from "@/types/follow";

type Props = {
  pathId?: number;
  currentUserId: number;
  visitedUserId: number;
  currentUserFollowings: Array<{ following: FollowType }>;
};

const useFollows = ({
  pathId,
  currentUserId,
  currentUserFollowings,
  visitedUserId,
}: Props) => {
  // Follow information between current user and visited user for mutation calls that
  // needs information on the specific follow (e.g., Follow ID)
  const [follow, setFollow] = useState<{
    id: number;
    following: FollowType;
  } | null>(null);

  // Following state between current and visited user
  const [isUserFollowing, setIsUserFollowing] = useState<boolean | null>(null);

  // Optimistic follow state for instant UI feedback on followng & unfollowing
  const [optimisticFollow, addOptimisticFollow] = useOptimistic(
    isUserFollowing,
    (currentFollowState, optimisticFollowState) =>
      optimisticFollowState as boolean,
  );

  const followMutation = useMutation({
    mutationFn: async () => {
      addOptimisticFollow(true);
      const res = await followApi.createFollow(currentUserId, visitedUserId);
      return res;
    },
    onSuccess: (data: { status: string; message: string }) => {
      if (data.status === "success") {
        setIsUserFollowing(true);
      } else {
        setIsUserFollowing(false);
      }
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      addOptimisticFollow(false);
      const res = await followApi.deleteFollow(follow?.id ?? 0);
      return res;
    },
    onSuccess: (data: { status: string; message: string }) => {
      if (data.status === "success") {
        setIsUserFollowing(true);
      } else {
        setIsUserFollowing(false);
      }
    },
  });

  useEffect(() => {
    const setIsCurrentUserFollowing = () => {
      if (visitedUserId) {
        const isCurrentUserFollowing = isFollowing(
          currentUserFollowings,
          visitedUserId,
        );
        setIsUserFollowing(isCurrentUserFollowing?.following as boolean);
        setFollow(
          isCurrentUserFollowing?.follow as {
            id: number;
            following: FollowType;
          },
        );
      }
    };
    setIsCurrentUserFollowing();
  }, [visitedUserId, pathId]);

  return {
    optimisticFollow,
    isUserFollowing,
    followMutation,
    unfollowMutation,
  };
};

export default useFollows;

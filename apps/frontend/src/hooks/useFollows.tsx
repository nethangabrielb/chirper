import { useMutation, useQueryClient } from "@tanstack/react-query";

import { startTransition, useEffect, useOptimistic, useState } from "react";

import followApi from "@/lib/api/follow";
import { isFollowing } from "@/lib/utils";

import { FollowType } from "@/types/follow";

type Props = {
  pathId?: number;
  currentUserId: number;
  visitedUserId: number;
  currentUserFollowings: Array<{ id: number; following: FollowType }>;
};

type Follow = {
  id: number;
  followerId: number;
  followingId: number;
};

const useFollows = ({
  pathId,
  currentUserId,
  currentUserFollowings,
  visitedUserId,
}: Props) => {
  const queryClient = useQueryClient();

  // Follow information between current user and visited user for mutation calls that
  // needs information on the specific follow (e.g., Follow ID)
  const [follow, setFollow] = useState<Follow | null>(null);

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
      startTransition(() => {
        addOptimisticFollow(true);
      });
      const res = await followApi.createFollow(currentUserId, visitedUserId);
      return res;
    },
    onSuccess: (data: { status: string; message: string; data: Follow }) => {
      if (data.status === "success") {
        resetUserQueryCache();
        setIsUserFollowing(true);
        setFollow(data.data);
      } else {
        setIsUserFollowing(false);
      }
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      startTransition(() => {
        addOptimisticFollow(false);
      });
      const res = await followApi.deleteFollow(follow?.id ?? 0);
      return res;
    },
    onSuccess: (data: { status: string; message: string }) => {
      if (data.status === "success") {
        resetUserQueryCache();
        setIsUserFollowing(false);
        setFollow(null);
      } else {
        setIsUserFollowing(true);
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
        if (isCurrentUserFollowing?.following) {
          setFollow({
            id: isCurrentUserFollowing?.follow?.id ?? 0,
            followerId: currentUserId,
            followingId: visitedUserId,
          });
        }
      }
    };
    setIsCurrentUserFollowing();
  }, [visitedUserId, pathId]);

  const resetUserQueryCache = async () => {
    await queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return {
    optimisticFollow,
    isUserFollowing,
    followMutation,
    unfollowMutation,
  };
};

export default useFollows;

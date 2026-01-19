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
  const [isUserFollowing, setIsUserFollowing] = useState<boolean | null>(null);

  const [optimisticFollow, addOptimisticFollow] = useOptimistic(
    isUserFollowing,
    (currentFollowState, optimisticFollowState) =>
      optimisticFollowState as boolean,
  );

  const followMutation = useMutation({
    mutationFn: async () => {
      addOptimisticFollow(true);
      const res = await followApi.createFollow(currentUserId, visitedUserId);
      console.log(res);
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
        ) as boolean;
        setIsUserFollowing(isCurrentUserFollowing);
      }
    };
    setIsCurrentUserFollowing();
  }, [visitedUserId, pathId]);

  return { optimisticFollow, isUserFollowing, followMutation };
};

export default useFollows;

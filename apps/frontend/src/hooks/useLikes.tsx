import { useMutation, useQueryClient } from "@tanstack/react-query";

import { startTransition, useOptimistic, useState } from "react";

import postApi from "@/lib/api/post";

import { PostType } from "@/types/post";
import { ReplyType } from "@/types/reply";
import { User } from "@/types/user";

export const useLikes = (post: PostType | ReplyType, user: User) => {
  const queryClient = useQueryClient();

  // put likes in a state to use as source of truth
  // for useOptimistic hooks
  const [likes, setLikes] = useState(post?._count.Like);

  // source of truth to determine if clicking the like button should either
  // like or unlike a tweet by determining if current user has alr liked a post
  const [userHasLiked, setUserHasLiked] = useState(
    post?.Like?.find((userId: { userId: number }) => userId.userId === user?.id)
      ?.userId === user?.id,
  );
  const [optimisticLikes, addOptimisticLikes] = useOptimistic(
    likes,
    (currentLike: number, updatedLike: number) => currentLike + updatedLike,
  );

  // LIKE/UNLIKE POST API INTERFACE
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (userHasLiked) {
        startTransition(() => {
          addOptimisticLikes(-1);
        });
        const res = await postApi.unlikePost(post.id);
        return res;
      } else {
        startTransition(() => {
          addOptimisticLikes(1);
        });
        const res = await postApi.likePost(post.id);
        return res;
      }
    },
    onSuccess: (res) => {
      if (res.message === "Post liked successfully") {
        setLikes((prev: number) => prev + 1);
        setUserHasLiked(true);
      } else if (res.message === "Unlike success") {
        setLikes((prev: number) => prev - 1);
        setUserHasLiked(false);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["post"] });
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["userProfilePage"] });
      await queryClient.invalidateQueries({ queryKey: ["bookmarkedPosts"] });
    },
  });

  return {
    likes,
    setLikes,
    userHasLiked,
    setUserHasLiked,
    optimisticLikes,
    addOptimisticLikes,
    likeMutation,
  };
};

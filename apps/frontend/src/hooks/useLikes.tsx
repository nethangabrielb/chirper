import notificationHandler from "@/socket/handlers/notification";
import useGuestDialog from "@/stores/guest-dialog.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { startTransition, useEffect, useOptimistic, useState } from "react";

import postApi from "@/lib/api/post";

import { PostType } from "@/types/post";
import { ReplyType } from "@/types/reply";
import { User } from "@/types/user";

export const useLikes = (post: PostType | ReplyType, user: User) => {
  const queryClient = useQueryClient();
  const openGuestDialog = useGuestDialog((state) => state.setOpenGuestDialog);

  // put likes in a state to use as source of truth
  // for useOptimistic hooks
  const [likes, setLikes] = useState(post?._count.Like);

  // source of truth to determine if clicking the like button should either
  // like or unlike a tweet by determining if current user has alr liked a post
  const [userHasLiked, setUserHasLiked] = useState(
    post?.Like?.find((userId: { userId: number }) => userId.userId === user?.id)
      ?.userId === user?.id,
  );

  const [optimisticHasLiked, addOptimisticHasLiked] = useOptimistic(
    userHasLiked,
    (currentValue: boolean, updatedValue: boolean) => updatedValue,
  );

  const [optimisticLikes, addOptimisticLikes] = useOptimistic(
    likes,
    (currentLike: number, updatedLike: number) => currentLike + updatedLike,
  );

  useEffect(() => {
    setUserHasLiked(
      post?.Like?.find(
        (userId: { userId: number }) => userId.userId === user?.id,
      )?.userId === user?.id,
    );
  }, [post, user]);

  useEffect(() => {
    setLikes(post?._count.Like);
  }, [post]);

  // LIKE/UNLIKE POST API INTERFACE
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (user.isGuest) {
        openGuestDialog(true);
        return;
      }
      if (userHasLiked) {
        startTransition(() => {
          addOptimisticLikes(-1);
          addOptimisticHasLiked(false);
        });
        const res = await postApi.unlikePost(post.id);
        return res;
      } else {
        startTransition(() => {
          addOptimisticLikes(1);
          addOptimisticHasLiked(true);
        });
        const res = await postApi.likePost(post.id);
        return res;
      }
    },
    onSuccess: (res) => {
      if (res.message === "Post liked successfully") {
        setLikes((prev: number) => prev + 1);
        setUserHasLiked(true);
        if (post?.userId !== user?.id)
          notificationHandler.emitLikeNotification(
            user,
            post?.userId,
            post?.id,
          );
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
    optimisticHasLiked,
    addOptimisticLikes,
    likeMutation,
  };
};

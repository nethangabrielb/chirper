import useGuestDialog from "@/stores/guest-dialog.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { startTransition, useEffect, useOptimistic, useState } from "react";

import bookmarkApi from "@/lib/api/bookmark";

import { PostType } from "@/types/post";
import { User } from "@/types/user";

type Props = {
  post: PostType;
  user: User;
};

export const useBookmark = ({ post, user }: Props) => {
  const queryClient = useQueryClient();
  const openGuestDialog = useGuestDialog((state) => state.setOpenGuestDialog);
  const [userHasBookmarked, setUserHasBookmarked] = useState(
    post?.bookmarks?.find((bookmark) => bookmark.userId === user?.id)
      ?.userId === user?.id,
  );

  const [optimisticBookmark, addOptimisticBookmark] = useOptimistic(
    userHasBookmarked,
    (currentBookmarkState, optimisticBookmarkState) =>
      optimisticBookmarkState as boolean,
  );

  useEffect(() => {
    setUserHasBookmarked(
      post?.bookmarks?.find((bookmark) => bookmark.userId === user?.id)
        ?.userId === user?.id,
    );
  }, [post, user?.id]);

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (user?.isGuest) {
        openGuestDialog(true);
        return;
      }
      if (userHasBookmarked) {
        startTransition(() => {
          addOptimisticBookmark(false);
        });
        const bookmark = post?.bookmarks?.find(
          (bookmark) => bookmark.userId === user?.id,
        );
        if (bookmark) {
          const res = await bookmarkApi.removeBookmarkOnPost(bookmark?.id);
          return res;
        }
      } else if (!userHasBookmarked) {
        startTransition(() => {
          addOptimisticBookmark(true);
        });
        const res = await bookmarkApi.bookmarkPost(user?.id, post.id);
        return res;
      }
    },
    onSuccess: (res) => {
      if (res.status === "success") {
        if (res.message === "Bookmarked successfully") {
          toast.success("Added to your bookmarks", {
            style: {
              background: "#1d9bf0",
              color: "white",
              width: "fit-content",
            },
          });
          setUserHasBookmarked(true);
        } else if (res.message === "Bookmark removed successfully") {
          setUserHasBookmarked(false);
          toast.success("Removed from your bookmarks", {
            style: {
              background: "#1d9bf0",
              color: "white",
              width: "fit-content",
            },
          });
        }
      } else if (res.status === "error") {
        if (optimisticBookmark) {
          setUserHasBookmarked(false);
          toast.error(res.message);
        } else {
          setUserHasBookmarked(true);
          toast.error(res.message);
        }
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

  return { userHasBookmarked, optimisticBookmark, bookmarkMutation };
};

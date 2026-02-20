import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { startTransition, useOptimistic, useState } from "react";

import bookmarkApi from "@/lib/api/bookmark";

import { PostType } from "@/types/post";
import { User } from "@/types/user";

type Props = {
  post: PostType;
  user: User;
  refetchPosts: () => void;
  refetch?: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<any, Error>>;
  refetchUser?: () => Promise<void>;
};

export const useBookmark = ({
  post,
  user,
  refetchPosts,
  refetch,
  refetchUser,
}: Props) => {
  const [userHasBookmarked, setUserHasBookmarked] = useState(
    post?.bookmarks?.find((bookmark) => bookmark.userId === user.id)?.userId ===
      user.id,
  );

  const [optimisticBookmark, addOptimisticBookmark] = useOptimistic(
    userHasBookmarked,
    (currentBookmarkState, optimisticBookmarkState) =>
      optimisticBookmarkState as boolean,
  );

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (userHasBookmarked) {
        startTransition(() => {
          addOptimisticBookmark(false);
        });
        const bookmark = post?.bookmarks?.find(
          (bookmark) => bookmark.userId === user.id,
        );
        if (bookmark) {
          const res = await bookmarkApi.removeBookmarkOnPost(bookmark?.id);
          return res;
        }
      } else if (!userHasBookmarked) {
        startTransition(() => {
          addOptimisticBookmark(true);
        });
        const res = await bookmarkApi.bookmarkPost(user.id, post.id);
        return res;
      }
    },
    onSuccess: (res) => {
      refetchPosts();
      if (refetch) {
        refetch();
      }

      if (refetchUser) {
        refetchUser();
      }

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
  });

  return { userHasBookmarked, optimisticBookmark, bookmarkMutation };
};

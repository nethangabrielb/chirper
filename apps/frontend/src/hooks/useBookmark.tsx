import { useState } from "react";

import { BookmarkType } from "@/types/bookmark";
import { PostType } from "@/types/post";
import { User } from "@/types/user";

type Props = {
  post: PostType;
  user: User;
};

export const useBookmark = ({ post, user }: Props) => {
  const [userHasBookmarked, setUserHasBookmarked] = useState(
    post?.bookmarks?.find((bookmark) => bookmark.userId === user.id)?.userId ===
      user.id,
  );

  return { userHasBookmarked };
};

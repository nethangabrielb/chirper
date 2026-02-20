"use client";

import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

import Post from "@/components/post-section";

import { PostType } from "@/types/post";
import { ReplyType } from "@/types/reply";

type Props = {
  post: PostType | ReplyType;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<any, Error>>;
  refetchPosts: () => void;
  displayReplies?: boolean;
  bookmarkedPosts?: boolean;
};

const FeedPost = ({
  post,
  refetch,
  refetchPosts,
  displayReplies = true,
  bookmarkedPosts,
}: Props) => {
  return (
    <div className="flex flex-col border-b border-b-border border-x border-x-border">
      {bookmarkedPosts ? (
        <Post
          bookmarkedPost={true}
          post={post}
          refetch={refetch}
          refetchPosts={refetchPosts}
          displayReplies={false}
        ></Post>
      ) : (
        <>
          {post?.reply && (
            <Post
              post={post?.reply}
              refetch={refetch}
              refetchPosts={refetchPosts}
              displayReplies={displayReplies}
            ></Post>
          )}
          <Post
            post={post}
            refetch={refetch}
            refetchPosts={refetchPosts}
            displayReplies={post?.replies?.length > 0 && displayReplies}
          ></Post>
          {post?.replies?.length >= 1 && displayReplies && (
            <Post
              post={post?.replies[0]}
              refetch={refetch}
              refetchPosts={refetchPosts}
              displayReplies={false}
            ></Post>
          )}
        </>
      )}
    </div>
  );
};

export default FeedPost;

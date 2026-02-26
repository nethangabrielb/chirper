"use client";

import Post from "@/components/post-section";

import { PostType } from "@/types/post";
import { ReplyType } from "@/types/reply";

type Props = {
  post: PostType | ReplyType;

  displayReplies?: boolean;
  bookmarkedPosts?: boolean;
};

const FeedPost = ({ post, displayReplies = true, bookmarkedPosts }: Props) => {
  return (
    <div className="flex flex-col border-b border-b-border ">
      {bookmarkedPosts ? (
        <Post bookmarkedPost={true} post={post} displayReplies={false}></Post>
      ) : (
        <>
          {post?.reply && (
            <Post post={post?.reply} displayReplies={displayReplies}></Post>
          )}
          <Post
            post={post}
            displayReplies={post?.replies?.length > 0 && displayReplies}
          ></Post>
          {post?.replies?.length >= 1 && displayReplies && (
            <Post post={post?.replies[0]} displayReplies={false}></Post>
          )}
        </>
      )}
    </div>
  );
};

export default FeedPost;

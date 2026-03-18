"use client";

import FeedPost from "@/app/home/components/feed-post";
import PostSingle from "@/app/post/components/post";
import Reply from "@/app/post/components/reply";
import CreateReply from "@/app/post/components/reply-form";
import { useQuery } from "@tanstack/react-query";

import React, { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import postApi from "@/lib/api/post";

import { PostType } from "@/types/post";
import { ReplyType } from "@/types/reply";

const Post = () => {
  const [isReply, setIsReply] = useState<boolean | null>(null);
  const params = useParams();
  const router = useRouter();

  const { data: post, refetch } = useQuery<PostType | ReplyType>({
    queryKey: ["post", params.id],
    queryFn: async () => {
      const posts = await postApi.getPost(params.id);
      return posts;
    },
  });

  useEffect(() => {
    document.title = `${post?.user?.username} on Chirper: ${post?.content}`;
  }, [post]);

  useEffect(() => {
    if (post?.replyId !== null) {
      setIsReply(true);
    } else {
      setIsReply(false);
    }
  }, [post]);

  return (
    <>
      <div className="lg:w-[600px] w-full border-l border-r border-l-border border-r-border h-full relative">
        {/* FEED CONTROL UI */}
        <div className="flex backdrop-blur-xl bg-white/60 dark:bg-black/30 sticky top-0 z-10 w-full">
          <div className="bg-transparent flex-1 p-2 border-b border-b-border font-bold flex items-center gap-4 sm:gap-8">
            <button
              className="p-2 rounded-full hover:bg-neutral-500/20 transition-all cursor-pointer"
              onClick={() => router.back()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </button>
            <h1>Post</h1>
          </div>
        </div>
        <>
          {post && isReply ? (
            <>
              <Reply reply={post}></Reply>
              <CreateReply
                postId={post.id}
                refetch={refetch}
                postUserId={post.userId}
                postContent={post.content}
              ></CreateReply>
              {post?.replies.map((reply: ReplyType) => {
                return (
                  <FeedPost post={reply as ReplyType} key={reply.id}></FeedPost>
                );
              })}
            </>
          ) : (
            post && (
              <>
                <PostSingle post={post}></PostSingle>

                <CreateReply
                  refetch={refetch}
                  postId={Number(params.id)}
                  postUserId={post.userId}
                  postContent={post.content}
                ></CreateReply>
                {post?.replies.map((reply: ReplyType) => {
                  return (
                    <FeedPost
                      post={reply as ReplyType}
                      key={reply.id}
                    ></FeedPost>
                  );
                })}
              </>
            )
          )}
        </>
      </div>
    </>
  );
};

export default Post;

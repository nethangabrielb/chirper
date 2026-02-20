"use client";

import FeedPost from "@/app/home/components/feed-post";
import PostSingle from "@/app/post/components/post";
import Reply from "@/app/post/components/reply";
import CreateReply from "@/app/post/components/reply-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useEffect, useState } from "react";

import Head from "next/head";
import { useParams, useRouter } from "next/navigation";

import postApi from "@/lib/api/post";

import { PostType } from "@/types/post";
import { ReplyType } from "@/types/reply";

const Post = () => {
  const [isReply, setIsReply] = useState<boolean | null>(null);
  const params = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: post, refetch } = useQuery<PostType | ReplyType>({
    queryKey: ["post", params.id],
    queryFn: async () => {
      const posts = await postApi.getPost(params.id);
      return posts;
    },
  });

  const refetchPosts = async () => {
    await queryClient.refetchQueries({ queryKey: ["posts"] });
    await queryClient.refetchQueries({ queryKey: ["post"] });
  };

  useEffect(() => {
    document.title = `${post?.user?.username} on Twitter Clone: ${post?.content}`;
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
      <Head>
        <title>{document.title}</title>
        <meta
          name="description"
          content="Home page of my attempt to make a clone of Twitter"
        />
      </Head>
      <div className="lg:w-[600px] border-l border-r border-l-border border-r-border h-full relative">
        {/* FEED CONTROL UI */}
        <div className="flex backdrop-blur-lg absolute top-0 w-full">
          <div className="bg-transparent flex-1 p-2 border-b border-b-border font-bold flex items-center gap-8">
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
        <div className="mt-[57.1px]"></div>
        <>
          {post && isReply ? (
            <>
              <Reply reply={post} refetchPosts={refetchPosts}></Reply>
              <CreateReply postId={post.id} refetch={refetch}></CreateReply>
              {post?.replies.map((reply: ReplyType) => {
                return (
                  <FeedPost
                    post={reply as ReplyType}
                    refetch={refetch}
                    refetchPosts={refetchPosts}
                    key={reply.id}
                  ></FeedPost>
                );
              })}
            </>
          ) : (
            post && (
              <>
                <PostSingle
                  post={post}
                  refetchPosts={refetchPosts}
                ></PostSingle>

                <CreateReply
                  refetch={refetch}
                  postId={Number(params.id)}
                ></CreateReply>
                {post?.replies.map((reply: ReplyType) => {
                  return (
                    <FeedPost
                      post={reply as ReplyType}
                      refetch={refetch}
                      refetchPosts={refetchPosts}
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

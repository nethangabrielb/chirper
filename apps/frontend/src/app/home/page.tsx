"use client";

import CreatePost from "@/app/home/components/create-post";
import FeedPost from "@/app/home/components/feed-post";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useEffect } from "react";

import Head from "next/head";

import { Spinner } from "@/components/ui/spinner";

import postApi from "@/lib/api/post";
import { cn } from "@/lib/utils";

import { PostType } from "@/types/post";

const Home = () => {
  // POSTS FEED CONTENT QUERY
  const {
    data: posts,
    isPending,
    refetch,
  } = useQuery<PostType[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const posts = await postApi.getPosts();
      return posts;
    },
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = "Home / Twitter";
  }, []);

  const refetchPosts = async () => {
    await queryClient.refetchQueries({ queryKey: ["post"] });
    await queryClient.refetchQueries({ queryKey: ["user"] });
    await queryClient.refetchQueries({ queryKey: ["posts"] });
  };

  useEffect(() => {
    const refetchUser = async () => {
      await queryClient.refetchQueries({ queryKey: ["user"] });
    };
    refetchUser();
  }, []);

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
          <FeedControlBtn>For you</FeedControlBtn>
          <FeedControlBtn>Following</FeedControlBtn>
        </div>
        <div className="mt-[57.1px]"></div>

        {/* CREATE POST SECTION */}
        <CreatePost refetch={refetch}></CreatePost>

        {/* RENDER POSTS */}
        <div className="w-full">
          {/* PENDING STATE */}
          {isPending && (
            <div className="flex justify-center items-center w-full h-full py-4">
              <Spinner className="size-7 text-primary"></Spinner>
            </div>
          )}
          {/* POSTS */}
          {posts &&
            posts.map((post: PostType) => {
              return (
                <FeedPost
                  post={post}
                  key={post.id}
                  refetch={refetch}
                  refetchPosts={refetchPosts}
                  displayReplies={true}
                ></FeedPost>
              );
            })}
        </div>
      </div>
    </>
  );
};

export const FeedControlBtn = ({
  children,
  handleClick,
  isActive = false,
}: {
  children: string;
  handleClick?: () => void;
  isActive?: boolean;
}) => {
  return (
    <button
      className="bg-transparent flex-1 p-4 hover:bg-neutral-900 border-b border-b-border"
      onClick={handleClick}
    >
      <span className={cn(isActive && "border-b-2 border-b-primary")}>
        {children}
      </span>
    </button>
  );
};

export default Home;

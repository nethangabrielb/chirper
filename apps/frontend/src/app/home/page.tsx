"use client";

import CreatePost from "@/app/home/components/create-post";
import FeedPost from "@/app/home/components/feed-post";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import React, { useEffect, useRef, useState } from "react";

import Head from "next/head";

import { Spinner } from "@/components/ui/spinner";

import postApi from "@/lib/api/post";
import { cn } from "@/lib/utils";

import { PostType } from "@/types/post";

const Home = () => {
  const queryClient = useQueryClient();
  const postsContainerRef = useRef<HTMLDivElement>(null);
  const [reachedBottom, setReachedBottom] = useState<boolean>(false);
  const [feedType, setFeedType] = useState<"default" | "followings">("default");
  // POSTS FEED CONTENT QUERY
  const {
    data: posts,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["posts", feedType],
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.length < 20) {
        return null;
      } else {
        return lastPage.nextCursor;
      }
    },
    queryFn: async ({ pageParam }: { pageParam: number | undefined }) => {
      if (feedType === "default") {
        const posts = await postApi.getPosts(pageParam);
        return posts;
      } else {
        const posts = await postApi.getFollowingsPosts(pageParam);
        return posts;
      }
    },
  });

  console.log(posts);

  useEffect(() => {
    document.title = "Home / Twitter Clone";
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      const elementRect = postsContainerRef.current?.getBoundingClientRect();
      if (
        Math.floor(elementRect?.bottom as number) ===
        Math.floor(window.innerHeight)
      ) {
        setReachedBottom(true);
      } else {
        setReachedBottom(false);
      }
    });
  }, []);

  useEffect(() => {
    if (reachedBottom === true && hasNextPage) {
      fetchNextPage();
    }
  }, [reachedBottom]);

  const refetchPosts = async () => {
    await queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <>
      <Head>
        <title>{document.title}</title>
        <meta
          name="description"
          content="Home page of my attempt to make a clone of Twitter"
        />
      </Head>
      <div className="lg:w-[600px] h-full relative">
        {/* FEED CONTROL UI */}
        <div className="flex backdrop-blur-lg absolute top-0 w-full border-x border-x-border">
          <FeedControlBtn
            isActive={feedType === "default"}
            handleClick={() => setFeedType("default")}
          >
            For you
          </FeedControlBtn>
          <FeedControlBtn
            isActive={feedType === "followings"}
            handleClick={() => setFeedType("followings")}
          >
            Following
          </FeedControlBtn>
        </div>
        <div className="mt-[57.1px]"></div>

        {/* CREATE POST SECTION */}
        <CreatePost refetch={refetchPosts}></CreatePost>

        {/* RENDER POSTS */}
        <div
          className="w-full border-x border-x-border"
          ref={postsContainerRef}
        >
          {/* PENDING STATE */}
          {posts &&
            posts.pages.map((pageGroup, i) => {
              return (
                <React.Fragment key={i}>
                  {pageGroup?.data.map((post: PostType) => {
                    return (
                      <FeedPost
                        post={post}
                        key={post.id}
                        displayReplies={true}
                      ></FeedPost>
                    );
                  })}
                </React.Fragment>
              );
            })}

          {isFetching && (
            <div className="flex justify-center items-center w-full h-full py-4">
              <Spinner className="size-7 text-primary"></Spinner>
            </div>
          )}
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
      className={
        "bg-transparent flex-1 p-4 hover:bg-neutral-900 border-b border-b-border"
      }
      onClick={handleClick}
    >
      <span className={cn(isActive && "border-b-3 border-b-primary")}>
        {children}
      </span>
    </button>
  );
};

export default Home;

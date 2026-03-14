"use client";

import CreatePost from "@/app/home/components/create-post";
import FeedPost from "@/app/home/components/feed-post";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import React, { Activity, useEffect, useRef, useState } from "react";

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
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    document.title = "Home / Chirper";
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
      <div className="lg:w-[600px] w-full min-h-screen relative">
        {/* FEED CONTROL UI */}
        <div className="flex backdrop-blur-xl bg-white/60 dark:bg-black/30 z-10 sticky top-0 w-full border-x border-x-border">
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

        {/* CREATE POST SECTION */}
        <CreatePost refetch={refetchPosts}></CreatePost>

        {/* RENDER POSTS */}
        <div
          className={cn(
            "w-full border-x border-x-border",
            posts && posts.pages[0].data.length === 0 && "border-0 mt-20",
          )}
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

          <Activity
            mode={
              posts && posts.pages[0].data.length === 0 ? "visible" : "hidden"
            }
          >
            <div className="h-full flex justify-center items-center mt-auto flex-col">
              <svg
                viewBox="0 0 1024 1024"
                className="size-24"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M151.963012 337.651783v30.025437h22.107732l7.917705 60.050874c0 11.025197 3.281552 21.170877 8.473675 30.025438h673.634633c5.191099-8.85456 8.475723-19.00024 8.475723-30.025438l7.975043-60.050874h22.050394v-30.025437H151.963012zM269.365799 790.671893c5.512599 31.433279 25.626826 57.294575 57.294575 57.294575h401.238133c31.667749 0 50.845121-25.392356 57.354985-57.294575l51.869006-302.892924h-619.686115l51.929416 302.892924z m146.373622-228.414482l21.231286-21.231286 90.310781 90.253444 90.310782-90.253444 21.228214 21.231286-90.310781 90.250372 90.604636 90.604636-21.231286 21.228215-90.601565-90.604636-90.604636 90.604636-21.228214-21.228215 90.602588-90.604636-90.311805-90.250372z"
                    fill="#1d9bf0"
                  ></path>
                  <path
                    d="M121.937575 307.626346v30.025437h22.107732l7.917705 60.050874c0 11.025197 3.281552 21.170877 8.473675 30.025437h673.634633c5.191099-8.85456 8.475723-19.00024 8.475723-30.025437l7.975043-60.050874h22.050394v-30.025437H121.937575zM239.340362 760.646456c5.512599 31.433279 25.626826 57.294575 57.294575 57.294575H697.87307c31.667749 0 50.845121-25.392356 57.354984-57.294575l51.869007-302.892924h-619.686115l51.929416 302.892924z m146.373622-228.414482l21.231286-21.231286 90.310781 90.253444 90.310782-90.253444 21.228214 21.231286-90.310781 90.250372 90.604636 90.604636-21.231286 21.228215-90.601565-90.604637-90.604636 90.604637-21.228214-21.228215 90.602588-90.604636-90.311805-90.250372z"
                    fill="#16181c"
                  ></path>
                  <path
                    d="M306.141858 413.762503a27.013167 57.402083 55.515 1 0 94.63014-65.001024 27.013167 57.402083 55.515 1 0-94.63014 65.001024Z"
                    fill="#FEFEFE"
                  ></path>
                  <path
                    d="M248.134573 508.228533a18.008095 31.51519 55.515 1 0 51.954332-35.687201 18.008095 31.51519 55.515 1 0-51.954332 35.687201Z"
                    fill="#FEFEFE"
                  ></path>
                </g>
              </svg>
              <p className="font-bold text-lg">Nothing to see here!</p>
            </div>
          </Activity>
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

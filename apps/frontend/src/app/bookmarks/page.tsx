"use client";

import FeedPost from "@/app/home/components/feed-post";
import { useQuery } from "@tanstack/react-query";

import { useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/navigation";

import postApi from "@/lib/api/post";

import { PostType } from "@/types/post";

const Bookmarks = () => {
  const router = useRouter();

  const { data: posts } = useQuery({
    queryKey: ["bookmarkedPosts"],
    queryFn: async () => {
      const res = await postApi.getUserBookmarkedPosts();
      return res.data;
    },
  });

  useEffect(() => {
    document.title = "Bookmarks / Twitter Clone";
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
        <div className="flex backdrop-blur-md top-0 z-100 w-full sticky">
          <div className="bg-transparent flex-1 p-2 border-b border-b-border font-bold flex items-center gap-8">
            <button
              className="p-2 rounded-full hover:bg-neutral-500/20 transition-all cursor-pointer"
              onClick={() => router.push("/home")}
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
            <div className="flex flex-col">Bookmarks</div>
          </div>
        </div>
        {posts && posts.length > 0 ? (
          posts.map(
            (post: {
              id: number;
              createdAt: string;
              post: PostType;
              postId: number;
              userId: number;
            }) => {
              return (
                <FeedPost
                  post={post.post}
                  key={post.post.id}
                  bookmarkedPosts={true}
                ></FeedPost>
              );
            },
          )
        ) : (
          <div className="flex justify-center items-center flex-col mt-50">
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
        )}
      </div>
    </>
  );
};

export default Bookmarks;

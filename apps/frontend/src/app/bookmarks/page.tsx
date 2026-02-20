"use client";

import FeedPost from "@/app/home/components/feed-post";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/navigation";

import postApi from "@/lib/api/post";

import { PostType } from "@/types/post";

const Bookmarks = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: posts, refetch } = useQuery({
    queryKey: ["bookmarkedPosts"],
    queryFn: async () => {
      const res = await postApi.getUserBookmarkedPosts();
      console.log(res.data);
      return res.data;
    },
  });

  useEffect(() => {
    document.title = "Bookmarks / Twitter Clone";
  }, []);

  const refetchPosts = async () => {
    await queryClient.refetchQueries({ queryKey: ["post"] });
    await queryClient.refetchQueries({ queryKey: ["user"] });
    await queryClient.refetchQueries({ queryKey: ["posts"] });
    await queryClient.refetchQueries({ queryKey: ["userProfilePage"] });
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
        {posts &&
          posts.map((post: PostType) => {
            return (
              <FeedPost
                post={post}
                key={post.id}
                refetchPosts={refetchPosts}
                refetch={refetch}
                bookmarkedPosts={true}
              ></FeedPost>
            );
          })}
      </div>
    </>
  );
};

export default Bookmarks;

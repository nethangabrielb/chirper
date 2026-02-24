"use client";

import useUser from "@/stores/user.store";
import { useQuery } from "@tanstack/react-query";

import { useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/navigation";

import FollowListRow from "@/components/follow-list";

import userApi from "@/lib/api/user";

import { User, UserPartial } from "@/types/user";

const ConnectPeople = () => {
  const router = useRouter();
  const currentUser = useUser((state) => state.user) as User;

  const { data } = useQuery({
    queryKey: ["followListPage"],
    queryFn: async () => {
      const res = await userApi.getUserFollowList();
      return res;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    document.title = "Follow / Twitter Clone";
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
            <div className="flex flex-col">Follow</div>
          </div>
        </div>
        <main className="flex flex-col">
          {currentUser &&
            data?.map((user: UserPartial) => {
              return (
                <FollowListRow
                  isUser={user.id === currentUser?.id}
                  user={user}
                  key={user.id}
                  currentUser={currentUser}
                  className="p-4 hover:bg-secondary/40"
                ></FollowListRow>
              );
            })}
        </main>
      </div>
    </>
  );
};

export default ConnectPeople;

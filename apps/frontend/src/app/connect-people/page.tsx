"use client";

import useUser from "@/stores/user.store";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";

import React, { useEffect, useRef, useState } from "react";


import FollowListRow from "@/components/follow-list";
import { Spinner } from "@/components/ui/spinner";

import userApi from "@/lib/api/user";
import { cn } from "@/lib/utils";

import { User, UserPartial } from "@/types/user";

const ConnectPeople = () => {
  const router = useRouter();
  const currentUser = useUser((state) => state.user) as User;
  const followsContainer = useRef<HTMLElement>(null);
  const [reachedBottom, setReachedBottom] = useState<boolean>(false);

  const { data, fetchNextPage, isFetching, hasNextPage } = useInfiniteQuery({
    queryKey: ["followListPage"],
    queryFn: async ({ pageParam }) => {
      const res = await userApi.getUserFollowList(pageParam);
      return res;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.length === 20) {
        return lastPage.nextPage;
      } else {
        return undefined;
      }
    },

    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    document.title = "Follow / Chirper";
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      const elementRect = followsContainer.current?.getBoundingClientRect();
      if (elementRect?.bottom === window.innerHeight) {
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

  return (
    <>
      <div className="lg:w-[600px] w-full relative h-fit">
        <div className="flex backdrop-blur-md top-0 z-100 w-full sticky border-x border-x-border">
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
        <main
          className={cn(
            "flex flex-col border-x border-x-border",
            (isFetching && "h-svh") || (!data && "h-svh"),
          )}
          ref={followsContainer}
        >
          {currentUser &&
            data?.pages?.map(
              (page: { data: UserPartial[]; nextPage: number }, i) => {
                return (
                  <React.Fragment key={i}>
                    {page?.data?.map((user: UserPartial) => {
                      return (
                        <FollowListRow
                          isUser={user?.id === currentUser?.id}
                          user={user}
                          key={user?.id}
                          currentUser={currentUser}
                          className="p-4 hover:bg-secondary/40"
                        ></FollowListRow>
                      );
                    })}
                  </React.Fragment>
                );
              },
            )}
          {isFetching && (
            <div className="flex justify-center w-full h-full py-4">
              <Spinner className="size-7 text-primary"></Spinner>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ConnectPeople;

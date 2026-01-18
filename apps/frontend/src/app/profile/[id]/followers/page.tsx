"use client";

import Follows from "@/app/profile/components/follows-row";
import LinkButton from "@/app/profile/components/link-button";
import useBoxHeight from "@/hooks/useBoxHeight";
import useUser from "@/stores/user.store";
import { useQuery } from "@tanstack/react-query";

import React, { ReactElement, useEffect, useRef } from "react";

import Head from "next/head";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { ActionButton } from "@/components/button";

import followApi from "@/lib/api/follow";
import { isFollowing } from "@/lib/utils";

import { FollowType } from "@/types/follow";
import { User } from "@/types/user";

const FollowersIndex = () => {
  const router = useRouter();
  const visitedUser = useUser((state) => state.visitedUser) as User;
  const currentUser = useUser((state) => state.user) as User;
  const params = useParams();
  const elementRef = useRef<HTMLDivElement>(null);
  const { height, setHeight } = useBoxHeight();
  const { data: followers } = useQuery({
    queryKey: [params?.id],
    queryFn: async () => {
      if (params) {
        const followers = await followApi.getFollowers(Number(params.id));
        return followers.data;
      }
    },
  });

  useEffect(() => {
    if (elementRef?.current?.getBoundingClientRect()) {
      setHeight(elementRef?.current?.getBoundingClientRect().height);
    }
  }, [elementRef]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      const currentElement = elementRef.current;
      setHeight(currentElement?.getBoundingClientRect().height!);
    });
  }, []);

  useEffect(() => {
    document.title = `Twitter / @${visitedUser.username}'s Followers`;
  }, [params.id]);

  return (
    <>
      <Head>
        <title>{document.title}</title>
        <meta
          name="description"
          content="Home page of my attempt to make a clone of Twitter"
        />
      </Head>
      <div className="lg:w-[600px] h-full relative border-l border-r border-l-border border-r-border">
        <div
          className="flex backdrop-blur-lg absolute top-0 w-full flex-col border-b border-b-border"
          ref={elementRef}
        >
          <div className="bg-transparent flex-1 p-2 font-bold flex items-center gap-8">
            <button
              className="p-2 rounded-full hover:bg-neutral-500/20 transition-all cursor-pointer"
              onClick={() => router.push(`/profile/${visitedUser?.id}`)}
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
            <div className="flex flex-col">
              <p className="text-[15px] text-text font-bold">
                {visitedUser?.name}
              </p>
              <p className="text-[15px] text-darker font-bold">
                @{visitedUser?.username}
              </p>
            </div>
          </div>
          <div className="flex w-full">
            <LinkButton
              isActive={true}
              href={`/profile/${visitedUser?.id}/followers`}
            >
              Followers
            </LinkButton>
            <LinkButton href={`/profile/${visitedUser?.id}/followings`}>
              Followings
            </LinkButton>
          </div>
        </div>
        <div style={{ marginTop: `${height}px` }}></div>
        <main className="flex flex-col">
          {followers?.map((follow: { follower: FollowType }) => {
            const isUserFollowing = isFollowing(
              currentUser?.followings,
              follow?.follower?.id,
            );
            return (
              <Link
                key={crypto.randomUUID()}
                href={`/profile/${follow?.follower?.id}`}
              >
                <div
                  key={crypto.randomUUID()}
                  className="p-4 flex items-center justify-between hover:bg-secondary/40 cursor-pointer transition-all"
                >
                  <Follows follow={follow?.follower}></Follows>
                  {follow?.follower?.id === currentUser?.id ? (
                    <></>
                  ) : isUserFollowing ? (
                    <ActionButton
                      className="bg-background border border-white text-white hover:border-red-500 hover:bg-red-500/10! hover:text-red-500 transition-all"
                      hoverText="Unfollow"
                    >
                      Following
                    </ActionButton>
                  ) : isUserFollowing! &&
                    currentUser?.id === visitedUser?.id ? (
                    <ActionButton>Follow back</ActionButton>
                  ) : (
                    <ActionButton>Follow</ActionButton>
                  )}
                </div>
              </Link>
            );
          })}
        </main>
      </div>
    </>
  );
};

export default FollowersIndex;

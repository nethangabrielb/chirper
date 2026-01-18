"use client";

import Follows from "@/app/profile/components/follows-row";
import LinkButton from "@/app/profile/components/link-button";
import useUser from "@/stores/user.store";
import { useQuery } from "@tanstack/react-query";

import { useEffect } from "react";

import Head from "next/head";
import { useParams, useRouter } from "next/navigation";

import { ActionButton } from "@/components/button";

import followApi from "@/lib/api/follow";
import { isFollowing } from "@/lib/utils";

import { FollowType } from "@/types/follow";
import { User } from "@/types/user";

const FollowingsIndex = () => {
  const router = useRouter();
  const visitedUser = useUser((state) => state.visitedUser) as User;
  const currentUser = useUser((state) => state.user) as User;
  const params = useParams();
  const { data: followings } = useQuery({
    queryKey: [params.id],
    queryFn: async () => {
      if (params) {
        const followings = await followApi.getFollowings(Number(params.id));
        return followings.data;
      }
    },
  });

  useEffect(() => {
    document.title = `Twitter / @${visitedUser.username} Followings`;
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
        <div className="flex backdrop-blur-lg absolute top-0 w-full flex-col border-b border-b-border">
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
            <LinkButton href={`/profile/${visitedUser?.id}/followers`}>
              Followers
            </LinkButton>
            <LinkButton
              isActive={true}
              href={`/profile/${visitedUser?.id}/followings`}
            >
              Followings
            </LinkButton>
          </div>
        </div>
        <div className="mt-[136.2px]"></div>

        <main className="p-4 flex flex-col gap-4">
          {followings?.map((follow: { following: FollowType }) => {
            const isUserFollowing = isFollowing(
              currentUser?.followings,
              follow?.following?.id,
            );
            console.log(isUserFollowing);
            return (
              <div
                key={crypto.randomUUID()}
                className="flex items-center justify-between"
              >
                <Follows follow={follow?.following}></Follows>
                {follow?.following?.id === currentUser.id ? (
                  <></>
                ) : isUserFollowing ? (
                  <ActionButton
                    className="bg-background border border-white text-white hover:border-red-500 hover:bg-red-500/10! hover:text-red-500 transition-all"
                    hoverText="Unfollow"
                  >
                    Following
                  </ActionButton>
                ) : (
                  <ActionButton>Follow</ActionButton>
                )}
              </div>
            );
          })}
        </main>
      </div>
    </>
  );
};

export default FollowingsIndex;

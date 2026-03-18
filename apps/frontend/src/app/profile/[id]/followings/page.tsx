"use client";

import Follows from "@/app/profile/components/follows-row";
import LinkButton from "@/app/profile/components/link-button";
import useVisitedUser from "@/app/profile/hooks/useVisitedUser";
import useBoxHeight from "@/hooks/useBoxHeight";
import useUser from "@/stores/user.store";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useEffect, useRef } from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import followApi from "@/lib/api/follow";

import { FollowType } from "@/types/follow";
import { User } from "@/types/user";

const FollowingsIndex = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const currentUser = useUser((state) => state.user) as User;
  const { height, setHeight } = useBoxHeight();
  const elementRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const visitedUser = useVisitedUser({ id: params.id }).visitedUser;
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
    const invalidateQueries = async () => {
      await queryClient.refetchQueries({
        queryKey: ["userProfilePage", params?.id],
      });
    };

    invalidateQueries();
  }, [params?.id]);

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
    document.title = `Twitter / @${visitedUser?.username} Followings`;
  }, [visitedUser?.id]);

  return (
    <>
      <div className="lg:w-[600px] min-h-svh relative border-l border-r border-l-border border-r-border">
        <div
          className="flex backdrop-blur-lg absolute top-0 w-full flex-col border-b border-b-border"
          ref={elementRef}
        >
          <div className="bg-transparent flex-1 p-2 font-bold flex items-center gap-8">
            <button
              className="p-2 rounded-full hover:bg-neutral-500/20 transition-all cursor-pointer"
              onClick={() => router.push(`/profile/${params?.id}`)}
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
        <div style={{ marginTop: `${height}px` }}></div>

        <main className=" flex flex-col">
          {followings?.map((follow: { following: FollowType }) => {
            return (
              <Link
                key={crypto.randomUUID()}
                href={`/profile/${follow?.following?.id}`}
              >
                <Follows
                  follow={follow?.following}
                  isUser={follow?.following?.id === currentUser?.id}
                  pathId={Number(params?.id)}
                  currentUser={currentUser}
                  currentUserId={currentUser?.id}
                  visitedUserId={follow?.following?.id}
                  currentUserFollowings={currentUser?.followings}
                ></Follows>
              </Link>
            );
          })}
        </main>
      </div>
    </>
  );
};

export default FollowingsIndex;

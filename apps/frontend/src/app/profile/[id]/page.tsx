"use client";

import FeedPost from "@/app/home/components/feed-post";
import { FeedControlBtn } from "@/app/home/page";
import ProfileSkeleton from "@/app/profile/components/profile-skeleton";
import useVisitedUser from "@/app/profile/hooks/useVisitedUser";
import useFollows from "@/hooks/useFollows";
import useUser from "@/stores/user.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, Mail } from "lucide-react";

import { Activity, useEffect, useState } from "react";

import Head from "next/head";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { ActionButton } from "@/components/button";
import EditProfileDialog from "@/components/edit-profile-dialog";
import { CreatePostDialog } from "@/components/post-dialog";

import postApi from "@/lib/api/post";
import roomApi from "@/lib/api/room";
import { chatroomExisted, cn } from "@/lib/utils";

import { FollowType } from "@/types/follow";
import { PostType } from "@/types/post";
import { RoomType } from "@/types/room";
import { User } from "@/types/user";

const ProfileSideButton = ({
  pathId,
  currentUserFollowings,
  currentUser,
  visitedUser,
  currentUserId,
  visitedUserId,
  currentUserRooms,
}: {
  pathId: number;
  currentUserFollowings: Array<{ id: number; following: FollowType }>;
  currentUser: User;
  visitedUser?: User;
  currentUserId: number;
  visitedUserId: number;
  currentUserRooms: Array<RoomType>;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { optimisticFollow, followMutation, unfollowMutation } = useFollows({
    pathId,
    currentUser,
    currentUserId,
    currentUserFollowings,
    visitedUserId,
  });
  const mutation = useMutation({
    mutationFn: async () => {
      if (currentUser && visitedUser) {
        const res = await roomApi.createChatRoom(currentUser, visitedUser);
        return res;
      }
    },
    onSuccess: async (res) => {
      if (res.status === "success") {
        await queryClient.prefetchQuery({ queryKey: ["user"] });
        router.push(`/messages/${res.data.id}`);
      }
    },
  });

  const messageUser = () => {
    // Check currentUser rooms if there is a room with the user IDs of current and visited user
    const chatroom = chatroomExisted(
      currentUserId,
      visitedUserId,
      currentUserRooms,
    );

    // If there is, redirect to the id of the room
    if (chatroom) {
      router.push(`/messages/${chatroom.id}`);
    } else {
      // Otherwise, use useMutation and create the room and redirect to that room
      mutation.mutate();
    }
  };

  if (currentUserId && visitedUserId) {
    if (currentUserId === visitedUserId) {
      return (
        <EditProfileDialog>
          <ActionButton className="hover:bg-primary!  absolute right-0 mr-4 bg-primary text-white">
            Edit profile
          </ActionButton>
        </EditProfileDialog>
      );
    } else if (optimisticFollow) {
      return (
        <div className="flex justify-center items-center gap-4 absolute right-0 mr-4">
          <button onClick={messageUser}>
            <div className="p-1.5 rounded-full border border-border hover:bg-white/10 transition-all cursor-pointer">
              <Mail size={24}></Mail>
            </div>
          </button>
          <ActionButton
            className="bg-primary h-full! border border-primary! text-white hover:border-red-500! hover:bg-red-500/10! hover:text-red-500 transition-all hover:border"
            hoverText="Unfollow"
            onClick={() => {
              unfollowMutation.mutate();
            }}
          >
            Following
          </ActionButton>
        </div>
      );
    } else if (optimisticFollow === false) {
      return (
        <div className="flex justify-center items-center gap-4 absolute right-0 mr-4">
          <button onClick={messageUser}>
            <div className="p-1.5 rounded-full border border-border hover:bg-white/10 transition-all cursor-pointer">
              <Mail size={24}></Mail>
            </div>
          </button>
          <ActionButton
            className="hover:bg-primary! h-full! border border-primary! bg-primary text-white"
            onClick={() => followMutation.mutate()}
          >
            Follow
          </ActionButton>
        </div>
      );
    }
  }
};

const Profile = () => {
  const currentUser = useUser((state) => state.user) as User;
  const [feedType, setFeedType] = useState<"posts" | "replies" | "likes">(
    "posts",
  );
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const user = useVisitedUser({ id }).visitedUser as User;

  const { data: posts } = useQuery({
    queryKey: ["posts", feedType],
    queryFn: async () => {
      if (feedType === "replies") {
        const data = await postApi.getUserReplies(user ? user?.id : 0);
        return data.data;
      } else if (feedType === "likes") {
        const data = await postApi.getUserLiked(user ? user?.id : 0);
        return data.data;
      }
    },
  });

  useEffect(() => {
    document.title = `${user?.name} (@${user?.username}) / Chirper`;
  }, [user]);

  const displayReplies = (post: PostType) => {
    if (feedType === "replies") {
      return true;
    } else if (feedType === "likes") {
      if (typeof post.replyId === "number") {
        return true;
      } else {
        return false;
      }
    }
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
      {!user ? (
        <ProfileSkeleton />
      ) : (
      <div className="lg:w-[600px] h-full relative">
        <div className="flex backdrop-blur-lg top-0 w-full border-x border-x-border">
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
            <div className="flex flex-col">
              <h1>{user?.name}</h1>
              <p className="text-darker font-light">
                {user?._count.Post} posts
              </p>
            </div>
          </div>
        </div>
        {/* TOP SECTION - User Profile Information */}
        <section className="flex flex-col h-[400px] relative">
          {/* cover photo */}
          <div className="flex-1 h-[50%] border-x border-x-border">
            <img
              src={user?.cover ?? "/blue.jpg"}
              alt="Default profile cover"
              className="h-full w-full object-cover"
            />
          </div>

          {/* avatar */}
          <div className="absolute p-4 top-[28%]">
            <div className="bg-black p-1 rounded-full">
              <img
                src={user?.avatar}
                alt={`@${user?.username}'s avatar`}
                className="size-[128px] object-cover rounded-full "
              />
            </div>
          </div>

          {/* profile information */}
          <div className="flex-1 p-4 relative border-x border-x-border">
            <ProfileSideButton
              pathId={Number(id)}
              currentUserFollowings={currentUser?.followings}
              currentUserId={currentUser?.id}
              visitedUserId={user?.id}
              currentUserRooms={currentUser?.rooms}
              currentUser={currentUser}
              visitedUser={user}
            ></ProfileSideButton>
            <div className="mt-[64px]"></div>
            <div className="flex flex-col items-start">
              <p className="text-[22px] text-text font-bold">{user?.name}</p>
              <p className="text-[15px] text-darker font-bold">
                @{user?.username}
              </p>
            </div>
            {user && (
              <div className="flex items-center gap-2 my-4">
                <Calendar size={18} className="text-darker"></Calendar>
                <p className="text-darker ">
                  Joined on {format(user?.createdAt as Date, "LLLL yyyy")}
                </p>
              </div>
            )}
            <div className="flex gap-4">
              <Link
                className="text-darker hover:underline"
                href={`/profile/${user?.id}/followers`}
              >
                <span className="text-white">{user?._count.Followings}</span>{" "}
                Followers
              </Link>
              <Link
                className="text-darker hover:underline"
                href={`/profile/${user?.id}/followings`}
              >
                <span className="text-white">{user?._count.Followers}</span>{" "}
                Followings
              </Link>
            </div>
          </div>
        </section>
        {/*SECTION - User Profile Post Feeds controls*/}
        <div className="flex mt-6 border-x border-x-border">
          <FeedControlBtn
            handleClick={() => setFeedType("posts")}
            isActive={feedType === "posts"}
          >
            Posts
          </FeedControlBtn>
          <FeedControlBtn
            handleClick={() => setFeedType("replies")}
            isActive={feedType === "replies"}
          >
            Replies
          </FeedControlBtn>
          <FeedControlBtn
            handleClick={() => setFeedType("likes")}
            isActive={feedType === "likes"}
          >
            Likes
          </FeedControlBtn>
        </div>

        {/* Posts section */}
        <section
          className={cn(
            (feedType === "replies" && posts?.length > 0) ||
              (feedType === "likes" && posts?.length > 0)
              ? "border-x border-x-border"
              : "",
            feedType === "posts" && user && user.Post.length > 0
              ? "border-x border-x-border"
              : "",
          )}
        >
          <Activity mode={feedType === "posts" ? "visible" : "hidden"}>
            {user?.Post.map((post) => {
              return (
                <FeedPost
                  post={post}
                  key={post.id}
                  displayReplies={false}
                ></FeedPost>
              );
            })}
          </Activity>

          <Activity
            mode={
              feedType === "replies" || feedType === "likes"
                ? "visible"
                : "hidden"
            }
          >
            {posts &&
              posts?.map((post: PostType) => {
                return (
                  <FeedPost
                    post={post}
                    key={post.id}
                    displayReplies={displayReplies(post)}
                  ></FeedPost>
                );
              })}
          </Activity>

          <Activity
            mode={
              (feedType === "replies" && posts?.length > 0) ||
              (feedType === "likes" && posts?.length > 0) ||
              feedType === "posts"
                ? "hidden"
                : "visible"
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

          <Activity
            mode={
              (user && user?.Post.length > 0) || feedType !== "posts"
                ? "hidden"
                : "visible"
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
              <p className="font-bold text-lg">Such empty!</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="font-light">Maybe you can </p>
                <p className="bg-primary rounded-lg font-bold text-neutral-200 cursor-pointer -rotate-5 hover:rotate-0 transition-all">
                  <CreatePostDialog>
                    <button className="p-1 px-2">make a tweet?</button>
                  </CreatePostDialog>
                </p>
              </div>
            </div>
          </Activity>
        </section>
      </div>
      )}
    </>
  );
};

export default Profile;

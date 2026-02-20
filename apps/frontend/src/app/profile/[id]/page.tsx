"use client";

import FeedPost from "@/app/home/components/feed-post";
import { FeedControlBtn } from "@/app/home/page";
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

import postApi from "@/lib/api/post";
import roomApi from "@/lib/api/room";
import { chatroomExisted } from "@/lib/utils";

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
        <ActionButton className="hover:bg-primary! border border-primary absolute right-0 mr-4 bg-primary text-white">
          Edit profile
        </ActionButton>
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
  const setVisitedUser = useUser((state) => state.setVisitedUser);
  const currentUser = useUser((state) => state.user) as User;
  const [feedType, setFeedType] = useState<"posts" | "replies" | "likes">(
    "posts",
  );
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = params.id;
  const { data: user, refetch: refetchUser } = useQuery({
    queryKey: ["userProfilePage", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/users/${id}`,
        {
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Error fetching from the server.");
      }
      const data = await res.json();
      setVisitedUser(data.data);
      return data.data as User;
    },
  });

  const { data: posts, refetch: refetchPost } = useQuery({
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
    document.title = `${user?.name} (@${user?.username}) / Twitter Clone`;
  }, [user]);

  const refetchPosts = async () => {
    await queryClient.refetchQueries({ queryKey: ["post"] });
    await queryClient.refetchQueries({ queryKey: ["posts"] });
  };

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
              src="/blue.jpg"
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
              visitedUserId={user?.id!}
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
                  Join on {format(user?.createdAt as Date, "LLLL yyyy")}
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
          <FeedControlBtn handleClick={() => setFeedType("posts")}>
            Posts
          </FeedControlBtn>
          <FeedControlBtn handleClick={() => setFeedType("replies")}>
            Replies
          </FeedControlBtn>
          <FeedControlBtn handleClick={() => setFeedType("likes")}>
            Likes
          </FeedControlBtn>
        </div>

        {/* Posts section */}
        <section>
          <Activity mode={feedType === "posts" ? "visible" : "hidden"}>
            {user?.Post.map((post) => {
              return (
                <FeedPost
                  post={post}
                  refetchPosts={refetchPosts}
                  key={post.id}
                  refetch={refetchUser}
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
                    refetchPosts={refetchPosts}
                    key={post.id}
                    refetch={refetchPost}
                    displayReplies={displayReplies(post)}
                  ></FeedPost>
                );
              })}
          </Activity>
        </section>
      </div>
    </>
  );
};

export default Profile;

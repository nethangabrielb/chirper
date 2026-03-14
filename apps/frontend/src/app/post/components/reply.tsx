"use client";

import { CurrentUserPostDropdown } from "@/app/home/components/post-controls";
import PostSingle from "@/app/post/components/post";
import { useBookmark } from "@/hooks/useBookmark";
import notificationHandler from "@/socket/handlers/notification";
import useGuestDialog from "@/stores/guest-dialog.store";
import useUser from "@/stores/user.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import {
  Activity,
  startTransition,
  useEffect,
  useOptimistic,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ProfileHoverCard } from "@/components/profile-card-hover";

import postApi from "@/lib/api/post";
import { cn, formatDateFeedPost } from "@/lib/utils";

import { PostType } from "@/types/post";
import type { ReplyType } from "@/types/reply";
import { User } from "@/types/user";

type Props = {
  reply: ReplyType;
};

const Reply = ({ reply }: Props) => {
  const router = useRouter();
  const user = useUser((state) => state.user) as User;
  const queryClient = useQueryClient();
  const openGuestDialog = useGuestDialog((state) => state.setOpenGuestDialog);

  // Fetch the post the reply is replying to
  const { data: post } = useQuery<PostType | ReplyType>({
    queryKey: ["post", reply.replyId],
    queryFn: async () => {
      const post = await postApi.getPost(reply.replyId);
      return post;
    },
  });

  // put likes in a state to use as source of truth
  // for useOptimistic hooks
  const [likes, setLikes] = useState(post?._count.Like ?? 0);

  // source of truth to determine if clicking the like button should either
  // like or unlike a tweet by determining if current user has alr liked a post
  const [userHasLiked, setUserHasLiked] = useState(
    post?.Like?.find((userId: { userId: number }) => userId.userId === user?.id)
      ?.userId === user?.id,
  );

  const [optimisticHasLiked, addOptimisticHasLiked] = useOptimistic(
    userHasLiked,
    (currentValue: boolean, updatedValue: boolean) => updatedValue,
  );

  const [optimisticLikes, addOptimisticLikes] = useOptimistic(
    likes ?? 0,
    (currentLike: number, updatedLike: number) => currentLike + updatedLike,
  );

  const refetchUserPosts = async () => {
    await queryClient.invalidateQueries({ queryKey: ["userProfilePage"] });
  };

  const { optimisticBookmark, bookmarkMutation } = useBookmark({
    post,
    user,
  });

  // LIKE/UNLIKE POST API INTERFACE
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (user.isGuest) {
        openGuestDialog(true);
        return;
      }
      if (userHasLiked) {
        startTransition(() => {
          addOptimisticLikes(-1);
          addOptimisticHasLiked(false);
        });
        const res = await postApi.unlikePost(post?.id ?? 0);
        return res;
      } else {
        startTransition(() => {
          addOptimisticLikes(1);
          addOptimisticHasLiked(true);
        });
        const res = await postApi.likePost(post?.id ?? 0);
        return res;
      }
    },
    onSuccess: (res) => {
      refetchUserPosts();
      if (res.message === "Post liked successfully") {
        setLikes((prev: number) => prev + 1);
        setUserHasLiked(true);
        notificationHandler.emitLikeNotification(user, post?.userId, post?.id);
      } else if (res.message === "Unlike success") {
        setLikes((prev: number) => prev - 1);
        setUserHasLiked(false);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["post"] });
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["userProfilePage"] });
      await queryClient.invalidateQueries({ queryKey: ["bookmarkedPosts"] });
    },
  });

  useEffect(() => {
    setUserHasLiked(
      post?.Like?.find(
        (userId: { userId: number }) => userId.userId === user?.id,
      )?.userId === user?.id,
    );
  }, [user, post]);

  useEffect(() => {
    setLikes(post?._count.Like ?? 0);
  }, [post]);

  // DELETE POST API INTERFACE
  const postMutation = useMutation({
    mutationFn: async () => {
      const res = await postApi.deletePost(reply.id);
      return res;
    },
    onSuccess: (res) => {
      if (res.status === "success") {
        toast.success(res.message, {
          position: "top-right",
          style: {
            background: "#1d9bf0",
            color: "white",
            width: "fit-content",
          },
        });
        router.back();
      } else {
        toast.error(res.message);
      }
    },
  });

  const handleDelete = () => {
    postMutation.mutate();
  };

  return (
    <>
      {post?.deleted ? (
        <>
          <div className={cn("flex flex-col relative transition-all p-4")}>
            <p className="bg-secondary w-full p-4 text-center py-8 border border-border rounded-md">
              This tweet has been deleted by the user
            </p>
            <div className="w-[48px] flex justify-center">
              <div className="bg-neutral-600 w-[2px] h-[50px] translate-y-2"></div>
            </div>
          </div>
          <PostSingle
            post={reply}
            className="p-4 pt-0!"
            settingsCn="m-0!"
            buttonCn="p-1!"
          ></PostSingle>
        </>
      ) : (
        <div className="flex flex-col border-b border-b-border relative transition-all">
          <Activity mode={user?.id === post?.userId ? "visible" : "hidden"}>
            <CurrentUserPostDropdown
              handleDelete={handleDelete}
            ></CurrentUserPostDropdown>
          </Activity>

          <Link
            className="flex w-full gap-2 p-4 pb-0! hover:bg-secondary/40 items-stretch"
            href={`/post/${post?.id}`}
          >
            <div className="self-stretch items-center flex flex-col">
              {post?.user && (
                <ProfileHoverCard user={post?.user}></ProfileHoverCard>
              )}
              <div className="bg-neutral-600 w-[2px] flex-1"></div>
            </div>
            <div className="flex flex-col gap-2 w-full min-w-0">
              <div className="flex items-center gap-1 flex-wrap min-w-0">
                <p className="font-bold text-text tracking-[0.2px] text-base sm:text-[18px] truncate max-w-[150px] sm:max-w-none">
                  {post?.user.name}
                </p>
                <Link
                  className="text-darker font-light text-[14px] sm:text-[15px] hover:underline truncate max-w-[120px] sm:max-w-none"
                  href={`/profile/${post?.user?.id}`}
                >
                  @{post?.user.username}
                </Link>
                <div className="text-darker font-light w-0.8 my-auto flex justify-center items-center">
                  .
                </div>
                <p className="text-darker font-light text-[13px] sm:text-[14px] whitespace-nowrap">
                  {post && formatDateFeedPost(post?.createdAt)}
                </p>
              </div>
              <p className="text-text text-[15px] py-2 whitespace-normal break-words">
                {post?.content}
              </p>
              <Activity mode={post?.imageUrl ? "visible" : "hidden"}>
                <div className="relative">
                  <img
                    src={post?.imageUrl}
                    alt="User Icon"
                    className={cn(
                      "rounded-lg border h-full w-full object-cover",
                    )}
                    loading="lazy"
                  ></img>
                </div>
              </Activity>
              <div className="flex justify-start w-full pb-2">
                {/* render comments */}
                <div className="flex items-center flex-1 group cursor-pointer">
                  <div className="p-2 rounded-full group-hover:bg-primary/20 transition-all">
                    <MessageCircle
                      size={20}
                      className="stroke-darker text-darker font-light stroke-[1.2px] group-hover:stroke-primary! transition-all"
                    ></MessageCircle>
                  </div>
                  <p className="text-darker text-[14px] font-light group-hover:text-primary transition-all">
                    {post?._count.replies}
                  </p>
                </div>

                {/* render likes */}
                <button
                  className="flex items-center flex-1 group cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    likeMutation.mutate();
                  }}
                >
                  <div className="p-2 rounded-full group-hover:bg-red-500/20 transition-all bg-transparent group">
                    <Heart
                      size={20}
                      className={cn(
                        "text-darker font-light stroke-[1.2px] group-hover:stroke-red-500! group-active:scale-150 duration-500",
                        optimisticHasLiked
                          ? "fill-red-500 stroke-red-500!"
                          : "stroke-darker",
                      )}
                    ></Heart>
                  </div>
                  <p className="text-darker text-[14px] font-light group-hover:text-red-500 transition-all">
                    {optimisticLikes}
                  </p>
                </button>

                {/* Bookmark button */}
                <button
                  className="flex items-center group cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    bookmarkMutation.mutate();
                  }}
                >
                  <div className="p-2 rounded-full group-hover:bg-blue-500/20 transition-all bg-transparent group">
                    <Bookmark
                      size={20}
                      className={cn(
                        "text-darker font-light stroke-[1.2px] group-hover:stroke-blue-500! group-active:scale-150 duration-500",
                        optimisticBookmark
                          ? "fill-blue-500 stroke-blue-500!"
                          : "stroke-darker",
                      )}
                    ></Bookmark>
                  </div>
                </button>
              </div>
            </div>
          </Link>
          <PostSingle
            post={reply}
            className="p-4 pt-0!"
            settingsCn="m-0!"
            buttonCn="p-1!"
          ></PostSingle>
        </div>
      )}
    </>
  );
};

export default Reply;

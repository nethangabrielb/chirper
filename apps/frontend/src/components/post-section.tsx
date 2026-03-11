import { CurrentUserPostDropdown } from "@/app/home/components/post-controls";
import { useBookmark } from "@/hooks/useBookmark";
import { useLikes } from "@/hooks/useLikes";
import useUser from "@/stores/user.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import React, { Activity } from "react";

import Link from "next/link";

import { ProfileHoverCard } from "@/components/profile-card-hover";

import postApi from "@/lib/api/post";
import { cn, formatDateFeedPost } from "@/lib/utils";

import { PostType } from "@/types/post";
import { ReplyType } from "@/types/reply";
import { User } from "@/types/user";

type Props = {
  post: PostType | ReplyType;

  displayReplies?: boolean;
  bookmarkedPost?: boolean;
};

const Post = ({ post, displayReplies, bookmarkedPost }: Props) => {
  const queryClient = useQueryClient();
  const user = useUser((state) => state.user) as User;
  const likesHook = useLikes(post, user);

  const { optimisticBookmark, bookmarkMutation } = useBookmark({
    post,
    user,
  });

  // DELETE POST API INTERFACE
  const postMutation = useMutation({
    mutationFn: async () => {
      const res = await postApi.deletePost(post.id);
      return res;
    },
    onSuccess: async (res) => {
      if (res.status === "success") {
        toast.success(res.message, {
          position: "top-right",
          style: {
            background: "#1d9bf0",
            color: "white",
            width: "fit-content",
          },
        });
      } else {
        toast.error(res.message);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await queryClient.invalidateQueries({ queryKey: ["post"] });
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["userProfilePage"] });
      await queryClient.invalidateQueries({ queryKey: ["bookmarkedPosts"] });
    },
  });

  const handleDelete = () => {
    postMutation.mutate();
  };

  return (
    <>
      {post.deleted ? (
        <div
          className={cn(
            "flex flex-col relative transition-all",
            displayReplies && post?.replies?.length > 0 ? "pt-4 px-4" : "p-4",
          )}
        >
          <p className="bg-secondary w-full p-4 text-center py-8 border border-border rounded-md">
            This tweet has been deleted by the user
          </p>
          <div className="w-[48px] flex justify-center">
            <div className="bg-neutral-600 w-[2px] h-[50px] translate-y-2"></div>
          </div>
        </div>
      ) : (
        <Link
          className={cn(
            "flex gap-4 relative hover:bg-secondary/40 transition-all",
            displayReplies && post?.replies?.length > 0 ? "pt-4 px-4" : "p-4",
          )}
          href={`/post/${post.id}`}
        >
          <Activity mode={user?.id === post.userId ? "visible" : "hidden"}>
            <CurrentUserPostDropdown
              handleDelete={handleDelete}
            ></CurrentUserPostDropdown>
          </Activity>
          {displayReplies ? (
            <div className="self-start items-center flex flex-col">
              <ProfileHoverCard user={post.user}></ProfileHoverCard>
              <div className="bg-neutral-600 w-[2px] h-[100px] translate-y-2"></div>
            </div>
          ) : (
            <ProfileHoverCard user={post.user}></ProfileHoverCard>
          )}

          <div className="flex flex-col gap-2 w-full min-w-0">
            <div className="flex gap-1">
              <p className="font-bold text-text space tracking-[0.2px] text-[18px]">
                {post.user.name}
              </p>
              <div className="flex items-center gap-1">
                <Link
                  className="text-darker font-light text-[15px] hover:underline"
                  href={`/profile/${post.user.id}`}
                >
                  @{post.user.username}
                </Link>
                <div className="text-darker font-light w-0.8 my-auto flex justify-center text-a items-center">
                  .
                </div>
                <p className="text-darker font-light text-[14px]">
                  {formatDateFeedPost(post.createdAt)}
                </p>
              </div>
            </div>
            {bookmarkedPost && post.reply && (
              <p className="text-darker font-light text-sm -translate-y-2">
                Replying to{" "}
                <Link
                  className="text-blue-500 cursor-pointer hover:underline underline-offset-1"
                  href={`/profile/${post.reply.user.id}`}
                >
                  @{post.reply.user.username}
                </Link>
              </p>
            )}
            <p className="text-text text-[15px] whitespace-normal break-words">
              {post.content}
            </p>
            <Activity mode={post.imageUrl ? "visible" : "hidden"}>
              <div className="relative">
                <img
                  src={post.imageUrl}
                  alt="User Icon"
                  className={cn("rounded-lg border h-full w-full object-cover")}
                  loading="lazy"
                ></img>
              </div>
            </Activity>
            <div className="flex justify-between w-[100%] ">
              {/* render comments */}
              <div className="flex items-center group cursor-pointer">
                <div className="p-2 rounded-full group-hover:bg-primary/20 transition-all">
                  <MessageCircle
                    size={20}
                    className="stroke-darker text-darker font-light stroke-[1.2px] group-hover:stroke-primary! transition-all"
                  ></MessageCircle>
                </div>
                <p className="text-darker text-[14px] font-light group-hover:text-primary transition-all">
                  {post._count.replies}
                </p>
              </div>

              {/* render likes */}
              <button
                className="flex items-center group cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  likesHook.likeMutation.mutate();
                }}
              >
                <div className="p-2 rounded-full group-hover:bg-red-500/20 transition-all bg-transparent group">
                  <Heart
                    size={20}
                    className={cn(
                      "text-darker font-light stroke-[1.2px] group-hover:stroke-red-500! group-active:scale-150 duration-500",
                      likesHook.optimisticHasLiked
                        ? "fill-red-500 stroke-red-500!"
                        : "stroke-darker",
                    )}
                  ></Heart>
                </div>
                <p className="text-darker text-[14px] font-light group-hover:text-red-500 transition-all">
                  {likesHook.optimisticLikes}
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
      )}
    </>
  );
};

export default Post;

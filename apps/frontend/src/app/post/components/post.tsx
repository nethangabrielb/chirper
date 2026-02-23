"use client";

import { CurrentUserPostDropdown } from "@/app/home/components/post-controls";
import { useBookmark } from "@/hooks/useBookmark";
import useUser from "@/stores/user.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { cn, formatDateSlugPost } from "@/lib/utils";

import { PostType } from "@/types/post";
import { ReplyType } from "@/types/reply";
import { User } from "@/types/user";

type Props = {
  post: PostType | ReplyType;
  className?: string;
  settingsCn?: string;
  buttonCn?: string;
};

const PostSingle = ({ post, className, settingsCn, buttonCn }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useUser((state) => state.user) as User;
  // put likes in a state to use as source of truth
  // for useOptimistic hooks
  const [likes, setLikes] = useState(post?._count.Like);

  // source of truth to determine if clicking the like button should either
  // like or unlike a tweet by determining if current user has alr liked a post
  const [userHasLiked, setUserHasLiked] = useState(
    post?.Like?.find((userId: { userId: number }) => userId.userId === user?.id)
      ?.userId === user?.id,
  );
  const [optimisticLikes, addOptimisticLikes] = useOptimistic(
    likes,
    (currentLike: number, updatedLike: number) => currentLike + updatedLike,
  );

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

  // LIKE/UNLIKE POST API INTERFACE
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (userHasLiked) {
        startTransition(() => {
          addOptimisticLikes(-1);
        });
        const res = await postApi.unlikePost(post.id);
        return res;
      } else {
        startTransition(() => {
          addOptimisticLikes(1);
        });
        const res = await postApi.likePost(post.id);
        return res;
      }
    },
    onSuccess: (res) => {
      if (res.message === "Post liked successfully") {
        setLikes((prev: number) => prev + 1);
        setUserHasLiked(true);
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
  }, [user]);

  const handleDelete = () => {
    postMutation.mutate();
  };

  return (
    <div
      className={`flex flex-col gap-4 p-4 border-b border-b-border relative transition-all ${className}`}
    >
      <Activity mode={user.id === post.userId ? "visible" : "hidden"}>
        <CurrentUserPostDropdown
          handleDelete={handleDelete}
          settingsCn={settingsCn}
          buttonCn={buttonCn}
        ></CurrentUserPostDropdown>
      </Activity>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2">
          {user && <ProfileHoverCard user={post.user}></ProfileHoverCard>}
          <div className="flex flex-col">
            <p className="font-bold text-text space tracking-[0.2px] text-[18px]">
              {post.user.name}
            </p>
            <Link
              className="text-darker font-light text-[15px] hover:underline"
              href={`/profile/${post.user.id}`}
            >
              @{post.user.username}
            </Link>
          </div>
        </div>
        <p className="text-text text-[15px] py-2">{post.content}</p>
        <p className="border-b border-b-border pb-1 text-darker font-light text-[14px]">
          {formatDateSlugPost(post.createdAt)}
        </p>

        <div className="flex justify-start w-full border-b border-b-border pb-2">
          {/* render comments */}
          <div className="flex items-center flex-1 group cursor-pointer">
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
            className="flex items-center flex-1 group cursor-pointer"
            onClick={() => likeMutation.mutate()}
          >
            <div className="p-2 rounded-full group-hover:bg-red-500/20 transition-all bg-transparent group">
              <Heart
                size={20}
                className={cn(
                  "text-darker font-light stroke-[1.2px] group-hover:stroke-red-500! group-active:scale-150 duration-500",
                  userHasLiked
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
    </div>
  );
};

export default PostSingle;

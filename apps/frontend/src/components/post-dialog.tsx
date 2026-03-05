import PostSchema from "@/app/home/schema/create-post.schema";
import { NewPost } from "@/app/home/types/create-post.type";
import useUser from "@/stores/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image, Smile } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import React, { Activity, useState } from "react";

import { ActionButton } from "@/components/button";
import { TooltipIcon } from "@/components/tool-tip-icon";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

import postApi from "@/lib/api/post";
import { cn } from "@/lib/utils";

import { User } from "@/types/user";

export function CreatePostDialog({ children }: { children: React.ReactNode }) {
  const [displayIndicator, setDisplayIndicator] = useState(false);
  const [dashOffset, setDashOffset] = useState(565.48);
  const [progressValue, setProgressValue] = useState(0);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const user = useUser((state) => state.user) as User;
  const queryClient = useQueryClient();
  const {
    getValues,
    handleSubmit,
    register,
    resetField,
    formState: { errors },
  } = useForm<NewPost>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      userId: user.id,
    },
  });

  // CREATE POSTS MUTATION
  const mutation = useMutation({
    mutationFn: async (values: NewPost) => {
      setProgressValue(80);
      const res = await postApi.createPost(values);
      return res;
    },
    onSuccess: (data) => {
      if (data.status === "success") {
        resetField("content");
        toast.success(data.message, {
          position: "top-right",
          style: {
            background: "#1d9bf0",
            color: "white",
            width: "fit-content",
          },
        });
      } else {
        toast.error(data.message);
      }
    },
    onSettled: async () => {
      setOpenDialog(false);
      setProgressValue(0);
      await queryClient.invalidateQueries({ queryKey: ["post"] });
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["userProfilePage"] });
      await queryClient.invalidateQueries({ queryKey: ["bookmarkedPosts"] });
    },
  });

  const createPost: SubmitHandler<NewPost> = () => {
    const values = getValues();
    const updatedValues = { ...values, userId: user.id };

    mutation.mutate(updatedValues);
  };

  const checkLengthExceed = (length: number) => {
    if (length >= 250 || length < 1) {
      setInputDisabled(true);
    } else {
      setInputDisabled(false);
    }
  };

  const updateLimitOffset = (length: number) => {
    setDashOffset(565.48);
    setDashOffset((prev) => prev - 2.26192 * length);
  };
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg field-sizing-content">
        <DialogHeader>
          <DialogTitle>New Tweet</DialogTitle>
          <DialogDescription>
            You can post/tweet here. Click the tweet button when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <div
          className={cn(
            mutation.isPending && "brightness-110",
            "flex gap-4 w-full relative max-w-full overflow-hidden",
          )}
        >
          <Activity mode={mutation.isPending ? "visible" : "hidden"}>
            <Progress
              value={progressValue}
              className="absolute top-0 w-full left-0 rounded-none! h-[4px] duration-500 bg-transparent"
            ></Progress>
          </Activity>

          <Avatar>
            <AvatarImage
              src={`${user?.avatar}`}
              alt={`${user?.username}'s icon`}
              loading="eager"
              className="size-[48px]! min-w-[48px]! rounded-full object-cover"
            ></AvatarImage>
          </Avatar>
          <form
            onSubmit={handleSubmit(createPost)}
            className="w-full max-w-full flex flex-col gap-4 overflow-hidden"
          >
            <textarea
              {...register("content")}
              placeholder="What's happening?"
              className={cn(
                `transition-all bg-transparent pt-3 pb-8 border-b border-b-border outline-0 placeholder:text-gray field-sizing-content placeholder:text-lg w-full max-w-full resize-none text-lg`,
                mutation.isPending && "brightness-50 border-b-0 pb-0",
              )}
              onChange={(e) => {
                const length = e.target.value.length;

                if (!inputDisabled) {
                  updateLimitOffset(length);
                }

                if (length > 0) {
                  setDisplayIndicator(true);
                } else {
                  setDisplayIndicator(false);
                }

                checkLengthExceed(length);
              }}
              maxLength={250}
              disabled={mutation.isPending}
            />
            <div
              className={cn(
                "flex items-center justify-between w-[95%] max-w-[95%] transition-all ",
                mutation.isPending && "h-0! hidden",
              )}
            >
              <div className="flex items-center">
                <TooltipIcon content="Upload image">
                  <Image size={20} className="text-primary" />
                </TooltipIcon>
                <TooltipIcon content="Emoji">
                  <Smile size={20} className="text-primary" />
                </TooltipIcon>
              </div>
              <div className="flex items-center gap-4">
                {displayIndicator && (
                  <svg
                    width="32"
                    height="32"
                    viewBox="-25 -25 250 250"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ transform: "rotate(-90deg)" }}
                    className="stroke-neutral-700"
                  >
                    <circle
                      r="90"
                      cx="100"
                      cy="100"
                      fill="transparent"
                      className="stroke-neutral-700"
                      strokeWidth="16px"
                    ></circle>
                    <circle
                      r="90"
                      cx="100"
                      cy="100"
                      className={cn(
                        inputDisabled ? "stroke-red-500" : "stroke-primary",
                        "transition-all duration-400",
                      )}
                      strokeWidth="15"
                      strokeLinecap="round"
                      strokeDashoffset={`${dashOffset}`}
                      fill="transparent"
                      strokeDasharray="565.48px"
                    ></circle>
                  </svg>
                )}
                <DialogFooter>
                  <DialogClose asChild>
                    <ActionButton className="bg-card! border border-background! text-white hover:bg-card/80!">
                      Cancel
                    </ActionButton>
                  </DialogClose>
                  <ActionButton
                    className="bg-primary text-white hover:bg-primary! hover:brightness-90!"
                    disabled={inputDisabled}
                    type="submit"
                  >
                    Tweet
                  </ActionButton>
                </DialogFooter>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

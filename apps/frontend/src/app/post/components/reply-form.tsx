"use client";

import { newComment } from "@/app/post/schema/comment";
import { Comment } from "@/app/post/types/coment";
import notificationHandler from "@/socket/handlers/notification";
import useUser from "@/stores/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Image, Smile } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Activity, useState } from "react";

import { useRouter } from "next/navigation";

import { ActionButton } from "@/components/button";
import { TooltipIcon } from "@/components/tool-tip-icon";
import { Progress } from "@/components/ui/progress";

import commentApi from "@/lib/api/comment";
import { cn } from "@/lib/utils";

import { User } from "@/types/user";

type Props = {
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<any, Error>>;
  postId: number;
  className?: string;
  postContent: string;
  postUserId: number;
};

const CreateReply = ({
  refetch,
  postId,
  className,
  postContent,
  postUserId,
}: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [displayIndicator, setDisplayIndicator] = useState(false);
  const [dashOffset, setDashOffset] = useState(565.48);
  const [progressValue, setProgressValue] = useState(0);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [openReplyControls, setOpenReplyControls] = useState(false);
  const user = useUser((state) => state.user) as User;

  const {
    getValues,
    handleSubmit,
    register,
    resetField,
    formState: { errors },
  } = useForm<Comment>({
    resolver: zodResolver(newComment),
    defaultValues: {
      userId: user.id,
      replyId: postId,
    },
  });

  // CREATE REPLY MUTATION
  const mutation = useMutation({
    mutationFn: async (values: Comment) => {
      setProgressValue(80);
      const res = await commentApi.createComment(values);
      return res;
    },
    onSuccess: async (data) => {
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
        if (postUserId !== user?.id) {
          notificationHandler.emitReplyNotification(
            user,
            postUserId,
            data?.data?.id,
            data?.data?.content,
          );
        }
      } else if (data.status === "deleted") {
        toast.error(data.message);
        await queryClient.invalidateQueries({ queryKey: ["post"] });
        await queryClient.invalidateQueries({ queryKey: ["posts"] });
        await queryClient.invalidateQueries({ queryKey: ["userProfilePage"] });
        await queryClient.invalidateQueries({ queryKey: ["bookmarkedPosts"] });
        router.back();
      } else {
        toast.error(data.message);
      }
      refetch();
    },
    onSettled: () => {
      setProgressValue(0);
    },
  });

  const createReply: SubmitHandler<Comment> = () => {
    const values = getValues();
    const updatedValues = { ...values, userId: user.id, replyId: postId };

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
    <div
      className={cn(
        mutation.isPending && "brightness-110",
        "flex gap-4 p-4 border-b border-b-border w-full relative",
        className,
      )}
    >
      <Activity mode={mutation.isPending ? "visible" : "hidden"}>
        <Progress
          value={progressValue}
          className="absolute top-0 w-full left-0 rounded-none! h-[4px] duration-500 bg-transparent"
        ></Progress>
      </Activity>

      <img
        src={user?.avatar}
        alt={`${user?.username}'s icon`}
        className="size-[48px] min-w-[48px]! rounded-full object-cover"
      />
      <form
        onSubmit={handleSubmit(createReply)}
        className="w-full max-w-full flex flex-col gap-1 overflow-hidden"
      >
        <textarea
          {...register("content")}
          placeholder="Reply here"
          className={cn(
            `transition-all bg-transparent pt-3 pb-3 outline-0 placeholder:text-gray field-sizing-content placeholder:text-lg w-full max-w-full resize-none text-lg`,
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
          onClick={() => {
            setOpenReplyControls(true);
          }}
        />
        <div
          className={cn(
            mutation.isPending && "h-0! hidden",
            openReplyControls
              ? "items-center flex h-auto transition-all -translate-y-0 justify-between opacity-100"
              : "w-[95%] max-w-[95%] transition-all -translate-y-5 h-0 invisible opacity-0",
          )}
        >
          <div className="flex items-center gap-2">
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

            <ActionButton
              className="bg-primary text-white hover:bg-primary! hover:brightness-90!"
              disabled={inputDisabled}
              type="submit"
            >
              Reply
            </ActionButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateReply;

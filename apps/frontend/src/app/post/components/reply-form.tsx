"use client";

import { newComment } from "@/app/post/schema/comment";
import { Comment } from "@/app/post/types/coment";
import notificationHandler from "@/socket/handlers/notification";
import useGuestDialog from "@/stores/guest-dialog.store";
import useUser from "@/stores/user.store";
import data from "@emoji-mart/data/sets/14/twitter.json";
import Picker from "@emoji-mart/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Image, Smile, X } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import React, { Activity, useRef, useState } from "react";

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

type EmojiPickerProps = {
  handleEmojiSelect: (emoji: any) => void;
  openEmojiPicker: boolean;
  setOpenEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
};

const EmojiPicker = React.memo(
  ({
    handleEmojiSelect,
    openEmojiPicker,
    setOpenEmojiPicker,
  }: EmojiPickerProps) => (
    <Picker
      data={data}
      onEmojiSelect={handleEmojiSelect}
      searchPosition="sticky"
      onClickOutside={() => openEmojiPicker && setOpenEmojiPicker(false)}
    />
  ),
);

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
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [filePreview, setFilePreview] = useState<File | null>(null);
  const fileInput = useRef<null | HTMLInputElement>(null);
  const openGuestDialog = useGuestDialog((state) => state.setOpenGuestDialog);
  const user = useUser((state) => state.user) as User;
  const {
    getValues,
    handleSubmit,
    register,
    resetField,
    setValue,
    formState: { errors },
  } = useForm<Comment>({
    resolver: zodResolver(newComment),
    defaultValues: {
      userId: user?.id,
      replyId: postId,
      imageUrl: null,
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
        toast.success(data.message, {
          position: "top-right",
          style: {
            background: "#1d9bf0",
            color: "white",
            width: "fit-content",
          },
        });
        resetField("content");
        setValue("imageUrl", null);
        setFilePreview(null);
        if (fileInput.current) {
          fileInput.current.value = "";
        }
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
    if (user.isGuest) {
      openGuestDialog(true);
      return;
    }

    const values = getValues();
    const updatedValues = { ...values, userId: user?.id, replyId: postId };

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

  const handleEmojiSelect = (emoji: any) => {
    let currentValue = getValues("content");
    const updatedValue = currentValue + emoji.native;
    setValue("content", updatedValue);
    const length = updatedValue.length;

    if (!inputDisabled) {
      updateLimitOffset(length);
    }

    if (length > 0) {
      setDisplayIndicator(true);
    } else {
      setDisplayIndicator(false);
    }

    checkLengthExceed(length);
  };

  const uploadHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fileInput?.current?.click();
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      if (e.target.files[0].size <= 5 * 1024 * 1024) {
        setValue("imageUrl", e.target.files[0], { shouldValidate: true });
        setFilePreview(e.target.files[0]);
      } else {
        toast.error("Avatar must be 5MB or smaller.");
      }
    }
  };

  const removePreviewImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFilePreview(null);
    setValue("imageUrl", null);

    if (fileInput.current) {
      fileInput.current.value = "";
    }
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
        className="size-[40px] sm:size-[48px] min-w-[40px]! sm:min-w-[48px]! rounded-full object-cover"
      />
      <form
        onSubmit={handleSubmit(createReply)}
        className={cn("w-full max-w-full flex flex-col gap-1")}
      >
        <div
          className={cn(openReplyControls && "border-b border-b-border pb-4")}
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
          {filePreview && (
            <div className="relative">
              <img
                src={URL.createObjectURL(filePreview)}
                alt="User Icon"
                className={cn(
                  "rounded-lg border h-full w-full object-cover",
                  filePreview ? "block" : "hidden",
                  mutation.isPending && "animation-pulse brightness-75",
                )}
              ></img>
              <Activity mode={mutation.isPending ? "hidden" : "visible"}>
                <button
                  className="absolute top-0 right-0 m-2 bg-muted/90 rounded-full p-1 "
                  onClick={removePreviewImage}
                >
                  <X size={24}></X>
                </button>
              </Activity>
            </div>
          )}
        </div>
        <input
          type="file"
          name="avatar"
          id="avatar"
          className="invisible h-0 absolute"
          ref={fileInput}
          accept="image/*"
          onChange={uploadImage}
        />
        <div
          className={cn(
            "relative",
            mutation.isPending && "h-0! hidden invisible",
            openReplyControls
              ? "items-center flex h-auto transition-all -translate-y-0 justify-between opacity-100 z-[20]"
              : "w-[95%] max-w-[95%] transition-all -translate-y-5 h-0 invisible opacity-0",
          )}
        >
          <div className="flex items-center gap-2 z-[30]">
            <button onClick={uploadHandler}>
              <TooltipIcon content="Upload image">
                <Image size={20} className="text-primary" />
              </TooltipIcon>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                openEmojiPicker
                  ? setOpenEmojiPicker(false)
                  : setOpenEmojiPicker(true);
              }}
              className="relative z-30"
            >
              <TooltipIcon content="Emoji">
                <Smile size={20} className="text-primary" />
              </TooltipIcon>
              <div
                className={cn(
                  "absolute top-0 z-50 transition-all ease-out delay-200",
                  openEmojiPicker
                    ? "translate-x-0 sm:translate-x-10 translate-y-0 visible block"
                    : "translate-x-0 sm:translate-x-10 translate-y-100 opacity-80 invisible hidden h-0",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <EmojiPicker
                  handleEmojiSelect={handleEmojiSelect}
                  openEmojiPicker={openEmojiPicker}
                  setOpenEmojiPicker={setOpenEmojiPicker}
                />
              </div>
            </button>
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

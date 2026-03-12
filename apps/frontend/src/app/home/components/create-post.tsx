"use client";

import PostSchema from "@/app/home/schema/create-post.schema";
import { NewPost } from "@/app/home/types/create-post.type";
import useUser from "@/stores/user.store";
import data from "@emoji-mart/data/sets/14/twitter.json";
import Picker from "@emoji-mart/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Image, Smile, X } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import React, { Activity, useRef, useState } from "react";

import { ActionButton } from "@/components/button";
import { TooltipIcon } from "@/components/tool-tip-icon";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

import postApi from "@/lib/api/post";
import { cn } from "@/lib/utils";

import { User } from "@/types/user";

type Props = {
  refetch: () => Promise<void>;
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

const CreatePost = ({ refetch }: Props) => {
  const [displayIndicator, setDisplayIndicator] = useState(false);
  const [dashOffset, setDashOffset] = useState(565.48);
  const [progressValue, setProgressValue] = useState(0);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [filePreview, setFilePreview] = useState<File | null>(null);
  const fileInput = useRef<null | HTMLInputElement>(null);
  const user = useUser((state) => state.user) as User;

  const {
    getValues,
    handleSubmit,
    register,
    resetField,
    setValue,
    formState: { errors },
  } = useForm<NewPost>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      imageUrl: null,
      userId: user.id,
    },
  });

  // CREATE POSTS MUTATION
  const mutation = useMutation({
    mutationFn: async (values: NewPost) => {
      const formData = new FormData();

      for (const key in values) {
        if (values.hasOwnProperty(key)) {
          const value = values[key as keyof typeof values];
          if (value !== null) {
            formData.append(key, value as any);
          }
        }
      }

      setProgressValue(80);

      const res = await postApi.createPost(formData);
      return res;
    },
    onSuccess: (data) => {
      if (data.status === "success") {
        resetField("content");
        setValue("imageUrl", null);
        setFilePreview(null);
        if (fileInput.current) {
          fileInput.current.value = "";
        }
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
      refetch();
    },
    onSettled: () => {
      setProgressValue(0);
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
        "flex gap-4 p-4 border-b border-b-border border-x border-x-border w-full relative",
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
        className="w-full max-w-full h-fit flex flex-col gap-4 overflow-hidden"
      >
        <div className="border-b border-b-border pb-4">
          <textarea
            {...register("content")}
            placeholder="What's happening?"
            className={cn(
              `transition-all bg-transparent pt-3 pb-2 outline-0 placeholder:text-gray field-sizing-content placeholder:text-lg w-full max-w-full resize-none text-lg overflow-hidden`,
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
            "flex items-center justify-between w-[95%] max-w-[95%] transition-all z-30 ",
            mutation.isPending && "h-0! hidden",
          )}
        >
          <div className="flex items-center">
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
                  "fixed top-0 z-[9999] transition-all ease-out",
                  openEmojiPicker
                    ? "translate-x-10 translate-y-40 visible"
                    : "translate-x-10 translate-y-100 opacity-80 invisible h-0",
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
              Tweet
            </ActionButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

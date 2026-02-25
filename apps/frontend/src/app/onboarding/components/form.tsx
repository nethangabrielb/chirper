"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { ActionButton } from "@/components/button";
import Icon from "@/components/icon";
import { InputSharp } from "@/components/input";

import { cn } from "@/lib/utils";

import { User } from "@/types/user";

const UserSchema = z.object({
  name: z
    .string()
    .max(50, "Name can't exceed 50 characters.")
    .refine((val) => val.trim().length >= 1, {
      message: "Name can't be empty",
    }),
  username: z
    .string()
    .max(15, "Username can't exceed 15 characters.")
    .refine((val) => val.trim().length >= 1, {
      message: "Username can't be empty",
    }),
  avatar: z
    .file()
    .refine((file) => {
      if (file) {
        return file.size <= 5 * 1024 * 1024;
      }
    }, "Image exceeds 5MB limit")
    .nullable(),
});

export type ConfirmUser = z.infer<typeof UserSchema>;

type Props = {
  user: User;
};

const ConfirmForm = ({ user }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mouseEnter, setMouseEnter] = useState<boolean>(false);
  const [filePreview, setFilePreview] = useState<File | null>(null);
  const fileInput = useRef<null | HTMLInputElement>(null);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmUser>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      avatar: null,
      name: user.name,
      username: user?.username,
    },
  });
  const mutation = useMutation({
    mutationFn: (data: ConfirmUser) => {
      const userData = new FormData();

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const value = data[key as keyof typeof data];
          if (value !== null) {
            userData.append(key, value as any);
          }
        }
      }

      userData.append("onboarded", true as any);

      return fetch(`${process.env.NEXT_PUBLIC_API}/api/users/${user.id}`, {
        method: "PUT",
        body: userData,
        credentials: "include",
      });
    },
    onSuccess: async (res) => {
      const data = await res.json();
      if (data.status === "error") {
        toast.error(data.message);
      } else {
        refetchUser();
        router.push("/home");
      }
    },
  });

  useEffect(() => {
    if (user.name && user.username) {
      setValue("name", user.name, { shouldValidate: true, shouldDirty: true });
      setValue("username", user.username, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [user]);

  const uploadHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fileInput?.current?.click();
  };

  const uploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files[0].size <= 5 * 1024 * 1024) {
        setValue("avatar", e.target.files[0], { shouldValidate: true });
        setFilePreview(e.target.files[0]);
      } else {
        toast.error("Avatar must be 2MB or smaller.");
      }
    }
  };

  const submitForm = (data: ConfirmUser) => {
    mutation.mutate(data);
  };

  const refetchUser = async () => {
    await queryClient.refetchQueries({ queryKey: ["user"] });
  };

  return (
    <form
      className="w-full m-auto h-full flex flex-col justify-center items-center gap-8"
      onSubmit={handleSubmit(submitForm)}
      encType="multipart/form-data"
    >
      <div className="flex flex-col gap-4 items-center bg-card border border-border p-8 rounded-md">
        <Icon width={48} height={48} alt="Twitter Icon"></Icon>
        <h1 className="font-extrabold text-2xl rotate-x-[20deg] mb-4">
          Confirm profile
        </h1>
        <div className="flex flex-col gap-4 w-[350px]">
          <button
            className="w-[130px] h-[130px] mx-auto relative"
            onMouseOver={() => setMouseEnter(true)}
            onMouseLeave={() => setMouseEnter(false)}
            onClick={uploadHandler}
            type="button"
          >
            <img
              src={filePreview ? URL.createObjectURL(filePreview) : user.avatar}
              alt="User Icon"
              className={cn(
                "rounded-full border h-full object-cover size-[130px]",
                mouseEnter && "opacity-30",
              )}
            ></img>
            <Pencil
              className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                mouseEnter ? "!visible !opacity-100" : "!invisible",
              )}
            ></Pencil>
          </button>
          {errors.avatar?.message && (
            <p className="text-red-600 font-medium text-center">
              {errors.avatar?.message}
            </p>
          )}
          <input
            type="file"
            name="avatar"
            id="avatar"
            className="invisible"
            ref={fileInput}
            accept="image/*"
            onChange={uploadAvatar}
          />
          <InputSharp
            label="name"
            register={register}
            errorMessage={errors.name?.message}
          >
            {user.name}
          </InputSharp>
          <InputSharp
            label="username"
            register={register}
            errorMessage={errors.username?.message}
          >
            {user.username}
          </InputSharp>
          <div className="mt-2"></div>

          <ActionButton
            type="submit"
            className="p-3 text-[17px] font-bold rotate-x-20"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Processing..." : "Confirm details"}
          </ActionButton>
        </div>
      </div>
    </form>
  );
};

export default ConfirmForm;

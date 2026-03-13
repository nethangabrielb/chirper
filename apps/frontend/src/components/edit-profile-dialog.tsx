import useUser from "@/stores/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ReactNode, useRef, useState } from "react";

import { ActionButton } from "@/components/button";
import { InputSharp } from "@/components/input";
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
import { Spinner } from "@/components/ui/spinner";

import { authApi } from "@/lib/api/auth";
import userApi from "@/lib/api/user";
import { cn } from "@/lib/utils";

import { User } from "@/types/user";

const EditProfileSchema = z.object({
  name: z
    .string()
    .refine((val) => val.trim().length >= 1, {
      message: "Name is required",
    })
    .max(50, { error: "Name must not exceed 50 characters" }),
  username: z
    .string()
    .refine((val) => val.trim().length >= 1, {
      message: "Username is required",
    })
    .max(15, { error: "Username must not exceed 15 characters" })
    .refine((val) => /\s/.test(val) === false, {
      error: "Username must not have spaces",
    })
    .refine(
      async (val) => {
        const isUnique = await authApi.checkPropertyUnique(val, "username");
        return isUnique;
      },
      { message: "This username is already taken" },
    ),
  avatar: z
    .file()
    .refine((file) => {
      if (file) {
        return file.size <= 5 * 1024 * 1024;
      }
    }, "Image exceeds 5MB limit")
    .nullable(),
  cover: z
    .file()
    .refine((file) => {
      if (file) {
        return file.size <= 5 * 1024 * 1024;
      }
    }, "Image exceeds 5MB limit")
    .nullable(),
});

export type EditProfile = z.infer<typeof EditProfileSchema>;

const EditProfileDialog = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const user = useUser((state) => state.user) as User;
  const [avatarPreview, setAvatarPreview] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<File | null>(null);
  const avatarInputRef = useRef<null | HTMLInputElement>(null);
  const coverInputRef = useRef<null | HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    reset,
    formState: { errors },
  } = useForm<EditProfile>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      username: user?.username,
      name: user?.name,
      avatar: null,
      cover: null,
    },
  });

  // CREATE POSTS MUTATION
  const mutation = useMutation({
    mutationFn: async (values: EditProfile) => {
      console.log(values);

      const formData = new FormData();

      for (const key in values) {
        if (values.hasOwnProperty(key)) {
          const value = values[key as keyof typeof values];
          if (value !== null) {
            formData.append(key, value as any);
          }
        }
      }

      const res = await userApi.updateUserData(user.id, formData);
      return res;
    },
    onSuccess: async (data) => {
      if (data.status === "success") {
        if (coverInputRef.current) {
          coverInputRef.current.value = "";
        }
        if (avatarInputRef.current) {
          avatarInputRef.current.value = "";
        }
        toast.success(data.message, {
          position: "top-right",
          style: {
            background: "#1d9bf0",
            color: "white",
            width: "fit-content",
          },
        });
        await queryClient.invalidateQueries({ queryKey: ["userProfilePage"] });
        await queryClient.invalidateQueries({ queryKey: ["user"] });
      } else {
        toast.error(data.message);
      }
    },
    onSettled: () => {
      reset({
        name: user?.name,
        username: user?.username,
        avatar: null,
        cover: null,
      });
      setValue("avatar", null);
      setValue("cover", null);
      setAvatarPreview(null);
      setCoverPreview(null);
      setOpenDialog(false);
    },
  });

  const checkImageType = (type: "avatar" | "cover") => {
    return type === "avatar" ? "avatar" : "cover";
  };

  const uploadHandler = (
    e: React.MouseEvent<HTMLButtonElement>,
    type: "avatar" | "cover",
  ) => {
    e.preventDefault();
    type === "avatar"
      ? avatarInputRef?.current?.click()
      : coverInputRef?.current?.click();
  };

  const uploadImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover",
  ) => {
    if (e.target.files) {
      if (e.target.files[0].size <= 5 * 1024 * 1024) {
        setValue(checkImageType(type), e.target.files[0], {
          shouldValidate: true,
        });
        type === "avatar"
          ? setAvatarPreview(e.target.files[0])
          : setCoverPreview(e.target.files[0]);
      } else {
        toast.error("Avatar must be 5MB or smaller.");
      }
    }
  };

  const submitHandler: SubmitHandler<EditProfile> = (values) => {
    mutation.mutate(values);
  };

  console.log(mutation.isPending);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={cn("sm:max-w-lg overflow-visible -translate-y-72")}
      >
        <div className="relative">
          <DialogHeader className="bg-background pb-4">
            <DialogTitle className="text-white font-bold">
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          {mutation.isPending && (
            <Spinner className="size-7 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></Spinner>
          )}
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex flex-col gap-4 relative"
          >
            <div className="relative flex flex-col h-fit grow-0">
              <div className="h-[190px] border-x border-x-border relative">
                <button
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-700/50"
                  onClick={(e) => uploadHandler(e, "cover")}
                  disabled={mutation.isPending}
                >
                  <Camera size={24}></Camera>
                </button>
                <img
                  src={
                    coverPreview
                      ? URL.createObjectURL(coverPreview)
                      : (user?.cover ?? "/blue.jpg")
                  }
                  alt="Default profile cover"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* avatar */}
              <div className="bg-black p-1 rounded-full absolute top-34">
                <div className="relative">
                  <button
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-700/50"
                    onClick={(e) => uploadHandler(e, "avatar")}
                    disabled={mutation.isPending}
                  >
                    <Camera size={24}></Camera>
                  </button>
                  <img
                    src={
                      avatarPreview
                        ? URL.createObjectURL(avatarPreview)
                        : user?.avatar
                    }
                    alt={`@${user?.username}'s avatar`}
                    className="size-[108px] object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="size-[58px]"></div>
            </div>

            <InputSharp
              label="username"
              register={register}
              errorMessage={errors.username?.message}
            ></InputSharp>
            <InputSharp
              label="name"
              register={register}
              errorMessage={errors.name?.message}
            ></InputSharp>
            <input
              type="file"
              name="avatar"
              id="avatar"
              className="invisible h-0 absolute"
              ref={avatarInputRef}
              accept="image/*"
              onChange={(e) => uploadImage(e, "avatar")}
              disabled={mutation.isPending}
            />
            <input
              type="file"
              name="cover"
              id="cover"
              className="invisible h-0 absolute"
              ref={coverInputRef}
              accept="image/*"
              onChange={(e) => uploadImage(e, "cover")}
              disabled={mutation.isPending}
            />
            <ActionButton
              type="submit"
              className="p-2 w-[20%] text-md"
              disabled={mutation.isPending}
            >
              Save
            </ActionButton>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;

"use client";

import useGuestDialog from "@/stores/guest-dialog.store";
import useUser from "@/stores/user.store";
import { useMutation } from "@tanstack/react-query";
import { Ban } from "lucide-react";
import { VisuallyHidden } from "radix-ui";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

import { ActionButton } from "@/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { authApi } from "@/lib/api/auth";

const GuestDialog = () => {
  const openDialog = useGuestDialog((state) => state.openGuestDialog);
  const openGuestDialog = useGuestDialog((state) => state.setOpenGuestDialog);
  const removeUser = useUser((state) => state.removeUser);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const data = await authApi.logout();
      return data;
    },
    onSuccess: (data) => {
      if (data.status === "success") {
        router.push("/register");
      } else {
        toast.error("Error logging out", { description: data.message });
      }
    },
    onSettled: () => {
      removeUser();
    },
  });

  const handler = () => {
    mutation.mutate();
    openGuestDialog(false);
  };

  return (
    <Dialog open={openDialog} onOpenChange={openGuestDialog}>
      <DialogContent className="sm:max-w-sm flex flex-col items-center justify-center -translate-y-62">
        <VisuallyHidden.Root>
          <DialogTitle>
            Guest Dialog for Unauthorized Actions by Guest
          </DialogTitle>
        </VisuallyHidden.Root>
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold rotate-x-25">Can't chirp yet!</h1>
          <div className="relative my-4">
            <Ban
              size={88}
              className="absolute text-primary top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            ></Ban>
            <img
              src="/twitter.svg"
              alt="Twitter icon"
              className="size-[48px]"
            />
          </div>
          <h2 className="text-center text-lg">
            Sorry to give you a very limited experience! 😅
          </h2>
          <p className="text-darker text-center text-sm">
            In order to enjoy the full experience, you need to make an account
            and sign in. <br></br>I'd really appreciate it if you would (I
            really worked hard on this one!)
          </p>

          <ActionButton className="flex-1" onClick={handler}>
            Create an account
          </ActionButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestDialog;

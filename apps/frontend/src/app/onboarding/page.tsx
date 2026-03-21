"use client";

import ConfirmForm from "@/app/onboarding/components/form";
import useUser from "@/stores/user.store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";

import { useEffect, useState } from "react";

import { User } from "@/types/user";

const Onboarding = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useUser((state) => state.user) as User;
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  useEffect(() => {
    const hydrateUser = async () => {
      await queryClient.refetchQueries({ queryKey: ["user"] });
      setIsCheckingUser(false);
    };

    hydrateUser();
  }, [queryClient]);

  useEffect(() => {
    if (isCheckingUser) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user?.onboarded) {
      router.replace("/home");
    }
  }, [user, router, isCheckingUser]);

  if (isCheckingUser) {
    return (
      <div className="w-full min-h-svh flex items-center justify-center text-darker">
        Loading account...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full min-h-svh flex items-center justify-center text-darker">
        Redirecting...
      </div>
    );
  }

  return <ConfirmForm user={user}></ConfirmForm>;
};

export default Onboarding;

"use client";

import ConfirmForm from "@/app/onboarding/components/form";
import useUser from "@/stores/user.store";
import { useRouter } from "nextjs-toploader/app";

import { useEffect } from "react";

import { User } from "@/types/user";

const Onboarding = () => {
  const router = useRouter();
  const user = useUser((state) => state.user) as User;

  useEffect(() => {
    if (user) {
      if (user?.onboarded) {
        router.push("/home");
      }
    }
  }, [user, router]);

  if (!user) {
    return null; // Wait for hydration
  }

  return <ConfirmForm user={user}></ConfirmForm>;
};

export default Onboarding;

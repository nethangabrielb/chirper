"use client";

import ConfirmForm from "@/app/onboarding/components/form";
import useUser from "@/stores/user.store";

import { redirect } from "next/navigation";

import { User } from "@/types/user";

const Onboarding = () => {
  const user = useUser((state) => state.user) as User;

  if (user) {
    if (user?.onboarded) {
      redirect(`/home`);
    } else {
      // onboarding page should fetch user info using token
      return <ConfirmForm user={user}></ConfirmForm>;
    }
  }
};

export default Onboarding;

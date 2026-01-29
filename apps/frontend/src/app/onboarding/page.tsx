"use client";

import ConfirmForm from "@/app/onboarding/components/form";
import useUser from "@/stores/user.store";
import { useQuery } from "@tanstack/react-query";

import { redirect } from "next/navigation";

const Onboarding = () => {
  const setUser = useUser((state) => state.setUser);
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/users?current=true`,
        {
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Error fetching from the server.");
      }
      const data = await res.json();
      const user = data.data;
      return user;
    },
    refetchOnWindowFocus: false,
  });

  if (user) {
    if (user?.onboarded) {
      setUser(user);
      redirect(`/home`);
    } else {
      // onboarding page should fetch user info using token
      return <ConfirmForm user={user} setUser={setUser}></ConfirmForm>;
    }
  }
};

export default Onboarding;

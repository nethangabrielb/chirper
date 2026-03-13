"use client";

import useUser from "@/stores/user.store";
import { useQuery } from "@tanstack/react-query";

import { ReactNode } from "react";

import { usePathname } from "next/navigation";

const UserProvider = ({ children }: { children: ReactNode }) => {
  const path = usePathname();
  const setUser = useUser((state) => state.setUser);

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (path !== "/") {
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

        setUser(user);
        return user;
      }
    },
    refetchOnWindowFocus: false,
  });

  return <>{children}</>;
};

export default UserProvider;

"use client";

import useUser from "@/stores/user.store";
import { useQuery } from "@tanstack/react-query";

import { ReactNode } from "react";

const UserProvider = ({ children }: { children: ReactNode }) => {
  const setUser = useUser((state) => state.setUser);

  useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch(`/api/users?current=true`, {
        credentials: "include",
      });

      if (!res.ok) {
        const error = new Error("Error fetching from the server.") as Error & {
          status?: number;
        };
        error.status = res.status;
        throw error;
      }

      const data = await res.json();
      const user = data.data;

      setUser(user);
      return user;
    },
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      const status = (error as { status?: number })?.status;
      if (status === 401 || status === 403) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 0, // ← always consider data stale
    refetchOnMount: true,
  });

  return <>{children}</>;
};

export default UserProvider;

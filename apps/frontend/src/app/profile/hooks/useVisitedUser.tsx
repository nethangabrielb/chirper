import { useQuery } from "@tanstack/react-query";

import { useState } from "react";

import { ParamValue } from "next/dist/server/request/params";

import { User } from "@/types/user";

const useVisitedUser = ({ id }: { id: ParamValue }) => {
  const [visitedUser, setVisitedUser] = useState<null | User>(null);

  const { data: user } = useQuery({
    queryKey: ["userProfilePage", id],
    queryFn: async () => {
      const res = await fetch(
        `/api/users/${id}`,
        {
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Error fetching from the server.");
      }
      const data = await res.json();
      setVisitedUser(data.data);
      return data.data as User;
    },
  });

  return { visitedUser };
};

export default useVisitedUser;

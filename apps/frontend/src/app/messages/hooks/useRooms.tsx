import useUser from "@/stores/user.store";
import { useQuery } from "@tanstack/react-query";

import roomApi from "@/lib/api/room";

import { User } from "@/types/user";

const useRooms = () => {
  const user = useUser((state) => state.user) as User;
  const { data: chatRooms } = useQuery({
    queryKey: ["chatRooms", user],
    queryFn: async () => {
      if (user) {
        const res = await roomApi.getByUserId(user.id);
        return res;
      }
    },
  });

  return { chatRooms };
};

export default useRooms;

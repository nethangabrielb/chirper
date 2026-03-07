import useUser from "@/stores/user.store";
import { useQuery } from "@tanstack/react-query";

import roomApi from "@/lib/api/room";

import { RoomType } from "@/types/room";
import { User } from "@/types/user";

const useRooms = () => {
  const user = useUser((state) => state.user) as User;
  const { data: chatRooms } = useQuery<RoomType[]>({
    queryKey: ["chatRooms", user.id],
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
